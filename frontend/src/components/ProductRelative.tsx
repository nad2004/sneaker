// ProductRelative.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductRate from "./ProductRate";
interface Product {
  _id: string;  // Đổi từ id -> _id
  name: string;
  price: string;
  image: string;
}

const ProductRelative: React.FC<{ currentProductId: string }> = ({ currentProductId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Tránh cập nhật state sau khi component unmount

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/product/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          
        });
      
        if (!response.ok) {
          throw new Error('Không thể tải danh sách sản phẩm');
        }

        const data = await response.json();
        if (data.success) {
          // Loại bỏ sản phẩm hiện tại khỏi danh sách
          const filteredProducts = data.data.filter((product: Product) => product._id !== currentProductId);
          // Chọn ngẫu nhiên 4 sản phẩm từ danh sách còn lại
          const randomProducts = filteredProducts.sort(() => 0.5 - Math.random()).slice(0, 4);

          if (isMounted) {
            setProducts(randomProducts);
          }
        } else {
          if (isMounted) setError('Không có sản phẩm');
        }
      } catch (error: any) {
        if (isMounted) setError(error.message || 'Lỗi khi lấy dữ liệu sản phẩm');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (currentProductId) {
      fetchProducts();
    }

    return () => {
      isMounted = false; // Cleanup khi component unmount
    };
  }, [currentProductId]);

  if (loading) {
    return <div>Đang tải sản phẩm liên quan...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
    <h2 className="text-2xl font-bold mb-4">Sản phẩm liên quan</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((product) => (
        <div key={product._id} className="border p-4 rounded-lg flex flex-col h-full">
          {/* Ảnh sản phẩm */}
          <img src={product.image[0]} alt={product.name} className="w-full h-48  mb-4 object-contain" />
          
          {/* Tên sản phẩm */}
          <h3 className="text-xl font-semibold flex-grow">{product.name}</h3>
          <ProductRate productId = {product._id} />
          {/* Giá sản phẩm */}
          <p className="text-lg text-red-500 font-semibold text-right">{product.price} VNĐ</p>
          
          {/* Nút xem chi tiết */}
          <Link
            to={`/product-details/${product._id}`}
            className="block text-center mt-4 text-blue-500 border-t pt-2"
          >
            Xem chi tiết
          </Link>
        </div>
      ))}
    </div>
  </div>
  );
};

export default ProductRelative;
