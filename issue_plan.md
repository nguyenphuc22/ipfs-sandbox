# Kế hoạch triển khai: Lưu file đã tải xuống

**Last Updated:** 2025-10-17

## Mục tiêu
- Tự động ghi lại file đã được `chunkDownloadManager` ráp xong vào thư mục sandbox (`RNFS.DocumentDirectoryPath`).
- Cung cấp tùy chọn sao chép file ra vị trí dễ truy cập (Android `Download/`, iOS Documents) để QA lấy nhanh.
- Hiển thị/log đường dẫn để developer hoặc QA kiểm tra và xác minh hash.

---

## Task A – Persist file trong sandbox (TODO)
- [ ] Tạo helper `saveDecryptedFile(file, data)` viết vào `RNFS.DocumentDirectoryPath` với tên chuẩn hóa (`<fileId>-<originalName>`).
- [ ] Gọi helper khi `chunkDownloadManager.downloadFile()` hoàn tất và trạng thái chuyển sang `ready`.
- [ ] Trả về đường dẫn để UI (`SecureDownloadScreen`/`FileViewer`) hiển thị cùng log debug.

## Task B – Export thân thiện QA (OPTIONAL)
- [ ] Android: nếu bật cờ `ENABLE_DOWNLOAD_EXPORT`, sao chép file sang `RNFS.DownloadDirectoryPath`, kiểm tra quyền lưu trữ trước khi thực thi.
- [ ] iOS: ghi chú bật `UIFileSharingEnabled` và xác nhận file trong thư mục `Documents/`; cập nhật hướng dẫn dùng `simctl`.
- [ ] Ghi lại đường dẫn trong màn hình download để QA biết nơi lấy file.

## Task C – Kiểm thử & tài liệu (TODO)
- [ ] Viết checklist QA: sử dụng `adb run-as` / `adb pull` hoặc `simctl get_app_container` để lấy file và đối chiếu SHA-256.
- [ ] Cập nhật README/USAGE GUIDE mô tả luồng tải xuống mới, bao gồm ví dụ hash kiểm chứng.
- [ ] Thêm ghi chú bảo mật về việc dọn file sau khi kiểm thử nếu có dữ liệu nhạy cảm.# Kế hoạch xử lý Anonymous Download Fix