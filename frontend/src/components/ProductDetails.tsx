import React, { useEffect, useState } from "react";
import { FaShieldAlt, FaShoppingCart, FaWallet } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams để lấy params từ URL
import ProductRelative from "./ProductRelative";
import CommentSection from "./CommentSection";
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
      const response = await fetch('http://localhost:8080/api/product/get-product-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }), // ✅ Truyền id vào body
      });
  
      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu sản phẩm');
      }
  
      const data = await response.json();
      console.log("🔥 API trả về chi tiết sản phẩm:", data);
      if (data.success) {
        setProduct(data.data);
        setMainImage(data.data.image[0]);
        setSelectedSize(data.data.sizes[0] || '');
      } else {
        setError('Sản phẩm không tìm thấy');
      }
    } catch (error: any) {
      setError(error.message || 'Lỗi khi lấy dữ liệu sản phẩm');
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
    console.log(localStorage.getItem("accessToken"))
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;
   if(!user) {
    alert("Please login");
    return;  // Nếu chưa đăng nhập thì báo và thoát hàm
   } 

    try {
      const response = await fetch("http://localhost:8080/api/cart/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Nếu có đăng nhập
        },
        body: JSON.stringify({
          // Nếu có đăng nhập
          userId: user?._id,
          productId: product._id,
          quantity: quantity,
          size: selectedSize
        }),
      });

      const data = await response.json();
  
      if (data.success) {
        console.log("✅ Thêm vào giỏ hàng thành công!", data.cart);
        // Kích hoạt sự kiện để cập nhật Header
        window.dispatchEvent(new Event("cartUpdated"));

        navigate("/cart"); // Chuyển hướng đến giỏ hàng
      } else {
        alert(data.message);
        console.error("⚠️ Lỗi khi thêm vào giỏ hàng:", data.message);
      }
    } catch (error) {
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
      
      <div className="flex">
        <div className="w-1/2">
          {/* Ảnh chính */}
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-96 object-contain mb-4"
          />
          <div className="flex gap-5 justify-center">
            {/* Ảnh phụ */}
            {product.image.slice(1, 5).map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`product-${index}`}
                className="w-24 h-24 object-contain cursor-pointer border"
                onClick={() => setMainImage(img)} // Khi click vào ảnh phụ sẽ thay đổi ảnh chính
              />
            ))}
          </div>
        </div>
        <div className="w-1/2 pl-8">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-lg text-gray-700 mb-4">{product.description}</p>
          
          {/* Hiển thị giá và giảm giá */}
          <div className="mb-4">
            {product.discount ? (
              <p className="text-xl text-red-500 font-bold mb-4">
                {discountedPrice}
                <span className="text-gray-500 line-through ml-2">{product.price} đ</span>
              </p>
            ) : (
              <p className="text-xl text-red-500 font-bold mb-4">{product.price} VNĐ</p>
            )}
          </div>

          <p className="mb-4">Còn lại: {product.stock} sản phẩm</p>
          
          {/* Phần số lượng */}
          <div className="flex items-center mb-4">
            <button 
              onClick={decreaseQuantity} 
              className="p-2 bg-gray-300 text-gray-700 rounded-l"
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              readOnly // Chỉ đọc, không cho thay đổi trực tiếp
              className="p-2 w-16 text-center border border-gray-300"
              min="1"
              max={product.stock}
            />
            <button 
              onClick={increaseQuantity} 
              className="p-2 bg-gray-300 text-gray-700 rounded-r"
              disabled={quantity >= product.stock}
            >
              +
            </button>
          </div>
          <div className="mb-4">
            <label htmlFor="size" className="text-lg font-medium">Chọn Size:</label>
            <div className="flex gap-4">
              {product.sizes.map((size, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={`px-6 py-2 text-lg font-semibold rounded-full transition-all duration-300 ease-in-out ${
                    selectedSize === size
                      ? 'bg-gray-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-600 border-2 border-gray-600 hover:bg-gray-600 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="flex">
            <button onClick={handleAddToCart} className="p-3 bg-green-500 text-white rounded-md flex">
              <FaShoppingCart className="mr-2" />Add To Cart
            </button>
            <button onClick={handleAddToCart} className="p-3 mx-5 bg-black text-white rounded-md flex">
              <FaShoppingCart className="mr-2" />
              Buy Now
            </button>
          </div>
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
      <ProductRelative currentProductId={id!} />
      <div className="mt-8">
      <div className="border-b flex space-x-8 text-gray-600">
        <button className="pb-2 border-b-2 border-black font-semibold text-black">Description</button>
      </div>
      <div className="mt-4 mb-12 text-gray-700 leading-relaxed">
        <p>{product.more_details}</p>
      </div>
    </div>
      <CommentSection productId={id} />
    </div>
  );
};

export default ProductDetails;
