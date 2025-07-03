Chắc chắn rồi. Đây là những câu hỏi rất xác đáng và quan trọng, cho thấy bạn đang tư duy sâu về chi tiết của luồng mật mã. Việc làm rõ những điểm này là cực kỳ cần thiết để đảm bảo kiến trúc của bạn không có lỗ hổng logic.

Hãy cùng cập nhật lại bài viết hoàn chỉnh, trong đó tôi sẽ giải thích cặn kẽ những khái niệm này ngay trong luồng kiến trúc.

-----

## **Kiến trúc Hệ thống Toàn diện: Giải pháp Lưu trữ Phi tập trung (Phiên bản đã làm rõ)**

[cite\_start]Bài viết này trình bày kiến trúc hệ thống cuối cùng cho đề tài **"Giải pháp lưu trữ và chia sẻ dữ liệu phi tập trung đảm bảo tính riêng tư"**[cite: 5]. Kiến trúc này tích hợp các cơ chế mật mã nâng cao để đạt được sự cân bằng giữa ẩn danh, bảo mật và trách nhiệm giải trình.

-----

### **1. Các Khái niệm Mật mã Nền tảng**

Trước khi đi vào các luồng chi tiết, chúng ta cần làm rõ 2 cơ chế mật mã cốt lõi sẽ được sử dụng.

#### **A. Chữ ký Vòng (Ring Signature)**

[cite\_start]Chữ ký vòng là một loại chữ ký điện tử cho phép một thành viên trong một nhóm người ký một thông điệp thay mặt cho cả nhóm, nhưng không ai có thể biết chính xác thành viên nào đã thực hiện việc ký đó[cite: 25, 26].

* **Tạo Chữ ký Vòng như thế nào?**
    * **Đầu vào:**
        1.  **Thông điệp cần ký:** Thường là hash của file (`h(M)`).
        2.  **Khóa bí mật của người ký (`SecretKey_User`):** Đây là khóa bí mật mà người dùng đã tự tạo và lưu trên thiết bị của mình.
        3.  **Tập hợp khóa công khai của nhóm (`Ring`):** Đây là một danh sách các `PublicKey` của tất cả thành viên trong nhóm ký (bao gồm cả `PublicKey` của chính người ký). Danh sách này được lấy từ Backend.
    * **Quá trình:** Người dùng (trên ứng dụng di động) sử dụng thuật toán mật mã, kết hợp `SecretKey` của mình với danh sách `PublicKey` của cả nhóm để tạo ra một chuỗi dữ liệu duy nhất, đó chính là Chữ ký Vòng (`σ`).
* **Xác thực Chữ ký Vòng như thế nào?**
    * **Đầu vào:**
        1.  Thông điệp gốc (hoặc `h(M)`).
        2.  Chữ ký Vòng (`σ`).
        3.  Danh sách `PublicKey` của nhóm (`Ring`) đã được dùng để tạo chữ ký.
    * **Quá trình:** Bên xác thực (ở đây là **Backend Gateway**) chạy một thuật toán kiểm tra. Thuật toán này không cần bất kỳ `SecretKey` nào. Nó sẽ trả về `True` nếu chữ ký hợp lệ và được tạo bởi một thành viên trong nhóm, ngược lại trả về `False`.

#### **B. Phong bì Ký gửi (Escrowed Identity) và Bên Giám sát (Adjudicator)**

* **Tại sao lại xuất hiện `escrowedIdentity`?**
    * Chữ ký vòng mang lại tính ẩn danh tuyệt đối. [cite\_start]Tuy nhiên, mục tiêu của đề tài là **"ẩn danh có giám sát"**, nghĩa là cần một cơ chế để truy vết danh tính trong trường hợp đặc biệt (ví dụ: vi phạm quy định)[cite: 5, 29]. `escrowedIdentity` chính là cơ chế đó.
* **Nó là gì?**
    * `escrowedIdentity` là một "phong bì niêm phong kỹ thuật số". Bên trong phong bì chứa **danh tính thật của người ký** (ví dụ: `PublicKey` của họ).
    * Phong bì này được "niêm phong" (mã hóa) bằng một chiếc khóa đặc biệt mà chỉ có **Bên Giám sát (Adjudicator)** mới có thể mở.
* **`PublicKey_Adjudicator` ở đâu ra?**
    * Bên Giám sát là một thực thể tin cậy của hệ thống. Họ sẽ tạo ra một cặp khóa `Public/Private` cho riêng mình. `PublicKey_Adjudicator` của họ sẽ được **công bố công khai**, thường do Backend Gateway cung cấp cho các client khi cần. Client sẽ lấy khóa này để "niêm phong" phong bì.

-----

### **2. Luồng Hoạt động Chi tiết (Đã cập nhật và làm rõ)**

#### **A. Đăng ký và Tải file có Giám sát**

```mermaid
sequenceDiagram
    participant User as Mobile App
    participant Backend

    %% Registration
    note over User: **Phần 1: Đăng ký An toàn**
    User->>User: 1. Tự tạo cặp khóa (PublicKey, SecretKey).
    User->>Backend: 2. Gửi {Định danh, **PublicKey**} để đăng ký.
    Backend->>Backend: 3. Lưu {Định danh, PublicKey} vào Database.

    %% Upload
    note over User, Backend: **Phần 2: Tải file và Tạo Bằng chứng Mật mã**
    User->>Backend: 4. Lấy PublicKey_Adjudicator và PublicKey của các thành viên trong Ring.
    Backend-->>User: Phản hồi các Public Key cần thiết.

    User->>User: 5. Mã hóa file (dùng FileKey_AES).
    
    note over User: 6. Thực hiện 2 thao tác Crypto đồng thời:
    User->>User: 6a. **Tạo Chữ ký Vòng (σ):** Dùng (h(File), SecretKey_của_mình, Ring_PublicKeys).
    User->>User: 6b. **Tạo Phong bì Ký gửi (escrowedIdentity):** Mã hóa PublicKey_của_mình bằng PublicKey_Adjudicator.

    User->>Backend: 7. Gửi {File mã hóa, σ, Ring_PublicKeys, escrowedIdentity}.
    
    note over Backend: 8. **Xác thực Chữ ký Vòng:** Dùng (h(File), σ, Ring_PublicKeys) để kiểm tra.
    
    alt Chữ ký hợp lệ
        Backend->>Backend: 9. Tải file lên IPFS, lưu metadata, Ring_PublicKeys và `escrowedIdentity` (dạng mã hóa) vào DB.
        Backend-->>User: 10. Trả về thành công.
    else Chữ ký không hợp lệ
        Backend-->>User: 10b. Từ chối.
    end
```

#### **B. Truy vết Danh tính**

```mermaid
sequenceDiagram
    participant Admin as Quản trị viên
    participant Backend
    participant Adjudicator as Bên Giám sát

    Admin->>Backend: 1. Yêu cầu truy vết một chữ ký cụ thể.
    
    note over Backend: 2. **Truy xuất chuỗi `escrowedIdentity` đã mã hóa từ DB.** <br/> Đây chính là "phong bì" đã được Client niêm phong ở bước upload.
    Backend->>DB: Lấy bản ghi `escrowedIdentity` tương ứng.
    DB-->>Backend: Trả về chuỗi `escrowedIdentity`.

    Backend-->>Admin: 3. Cung cấp `escrowedIdentity` (vẫn ở dạng mã hóa).

    note over Admin, Adjudicator: 4. Admin chuyển giao `escrowedIdentity` cho Bên Giám sát một cách an toàn.

    note over Adjudicator: 5. Bên Giám sát là người duy nhất có chìa khóa để mở phong bì.
    Adjudicator->>Adjudicator: Dùng **PrivateKey_Adjudicator** của mình để giải mã `escrowedIdentity`.
    
    note over Adjudicator: Kết quả giải mã chính là PublicKey thật của người đã ký.
    Adjudicator-->>Admin: 6. Báo cáo danh tính đã được xác định.
```

-----

### **3. Luồng Rút quyền Truy cập (Client-Side Re-encryption)**

Luồng này không thay đổi về mặt logic, nhưng giờ đây chúng ta đã hiểu rõ hơn về các thành phần mật mã được sử dụng bên trong.

```mermaid
sequenceDiagram
    participant AdminClient as Client được cấp quyền
    participant Backend
    participant IPFS
    participant DB as Database

    AdminClient->>Backend: 1. Gửi yêu cầu: Revoke(User_X, File_ID).

    Backend->>DB: Lấy thông tin cần thiết.
    Backend-->>AdminClient: 2. Phản hồi: OK, hãy tái mã hóa. <br> Đây là {CID_v1, Danh sách User còn lại}.

    AdminClient->>IPFS: 3a. Tải file từ CID_v1 về máy.

    note over AdminClient: 3b. Thực hiện toàn bộ Crypto tại Client:
    AdminClient->>AdminClient: - Dùng SecretKey của mình để lấy FileKey_v1.
    AdminClient->>AdminClient: - Giải mã ra PlaintextData.
    AdminClient->>AdminClient: - Tạo FileKey_v2 mới.
    AdminClient->>AdminClient: - Mã hóa lại -> EncryptedData_v2.

    AdminClient->>IPFS: 3c. Tải EncryptedData_v2 lên IPFS.
    IPFS-->>AdminClient: Trả về CID_v2.
    
    note over AdminClient: 3d. Mã hóa FileKey_v2 cho từng người dùng còn lại <br> -> List_Of_EncryptedKeys_v2.

    AdminClient->>Backend: 4. Gửi yêu cầu hoàn tất: Finalize(File_ID, CID_v2, List_Of_EncryptedKeys_v2).

    Backend->>DB: 5. Cập nhật cơ sở dữ liệu với thông tin mới.
    Backend-->>AdminClient: 6. Thông báo thành công.
```

-----

### **4. Kết luận**

Bằng việc làm rõ các khái niệm mật mã nền tảng, kiến trúc hệ thống giờ đây đã trở nên hoàn chỉnh và chặt chẽ về mặt logic. Các luồng hoạt động không chỉ được mô tả về mặt kỹ thuật mà còn được giải thích rõ ràng về mặt "tại sao", giúp củng cố tính thuyết phục và giá trị học thuật cho luận văn của bạn.