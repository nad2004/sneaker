import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
const AuthPage: React.FC = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  window.dispatchEvent(new Event("cartUpdated"));
  
const handleLogin = async (event: React.FormEvent) => {
  event.preventDefault(); // Ngăn chặn hành vi mặc định của form submit

  try {
      const response = await axios.post('http://localhost:8080/api/user/login', 
          { email, password }, 
          { withCredentials: true }
      );
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      setError(null);
      alert('Login successful');
      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("UnReadMessageUpdated"));
      navigate('/'); 
  } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
  }
};
const handleGoogleLoginSuccess = async (credentialResponse: any) => {
  try {
    const res = await axios.post("http://localhost:8080/api/user/google-login", {
      credential: credentialResponse.credential,
    }, { withCredentials: true });
    if (res.data.error) {
      alert(res.data.error);
      return;
    }
    console.log(res.data);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    alert("Login with Google successful!");
    navigate('/');
  } catch (error) {
    console.error("Google login failed:", error);
  }
};

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96">
        <div className="flex justify-center mb-4 space-x-4">
          <h2 className="text-2xl font-bold text-gray-900 cursor-pointer">Login</h2>
          <h2
            className="text-2xl font-semibold text-gray-400 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Register
          </h2>
        </div>
        <p className="text-center text-sm text-gray-600 mb-4">
          If you have an account, sign in with your username or email address.
        </p>
        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
        <form onSubmit={handleLogin} className="bg-white">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Username or email address *</label>
            <input
              type="email"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input type="checkbox" className="border-gray-300" />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => {
                
                navigate("/forgot-password")
              }}
              className="text-xs text-blue-600 hover:underline"
            >
              Lost your password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-200"
          >
            Log in
          </button>
        </form>
        <GoogleOAuthProvider clientId="519708215904-16r1qqurenv2q04maomojoflaitglp6v.apps.googleusercontent.com">
          <div className="mt-6 text-center">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={() => {
                    console.log('Login Failed');
                  }}
                />
              </div>
          </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default AuthPage;
