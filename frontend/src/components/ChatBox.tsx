import { useState } from "react";
import axios from "axios";
import { MdSupportAgent } from "react-icons/md";

const ChatBox = ({ onClose }) => {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      const { data } = await axios.post("http://localhost:8080/api/chat", { message: input });
      setMessages([...newMessages, { text: data.reply, sender: "bot" }]);
    } catch (error) {
      console.error("Chat error:", error);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        maxWidth: 400,
        border: "1px solid #ccc",
        padding: 20,
        borderRadius: 10,
        backgroundColor: "#fff",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <button onClick={onClose} style={{ float: "right", background: "red", color: "#fff", border: "none", padding: "5px 10px", cursor: "pointer" }}>
        ✕
      </button>
      <h3>Chat Hỗ Trợ</h3>
      <div style={{ height: 300, overflowY: "auto", marginBottom: 10 }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left", margin: "5px 0" }}>
            <span style={{ display: "inline-block", padding: 10, borderRadius: 8, backgroundColor: msg.sender === "user" ? "#007bff" : "#f1f1f1", color: msg.sender === "user" ? "#fff" : "#000" }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} style={{ flex: 1, padding: 8 }} placeholder="Nhập tin nhắn..." />
        <button onClick={sendMessage} style={{ padding: 8 }}>Gửi</button>
      </div>
    </div>
  );
};

const SupportChat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Nút mở ChatBox */}
      <a href="#" className="flex items-center gap-1 hover:text-gray-900" onClick={(e) => { e.preventDefault(); setIsChatOpen(true); }}>
        <MdSupportAgent className="text-gray-500 text-2xl" />
      </a>

      {/* Hiển thị ChatBox nếu isChatOpen = true */}
      {isChatOpen && <ChatBox onClose={() => setIsChatOpen(false)} />}
    </>
  );
};

export default SupportChat;
