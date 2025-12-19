# 🛒 E-Commerce Backend API

Backend RESTful API cho hệ thống thương mại điện tử, được xây dựng bằng **Node.js**, **Express** và **MongoDB**.

Dự án này cung cấp đầy đủ các tính năng quản lý sản phẩm, đơn hàng, người dùng, tích hợp logic giảm giá (Coupon) nâng cao và hệ thống đánh giá sản phẩm có điều kiện.

## 🚀 Tính năng nổi bật

- **Quản lý Sản phẩm:**
  - CRUD sản phẩm (Admin).
  - Tìm kiếm, Lọc theo danh mục, Phân trang.
  - Lấy danh sách sản phẩm liên quan.
- **Hệ thống Đánh giá & Bình luận (Reviews):**
  - Người dùng chỉ được đánh giá sản phẩm **sau khi đã mua và thanh toán**.
  - Chống spam review ảo.
- **Mã giảm giá (Coupons) Nâng cao:**
  - Tạo mã giảm giá theo % hoặc số tiền.
  - **Phân loại áp dụng:** Mã có thể áp dụng cho toàn bộ cửa hàng hoặc chỉ định riêng cho từng danh mục sản phẩm (Ví dụ: Chỉ giảm cho Giày dép).
  - Kiểm tra tính hợp lệ dựa trên giỏ hàng hiện tại.
- **Đơn hàng (Orders):**
  - Tính toán tổng tiền an toàn tại Server (tránh gian lận từ Frontend).
  - Tự động trừ tồn kho khi đặt hàng thành công.
- **Xác thực & Phân quyền:**
  - JWT Authentication (Login/Register).
  - Middleware bảo vệ Route (Admin/User).
- **Tài liệu API:**
  - Tích hợp **Swagger UI** để xem và test API trực quan.

## 🛠️ Công nghệ sử dụng

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (sử dụng Mongoose ODM)
- **Auth:** JSON Web Token (JWT), BCryptJS
- **Docs:** Swagger UI Express, Swagger JSDoc

## 📦 Cài đặt & Chạy dự án

### 1. Yêu cầu tiên quyết

- Node.js (v14 trở lên)
- MongoDB (Cài local hoặc dùng MongoDB Atlas)

### 2. Clone dự án và cài đặt dependencies

```bash
git clone <link-repo-cua-ban>
cd backend
npm install
3. Cấu hình biến môi trường
Tạo file .env tại thư mục gốc và điền các thông tin sau:

Đoạn mã

NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=ma_bi_mat_cua_ban_123
PAYPAL_CLIENT_ID=client_id_paypal_neu_co
4. Nạp dữ liệu mẫu (Seeder) - Tùy chọn
Để có dữ liệu sản phẩm và user test ngay lập tức:

Bash

# Nạp dữ liệu
npm run data:import

# Xóa toàn bộ dữ liệu
npm run data:destroy
(Lưu ý: Tài khoản Admin mặc định thường là admin@example.com / 123456 - xem trong file data/users.js)

5. Khởi chạy Server
Bash

# Chạy môi trường Dev (tự động restart khi sửa code)
npm run dev

# Chạy môi trường Prod
npm start
Server sẽ chạy tại: http://localhost:5000

📚 Tài liệu API (Swagger)
Sau khi chạy server, truy cập đường dẫn sau để xem toàn bộ tài liệu API và test thử:

👉 URL: http://localhost:5000/api-docs

📂 Cấu trúc dự án
backend/
├── config/             # Cấu hình DB, Swagger
├── controllers/        # Logic xử lý (Product, Order, User, Coupon...)
├── data/               # Dữ liệu mẫu (Seeding)
├── middleware/         # Auth, Error Handling
├── models/             # Mongoose Schemas (DB Model)
├── routes/             # Định nghĩa API Routes
├── utils/              # Các hàm tiện ích (Generate Token...)
├── server.js           # Entry point
└── .env                # Biến môi trường
📝 API Endpoints chính
Products
GET /api/products: Lấy danh sách sản phẩm.

GET /api/products/:id: Chi tiết sản phẩm.

POST /api/products/:id/reviews: Đánh giá sản phẩm (Yêu cầu Login + Đã mua).

Coupons
POST /api/coupons: Tạo mã giảm giá (Admin).

POST /api/coupons/validate: Kiểm tra mã giảm giá (Gửi kèm giỏ hàng để check danh mục).

Orders
POST /api/orders: Tạo đơn hàng mới.

GET /api/orders/myorders: Lấy đơn hàng của tôi.

Users
POST /api/users/login: Đăng nhập.

POST /api/users: Đăng ký.

🤝 Đóng góp
Fork dự án

Tạo branch mới (git checkout -b feature/AmazingFeature)

Commit thay đổi (git commit -m 'Add some AmazingFeature')

Push lên branch (git push origin feature/AmazingFeature)

Mở Pull Request


### Cách sử dụng file này:
1.  Tạo file mới tên là `README.md`.
2.  Copy toàn bộ nội dung trong khối code trên.
3.  Paste vào file và lưu lại.
4.  Khi đẩy lên Github/Gitlab, nó sẽ hiển thị rất đẹp mắt và chuyên nghiệp.
```
