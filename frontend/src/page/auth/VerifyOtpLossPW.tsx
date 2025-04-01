import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const VerifyOtp: React.FC = () => {
    const location = useLocation(); // Lấy email từ trang trước đó để lưu vào biến email
    const email = location.state;
    const [otp, setOtp] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await axios.put("http://localhost:8080/api/user/verify-forgot-password-otp", {
        email,
        otp,
      });

      console.log("🟢 OTP Verified!", response.data);
      navigate("/reset-password", {state: email}); // 
    } catch (err: any) {
      console.error("❌ OTP verification failed", err);
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-[400px]">
        <h2 className="text-xl font-semibold text-center mb-4">Verify OTP</h2>

        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Enter OTP *</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-200">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
