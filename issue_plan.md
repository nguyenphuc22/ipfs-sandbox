# Kế hoạch triển khai: Anonymous Sharing Grant

**Last Updated:** 2025-10-18

## Mục tiêu
- Cho phép uploader cấp quyền truy cập cho public key khác sau khi file đã được upload ẩn danh.
- Đảm bảo người nhận nhìn thấy file trong `AnonymousFileAccess` ngay sau khi grant, không cần thao tác DB thủ công.
- Gắn kết luồng chia sẻ với việc chuyển giao key package để demo hai thiết bị trơn tru.

---

## Task A – Backend grant endpoint (DONE)
- [x] Thiết kế endpoint `POST /api/files/:fileId/anonymous-grant` nhận `targetPublicKey`, nonce, ring signature.
- [x] Kiểm tra quyền: chỉ chủ sở hữu (hash public key trùng với uploader) mới được grant; xác thực Schnorr + LSAG theo thiết kế hiện hành.
- [x] Tạo hoặc cập nhật bản ghi `anonymousFileAccess` cho `targetPublicKeyHash`, copy fingerprint và trạng thái `client-managed`.
- [x] Ghi audit log `grant` để theo dõi ai cấp quyền cho ai.

## Task B – Mobile grant UI & service (DONE)
- [x] Thêm action trong `IPFSFileList` (nút **Grant**) mở modal nhập/dán public key của người nhận.
- [x] Gọi service mới `AnonymousFileAccessService.grantAccess` với Schnorr proof + LSAG để gửi request tới backend.
- [x] Hiển thị feedback thành công/thất bại, tự động sao chép key package JSON khi grant thành công.
- [x] Làm mới `IPFSFileList` sau khi grant để phản ánh trạng thái truy cập mới.

## Task C – Thử nghiệm & tài liệu (TODO)
- [ ] Viết test tích hợp: uploader grant → người nhận refresh thấy file → download hoàn tất với key package đã import.
- [ ] Cập nhật `README.md` (mục demo hai thiết bị) mô tả thêm bước grant tự động qua UI/API mới.
- [ ] Chuẩn bị checklist QA: kiểm tra audit log, trạng thái `anonymousFileAccess`, và xử lý revoke trên flow mới.