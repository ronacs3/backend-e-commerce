const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const Product = require("../models/productModel"); // Import model sản phẩm

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `
Bạn là trợ lý ảo TechShop.
NHIỆM VỤ: Chỉ tư vấn công nghệ, giọng điệu thân thiện. 
Tuyệt đối từ chối các câu hỏi không liên quan.
`;

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: SYSTEM_INSTRUCTION,
});

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) return res.status(400).send("Thiếu nội dung");

    // 1. Lấy dữ liệu sản phẩm (giữ nguyên logic cũ)
    const products = await Product.find({})
      .select("name price countInStock")
      .limit(5);
    const productContext = products
      .map((p) => `- ${p.name}: ${p.price}đ`)
      .join("\n");

    const fullPrompt = `
    Dữ liệu sản phẩm:
    ${productContext}
    Câu hỏi: "${message}"
    `;

    // 2. Gọi hàm STREAM của Gemini
    const result = await model.generateContentStream(fullPrompt);

    // 3. Thiết lập Header để báo hiệu đây là dữ liệu stream
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    // 4. Vòng lặp gửi từng mảnh dữ liệu về Frontend
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      // Gửi ngay lập tức đoạn text này
      res.write(chunkText);
    }

    // 5. Kết thúc stream
    res.end();
  } catch (error) {
    console.error("Stream Error:", error);
    // Lưu ý: Nếu đã lỡ write header rồi thì không thể gửi json error được nữa
    res.end("Lỗi hệ thống");
  }
};

module.exports = { chatWithAI };
