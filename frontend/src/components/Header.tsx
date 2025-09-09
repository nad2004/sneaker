import React, { useEffect, useState } from 'react';
import { FaUser, FaShoppingCart, FaSearch } from 'react-icons/fa';
import iconGeimi from './assets/gemini-color.svg';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import { MdOutlineSupportAgent } from 'react-icons/md';
import Chat from './Chat.tsx';
import ChatBox from './ChatBox.tsx';
import axios from 'axios';
interface HeaderProps {
  search: string;
  setSearch: (value: string) => void;
}
const Header: React.FC<HeaderProps> = ({ search, setSearch }) => {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    avatar: string;
    role: string | null;
  } | null>(null);
  const [productOptions, setProductOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [unReadMessageCount, setUnReadMessageCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatSupportOpen, setIsChatSupportOpen] = useState(false);
  const toggleSupportChat = () => {
    setIsChatSupportOpen(!isChatSupportOpen);
  };
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  useEffect(() => {
    const storedUserString = localStorage.getItem('user');
    const storedUser =
      storedUserString && storedUserString !== 'undefined' ? JSON.parse(storedUserString) : null;
    if (storedUser) {
      setUser({
        id: storedUser._id,
        name: storedUser.name,
        avatar: storedUser.avatar,
        role: storedUser.role,
      });
    }
  }, [localStorage.getItem('user')]);
  const handleLogout = () => {
    axios.get('https://sneaker-production.up.railway.app/api/user/logout', {
      data: { userid: user?.id },
      withCredentials: true,
    });
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };
  const handleSearchClick = () => {
    const queryParams = new URLSearchParams({
      search: search,
    });
    navigate(`/search-product?${queryParams.toString()}`);
  };
  const fetchProductOptions = async (input: string) => {
    try {
      setLoading(true);
      const response = await axios.post(
        'https://sneaker-production.up.railway.app/api/product/search-product',
        {
          search: input,
        }
      );
      setProductOptions(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product options', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (search.length >= 2) {
      fetchProductOptions(search);
    } else {
      setProductOptions([]);
    }
  }, [search]);
  useEffect(() => {
    const updateCartCount = async () => {
      try {
        const response = await axios.post(
          'https://sneaker-production.up.railway.app/api/cart/get',
          { userId: JSON.parse(localStorage.getItem('user') || '{}')._id },
          { withCredentials: true }
        );
        const data = await response.data;
        setCartCount(data.data.length);
      } catch (error) {
        setCartCount(0);
        console.error('Error fetching cart count:', error);
      }
    };
    updateCartCount();
    const handleCartUpdate = () => {
      updateCartCount();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);
  useEffect(() => {
    const updateUnReadMessageCount = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const response = await axios.post(
          'https://sneaker-production.up.railway.app/api/conversation/getconversationdetail',
          { senderId: user._id },
          { withCredentials: true }
        );
        if (response.data.success) {
          if (user.role === 'CUSTOMER') {
            setUnReadMessageCount(
              response.data.data.messages.filter((mes) => !mes.read && mes.sender === 'admin')
                .length
            );
          } else {
            setUnReadMessageCount(
              response.data.data.messages.filter((mes) => !mes.read && mes.sender === 'user').length
            );
          }
        }
      } catch (error) {
        setUnReadMessageCount(0);
        console.error('Lỗi lấy conversation:', error);
      }
    };
    updateUnReadMessageCount();
    const handleUnReadMessageUpdate = () => {
      updateUnReadMessageCount();
    };
    window.addEventListener('UnReadMessageUpdated', handleUnReadMessageUpdate);
    return () => {
      window.removeEventListener('UnReadMessageUpdated', handleUnReadMessageUpdate);
    };
  }, []);
  return (
    <div>
      {/* Thanh thông báo trên cùng */}
      <div className="flex items-center justify-center bg-purple-600 text-white text-sm sm:text-base py-2">
        <span className="text-center w-full">
          FREE delivery & 40% Discount for next 3 orders! Place your 1st order now.
        </span>
      </div>

      {/* Header */}
      <header className="bg-white shadow-md">
        {/* Phần thông tin trên cùng */}
        <div className="border-b px-4 sm:px-6 py-2 text-sm text-gray-600 flex flex-wrap justify-between items-center">
          <div className="flex flex-wrap gap-4">
            <Link to="/about" className="hover:text-gray-800">
              About Us
            </Link>
            <a href="#" className="hover:text-gray-800">
              My Account
            </a>
            <a href="#" className="hover:text-gray-800">
              Wishlist
            </a>
            <span className="hidden sm:inline text-gray-200">|</span>
            <span className="text-red-500 hidden md:inline">
              We deliver daily from <strong>7:00 - 23:00</strong>
            </span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-800">
              English
            </a>
            <a href="#" className="hover:text-gray-800">
              Order Tracking
            </a>
          </div>
        </div>

        {/* Logo + Tìm kiếm + User */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/assets/img1.png" alt="Lucky Larks" className="w-10 h-10 sm:w-12 sm:h-12" />
            <h1 className="text-xl sm:text-2xl font-bold ml-2 text-purple-500">Lucky Larks</h1>
          </Link>

          {/* Tìm kiếm (chỉ hiện trên tablet trở lên) */}
          <div className="hidden sm:flex items-center border rounded-md px-3 py-2 bg-gray-100 md:w-3/5 lg:w-2/5">
            <Autocomplete
              className="w-full"
              freeSolo
              options={productOptions.map((product) => product.name)}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search for products..."
                  variant="standard"
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              onChange={(event, newValue) => newValue && setSearch(newValue)}
            />
            <button onClick={handleSearchClick} className="ml-2">
              <FaSearch className="text-gray-500" />
            </button>
          </div>

          {/* User & Cart */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Chat Icon */}
            <button onClick={toggleChat}>
              <img src={iconGeimi} className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
            {user?.role === 'CUSTOMER' && (
              <button onClick={toggleSupportChat} className="relative">
                <MdOutlineSupportAgent className="w-4 h-4 sm:w-6 sm:h-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                  {unReadMessageCount || 0}
                </span>
              </button>
            )}
            {/* Chat Box nếu mở */}
            <div className="fixed bottom-5 right-5 z-50 flex gap-4">
              {isChatOpen && <ChatBox onClose={toggleChat} />}
              {isChatSupportOpen && <Chat onClose={toggleSupportChat} />}
            </div>
            {/* User */}
            {user ? (
              <div className="relative group">
                <img
                  src={user.avatar || '/default-avatar.png'}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full cursor-pointer"
                />
                <div className="hidden group-hover:block absolute right-0 bg-white shadow-md rounded-md w-40 py-2 z-40 border">
                  <button
                    onClick={() => navigate('/user-profile')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {user.name}
                  </button>
                  {user?.role === 'ADMIN' && (
                    <>
                      <button
                        onClick={() => {
                          navigate('/admin');
                          window.location.reload();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </button>
                      <button
                        onClick={() => {
                          navigate('/admin-chat');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Admin Chat
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 hover:text-gray-900">
                <FaUser /> Login
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative hover:text-gray-900">
              <FaShoppingCart />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                {cartCount || 0}
              </span>
            </Link>
          </div>
        </div>

        {/* Navbar */}
        <nav className="border-t hidden md:flex justify-between px-4 sm:px-6">
          <ul className="flex gap-4 sm:gap-6 py-3 text-gray-700 font-medium">
            <li>
              <Link to="/" className="hover:text-red-500">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-red-500">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/sneakers" className="hover:text-red-500">
                Sneakers
              </Link>
            </li>
            <li>
              <Link to="/accessories" className="hover:text-red-500">
                Accessories
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-red-500">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-red-500">
                Contact
              </Link>
            </li>
          </ul>

          <div className="flex gap-4 py-3 text-gray-700 font-medium">
            <a href="#" className="hover:text-gray-800">
              Trending ▾
            </a>
            <a href="#" className="hover:text-red-500 text-red-500 flex gap-2">
              <div className="rounded-md bg-red-500 text-white px-3 py-1">Sale</div>
              <span>▾</span>
            </a>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
