import React, { useEffect, useState } from "react";
import { FaShieldAlt, FaShoppingCart, FaWallet } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams để lấy params từ URL
import ProductRelative from "./ProductRelative";
import CommentSection from "./CommentSection";
import axios from "axios";
interface Product {
  _id: string;
  name: string;
  price: string;
  image: string[];
  description: string;
  more_details: string;
  stock: number;
  sizes: string[]; 
  discount: number;  // Thêm thuộc tính discount
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: any }>(); // Lấy productId từ URL
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [mainImage, setMainImage] = useState<string>(""); 
  const [selectedSize, setSelectedSize] = useState<string>("");
  const navigate = useNavigate();
  const fetchProductDetails = async (id: any) => { // ✅ Nhận id làm tham số
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/product/get-product-details', {
       id, // ✅ Truyền id vào body
      });
  
      if (!response) {
        throw new Error('Không thể tải dữ liệu sản phẩm');
      }
  
      const data = await response.data;
      console.log("🔥 API trả về chi tiết sản phẩm:", data);
      if (data.success) {
        setProduct(data.data);
        setMainImage(data.data.image[0]);
        setSelectedSize(data.data.sizes[0] || '');
      } else {
        setError('Sản phẩm không tìm thấy');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Lỗi khi lấy dữ liệu sản phẩm');
    } finally {
      setLoading(false);
    }
  };
  
  // Gọi API mỗi khi id thay đổi
  useEffect(() => {
    if (id) {
      fetchProductDetails(id);
    }
  }, [id]); // ✅ Theo dõi id
  

  const handleAddToCart = async () => {
    if (!product) return;
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;
   if(!user) {
    alert("Please login");
    return;  // Nếu chưa đăng nhập thì báo và thoát hàm
   } 

    try {
      console.log({
        userId: user?._id,
        productId: product._id,
        quantity: quantity,
        size: selectedSize,
      })
      const response = await axios.post(
        "http://localhost:8080/api/cart/create",
        {
          userId: user?._id,
          productId: product._id,
          quantity: quantity,
          size: selectedSize,
        },
        { withCredentials: true } // ✅ Đặt ở đây
      );
      
      const data = await response.data;
      if (data.success) {
        console.log("✅ Thêm vào giỏ hàng thành công!", data.cart);
        window.dispatchEvent(new Event("cartUpdated"));
        navigate("/cart"); // Chuyển hướng đến giỏ hàng
      } else {
        alert(data.message);
        console.error("⚠️ Lỗi khi thêm vào giỏ hàng:", data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng");
      } else {
        alert("Lỗi khi thêm vào giỏ hàng");
      }
      console.error("❌ Lỗi kết nối API:", error);
    }
  };
  // Hàm tăng số lượng
  const increaseQuantity = () => {
    if (quantity < (product?.stock || 1)) {
      setQuantity(quantity + 1);
    }else{
      alert("Sản phẩm đã hết hàng.");
    }
  };
  // Hàm giảm số lượng
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (!product) {
    return <div>Không tìm thấy sản phẩm.</div>;
  }
  // Tính giá sau khi giảm giá
  const discountedPrice = product.discount
  ? (parseFloat(product.price) * (1 - product.discount / 100)).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
  : parseFloat(product.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  return (
    <div className="container mx-auto p-4">
  {/* Breadcrumb */}
  <div className="text-sm text-gray-500 mb-4">
    <span className="text-gray-400">Home</span> &gt; <span className="font-semibold">{product.name}</span>
  </div>

  <div className="flex flex-col lg:flex-row gap-6">
    {/* Phần hình ảnh */}
    <div className="w-full lg:w-1/2">
      <img src={mainImage} alt={product.name} className="w-full h-64 sm:h-80 lg:h-96 object-fill mb-4" />

      {/* Ẩn ảnh phụ trên mobile */}
      <div className="hidden sm:flex gap-3 justify-center">
        {product.image.slice(1, 5).map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`product-${index}`}
            className="w-16 sm:w-24 h-16 sm:h-24 object-fill cursor-pointer border"
            onClick={() => setMainImage(img)}
          />
        ))}
      </div>
    </div>

    {/* Thông tin sản phẩm */}
    <div className="w-full lg:w-1/2">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-700 text-sm sm:text-lg mb-4">{product.description}</p>

      {/* Hiển thị giá */}
      <div className="mb-4">
        {product.discount ? (
          <p className="text-lg sm:text-xl text-red-500 font-bold">
            {discountedPrice.toLocaleString()} VNĐ
            <span className="text-gray-500 line-through ml-2">{product.price.toLocaleString()} đ</span>
          </p>
        ) : (
          <p className="text-lg sm:text-xl text-red-500 font-bold">{product.price.toLocaleString()} VNĐ</p>
        )}
      </div>

      <p className="mb-4 text-gray-600">Còn lại: {product.stock} sản phẩm</p>

      {/* Số lượng */}
      <div className="flex items-center mb-4">
        <button 
          onClick={decreaseQuantity} 
          className="p-2 sm:p-4 bg-gray-200 text-gray-700 text-lg"
          disabled={quantity <= 1}
        >
          -
        </button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => {
            let value = parseInt(e.target.value, 10) || 1;
            if (value > product.stock) value = product.stock;
            setQuantity(value);
          }}
          className="p-2 w-16 sm:w-24 text-center border border-gray-300"
          min="1"
          max={product.stock}
        />
        <button 
          onClick={increaseQuantity} 
          className="p-2 sm:p-4 bg-gray-200 text-gray-700 text-lg"
          disabled={quantity >= product.stock}
        >
          +
        </button>
      </div>

      {/* Chọn Size */}
      <div className="mb-4">
        <label htmlFor="size" className="text-lg font-medium">Chọn Size:</label>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {product.sizes.map((size, index) => (
            <button
              key={index}
              onClick={() => setSelectedSize(size)}
              className={`px-4 sm:px-6 py-2 text-base sm:text-lg font-semibold rounded-full transition-all ${
                selectedSize === size
                  ? 'bg-gray-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 border border-gray-600 hover:bg-gray-600 hover:text-white'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Nút thêm vào giỏ hàng & mua ngay */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={handleAddToCart} className="p-3 bg-green-500 text-white rounded-md flex items-center justify-center w-full sm:w-auto">
          <FaShoppingCart className="mr-2" /> Add To Cart
        </button>
        <button onClick={handleAddToCart} className="p-3 bg-black text-white rounded-md flex items-center justify-center w-full sm:w-auto">
          <FaShoppingCart className="mr-2" /> Buy Now
        </button>
      </div>

      {/* Chính sách */}
      <div className="bg-gray-100 p-4 rounded-md text-gray-700 my-4">
        <div className="flex items-center gap-2">
          <FaWallet className="text-xl" />
          <p className="text-sm">
            <strong>Payment.</strong> Thanh toán khi nhận hàng, quét mã QR, hoặc thanh toán online với -5% ưu đãi.
          </p>
        </div>
        <hr className="my-2" />
        <div className="flex items-center gap-2">
          <FaShieldAlt className="text-xl" />
          <p className="text-sm">
            <strong>Warranty.</strong> Chính sách bảo hành theo quy định của nhà sản xuất.
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* Sản phẩm liên quan */}
  <ProductRelative currentProductId={id!} />

  {/* Mô tả sản phẩm */}
  <div className="mt-8">
    <div className="border-b flex space-x-8 text-gray-600">
      <button className="pb-2 border-b-2 border-black font-semibold text-black">Description</button>
    </div>
    <div className="mt-4 mb-12 text-gray-700 leading-relaxed">
      <p>{product.more_details}</p>
    </div>
  </div>

  {/* Bình luận */}
  <CommentSection productId={id} />
</div>

  );
};

export default ProductDetails;
