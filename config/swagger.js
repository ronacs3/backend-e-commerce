const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TechShop API Documentation",
      version: "1.0.0",
      description: "Tài liệu API cho dự án E-commerce TechShop",
      contact: {
        name: "TechShop Support",
        email: "support@techshop.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local Development Server",
      },
    ],
    // Cấu hình để Swagger hiểu cơ chế đăng nhập bằng Token (Bearer Auth)
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Chỉ định nơi chứa các file routes để quét comment
  apis: ["./docs/apiDocs.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
