# IPFS Sandbox Testing Environment

Bộ công cụ để thiết lập môi trường sandbox IPFS cục bộ với nhiều node để thử nghiệm phân phối và sao chép nội dung.

## Tổng quan

Sandbox tạo ra 5 node IPFS trên máy của bạn tạo thành một mạng riêng tư, cho phép bạn thử nghiệm:
- Phân mảnh và phân phối tệp
- Định vị nội dung bằng địa chỉ (Content addressing)
- Ghim và bỏ ghim nội dung (Pinning/unpinning)
- Thu gom rác (Garbage collection)
- Lấy nội dung giữa các node

## Yêu cầu

- MacOS (script được tối ưu cho MacOS, nhưng có thể điều chỉnh cho Linux)
- IPFS Kubo đã cài đặt (`brew install ipfs` hoặc tải từ https://dist.ipfs.tech/)
- Shell Bash/ZSH

## Các script có sẵn

Dự án này bao gồm 3 script chính:

1. **setup-ipfs-sandbox.sh**: Thiết lập môi trường IPFS ban đầu
2. **manage-ipfs-sandbox.sh**: Quản lý các node IPFS (khởi động, dừng, kiểm tra)
3. **test-ipfs-distribution.sh**: Thử nghiệm phân phối nội dung

## Hướng dẫn sử dụng

### 1. Thiết lập sandbox (chỉ làm một lần)

```bash
chmod +x setup-ipfs-sandbox.sh
./setup-ipfs-sandbox.sh
```

### 2. Khởi động và quản lý các node

```bash
chmod +x manage-ipfs-sandbox.sh

# Khởi động tất cả các node
./manage-ipfs-sandbox.sh start

# Khởi động một node cụ thể
./manage-ipfs-sandbox.sh start 3  # Khởi động node3

# Kiểm tra trạng thái
./manage-ipfs-sandbox.sh status

# Dừng tất cả các node
./manage-ipfs-sandbox.sh stop

# Dừng một node cụ thể
./manage-ipfs-sandbox.sh stop 2  # Dừng node2

# Khởi động lại tất cả các node
./manage-ipfs-sandbox.sh restart

# Khởi động lại một node cụ thể
./manage-ipfs-sandbox.sh restart 3  # Khởi động lại node3
```

### 3. Chạy thử nghiệm phân phối

```bash
chmod +x test-ipfs-distribution.sh

# Tạo tệp thử nghiệm 5MB
dd if=/dev/urandom of=test-file-5mb.bin bs=1M count=5

# Chạy thử nghiệm với kích thước phân mảnh mặc định (256KB)
./test-ipfs-distribution.sh test-file-5mb.bin

# Chạy với kích thước phân mảnh tùy chỉnh
./test-ipfs-distribution.sh test-file-5mb.bin 1048576  # 1MB chunks
```

## Quy trình thử nghiệm

Script `test-ipfs-distribution.sh` thực hiện các thử nghiệm sau:

1. Thêm tệp vào node1 với kích thước phân mảnh được chỉ định
2. Phân tích cấu trúc DAG của tệp
3. Kiểm tra sự phân phối ban đầu
4. **Test 1**: Lấy tệp từ node2
5. **Test 2**: Ghim tệp trên node3
6. **Test 3**: Bỏ ghim tệp khỏi node1 và node2, chạy garbage collection
7. **Test 4**: Lấy tệp từ node4 và node5
8. Tóm tắt kết quả

## Khái niệm chính để quan sát

Khi chạy các thử nghiệm này, hãy quan sát:

1. **Content addressing**: Hoạt động thông qua CIDs (Content Identifiers)
2. **Chunking**: Phân chia tệp lớn thành các phần có thể quản lý
3. **Merkle DAG**: Cấu trúc liên kết các phân mảnh
4. **Content discovery**: Diễn ra thông qua DHT
5. **Content distribution**: Xảy ra theo nhu cầu thông qua Bitswap
6. **Pinning**: Ảnh hưởng đến việc lưu trữ dữ liệu
7. **Garbage collection**: Loại bỏ nội dung không được ghim

## Dọn dẹp môi trường IPFS

### Dọn dẹp dữ liệu trong sandbox

Để dọn dẹp các block và datastore nhưng giữ cấu hình:

```bash
# Dọn dẹp sandbox (xóa dữ liệu nhưng giữ cấu hình)
./manage-ipfs-sandbox.sh clean
```

Thao tác này sẽ:
1. Dừng tất cả các node đang chạy
2. Xóa nội dung trong thư mục `blocks` và `datastore` của mỗi node
3. Giữ nguyên cấu hình node và swarm key

### Xóa hoàn toàn môi trường IPFS sandbox

Nếu bạn muốn xóa hoàn toàn môi trường sandbox:

```bash
# Đầu tiên, dừng tất cả các node
./manage-ipfs-sandbox.sh stop

# Sau đó xóa thư mục sandbox
rm -rf ~/ipfs-sandbox
```

### Kill các tiến trình IPFS đang chạy

Đôi khi các tiến trình IPFS có thể không dừng lại đúng cách thông qua script quản lý. Dưới đây là các cách để kill các tiến trình IPFS đang chạy:

#### 1. Sử dụng script quản lý (cách thông thường)

```bash
# Dừng tất cả các node
./manage-ipfs-sandbox.sh stop

# Hoặc dừng một node cụ thể
./manage-ipfs-sandbox.sh stop 2
```

#### 2. Tìm và kill thủ công các tiến trình IPFS

Nếu script không dừng được tiến trình, bạn có thể tìm và kill thủ công:

```bash
# Tìm tất cả các tiến trình IPFS đang chạy
ps aux | grep ipfs

# Kill tiến trình theo PID
kill <PID>

# Kill tiến trình một cách mạnh mẽ nếu không phản hồi
kill -9 <PID>

# Hoặc kill tất cả các tiến trình IPFS cùng lúc
pkill -f ipfs

# Kill mạnh tất cả các tiến trình IPFS
pkill -9 -f ipfs
```

#### 3. Kiểm tra các tiến trình IPFS còn sót lại

Sau khi kill tiến trình, kiểm tra xem còn tiến trình nào đang chạy không:

```bash
ps aux | grep ipfs
```

#### 4. Xử lý file khóa nếu cần

Nếu sau khi kill tiến trình, bạn vẫn gặp vấn đề khi khởi động lại node, hãy xóa file khóa:

```bash
# Xóa file khóa của một node cụ thể
rm ~/ipfs-sandbox/node2/repo.lock

# Hoặc xóa tất cả các file khóa
rm ~/ipfs-sandbox/node*/repo.lock
```

## Xử lý sự cố

### Node không khởi động

Nếu node không thể khởi động:

1. Kiểm tra logs: `cat ~/ipfs-sandbox/logs/nodeX.log`
2. Xóa tệp khóa: `rm ~/ipfs-sandbox/nodeX/repo.lock`
3. Khởi động lại node: `./manage-ipfs-sandbox.sh restart X`

### Các node không thể kết nối với nhau

1. Kiểm tra cấu hình bootstrap:
   ```bash
   export IPFS_PATH=~/ipfs-sandbox/node1
   ipfs bootstrap list
   ```
2. Xác minh kết nối swarm:
   ```bash
   export IPFS_PATH=~/ipfs-sandbox/node1
   ipfs swarm peers
   ```

## Tài nguyên

- [IPFS Documentation](https://docs.ipfs.tech/)
- [IPFS Kubo Commands](https://docs.ipfs.tech/reference/kubo/cli/)
- [Content Addressing](https://docs.ipfs.tech/concepts/content-addressing/)
- [IPFS Bitswap](https://docs.ipfs.tech/concepts/bitswap/)
- [Pinning in IPFS](https://docs.ipfs.tech/concepts/persistence/)