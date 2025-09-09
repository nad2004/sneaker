import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
interface CartItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    image: [string];
    stock: number;
    discount: number;
  };
  quantity: number;
  size: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  // ✅ Lấy danh sách giỏ hàng từ API
  const fetchCart = async () => {
    const userId = JSON.parse(localStorage.getItem('user') || '')?._id;
    try {
      const response = await axios.post(
        'https://sneaker-production.up.railway.app/api/cart/get',
        { userId },
        { withCredentials: true }
      );

      const data = await response.data;
      console.log(userId);

      if (data.success) {
        setCartItems(data.data);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Cập nhật số lượng sản phẩm
  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const response = await axios.put(
        'https://sneaker-production.up.railway.app/api/cart/update-qty',
        {
          _id: itemId,
          qty: newQuantity,
        },
        { withCredentials: true }
      );

      const data = await response.data;

      if (!response) throw new Error(data.message || 'Cập nhật thất bại');

      // 🔄 Sau khi cập nhật, gọi lại API để lấy dữ liệu mới nhất
      await fetchCart();
    } catch (error: any) {
      alert('Cập nhật số lượng thất bại: ' + error.message);
      console.error('Lỗi khi cập nhật số lượng:', error);
    }
  };

  // 🗑️ Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (itemId: string) => {
    try {
      const response = await axios({
        method: 'delete',
        url: 'https://sneaker-production.up.railway.app/api/cart/delete-cart-item',
        data: { _id: itemId, userId: JSON.parse(localStorage.getItem('user') || '')._id }, // Truyền dữ liệu vào body ở đây
        withCredentials: true,
      });

      if (!response) throw new Error('Xóa sản phẩm thất bại');

      // 🔄 Sau khi xóa, gọi lại API để lấy dữ liệu mới nhất
      window.dispatchEvent(new Event('cartUpdated'));
      await fetchCart();
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
    }
  };

  const handleOrder = async () => {
    const products = cartItems.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      size: item.size,
    }));
    const totalAmt = cartItems.reduce((sum, item) => {
      const priceAfterDiscount = item.productId.price * (1 - item.productId.discount / 100);
      return sum + priceAfterDiscount * item.quantity;
    }, 0);
    const OrderData = {
      products,
      totalAmt,
    };
    navigate('/checkout', { state: OrderData });
  };
  if (loading) return <div>Đang tải giỏ hàng...</div>;

  if (cartItems.length === 0) return <div>Giỏ hàng của bạn đang trống.</div>;

  // 🔥 Tính tổng tiền
  const totalPrice = cartItems.reduce((sum, item) => {
    const priceAfterDiscount = item.productId.price * (1 - item.productId.discount / 100);
    return sum + priceAfterDiscount * item.quantity;
  }, 0);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">🛒 Giỏ hàng của bạn</h2>
      {cartItems.map((item) => (
        <div key={item._id} className="flex items-center border-b py-4">
          <img
            src={item.productId.image[0]}
            alt={item.productId.name}
            className="w-24 h-24 object-cover mr-4"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{item.productId.name}</h3>
            <p className="text-gray-600">
              Giá:{' '}
              <span className="text-red-500 font-bold">
                {(item.productId.price * (1 - item.productId.discount / 100)).toFixed(2)} VNĐ
              </span>
              {item.productId.discount > 0 && (
                <span className="text-gray-400 line-through ml-2">{item.productId.price} VNĐ</span>
              )}
            </p>
            <p className="text-gray-800 font-bold">
              Size: <span>{item.size}</span>
            </p>
            {/* Nút tăng giảm số lượng */}
            <div className="flex items-center mt-2">
              <button
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                className="px-2 py-1 bg-gray-300 text-gray-700 rounded-l"
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-1 border">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                className="px-2 py-1 bg-gray-300 text-gray-700 rounded-r"
                disabled={item.quantity >= item.productId.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Xóa sản phẩm */}
          <button
            onClick={() => removeFromCart(item._id)}
            className="text-red-500 font-semibold ml-4"
          >
            ❌ Xóa
          </button>
        </div>
      ))}

      {/* Tổng tiền */}
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p className="text-lg font-bold">Tổng tiền: {totalPrice.toFixed(2)} VNĐ</p>
        <button onClick={handleOrder} className="bg-green-500 text-white px-4 py-2 mt-2 rounded">
          Đặt Hàng
        </button>
      </div>
    </div>
  );
};

export default Cart;
