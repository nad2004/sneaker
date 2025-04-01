import pkg from "@google/genai";
const { GoogleGenAI } = pkg;
import ProductModel from "../models/product.model.js";

// Nhập API key từ Google AI Studio
const ai = new GoogleGenAI({ apiKey: "AIzaSyBnu-3JGy8VUuXuSXRZXe_rmwEczC8NJKM" });

export async function generateText(req, res) {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });
        
      // Lấy toàn bộ sản phẩm từ database
        const allProducts = await ProductModel.find();
        // console.log("📦 Danh sách sản phẩm từ DB:", allProducts, "sản phẩm");
        const normalizedMessage = message.toLowerCase();
        const keywords = normalizedMessage.split(/\s+/);
        if (normalizedMessage.includes("tuấn sơn")) {
            return res.json({ reply: "Tuấn Sơn là chủ cửa hàng." });
        }

        // Tìm sản phẩm có tên khớp hoàn toàn với message
        let foundProducts = allProducts.filter(product =>
            normalizedMessage.includes(product.name.toLowerCase())
        );
        
        // Nếu không tìm thấy sản phẩm nào, tìm theo từ khóa
        if (foundProducts.length === 0) {
            foundProducts = allProducts.filter(product =>
                keywords.some(keyword => product.name.toLowerCase().includes(keyword))
            );
        }

        // Giới hạn tối đa 5 sản phẩm
        const topProducts = foundProducts.slice(0, 5);

        // console.log("✅ Kết quả tìm kiếm:", JSON.stringify(topProducts, null, 2));

        let productInfo = "";
        if (topProducts.length > 0) {
            productInfo = "Dưới đây là các sản phẩm phù hợp với tìm kiếm của bạn:\n";
            productInfo += topProducts.map(p => `- ${p.name}: ${p.price} VND`).join("\n");
        } else {
            productInfo = "Hiện tại không tìm thấy sản phẩm nào phù hợp.";
        }


        // Tạo prompt với thông tin sản phẩm truy xuất được
        let prompt;
        if (foundProducts.length === 0){
            prompt = message
        }else{
            prompt = `Bạn là một trợ lý AI chuyên về bán hàng. Hãy trả lời câu hỏi của khách hàng một cách tự nhiên và thân thiện.
        Nếu câu hỏi liên quan đến sản phẩm, hãy tham khảo danh sách sản phẩm dưới đây:
        ${productInfo}
        
        Câu hỏi của khách hàng: "${message}"`;
        }
        // Gọi model AI
        const response = await ai.models.generateContentStream({
            model: "gemini-2.0-flash",
            contents: prompt 
        });

        let reply = "";
        for await (const chunk of response) {
            reply += chunk.text;
        }

        res.json({ reply });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
