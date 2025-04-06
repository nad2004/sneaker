import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
const AdminChatPage = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentConv, setCurrentConv] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await axios.post(
        "http://localhost:8080/api/conversation/getuserconversations",
        { userId: user._id },
        { withCredentials: true }
      );
      console.log(res.data);
      if (res.data.success) {
        setConversations(res.data.data);
      }
    } catch (err) {
      console.error("Lỗi khi lấy conversation:", err);
    }
  };
  const updateMessages = async (conversationId: string, msg: any) => {
    try {
      const response = axios.post(
        "http://localhost:8080/api/message/create",
        { conversation: conversationId, text: msg.text, sender: msg.sender },
        { withCredentials: true }
      );
      
      response.then(res => setMessages([...messages, res.data.data])).catch(error => console.error("Lỗi gửi tin nhắn:", error));
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
    }
  };
  const handleOpenConversation = (conv: any) => {
    setCurrentConv(conv);
    setMessages(conv.messages || []);
    socketRef.current.emit("join-conversation", conv._id);
  };
  const sendMessage = () => {
    if (!input.trim() || !currentConv) return;
    const messageData = {
      conversationId: currentConv._id,
      message: {
        text: input,
        sender: "admin",
      },
    };
    // Gửi lên server
    socketRef.current.emit("send-message", messageData);
    updateMessages(currentConv._id, messageData.message);
    // Thêm vào UI
    setInput("");
    fetchConversations();
  };
  useEffect(() => {
    const socket = io("http://localhost:8081", {
        withCredentials: true,
      });
    socketRef.current = socket;
  
    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
    });
  
    socket.on("connect_error", (error) => {
      console.error("❌ Connection error:", error);
    });
  
    socket.on("disconnect", (reason) => {
      console.log("🔌 Disconnected:", reason);
    });
    return () => {
      socket.disconnect()
    };
  }, []);
   // 📩 Lắng nghe tin nhắn
   useEffect(() => {
    if (!socketRef.current) return;
    const handleReceive = (msg: any) => {
      fetchConversations();
      setMessages((prevMessages) => {
        return [
          ...prevMessages,
          { conversation: msg.conversationId, text: msg.message.text, sender: msg.message.sender },
        ];
      })
      window.dispatchEvent(new Event("UnReadMessageUpdated"));
    };
    socketRef.current.on("receive-message", handleReceive);
    return () => {
      socketRef.current.off("receive-message", handleReceive);
    };
  }, []);
  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesEndRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, [messages]);
  
  return (
    <div className="flex h-[700px]">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-100 border-r p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Danh sách cuộc trò chuyện</h2>
        {conversations.map((conv, idx) => (
          <div
            key={idx}
            onClick={() => handleOpenConversation(conv)}
            className={`p-3 rounded cursor-pointer hover:bg-blue-100 ${
              currentConv?._id === conv._id ? "bg-blue-200" : ""
            }`}
          >
            <p>🧑 Người dùng: {conv.members[0].name || "Unknown"}</p>
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div className="w-2/3 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">
            {currentConv ? `Đang chat với ${currentConv.members[0].name}` : "Chọn cuộc trò chuyện"}
          </h2>
          <div
            ref={messagesContainerRef}
            className="space-y-2 h-[500px] overflow-y-auto pr-2"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "admin" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[60%] ${
                    msg.sender === "admin"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {currentConv && (
          <div className="p-4 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Gửi
            </button>
          </div>
        )}   
      </div>
    </div>
    
  );
};

export default AdminChatPage;
