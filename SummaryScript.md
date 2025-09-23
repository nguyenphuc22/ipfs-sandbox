Kịch bản Thuyết trình Chi tiết

Slide 1: Đặt vấn đề & Mục tiêu(Bắt đầu)

"Kính thưa quý thầy cô và các bạn,

Trong thế giới số ngày nay, nhu cầu chia sẻ dữ liệu là vô cùng lớn. Tuy nhiên, đi kèm với đó là một bài toán nan giải: làm thế nào để chúng ta có thể chia sẻ thông tin một cách tự do, ẩn danh, nhưng đồng thời vẫn phải đảm bảo rằng hệ thống không bị lạm dụng để phát tán những nội dung xấu, vi phạm pháp luật?"

(Chỉ vào mục "Bài toán" trên slide)"

Đây chính là bài toán cốt lõi mà đề tài của chúng em hướng đến giải quyết. Cụ thể là, làm sao để một người dùng có thể tải lên một tài liệu mà không ai biết họ là ai, nhưng nếu tài liệu đó có vấn đề, chúng ta vẫn có cơ chế để tìm ra người chịu trách nhiệm."

(Chỉ vào mục "Mục tiêu chính")

"Để giải quyết bài toán này, kiến trúc hệ thống của chúng em tập trung vào việc cân bằng ba yếu tố trụ cột:

1. Thứ nhất là Ẩn danh (Anonymity): Chúng ta phải bảo vệ danh tính của người dùng, cho phép họ hoạt động mà không bị theo dõi.
2. Thứ hai là Bảo mật (Security): Dữ liệu phải được mã hóa và bảo vệ toàn vẹn trong suốt quá trình lưu trữ và chia sẻ.
3. Và cuối cùng, quan trọng không kém, là Trách nhiệm (Accountability): Phải tồn tại một cơ chế truy vết danh tính khi có sự cố xảy ra, đảm bảo hệ thống không trở thành một môi trường vô chính phủ."

"Trong phần tiếp theo, em sẽ trình bày giải pháp kỹ thuật mà chúng em đã xây dựng để đạt được sự cân bằng này."

Slide 2: Các "Viên gạch" Mật mã Cốt lõi

"Để hiện thực hóa ba mục tiêu vừa nêu, chúng em đã sử dụng hai kỹ thuật mật mã tiên tiến, được xem như những 'viên gạch' nền tảng cho toàn bộ hệ thống."

(Chỉ vào mục "Chữ ký Vòng")

"Viên gạch đầu tiên là Chữ ký Vòng (Ring Signature). Ý tưởng của nó rất đơn giản: hãy tưởng tượng một nhóm người cùng ký vào một văn bản, nhưng chữ ký cuối cùng không chỉ ra được ai là người đã cầm bút. Nó chỉ xác nhận rằng chữ ký được tạo bởi một người trong nhóm đó. Trong hệ thống của chúng em, Chữ ký Vòng chính là công cụ để cung cấp tính ẩn danh cho người tải file."

(Chỉ vào mục "Phong bì Ký gửi")

"Tuy nhiên, ẩn danh tuyệt đối sẽ tạo ra rủi ro. Đó là lý do chúng ta cần đến viên gạch thứ hai: Phong bì Ký gửi (Escrowed Identity). Mọi người có thể hình dung đây là một chiếc phong bì kỹ thuật số đã được niêm phong. Bên trong phong bì này chứa danh tính thật của người ký. Điểm đặc biệt là, chỉ có một bên thứ ba độc lập và đáng tin cậy, mà chúng em gọi là Bên Giám sát (Adjudicator), mới có chiếc chìa khóa để mở phong bì này. Đây chính là cơ chế đảm bảo khả năng truy vết và trách nhiệm trong hệ thống."

"Vậy, hai viên gạch này được lắp ghép với nhau như thế nào trong thực tế? Xin mời thầy cô và các bạn cùng xem qua các luồng hoạt động chính của hệ thống."

Slide 3: Luồng 1 - Tải File Lên (Ẩn danh có Giám sát)

(Trình bày theo sơ đồ)

"Đây là luồng hoạt động quan trọng nhất, mô tả cách một người dùng tải file lên hệ thống. Quá trình này diễn ra như sau:"

- "Bước 1 và 2: Người dùng thông báo cho Backend rằng họ muốn tải file. Backend sẽ gửi lại cho họ một danh sách các khóa công khai cần thiết, bao gồm khóa của Bên Giám sát và của các thành viên khác trong 'nhóm ký'.
- ""Bước 3 (Đây là bước cốt lõi): Tại ứng dụng của mình, người dùng thực hiện đồng thời hai thao tác mật mã:
  - 3a: Họ dùng khóa bí mật của mình và danh sách khóa công khai của nhóm để tạo ra một Chữ ký Vòng. Thao tác này giúp che giấu danh tính của họ.
  - 3b: Đồng thời, họ tạo một 'Phong bì Ký gửi' bằng cách mã hóa danh tính thật của mình với khóa công khai của Bên Giám sát."
- "Bước 4: Người dùng gửi file đã được mã hóa, kèm theo Chữ ký Vòng và 'Phong bì' đã niêm phong lên Backend."
- "Bước 5, 6, 7: Backend nhận được gói tin này. Nó có thể xác thực rằng Chữ ký Vòng là hợp lệ (tức là đúng là do một thành viên trong nhóm ký) mà không cần biết đó là ai. Nếu hợp lệ, Backend sẽ lưu file và 'phong bì' đang được niêm phong vào cơ sở dữ liệu. Quá trình tải file thành công, và danh tính người dùng vẫn hoàn toàn ẩn danh."

"Như vậy, khi kết thúc luồng này, file đã được lưu trữ an toàn, người dùng được ẩn danh, nhưng một cơ chế truy vết đã được lưu lại để dự phòng."

Slide 4: Luồng 2 - Truy vết Danh tính

"Vậy, khi nào thì 'Phong bì' đó được mở? Đó chính là nội dung của luồng truy vết danh tính."

(Trình bày theo sơ đồ)

- "Bước 1: Khi phát hiện một nội dung vi phạm, Quản trị viên (Admin) sẽ gửi yêu cầu truy vết chữ ký gắn với nội dung đó."
- "Bước 2 và 3: Backend sẽ tìm trong cơ sở dữ liệu và lấy ra đúng 'Phong bì Ký gửi' tương ứng. Quan trọng là, Backend chỉ có thể lấy ra chứ không thể mở nó. 'Phong bì' này sau đó được chuyển cho Admin."
- "Bước 4 (Phân tách quyền lực): Admin sẽ chuyển giao 'phong bì' này cho Bên Giám sát. Đây là một bước quan trọng để đảm bảo tính minh bạch, tránh việc Admin có thể tự ý xem danh tính người dùng."
- "Bước 5 và 6: Chỉ có Bên Giám sát, với khóa bí mật của mình, mới có thể 'mở phong bì' và đọc được danh tính thật bên trong. Kết quả sau đó sẽ được báo cáo lại cho Admin để xử lý."

"Luồng hoạt động này cho thấy cơ chế truy vết của chúng em được thiết kế rất chặt chẽ, đảm bảo danh tính người dùng chỉ bị tiết lộ khi có lý do chính đáng và phải thông qua một thực thể độc lập."

Slide 5: Luồng 3 - Thu hồi Quyền Truy cập

"Một tính năng quan trọng khác của hệ thống là khả năng thu hồi quyền truy cập vào một file đã được chia sẻ. Chúng em giải quyết bài toán này bằng kỹ thuật Tái mã hóa phía Client."

"Mục đích của kỹ thuật này là khi một người dùng, ví dụ User_X, bị loại khỏi nhóm chia sẻ, chúng ta phải đảm bảo User_X không thể đọc được file đó nữa."

(Trình bày theo sơ đồ)

- "Bước 1: Một người có quyền quản trị (AdminClient) gửi yêu cầu thu hồi quyền của User_X."
- "Bước 2 (Xử lý tại Client): Thay vì xử lý trên server, chính AdminClient sẽ tải file về, dùng khóa của mình để giải mã, sau đó tạo ra một khóa mã hóa hoàn toàn mới (FileKey_v2) và dùng nó để mã hóa lại file."
- "Bước 3: File đã được tái mã hóa này sẽ được tải lại lên IPFS, tạo ra một địa chỉ mới (CID_v2)."
- "Bước 4 và 5: Cuối cùng, AdminClient sẽ mã hóa khóa mới (FileKey_v2) và chỉ gửi cho những người dùng còn lại trong nhóm. Thông tin về file mới và các khóa mới này sẽ được cập nhật lên Backend."

"Kết quả là, User_X, người đã bị thu hồi quyền, sẽ không có khóa mới và do đó không thể giải mã phiên bản mới của file, đảm bảo việc thu hồi quyền diễn ra triệt để."

Slide 6: Kết luận

"Để tổng kết lại bài trình bày, kiến trúc hệ thống của chúng em đã giải quyết thành công bài toán đặt ra ban đầu."

(Chỉ vào các gạch đầu dòng)

- "Bằng việc kết hợp một cách thông minh giữa Chữ ký Vòng để tạo ra sự ẩn danh và Phong bì Ký gửi để đảm bảo trách nhiệm, chúng em đã xây dựng được một cơ chế 'ẩn danh có giám sát'."
- "Hệ thống này đạt được sự cân bằng tinh tế giữa việc bảo vệ quyền riêng tư cho người dùng và việc duy trì khả năng quản lý, kiểm soát của nhà cung cấp dịch vụ."
- "Về mặt logic và học thuật, mô hình này đã chứng minh được tính hiệu quả và chặt chẽ, mở ra hướng tiếp cận mới cho các hệ thống lưu trữ phi tập trung đòi hỏi cao về bảo mật và ẩn danh."

"Bài trình bày của em đến đây là kết thúc. Em xin chân thành cảm ơn sự lắng nghe của quý thầy cô và các bạn. Em rất sẵn lòng trả lời các câu hỏi."