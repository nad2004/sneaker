import { useState } from 'react';
import axios from 'axios';

const ChatBox = ({ onClose }) => {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');
    try {
      const { data } = await axios.post('http://localhost:8080/api/chat', { message: input });
      setMessages([...newMessages, { text: data.reply, sender: 'bot' }]);
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  return (
    <div className="max-w-[450px] border border-gray-300 p-5 rounded-lg bg-white shadow-lg">
      {/* Nút đóng */}
      <button
        onClick={onClose}
        className="float-right bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
      >
        ✕
      </button>

      <h3 className="text-lg font-semibold mb-3">Geimini Chat</h3>

      {/* Khung tin nhắn */}
      <div className="h-80 overflow-y-auto mb-3 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      {/* Ô nhập và nút gửi */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Nhập tin nhắn..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
