Nội dung Slide Thuyết trình: Kiến trúc Hệ thống

Slide 1: Đặt vấn đề & Mục tiêu

Bài toán: Làm thế nào để người dùng có thể chia sẻ dữ liệu một cách ẩn danh, nhưng hệ thống vẫn có thể xác định danh tính trong trường hợp người dùng đăng tải nội dung xấu hoặc vi phạm?

Mục tiêu chính: Xây dựng một hệ thống cân bằng được 3 yếu tố:

- Ẩn danh (Anonymity): Che giấu danh tính người tải file.
- Bảo mật (Security): Đảm bảo an toàn và toàn vẹn dữ liệu.
- Trách nhiệm (Accountability): Có cơ chế truy vết khi cần thiết.

Slide 2: Các "Viên gạch" Mật mã Cốt lõi

Để giải quyết bài toán trên, chúng ta sử dụng 2 kỹ thuật mật mã chính:
1. Chữ ký Vòng (Ring Signature)
   - Ý tưởng: Một thành viên ký thay mặt cho cả nhóm.
   - Kết quả: Mọi người đều biết chữ ký đến từ một người trong nhóm, nhưng không biết chính xác là ai.
   - Vai trò: Cung cấp tính ẩn danh cho người dùng.

2. Phong bì Ký gửi (Escrowed Identity)
   - Ý tưởng: Một "phong bì" kỹ thuật số được niêm phong, bên trong chứa danh tính thật của người ký.
   - Cơ chế: Phong bì này chỉ có thể được mở bởi một bên thứ ba được tin tưởng là Bên Giám sát (Adjudicator).
   - Vai trò: Cung cấp khả năng truy vết (trách nhiệm).

Slide 3: Luồng 1 - Tải File Lên (Ẩn danh có Giám sát)
```mermaid
sequenceDiagram
    participant User as Mobile App
    participant Backend

    User->>Backend: 1. Yêu cầu lấy các khóa công khai cần thiết
    Backend-->>User: 2. Phản hồi PublicKey của Adjudicator & Ring

    note over User: 3. User thực hiện 2 thao tác Crypto:
    User->>User: 3a. Tạo Chữ ký Vòng (σ) để ẩn danh
    User->>User: 3b. Tạo Phong bì Ký gửi (escrowedIdentity)

    User->>Backend: 4. Gửi {File mã hóa, σ, Ring_PublicKeys, escrowedIdentity}

    note over Backend: 5. Backend xác thực Chữ ký Vòng (σ)

    alt Chữ ký hợp lệ
        Backend->>Backend: 6. Lưu file lên IPFS & lưu metadata vào DB
        Backend-->>User: 7. Thành công!
    else Chữ ký không hợp lệ
        Backend-->>User: 7b. Từ chối
    end
```

Slide 4: Luồng 2 - Truy vết Danh tính
```mermaid
sequenceDiagram
    participant Admin as Quản trị viên
    participant Backend
    participant Adjudicator as Bên Giám sát

    Admin->>Backend: 1. Yêu cầu truy vết một chữ ký cụ thể

    Backend->>Backend: 2. Lấy `escrowedIdentity` (dạng mã hóa) từ DB
    Backend-->>Admin: 3. Cung cấp `escrowedIdentity` cho Admin

    note over Admin, Adjudicator: 4. Admin chuyển giao `escrowedIdentity` cho Bên Giám sát

    Adjudicator->>Adjudicator: 5. Dùng PrivateKey của mình để giải mã `escrowedIdentity`

    Adjudicator-->>Admin: 6. Báo cáo danh tính thật của người ký
```

Slide 5: Luồng 3 - Thu hồi Quyền Truy cập
- Kỹ thuật: Tái mã hóa phía Client (Client-Side Re-encryption).
- Mục đích: Khi một người dùng bị thu hồi quyền, file sẽ được mã hóa lại với một khóa mới, và khóa mới này chỉ được chia sẻ cho những người còn lại.sequenceDiagram
```mermaid
sequenceDiagram
    participant AdminClient as Client được cấp quyền
    participant Backend
    participant IPFS

    AdminClient->>Backend: 1. Yêu cầu: Revoke(User_X, File_ID)
    Backend-->>AdminClient: 2. Phản hồi {CID_v1, Danh sách User còn lại}

    AdminClient->>IPFS: 3. Tải file từ CID_v1

    note over AdminClient: 4. Tái mã hóa file tại Client:<br/>- Giải mã file<br/>- Tạo khóa mới (FileKey_v2)<br/>- Mã hóa lại file

    AdminClient->>IPFS: 5. Tải file đã mã hóa lại lên IPFS
    IPFS-->>AdminClient: 6. Trả về CID_v2

    AdminClient->>Backend: 7. Gửi yêu cầu hoàn tất với thông tin mới
    Backend-->>AdminClient: 8. Thành công!
```

Slide 6: Kết luận
- Kiến trúc đã kết hợp thành công Chữ ký Vòng (ẩn danh) và Phong bì Ký gửi (truy vết).
- Hệ thống đạt được sự cân bằng giữa tính riêng tư cho người dùng và khả năng quản lý của hệ thống.
- Giải quyết được bài toán "ẩn danh có giám sát" một cách hiệu quả và logic.