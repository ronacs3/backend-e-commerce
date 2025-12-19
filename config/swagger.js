const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API Documentation",
      version: "1.0.0",
      description:
        "Tài liệu API đầy đủ cho dự án E-Commerce (Node.js, Express, MongoDB)",
      contact: {
        name: "Dev Team",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local Development Server",
      },
    ],
    components: {
      // Cấu hình xác thực JWT
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      // Định nghĩa các Model (Schema)
      schemas: {
        // --- 1. PRODUCT SCHEMA ---
        Product: {
          type: "object",
          properties: {
            name: { type: "string", example: "iPhone 15 Pro Max" },
            price: { type: "number", example: 30000000 },
            image: { type: "string", example: "/images/iphone.jpg" },
            category: { type: "string", example: "Điện thoại" },
            countInStock: { type: "number", example: 10 },
            description: { type: "string", example: "Mô tả sản phẩm..." },
            rating: { type: "number", example: 4.5 },
            numReviews: { type: "number", example: 12 },
          },
        },
        // --- 2. REVIEW SCHEMA ---
        Review: {
          type: "object",
          required: ["rating", "comment"],
          properties: {
            rating: { type: "number", example: 5 },
            comment: { type: "string", example: "Sản phẩm dùng rất tốt!" },
          },
        },
        // --- 3. COUPON SCHEMA (MỚI) ---
        Coupon: {
          type: "object",
          properties: {
            code: { type: "string", example: "SALE50" },
            discount: { type: "number", example: 10 },
            expirationDate: {
              type: "string",
              format: "date",
              example: "2025-12-31",
            },
            applicableCategories: {
              type: "array",
              items: { type: "string" },
              example: ["Điện thoại", "Laptop"],
              description:
                "Danh sách danh mục được áp dụng (Rỗng [] = Áp dụng tất cả)",
            },
            isActive: { type: "boolean", example: true },
          },
        },
        // --- 4. ORDER SCHEMA ---
        Order: {
          type: "object",
          properties: {
            orderItems: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  product: { type: "string", example: "65a1b2c3d4..." },
                  qty: { type: "number", example: 2 },
                  category: { type: "string", example: "Điện thoại" }, // Cần field này để check coupon
                },
              },
            },
            shippingAddress: {
              type: "object",
              properties: {
                address: { type: "string" },
                city: { type: "string" },
                country: { type: "string" },
              },
            },
            paymentMethod: { type: "string", example: "PayPal" },
            itemsPrice: { type: "number" },
            shippingPrice: { type: "number" },
            taxPrice: { type: "number" },
            totalPrice: { type: "number" },
            couponCode: { type: "string", example: "SALE50" },
          },
        },
      },
    },

    // --- ĐỊNH NGHĨA CÁC API ENDPOINTS ---
    paths: {
      // ================= PRODUCTS =================
      "/api/products": {
        get: {
          summary: "Lấy danh sách sản phẩm (Có tìm kiếm & Phân trang)",
          tags: ["Products"],
          parameters: [
            {
              in: "query",
              name: "keyword",
              schema: { type: "string" },
              description: "Tìm theo tên",
            },
            {
              in: "query",
              name: "pageNumber",
              schema: { type: "integer" },
              description: "Số trang",
            },
            {
              in: "query",
              name: "category",
              schema: { type: "string" },
              description: "Lọc theo danh mục",
            },
          ],
          responses: {
            200: {
              description: "Thành công",
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
          tags: ["Products"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          responses: {
            201: { description: "Đã tạo sản phẩm" },
            401: { description: "Không có quyền Admin" },
          },
        },
      },

      "/api/products/categories": {
        get: {
          summary: "Lấy danh sách tất cả danh mục",
          tags: ["Products"],
          responses: {
            200: {
              description: "Danh sách category",
              content: {
                "application/json": {
                  schema: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
      },

      "/api/products/{id}": {
        get: {
          summary: "Lấy chi tiết 1 sản phẩm",
          tags: ["Products"],
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
              description: "Chi tiết sản phẩm",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Product" },
                },
              },
            },
            404: { description: "Không tìm thấy sản phẩm" },
          },
        },
        put: {
          summary: "Cập nhật sản phẩm (Admin)",
          tags: ["Products"],
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true }],
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          responses: { 200: { description: "Cập nhật thành công" } },
        },
        delete: {
          summary: "Xóa sản phẩm (Admin)",
          tags: ["Products"],
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true }],
          responses: { 200: { description: "Đã xóa sản phẩm" } },
        },
      },

      "/api/products/{id}/reviews": {
        post: {
          summary: "Gửi đánh giá (Yêu cầu User đã mua hàng)",
          tags: ["Products"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              description: "ID sản phẩm",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Review" },
              },
            },
          },
          responses: {
            201: { description: "Đánh giá thành công" },
            400: { description: "Chưa mua hàng hoặc đã đánh giá rồi" },
          },
        },
      },

      // ================= COUPONS =================
      "/api/coupons": {
        get: {
          summary: "Lấy danh sách Coupon (Admin)",
          tags: ["Coupons"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "List coupons",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Coupon" },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Tạo Coupon mới (Admin)",
          tags: ["Coupons"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["code", "discount", "expirationDate"],
                  properties: {
                    code: { type: "string" },
                    discount: { type: "number" },
                    expirationDate: { type: "string", format: "date" },
                    applicableCategories: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Tạo thành công" },
            400: { description: "Mã đã tồn tại" },
          },
        },
      },

      "/api/coupons/{id}": {
        delete: {
          summary: "Xóa Coupon (Admin)",
          tags: ["Coupons"],
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true }],
          responses: { 200: { description: "Đã xóa mã" } },
        },
      },

      "/api/coupons/validate": {
        post: {
          summary: "Kiểm tra mã giảm giá (Check danh mục giỏ hàng)",
          tags: ["Coupons"],
          description:
            "Gửi kèm cartItems để hệ thống check xem mã có áp dụng cho sản phẩm trong giỏ hay không.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["code", "cartItems"],
                  properties: {
                    code: { type: "string", example: "SALE50" },
                    cartItems: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: { category: { type: "string" } },
                      },
                      example: [
                        { category: "Điện thoại" },
                        { category: "Quần áo" },
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Mã hợp lệ",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Coupon" },
                },
              },
            },
            400: { description: "Hết hạn hoặc sản phẩm không khớp danh mục" },
          },
        },
      },

      // ================= ORDERS =================
      "/api/orders": {
        post: {
          summary: "Tạo đơn hàng mới",
          tags: ["Orders"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Order" },
              },
            },
          },
          responses: {
            201: { description: "Đơn hàng tạo thành công" },
            400: { description: "Lỗi kho hàng hoặc dữ liệu sai" },
          },
        },
      },
    },
  },
  // Để mảng rỗng vì ta đã định nghĩa hết ở trên
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
