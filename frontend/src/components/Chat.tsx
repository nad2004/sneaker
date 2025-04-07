import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const Chat = ({ onClose }) => {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
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
  // 📩 Lắng nghe tin nhắn
  useEffect(() => {
    if (!socketRef.current) return;
    const handleReceive = (msg: any) => {
      setMessages((prevMessages) => [...prevMessages, {conversation: msg.conversationId, text: msg.message.text, sender: msg.message.sender, tempId: msg.tempId}])
        markMessagesRead(msg.conversationId);
    };
    socketRef.current.on("receive-message", handleReceive);
    return () => {
      socketRef.current.off("receive-message", handleReceive);
    };
  }, []);
  // 📥 Lấy conversation
  useEffect(() => {
    fetchConversation();
    window.addEventListener("updateMessageClient", fetchConversation);
    return () => {
      window.removeEventListener("updateMessageClient", fetchConversation);
    };
  }, []);
  const markMessagesRead = async (conversationId: string) => {
    try {
      await axios.post(
        "http://localhost:8080/api/message/mark-read",
        { conversationId, reader: "user" }, // "user" hoặc "admin"
        { withCredentials: true }
      );
      window.dispatchEvent(new Event("UnReadMessageUpdated"));
    } catch (err) {
      console.error("Lỗi khi đánh dấu đã đọc:", err);
    }
  };
  useEffect(() => {
    if (conversation) {
      markMessagesRead(conversation._id);
    }
  }, [conversation]); 
  // 📤 Gửi tin nhắn
  const sendMessage = () => {
    if (!input.trim() || !conversation) return;
    const newMessage = { text: input, sender: "user" };
    const tempId = Date.now().toString(); // tạo ID tạm  
    socketRef.current?.emit("send-message", {
      conversationId: conversation._id,
      message: newMessage,
      tempId,
    });
    try {
      const response = axios.post(
        "http://localhost:8080/api/message/create",
        { conversation: conversation._id, text: input, sender: "user" },
        { withCredentials: true }
      );
      response.then(res => setMessages([...messages, res.data.data])).catch(error => console.error("Lỗi gửi tin nhắn:", error));
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
    }
    setInput("");
  };
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // chạy mỗi khi danh sách messages thay đổi
  const recallMessage = async (messageId: string) => {
    try {
      await axios.delete("http://localhost:8080/api/message/delete", {
        data: { messageId },
        withCredentials: true,
      });
      dispatchEvent(new Event("updateMessageClient"));
    }
    catch (error) {
      console.error("Lỗi thu hồi tin nhắn:", error);
    }
  };
  const handleOpenRecall = (messageId: string) => {
    if (activeMenuId === messageId) {
      // Nếu đang mở => đóng
      setActiveMenuId(null);
    } else {
      // Nếu đang đóng hoặc đang mở tin nhắn khác => mở
      setActiveMenuId(messageId);
    }
  };
  return (
    <div className="max-w-[450px] border border-gray-300 p-5 rounded-lg bg-white shadow-lg">
      <button
        onClick={onClose}
        className="float-right bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
      >
        ✕
      </button>
      <h3 className="text-lg font-semibold mb-3">💬 Chat Hỗ Trợ</h3>

      <div ref={messagesContainerRef} className="h-80 overflow-y-auto mb-3 space-y-2">
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
            {msg.sender === "user" && (
              <div className="inline-block ml-2 relative">
                {/* Nút 3 chấm */}
                <button className="opacity-100" onClick={() => handleOpenRecall(msg._id)}>
                  ⋯
                </button>

                {/* Menu thu hồi */}
                {activeMenuId === msg._id && (
                  <div className="absolute right-0 mt-1 w-28 bg-white border rounded shadow-md z-10">
                    <button
                      onClick={() => recallMessage(msg._id)}
                      className="block w-full px-3 py-1 text-sm text-red-600 hover:bg-gray-100 text-left"
                    >
                      Thu hồi
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} /> 
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
