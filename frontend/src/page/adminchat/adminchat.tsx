import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
const AdminChatPage = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentConv, setCurrentConv] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);
  const currentConvRef = useRef<any>(null);
  useEffect(() => {
    currentConvRef.current = currentConv;
  }, [currentConv]);
  useEffect(() => {
    fetchConversations();
    window.addEventListener('updateMessageClient', fetchConversation);
    return () => {
      window.removeEventListener('updateMessageClient', fetchConversation);
    };
  }, []);
  const fetchConversation = useCallback(async () => {
    if (!currentConvRef) return;
    try {
      const response = await axios.post(
        'https://sneaker-production.up.railway.app/api/conversation/getconversation',
        { _id: currentConvRef.current._id },
        { withCredentials: true }
      );
      if (response.data.success) {
        const conv = response.data.data;
        setCurrentConv(conv);
        setMessages(conv.messages || []);
      }
    } catch (error) {
      console.error('Lỗi lấy conversation:', error);
    }
  }, [currentConv]);
  const fetchConversations = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await axios.post(
        'https://sneaker-production.up.railway.app/api/conversation/getuserconversations',
        { userId: user._id },
        { withCredentials: true }
      );
      console.log(res.data);
      if (res.data.success) {
        setConversations(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi khi lấy conversation:', err);
    }
  };
  const updateMessages = async (conversationId: string, msg: any) => {
    try {
      const response = axios.post(
        'https://sneaker-production.up.railway.app/api/message/create',
        { conversation: conversationId, text: msg.text, sender: msg.sender },
        { withCredentials: true }
      );

      response
        .then((res) => setMessages([...messages, res.data.data]))
        .catch((error) => console.error('Lỗi gửi tin nhắn:', error));
    } catch (error) {
      console.error('Lỗi gửi tin nhắn:', error);
    }
  };
  const handleOpenConversation = (conv: any) => {
    setCurrentConv(conv);
    setMessages(conv.messages || []);
    socketRef.current.emit('join-conversation', conv._id);
  };
  const sendMessage = () => {
    if (!input.trim() || !currentConv) return;
    const tempId = Date.now().toString();
    const messageData = {
      conversationId: currentConv._id,
      message: {
        text: input,
        sender: 'admin',
      },
      tempId,
    };
    // Gửi lên server
    socketRef.current.emit('send-message', messageData);
    updateMessages(currentConv._id, messageData.message);

    setInput('');
    fetchConversations();
  };
  useEffect(() => {
    const socket = io('http://localhost:8081', {
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Connected to server:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected:', reason);
    });
    return () => {
      socket.disconnect();
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
          {
            conversation: msg.conversationId,
            text: msg.message.text,
            sender: msg.message.sender,
            tempId: msg.tempId,
          },
        ];
      });
      window.dispatchEvent(new Event('UnReadMessageUpdated'));
    };
    socketRef.current.on('receive-message', handleReceive);
    return () => {
      socketRef.current.off('receive-message', handleReceive);
    };
  }, []);
  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesEndRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  }, [messages]);
  const recallMessage = async (messageId: string) => {
    try {
      await axios.delete('https://sneaker-production.up.railway.app/api/message/delete', {
        data: { messageId },
        withCredentials: true,
      });
      dispatchEvent(new Event('updateMessageClient'));
    } catch (error) {
      console.error('Lỗi thu hồi tin nhắn:', error);
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
    <div className="flex h-[700px]">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-100 border-r p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Danh sách cuộc trò chuyện</h2>
        {conversations.map((conv, idx) => (
          <div
            key={idx}
            onClick={() => handleOpenConversation(conv)}
            className={`p-3 rounded cursor-pointer hover:bg-blue-100 ${
              currentConv?._id === conv._id ? 'bg-blue-200' : ''
            }`}
          >
            <p>🧑 Người dùng: {conv.members[0].name || 'Unknown'}</p>
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div className="w-2/3 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">
            {currentConv ? `Đang chat với ${currentConv.members[0].name}` : 'Chọn cuộc trò chuyện'}
          </h2>
          <div ref={messagesContainerRef} className="space-y-2 h-[500px] overflow-y-auto pr-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[60%] ${
                    msg.sender === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === 'admin' && (
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
            <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
              Gửi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatPage;
