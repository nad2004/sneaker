import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import { FaShoppingCart} from "react-icons/fa";
import LeftsideBar from "./Layout/LeftsideBar";
import ProductRate from "./ProductRate";
interface Product {
  id: string;
  name: string;
  price: string | number;  // price có thể là số hoặc chuỗi
  image: [string];
  discount: number;  // Thêm discount
}

interface ProductListProps {
  search: string;
  setSearch: (value: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ search, setSearch }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [likedProducts, setLikedProducts] = useState<number[]>([]); // State để theo dõi các sản phẩm đã thích

  
  const navigate = useNavigate();  // Khởi tạo navigate 

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/product/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, limit: 12 }), // Thay đổi limit để lấy 12 sản phẩm mỗi lần
      });
  
      if (!response.ok) {
        throw new Error("Lỗi khi gọi API");
      }
  
      const data = await response.json();
      if (data.success) {
        // Map lại để chuyển đổi _id thành id
        const productsWithId = data.data.map((product: any) => ({
          ...product,
          id: product._id, // Chuyển _id thành id
        }));
  
        setProducts(productsWithId); // Đặt state products với danh sách mới
        setTotalPages(data.totalNoPage);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search,]);

  // Hàm điều hướng khi click vào sản phẩm
  const handleProductClick = (id: any) => {
    navigate(`/product-details/${id}`);  // Chuyển hướng đến trang chi tiết sản phẩm
  };

  // Hàm để thay đổi trạng thái liked của sản phẩm
  const handleLikeClick = (productId: any) => {
    setLikedProducts((prevLiked) =>
      prevLiked.includes(productId)
        ? prevLiked.filter((id) => id !== productId)
        : [...prevLiked, productId]
    );
  };

 
  

  return (
    <div className="container mx-auto p-4 !max-w-full">
      <div className="grid grid-cols-6 gap-4"> {/* Chỉnh số cột thành 6 */}
        <LeftsideBar/>
        {/* Danh sách sản phẩm */}
        <main className="col-span-5"> {/* Chỉnh lại cột sản phẩm */}
          <div className="relative">
            {/* Banner với chữ ghi đè */}
            <img src="/assets/img16.png" alt="Banner" className="w-full h-64 object-cover" />
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 p-4 text-white text-3xl ">
              <h2 className="font-bold ">Grocery store with different <br />treasures</h2>
              <p className="text-sm text-blue-500">We have prepared special discounts for you on grocery products...</p>
            </div>
          </div>
            {/* Nav Bar */}
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-md mb-4 my-4">
              <span className="text-gray-600">Showing all 16 results</span>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Sort:</span>
                  <select className="bg-white border rounded px-2 py-1">
                    <option>Sort by latest</option>
                    
                  </select>
                </div>

                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Show:</span>
                  <select className="bg-white border rounded px-2 py-1">
                    <option>20 Items</option>
                    
                  </select>
                </div>
              </div>
            </div>
          <h1 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>
          <div className="grid grid-cols-6 gap-4">
            {products.map((product) => {
              const price =
                typeof product.price === "string"
                  ? parseInt(product.price.replace(/[^0-9]/g, ""))
                  : product.price;
              const discountedPrice = product.discount > 0 ? price * (1 - product.discount / 100) : price;
              

              return (                
                <div
                  key={product.id}
                  className="border p-4 rounded shadow cursor-pointer h-full flex flex-col"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="relative">
                    {/* Hiển thị phần giảm giá */}
                    {product.discount > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white py-1 px-2 rounded-full text-sm font-semibold">
                        -{product.discount}%
                      </span>
                    )}
                    <img src={product.image[0]} alt={product.name} className="w-full h-40 object-cover mb-2" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeClick(product.id);
                      }}
                      className="absolute top-2 right-2 text-red-500"
                    >
                    
                    </button>
                  </div>

                  {/* Phần nội dung sản phẩm */}
                  <div className="flex flex-col flex-grow">
                  <h3 className="font-bold text-lg line-clamp-2 h-14 overflow-hidden">
                  {product.name}
                </h3>
                <ProductRate productId = {product.id} />
                    <p className="text-red-500 font-bold">{price.toLocaleString()} VNĐ</p>

                    {product.discount > 0 && (
                      <div className="text-green-500">
                        <p className="line-through text-gray-400">{price.toLocaleString()} VNĐ</p>
                        <p className="text-lg font-bold">{discountedPrice.toLocaleString()} VNĐ</p>
                      </div>
                    )}
                    
                    {/* Nút mua hàng */}
                    <button className="mt-auto p-2 bg-white text-green-500 border border-green-500 rounded w-full flex items-center justify-center transition-all duration-300 hover:bg-green-500 hover:text-white">
                      <FaShoppingCart className="mr-2 w-5 h-5" />
                      IN STOCK                    
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

                  {/* Phân trang */}
          <div className="mt-4 flex justify-center gap-2">
            <button
              key="prev-button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-2 bg-gray-300 rounded"
            >
              ◀ Trước
            </button>
            <span key="page-info" className="mt-2">
              Trang {page} / {totalPages}
            </span>
            <button
              key="next-button"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 bg-gray-300 rounded"
            >
              Sau ▶
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductList;
