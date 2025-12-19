# 🛒 E-Commerce Backend API

Backend RESTful API cho hệ thống **Thương mại điện tử**, xây dựng bằng **Node.js**, **Express** và **MongoDB**.  
Dự án tập trung vào **tính an toàn dữ liệu**, **logic nghiệp vụ chặt chẽ** và **khả năng mở rộng**.

---

## 🚀 Tính năng nổi bật

### 🛍️ Quản lý Sản phẩm

- CRUD sản phẩm (**Admin**).
- Tìm kiếm theo từ khóa.
- Lọc theo danh mục.
- Phân trang.
- Lấy danh sách sản phẩm liên quan.

### ⭐ Hệ thống Đánh giá & Bình luận

- Người dùng **chỉ được đánh giá sau khi đã mua và thanh toán**.
- Mỗi sản phẩm chỉ được review **1 lần / user**.
- Ngăn chặn spam & review ảo.

### 🎟️ Mã giảm giá (Coupons) nâng cao

- Tạo mã giảm giá theo:
  - **Phần trăm (%)**
  - **Số tiền cố định**
- **Phạm vi áp dụng linh hoạt**:
  - Toàn bộ cửa hàng
  - Chỉ áp dụng cho **danh mục sản phẩm cụ thể**
- Kiểm tra tính hợp lệ dựa trên **giỏ hàng hiện tại**.

### 📦 Đơn hàng (Orders)

- Tính toán tổng tiền **tại Server**.
- Tự động trừ tồn kho khi đặt hàng.
- Cập nhật trạng thái thanh toán & giao hàng.

### 🔐 Xác thực & Phân quyền

- JWT Authentication.
- Middleware phân quyền User / Admin.

### 📘 Tài liệu API

- Swagger UI.
- Test API trực tiếp.

---

## 🛠️ Công nghệ sử dụng

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT, BCryptJS
- Swagger

---

## 📦 Cài đặt & Chạy dự án

### 1️⃣ Clone & cài đặt

```bash
git clone <your-repo>
cd backend
npm install
```

### 2️⃣ Biến môi trường (.env)

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

### 3️⃣ Chạy server

```bash
npm run dev
```

---

## 📚 Swagger

👉 http://localhost:5000/api-docs

---

## 📂 Cấu trúc dự án

```
backend/
├── config/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
└── server.js
```

---

## 🤝 Đóng góp

Pull Request luôn được chào đón 👍
