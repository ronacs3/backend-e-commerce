const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API Documentation",
      version: "1.0.0",
      description:
        "Tài liệu API đầy đủ và chi tiết cho hệ thống E-Commerce Backend (Node.js, Express, MongoDB, Gemini AI)",
      contact: {
        name: "Dev Team",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local Development Server",
      },
      {
        url: "https://techshopnibi.name.vn",
        description: "Production Server",
      },
    ],
    components: {
      // Cấu hình xác thực JWT Bearer
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Nhập JWT Token của bạn (không bao gồm chữ Bearer)",
        },
      },
      // Định nghĩa các Schemas / Models
      schemas: {
        // --- 1. USER SCHEMAS ---
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "65a1b2c3d4e5f67890123456" },
            name: { type: "string", example: "Nguyen Van A" },
            email: { type: "string", example: "user@example.com" },
            isAdmin: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        UserRegisterInput: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Nguyen Van A" },
            email: { type: "string", example: "user@example.com" },
            password: { type: "string", example: "123456" },
          },
        },
        UserLoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "user@example.com" },
            password: { type: "string", example: "123456" },
          },
        },
        UserAuthResponse: {
          type: "object",
          properties: {
            _id: { type: "string", example: "65a1b2c3d4e5f67890123456" },
            name: { type: "string", example: "Nguyen Van A" },
            email: { type: "string", example: "user@example.com" },
            isAdmin: { type: "boolean", example: false },
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
          },
        },
        UserProfileUpdateInput: {
          type: "object",
          properties: {
            name: { type: "string", example: "Nguyen Van A Updated" },
            email: { type: "string", example: "user_updated@example.com" },
            password: { type: "string", example: "newpassword123" },
          },
        },
        UserForgotPasswordInput: {
          type: "object",
          required: ["email"],
          properties: {
            email: { type: "string", example: "user@example.com" },
          },
        },
        UserResetPasswordInput: {
          type: "object",
          required: ["password"],
          properties: {
            password: { type: "string", example: "newsecretpassword123" },
          },
        },

        // --- 2. REVIEW SCHEMA ---
        Review: {
          type: "object",
          properties: {
            _id: { type: "string", example: "65a1b2c3d4e5f67890999999" },
            name: { type: "string", example: "Nguyen Van A" },
            rating: { type: "number", example: 5 },
            comment: { type: "string", example: "Sản phẩm rất tuyệt vời!" },
            user: { type: "string", example: "65a1b2c3d4e5f67890123456" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        ReviewInput: {
          type: "object",
          required: ["rating", "comment"],
          properties: {
            rating: { type: "number", example: 5 },
            comment: { type: "string", example: "Sản phẩm rất tuyệt vời!" },
          },
        },

        // --- 3. PRODUCT SCHEMAS ---
        Product: {
          type: "object",
          properties: {
            _id: { type: "string", example: "65a1b2c3d4e5f67890123457" },
            user: { type: "string", example: "65a1b2c3d4e5f67890123456" },
            name: { type: "string", example: "iPhone 15 Pro Max" },
            price: { type: "number", example: 30000000 },
            image: {
              type: "string",
              example:
                "https://res.cloudinary.com/demo/image/upload/v12345/iphone15.jpg",
            },
            category: { type: "string", example: "Điện thoại" },
            countInStock: { type: "number", example: 10 },
            description: {
              type: "string",
              example: "Màn hình OLED 6.7 inch, chip Apple A17 Pro...",
            },
            rating: { type: "number", example: 4.8 },
            numReviews: { type: "number", example: 15 },
            reviews: {
              type: "array",
              items: { $ref: "#/components/schemas/Review" },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ProductInput: {
          type: "object",
          required: [
            "name",
            "price",
            "image",
            "category",
            "countInStock",
            "description",
          ],
          properties: {
            name: { type: "string", example: "iPhone 15 Pro Max" },
            price: { type: "number", example: 30000000 },
            image: {
              type: "string",
              example:
                "https://res.cloudinary.com/demo/image/upload/v12345/iphone15.jpg",
            },
            category: { type: "string", example: "Điện thoại" },
            countInStock: { type: "number", example: 10 },
            description: {
              type: "string",
              example: "Màn hình OLED 6.7 inch, chip Apple A17 Pro...",
            },
          },
        },
        CompareProductsAIInput: {
          type: "object",
          required: ["products"],
          properties: {
            products: {
              type: "array",
              description: "Danh sách từ 2 đến 4 sản phẩm để so sánh",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", example: "iPhone 15 Pro Max" },
                  price: { type: "number", example: 30000000 },
                  category: { type: "string", example: "Điện thoại" },
                  description: { type: "string", example: "Chip A17 Pro..." },
                  countInStock: { type: "number", example: 10 },
                },
              },
            },
          },
        },

        // --- 4. CATEGORY SCHEMAS ---
        Category: {
          type: "object",
          properties: {
            _id: { type: "string", example: "65a1b2c3d4e5f67890123458" },
            name: { type: "string", example: "Điện thoại" },
            description: {
              type: "string",
              example: "Các dòng điện thoại thông minh mới nhất",
            },
            image: {
              type: "string",
              example:
                "https://res.cloudinary.com/demo/image/upload/v12345/category_phone.jpg",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CategoryInput: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", example: "Điện thoại" },
            description: {
              type: "string",
              example: "Các dòng điện thoại thông minh mới nhất",
            },
            image: {
              type: "string",
              example:
                "https://res.cloudinary.com/demo/image/upload/v12345/category_phone.jpg",
            },
          },
        },

        // --- 5. COUPON SCHEMAS ---
        Coupon: {
          type: "object",
          properties: {
            _id: { type: "string", example: "65a1b2c3d4e5f67890123459" },
            code: { type: "string", example: "SALE50" },
            discount: { type: "number", example: 10 },
            expirationDate: {
              type: "string",
              format: "date-time",
              example: "2026-12-31T23:59:59.000Z",
            },
            applicableCategories: {
              type: "array",
              items: { type: "string" },
              example: ["Điện thoại", "Laptop"],
              description:
                "Mảng danh mục áp dụng (Mảng rỗng [] = Áp dụng tất cả sản phẩm)",
            },
            isActive: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CouponInput: {
          type: "object",
          required: ["code", "discount", "expirationDate"],
          properties: {
            code: { type: "string", example: "SALE50" },
            discount: { type: "number", example: 10 },
            expirationDate: {
              type: "string",
              format: "date-time",
              example: "2026-12-31T23:59:59.000Z",
            },
            applicableCategories: {
              type: "array",
              items: { type: "string" },
              example: ["Điện thoại"],
            },
          },
        },
        CouponValidateInput: {
          type: "object",
          required: ["code"],
          properties: {
            code: { type: "string", example: "SALE50" },
            cartItems: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string", example: "Điện thoại" },
                },
              },
            },
          },
        },

        // --- 6. ORDER SCHEMAS ---
        OrderItem: {
          type: "object",
          required: ["name", "qty", "image", "price", "product"],
          properties: {
            name: { type: "string", example: "iPhone 15 Pro Max" },
            qty: { type: "number", example: 1 },
            image: {
              type: "string",
              example: "/images/iphone.jpg",
            },
            price: { type: "number", example: 30000000 },
            product: { type: "string", example: "65a1b2c3d4e5f67890123457" },
          },
        },
        ShippingAddress: {
          type: "object",
          required: ["address", "city", "postalCode", "country"],
          properties: {
            address: { type: "string", example: "123 Đường ABC" },
            city: { type: "string", example: "TP. Hồ Chí Minh" },
            postalCode: { type: "string", example: "700000" },
            country: { type: "string", example: "Việt Nam" },
          },
        },
        Order: {
          type: "object",
          properties: {
            _id: { type: "string", example: "65a1b2c3d4e5f67890123460" },
            user: { type: "string", example: "65a1b2c3d4e5f67890123456" },
            orderItems: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" },
            },
            shippingAddress: { $ref: "#/components/schemas/ShippingAddress" },
            paymentMethod: { type: "string", example: "COD" },
            itemsPrice: { type: "number", example: 30000000 },
            taxPrice: { type: "number", example: 0 },
            shippingPrice: { type: "number", example: 30000 },
            totalPrice: { type: "number", example: 30030000 },
            isPaid: { type: "boolean", example: false },
            paidAt: { type: "string", format: "date-time" },
            isDelivered: { type: "boolean", example: false },
            deliveredAt: { type: "string", format: "date-time" },
            isCancelled: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        OrderCreateInput: {
          type: "object",
          required: ["orderItems", "shippingAddress", "paymentMethod"],
          properties: {
            orderItems: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" },
            },
            shippingAddress: { $ref: "#/components/schemas/ShippingAddress" },
            paymentMethod: { type: "string", example: "COD" },
            taxPrice: { type: "number", example: 0 },
            shippingPrice: { type: "number", example: 30000 },
            couponCode: { type: "string", example: "SALE50" },
          },
        },

        // --- 7. AI CHAT SCHEMAS ---
        ChatRequest: {
          type: "object",
          required: ["message"],
          properties: {
            message: {
              type: "string",
              example:
                "Tư vấn cho tôi một chiếc điện thoại dưới 10 triệu để chơi game mượt",
            },
          },
        },

        // --- 8. COMMON ERROR SCHEMA ---
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Thông báo lỗi chi tiết" },
            stack: { type: "string", example: "Error stack trace (nếu ở dev mode)" },
          },
        },
      },
    },

    // --- ĐỊNH NGHĨA CÁC API ENDPOINTS ---
    paths: {
      // =========================================================================
      // 1. AUTH & USER ENDPOINTS (/api/users)
      // =========================================================================
      "/api/users": {
        post: {
          summary: "Đăng ký tài khoản người dùng mới",
          tags: ["Users & Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserRegisterInput" },
              },
            },
          },
          responses: {
            201: {
              description: "Đăng ký thành công, trả về thông tin user và JWT token",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UserAuthResponse" },
                },
              },
            },
            400: {
              description: "Email đã tồn tại hoặc dữ liệu không hợp lệ",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
        get: {
          summary: "Lấy danh sách tất cả người dùng (Admin)",
          tags: ["Users & Auth"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Danh sách người dùng",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
            401: { description: "Chưa xác thực hoặc token không hợp lệ" },
            403: { description: "Không có quyền Admin" },
          },
        },
      },

      "/api/users/login": {
        post: {
          summary: "Đăng nhập hệ thống & Lấy JWT Token",
          tags: ["Users & Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserLoginInput" },
              },
            },
          },
          responses: {
            200: {
              description: "Đăng nhập thành công",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UserAuthResponse" },
                },
              },
            },
            401: { description: "Email hoặc mật khẩu sai" },
          },
        },
      },

      "/api/users/profile": {
        get: {
          summary: "Lấy thông tin cá nhân của người dùng đang đăng nhập",
          tags: ["Users & Auth"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Thông tin cá nhân người dùng",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" },
                },
              },
            },
            401: { description: "Chưa đăng nhập" },
            404: { description: "Không tìm thấy thông tin người dùng" },
          },
        },
        put: {
          summary: "Cập nhật thông tin cá nhân / Đổi mật khẩu",
          tags: ["Users & Auth"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UserProfileUpdateInput",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Cập nhật thành công",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UserAuthResponse" },
                },
              },
            },
            401: { description: "Chưa đăng nhập" },
            404: { description: "Không tìm thấy người dùng" },
          },
        },
      },

      "/api/users/{id}": {
        delete: {
          summary: "Xóa người dùng theo ID (Admin)",
          tags: ["Users & Auth"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "ID người dùng cần xóa",
            },
          ],
          responses: {
            200: { description: "Đã xóa người dùng thành công" },
            400: { description: "Không thể xóa tài khoản Admin" },
            401: { description: "Chưa đăng nhập" },
            403: { description: "Không có quyền Admin" },
            404: { description: "Không tìm thấy người dùng" },
          },
        },
      },

      "/api/users/forgot-password": {
        post: {
          summary: "Yêu cầu khôi phục mật khẩu (Gửi email chứa reset token)",
          tags: ["Users & Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UserForgotPasswordInput",
                },
              },
            },
          },
          responses: {
            200: { description: "Đã gửi email hướng dẫn đặt lại mật khẩu" },
            404: { description: "Không tìm thấy email này" },
            500: { description: "Lỗi gửi email hệ thống" },
          },
        },
      },

      "/api/users/reset-password/{token}": {
        put: {
          summary: "Đặt lại mật khẩu mới bằng reset token",
          tags: ["Users & Auth"],
          parameters: [
            {
              in: "path",
              name: "token",
              required: true,
              schema: { type: "string" },
              description: "Token khôi phục mật khẩu từ email",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UserResetPasswordInput",
                },
              },
            },
          },
          responses: {
            200: { description: "Đổi mật khẩu thành công" },
            400: { description: "Token không hợp lệ hoặc đã hết hạn" },
          },
        },
      },

      // =========================================================================
      // 2. PRODUCTS & REVIEWS ENDPOINTS (/api/products)
      // =========================================================================
      "/api/products": {
        get: {
          summary: "Lấy danh sách sản phẩm (Tìm kiếm, Lọc danh mục, Lọc giá)",
          tags: ["Products & Reviews"],
          parameters: [
            {
              in: "query",
              name: "keyword",
              schema: { type: "string" },
              description: "Tìm kiếm sản phẩm theo tên (Regex không phân biệt hoa thường)",
            },
            {
              in: "query",
              name: "category",
              schema: { type: "string" },
              description: "Lọc theo tên danh mục",
            },
            {
              in: "query",
              name: "min",
              schema: { type: "number" },
              description: "Giá tối thiểu",
            },
            {
              in: "query",
              name: "max",
              schema: { type: "number" },
              description: "Giá tối đa",
            },
          ],
          responses: {
            200: {
              description: "Danh sách sản phẩm phù hợp",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Tạo sản phẩm mới (Admin)",
          tags: ["Products & Reviews"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductInput" },
              },
            },
          },
          responses: {
            201: {
              description: "Sản phẩm được tạo thành công",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Product" },
                },
              },
            },
            401: { description: "Chưa đăng nhập hoặc không có quyền Admin" },
          },
        },
      },

      "/api/products/categories": {
        get: {
          summary: "Lấy danh sách các danh mục sản phẩm độc nhất (Distinct string categories)",
          tags: ["Products & Reviews"],
          responses: {
            200: {
              description: "Mảng tên danh mục",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { type: "string", example: "Điện thoại" },
                  },
                },
              },
            },
          },
        },
      },

      "/api/products/compare-ai": {
        post: {
          summary: "So sánh các sản phẩm bằng AI (Gemini 2.5 Flash)",
          tags: ["Products & Reviews"],
          description:
            "Gửi danh sách 2-4 sản phẩm. Trợ lý AI sẽ phân tích điểm giống/khác nhau và đưa ra lời khuyên mua sắm (Trả về dạng HTML).",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CompareProductsAIInput",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Kết quả so sánh dạng HTML",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      result: {
                        type: "string",
                        example:
                          "<div><p><strong>Điểm giống nhau:</strong>...</p></div>",
                      },
                    },
                  },
                },
              },
            },
            400: { description: "Cần ít nhất 2 sản phẩm để so sánh" },
            500: { description: "Lỗi kết nối Gemini AI" },
          },
        },
      },

      "/api/products/{id}": {
        get: {
          summary: "Lấy thông tin chi tiết một sản phẩm theo ID",
          tags: ["Products & Reviews"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "ID sản phẩm (MongoDB ObjectId 24 ký tự)",
            },
          ],
          responses: {
            200: {
              description: "Chi tiết sản phẩm",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Product" },
                },
              },
            },
            404: { description: "Không tìm thấy sản phẩm hoặc ID không hợp lệ" },
          },
        },
        put: {
          summary: "Cập nhật sản phẩm theo ID (Admin)",
          tags: ["Products & Reviews"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProductInput" },
              },
            },
          },
          responses: {
            200: {
              description: "Cập nhật sản phẩm thành công",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Product" },
                },
              },
            },
            401: { description: "Không có quyền Admin" },
            404: { description: "Không tìm thấy sản phẩm" },
          },
        },
        delete: {
          summary: "Xóa sản phẩm theo ID (Admin)",
          tags: ["Products & Reviews"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Đã xóa sản phẩm" },
            401: { description: "Không có quyền Admin" },
            404: { description: "Không tìm thấy sản phẩm" },
          },
        },
      },

      "/api/products/{id}/related": {
        get: {
          summary: "Lấy danh sách sản phẩm liên quan (Cùng danh mục, tối đa 4 món)",
          tags: ["Products & Reviews"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "ID sản phẩm gốc",
            },
          ],
          responses: {
            200: {
              description: "Danh sách sản phẩm liên quan",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
            404: { description: "Không tìm thấy sản phẩm gốc" },
          },
        },
      },

      "/api/products/{id}/reviews": {
        post: {
          summary: "Gửi đánh giá cho sản phẩm (Yêu cầu User đã mua và thanh toán sản phẩm)",
          tags: ["Products & Reviews"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "ID sản phẩm cần đánh giá",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ReviewInput" },
              },
            },
          },
          responses: {
            201: { description: "Đánh giá đã được thêm thành công" },
            400: {
              description:
                "Đã đánh giá rồi hoặc chưa từng mua & thanh toán sản phẩm này",
            },
            401: { description: "Chưa đăng nhập" },
            404: { description: "Không tìm thấy sản phẩm" },
          },
        },
      },

      // =========================================================================
      // 3. CATEGORIES ENDPOINTS (/api/categories)
      // =========================================================================
      "/api/categories": {
        get: {
          summary: "Lấy danh sách tất cả danh mục sản phẩm",
          tags: ["Categories"],
          responses: {
            200: {
              description: "Danh sách danh mục",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Category" },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Tạo danh mục sản phẩm mới (Admin)",
          tags: ["Categories"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CategoryInput" },
              },
            },
          },
          responses: {
            201: {
              description: "Tạo danh mục thành công",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Category" },
                },
              },
            },
            400: { description: "Danh mục đã tồn tại" },
            401: { description: "Không có quyền Admin" },
          },
        },
      },

      "/api/categories/{id}": {
        get: {
          summary: "Lấy chi tiết danh mục kèm danh sách sản phẩm thuộc danh mục",
          tags: ["Categories"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "Thông tin danh mục kèm mảng `products`",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/Category" },
                      {
                        type: "object",
                        properties: {
                          products: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Product" },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            404: { description: "Không tìm thấy danh mục" },
          },
        },
        put: {
          summary: "Cập nhật danh mục (Admin)",
          tags: ["Categories"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CategoryInput" },
              },
            },
          },
          responses: {
            200: {
              description: "Cập nhật thành công",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Category" },
                },
              },
            },
            401: { description: "Không có quyền Admin" },
            404: { description: "Không tìm thấy danh mục" },
          },
        },
        delete: {
          summary: "Xóa danh mục (Admin)",
          tags: ["Categories"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Đã xóa danh mục thành công" },
            400: { description: "Không thể xóa do đang có sản phẩm thuộc danh mục này" },
            401: { description: "Không có quyền Admin" },
            404: { description: "Không tìm thấy danh mục" },
          },
        },
      },

      // =========================================================================
      // 4. COUPONS ENDPOINTS (/api/coupons)
      // =========================================================================
      "/api/coupons": {
        get: {
          summary: "Lấy danh sách tất cả mã giảm giá (Admin)",
          tags: ["Coupons"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Danh sách mã giảm giá",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Coupon" },
                  },
                },
              },
            },
            401: { description: "Không có quyền Admin" },
          },
        },
        post: {
          summary: "Tạo mã giảm giá mới (Admin)",
          tags: ["Coupons"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CouponInput" },
              },
            },
          },
          responses: {
            201: {
              description: "Tạo thành công",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Coupon" },
                },
              },
            },
            400: { description: "Mã giảm giá này đã tồn tại" },
            401: { description: "Không có quyền Admin" },
          },
        },
      },

      "/api/coupons/{id}": {
        delete: {
          summary: "Xóa mã giảm giá theo ID (Admin)",
          tags: ["Coupons"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Đã xóa mã giảm giá" },
            401: { description: "Không có quyền Admin" },
            404: { description: "Không tìm thấy mã" },
          },
        },
      },

      "/api/coupons/validate": {
        post: {
          summary: "Kiểm tra mã giảm giá & Điều kiện danh mục áp dụng",
          tags: ["Coupons"],
          description:
            "Gửi mã coupon và cartItems để hệ thống xác nhận xem mã còn hạn và có áp dụng cho sản phẩm trong giỏ hay không.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CouponValidateInput" },
              },
            },
          },
          responses: {
            200: {
              description: "Mã hợp lệ, trả về % giảm giá và danh mục được áp dụng",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      code: { type: "string", example: "SALE50" },
                      discount: { type: "number", example: 10 },
                      applicableCategories: {
                        type: "array",
                        items: { type: "string" },
                        example: ["Điện thoại"],
                      },
                    },
                  },
                },
              },
            },
            400: {
              description:
                "Mã đã hết hạn, giỏ hàng trống hoặc sản phẩm trong giỏ không thuộc danh mục được áp dụng",
            },
            404: { description: "Mã giảm giá không hợp lệ" },
          },
        },
      },

      // =========================================================================
      // 5. ORDERS & STATS ENDPOINTS (/api/orders)
      // =========================================================================
      "/api/orders": {
        post: {
          summary: "Tạo đơn hàng mới",
          tags: ["Orders & Stats"],
          security: [{ bearerAuth: [] }],
          description:
            "Tự động tính toán tổng tiền, kiểm tra tồn kho, áp dụng giảm giá Coupon theo danh mục, trừ số lượng tồn kho và gửi email xác nhận đơn hàng.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderCreateInput" },
              },
            },
          },
          responses: {
            201: {
              description: "Đơn hàng tạo thành công",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Order" },
                },
              },
            },
            400: { description: "Giỏ hàng trống hoặc sản phẩm hết hàng" },
            401: { description: "Chưa đăng nhập" },
            404: { description: "Sản phẩm không tồn tại" },
          },
        },
        get: {
          summary: "Lấy tất cả đơn hàng hệ thống (Admin)",
          tags: ["Orders & Stats"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Danh sách đơn hàng",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
            401: { description: "Không có quyền Admin" },
          },
        },
      },

      "/api/orders/myorders": {
        get: {
          summary: "Lấy danh sách đơn hàng của người dùng đang đăng nhập",
          tags: ["Orders & Stats"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Danh sách đơn hàng cá nhân",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
            401: { description: "Chưa đăng nhập" },
          },
        },
      },

      "/api/orders/stats": {
        get: {
          summary: "Lấy dữ liệu thống kê Dashboard Admin",
          tags: ["Orders & Stats"],
          security: [{ bearerAuth: [] }],
          description:
            "Bao gồm: Thống kê doanh thu 7 ngày gần nhất, tỷ lệ trạng thái đơn hàng (đã/chưa thanh toán), và top 5 sản phẩm bán chạy nhất.",
          responses: {
            200: {
              description: "Dữ liệu thống kê Dashboard",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      dailyOrders: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            _id: { type: "string", example: "2026-10-06" },
                            totalSales: { type: "number", example: 150000000 },
                            count: { type: "integer", example: 5 },
                          },
                        },
                      },
                      statusStats: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            _id: { type: "boolean", example: true },
                            count: { type: "integer", example: 12 },
                          },
                        },
                      },
                      topProducts: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            _id: { type: "string" },
                            name: { type: "string", example: "iPhone 15 Pro Max" },
                            totalQty: { type: "integer", example: 25 },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "Không có quyền Admin" },
          },
        },
      },

      "/api/orders/{id}": {
        get: {
          summary: "Lấy chi tiết 1 đơn hàng theo ID",
          tags: ["Orders & Stats"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "Chi tiết đơn hàng",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Order" },
                },
              },
            },
            401: { description: "Chưa đăng nhập" },
            404: { description: "Không tìm thấy đơn hàng" },
          },
        },
      },

      "/api/orders/{id}/deliver": {
        put: {
          summary: "Cập nhật trạng thái đơn hàng thành Đã giao hàng (Admin)",
          tags: ["Orders & Stats"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "Đã cập nhật trạng thái đã giao & gửi email thông báo",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Order" },
                },
              },
            },
            401: { description: "Không có quyền Admin" },
            404: { description: "Không tìm thấy đơn hàng" },
          },
        },
      },

      "/api/orders/{id}/pay": {
        put: {
          summary: "Cập nhật trạng thái đơn hàng thành Đã thanh toán (Admin)",
          tags: ["Orders & Stats"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "Đã xác nhận thanh toán",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Order" },
                },
              },
            },
            401: { description: "Không có quyền Admin" },
            404: { description: "Không tìm thấy đơn hàng" },
          },
        },
      },

      "/api/orders/{id}/cancel": {
        put: {
          summary: "Hủy đơn hàng và hoàn lại số lượng tồn kho (Chủ đơn hoặc Admin)",
          tags: ["Orders & Stats"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "Đã hủy đơn hàng thành công",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Đã hủy đơn hàng" },
                      order: { $ref: "#/components/schemas/Order" },
                    },
                  },
                },
              },
            },
            400: {
              description:
                "Đơn hàng đang/đã giao không thể hủy hoặc đơn hàng đã hủy trước đó",
            },
            401: { description: "Không có quyền hủy đơn hàng này" },
            404: { description: "Đơn hàng không tồn tại" },
          },
        },
      },

      // =========================================================================
      // 6. UPLOAD ENDPOINT (/api/upload)
      // =========================================================================
      "/api/upload": {
        post: {
          summary: "Tải hình ảnh lên Cloudinary",
          tags: ["Upload"],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["image"],
                  properties: {
                    image: {
                      type: "string",
                      format: "binary",
                      description: "File ảnh (chấp nhận jpg, jpeg, png, webp)",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Upload ảnh thành công, trả về URL Cloudinary",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Image uploaded" },
                      image: {
                        type: "string",
                        example:
                          "https://res.cloudinary.com/demo/image/upload/v12345/sample.jpg",
                      },
                    },
                  },
                },
              },
            },
            400: { description: "File không hợp lệ (Chỉ chấp nhận file ảnh)" },
            500: { description: "Upload thất bại" },
          },
        },
      },

      // =========================================================================
      // 7. AI CHAT ENDPOINT (/api/chat)
      // =========================================================================
      "/api/chat": {
        post: {
          summary: "Trò chuyện trực tiếp với Trợ lý AI TechShop (Gemini stream)",
          tags: ["AI Chat & Tools"],
          description:
            "Gửi tin nhắn hỏi đáp về công nghệ hoặc sản phẩm. Server sẽ truyền dữ liệu phản hồi dạng Chunked Stream Text (text/plain).",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ChatRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Dữ liệu trả về dạng stream text chunked",
              content: {
                "text/plain": {
                  schema: {
                    type: "string",
                    example: "Chào bạn, TechShop có các sản phẩm...",
                  },
                },
              },
            },
            400: { description: "Thiếu nội dung câu hỏi (message)" },
            500: { description: "Lỗi hệ thống hoặc Gemini AI error" },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
