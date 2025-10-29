document.addEventListener('DOMContentLoaded', () => {
  const adminKeyInput = document.getElementById('adminKey');
  const adminUserInput = document.getElementById('adminUser');
  const adminSecretInput = document.getElementById('adminSecret');
  const resultEl = document.getElementById('investigationResult');
  const historyList = document.getElementById('historyList');
  const statusBadge = document.getElementById('statusBadge');
  const runButton = document.getElementById('runInvestigation');

  const history = [];

  // Fallback defaults in case browser serves cached HTML without values
  if (adminKeyInput && !adminKeyInput.value) {
    adminKeyInput.value = 'demo-admin';
  }
  if (adminUserInput && !adminUserInput.value) {
    adminUserInput.value = 'investigator@demo';
  }
  if (adminSecretInput && !adminSecretInput.value) {
    adminSecretInput.value = '20a20382d5adc30ad8b0406af8e2a256714eb3391461d6764c6f07915e56eb49';
  }

  const computeSignature = async (bodyString) => {
    const secret = adminSecretInput.value.trim();
    if (!secret) {
      return null;
    }

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(bodyString));
    return Array.from(new Uint8Array(signatureBuffer))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  };

  const callApi = async (path, options = {}) => {
    const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    const adminKey = adminKeyInput.value.trim();
    const adminUser = adminUserInput.value.trim();
    if (adminKey) headers['x-admin-key'] = adminKey;
    if (adminUser) headers['x-admin-user'] = adminUser;

    let bodyString;
    if (options.method && options.method.toUpperCase() !== 'GET' && options.body) {
      bodyString = JSON.stringify(options.body);
    }

    if (bodyString || adminSecretInput.value.trim()) {
      const signature = await computeSignature(bodyString || '{}');
      if (signature) {
        headers['x-admin-signature'] = signature;
      }
    }

    const response = await fetch(path, {
      ...options,
      headers,
      body: bodyString,
    });
    const text = await response.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch (err) {
      body = text;
    }
    return { ok: response.ok, status: response.status, body };
  };

  const pushHistory = (entry) => {
    history.unshift(entry);
    if (history.length > 5) {
      history.pop();
    }

    if (history.length === 0) {
      historyList.innerHTML = '<div class="empty-state">Chưa có truy vấn nào trong phiên làm việc này.</div>';
      return;
    }

    historyList.innerHTML = '';
    history.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'history-item';
      div.innerHTML = `
        <div class="history-id">${item.fileId}</div>
        <div class="history-meta">
          <span>${item.status}</span>
          <span>${item.timestamp}</span>
        </div>
      `;
      div.addEventListener('click', () => {
        resultEl.textContent = item.body;
      });
      historyList.appendChild(div);
    });
  };

  const setStatus = (text, variant = 'info') => {
    statusBadge.hidden = false;
    statusBadge.textContent = text;

    const variantMap = {
      info: 'rgba(56, 189, 248, 0.12)',
      success: 'rgba(74, 222, 128, 0.12)',
      error: 'rgba(248, 113, 113, 0.15)'
    };

    const colorMap = {
      info: '#bae6fd',
      success: '#bbf7d0',
      error: '#fecaca'
    };

    statusBadge.style.background = variantMap[variant] || variantMap.info;
    statusBadge.style.color = colorMap[variant] || colorMap.info;
  };

  runButton.addEventListener('click', async () => {
    const fileId = document.getElementById('fileId').value.trim();
    const reason = document.getElementById('reason').value.trim();
    const legal = document.getElementById('legal').value.trim();

    if (!fileId || !reason || !legal) {
      setStatus('Vui lòng điền đầy đủ File ID, lý do và căn cứ pháp lý.', 'error');
      resultEl.textContent = 'Thiếu thông tin đầu vào.';
      return;
    }

    runButton.disabled = true;
    setStatus('Đang gửi truy vấn tới adjudicator…', 'info');
    resultEl.textContent = 'Đang xử lý…';

    try {
      const { ok, status, body } = await callApi('/api/admin/investigate', {
        method: 'POST',
        body: { fileId, reason, legalAuthorization: legal },
      });

      const pretty = JSON.stringify({ ok, status, body }, null, 2);
      resultEl.textContent = pretty;

      if (ok) {
        setStatus('Truy vấn thành công', 'success');
      } else {
        setStatus(`Lỗi: HTTP ${status}`, 'error');
      }

      pushHistory({
        fileId,
        status: ok ? 'Thành công' : 'Thất bại',
        body: pretty,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (error) {
      console.error(error);
      setStatus('Không thể kết nối adjudicator', 'error');
      resultEl.textContent = error instanceof Error ? error.message : String(error);
    } finally {
      runButton.disabled = false;
    }
  });
});
