# Current Demo Status

- Backend: Upload pipeline (AOT generation, chunk encryption, anonymous revocation) vẫn ổn định. Download flow mới trả manifest/policy và xác nhận quyền; master key & chunk keys do client giữ. Registry hiện **chỉ lưu displayName + publicKey** và tự sinh identifier, đồng thời API `/api/files/user/:id/files` đã hỗ trợ filter theo ownership public key.
- Mobile: Đã có màn hình khởi tạo một lần để nhập display name + sinh khóa cục bộ, đồng bộ hóa ring context và lưu identity vào AsyncStorage. Danh sách file trên Home tự động load theo public key hiện tại; upload demo vẫn ổn định trong direct gateway mode.
- Dependencies: `@noble/secp256k1` tiếp tục là nền tảng crypto chính; theo dõi cập nhật trước khi hoàn thiện download proof-of-concept.
- Pending (Demo Roadmap): hoàn thiện chunk streaming API, chia sẻ khóa P2P (QR/Deep link), retry UX + integrity alert, audit timeline modal, tùy chọn cache mã hóa cục bộ + TTL tự động.
