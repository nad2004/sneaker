import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const Chat = ({ onClose }) => {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState<any>(null);

  const socketRef = useRef<any>(null);

  // 🔌 Khởi tạo socket chỉ 1 lần
  useEffect(() => {
    
    const socket = io("http://localhost:8081", {
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket error:", err);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 📩 Lắng nghe tin nhắn
  useEffect(() => {
    if (!socketRef.current) return;

    const handleReceive = (msg: any) => {
      try {
        axios.put(
          "http://localhost:8080/api/conversation/updatemessage",
          { conversationId: conversation._id, Message: [...messages, msg] },
          { withCredentials: true }
        );
      } catch (error) {
        console.error("Lỗi gửi tin nhắn:", error);
      }
      setMessages((prev) => [...prev, msg]);
    };

    socketRef.current.on("receive-message", handleReceive);

    return () => {
      socketRef.current.off("receive-message", handleReceive);
    };
  }, []);

  // 📥 Lấy conversation
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const response = await axios.post(
          "http://localhost:8080/api/conversation/getconversationdetail",
          { senderId: user._id },
          { withCredentials: true }
        );
        if (response.data.success) {
          const conv = response.data.data;
          setConversation(conv);
          setMessages(conv.messages || []); 
          socketRef.current.emit("join-conversation", conv._id);
        }
      } catch (error) {
        console.error("Lỗi lấy conversation:", error);
      }
    };

    fetchConversation();
  }, []);

  // 📤 Gửi tin nhắn
  const sendMessage = () => {
    if (!input.trim() || !conversation) return;

    const newMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    try {
      axios.put(
        "http://localhost:8080/api/conversation/updatemessage",
        { conversationId: conversation._id, Message: [...messages, newMessage] },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
    }
    socketRef.current?.emit("send-message", {
      conversationId: conversation._id,
      message: newMessage,
    });

    setInput("");
  };

  return (
    <div className="fixed bottom-5 z-50 right-5 max-w-[450px] border border-gray-300 p-5 rounded-lg bg-white shadow-lg">
      <button
        onClick={onClose}
        className="float-right bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
      >
        ✕
      </button>
      <h3 className="text-lg font-semibold mb-3">💬 Chat Hỗ Trợ</h3>

      <div className="h-80 overflow-y-auto mb-3 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-black"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-lg"
          placeholder="Nhập tin nhắn..."
        />
        <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded-lg">
          Gửi
        </button>
      </div>
    </div>
  );
};

export default Chat;
