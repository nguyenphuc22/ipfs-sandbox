# Issue Plan: Anonymous refresh fails after share

**Last Updated:** 2025-10-20

## Tóm tắt sự cố
- Thiết bị nhận quyền gọi `/api/files/anonymous-list` lần đầu (trước khi có grant) thành công, nhưng lưu key image vào audit log.
- Sau khi chủ sở hữu cấp quyền, lần refresh tiếp theo trả về 500 `Internal server error`; UI hiển thị `Files (0)` và log `Invalid ring signature`.
- Backend `RingSignatureService.checkKeyImage` không cho phép tái sử dụng key image khi `usageContext !== 'owner-management'` nên chặn mọi request lặp lại của cùng một public key (`backend/src/services/RingSignatureService.js:80`).
- Kết quả: grant đã lưu trong DB nhưng người nhận không thể liệt kê file do bị chặn ở bước xác thực LSAG.

## Mục tiêu
- Cho phép người dùng anonymous gọi `anonymous-list` nhiều lần liên tiếp mà không bị xem là double spend.
- Giữ nguyên cơ chế bảo vệ key image cho các ngữ cảnh khác (owner management, integrity alerts) để tránh lạm dụng.
- Bổ sung test đảm bảo regression không quay lại.

## Công việc cần làm
1. **Cập nhật policy reuse key image**
  - Điều chỉnh `_shouldAllowKeyImageReuse` để cho phép `usageContext === 'anonymous-access'` tái sử dụng khi cùng `actorPublicKeyHash` và (tuỳ chọn) cùng `messageDigest`.
  - Đảm bảo route `anonymous-list` truyền `actorPublicKey`/hash xuống `verifyRingSignature` để policy hoạt động chính xác.

2. **Kiểm thử backend**
  - Thêm unit test cho `RingSignatureService` và integration test cho `FileAccessService.listAccessibleFiles` chứng minh hai lần gọi liên tiếp với cùng khóa vẫn hợp lệ.
  - Bao phủ trường hợp grant revoked để chắc chắn cache key image không gây lỗi lặp lại.

3. **Kiểm thử manual & thông báo UI**
  - Sau khi backend sửa, kiểm tra lại trên thiết bị: grant -> refresh -> file xuất hiện.
  - Cập nhật toast/error handler trên mobile (`mobile/src/components/ipfs/IPFSFileList.tsx`) để hiển thị thông điệp thân thiện khi backend trả về lỗi xác thực, giúp QA dễ phát hiện nếu backend bị regress.

4. **Hoàn thiện secure key exchange cho download**
  - Chủ sở hữu cần chia sẻ key package (JSON) sau khi grant; hiện component `AccessManagerModal` chỉ copy clipboard mà không tự động gửi.
  - Bổ sung hướng dẫn rõ ràng hơn cho owner/recipient và flow import thực sự đọc file JSON (thay mock trong `SecureDownloadScreen.importSecureKeyPackage`).
  - Tích hợp `KeyPackageStorage` để lưu/bắt lỗi fingerprint mismatch và hiển thị yêu cầu nhập thủ công nếu chưa có package.
 - Viết test e2e mô phỏng grant -> export key package -> import key package -> download thành công.

5. **Thu hồi kèm re-encryption (theo luận văn)** ✅
  - Đã ép owner chỉ sử dụng luồng thu hồi + re-encrypt; modal cảnh báo nếu thiếu key package cục bộ.
  - Backend `/api/files/revoke-with-reencryption` hiện kiểm tra key package, giải mã các chunk, mã hóa lại với master key mới rồi gửi trả key package mới cho owner.
  - Mobile lưu/copy key package mới sau khi thu hồi để owner phát offline cho các recipient còn quyền.
