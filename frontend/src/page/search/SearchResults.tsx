import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Pagination } from "@mui/material"; // Import Pagination
import LeftsideBar from "../../components/Layout/LeftsideBar";
import ProductRate from "../../components/ProductRate";
const SearchResults = ({ search }: { search: string }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (pageNumber = 1, minPrice: any, maxPrice: any, search: any) => {
    try {
      const response = await fetch("http://localhost:8080/api/product/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: pageNumber, limit: 12, search, minPrice, maxPrice }), // Fetch 12 products per page
      });

      if (!response.ok) throw new Error("Lỗi khi gọi API");

      const data = await response.json();
      if (data.success) {
        const productsWithId = data.data.map((product: any) => ({
          ...product,
          id: product._id,
        }));
        setProducts(productsWithId);
        setTotalPages(data.totalNoPage);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  useEffect(() => {
    const query = searchParams.get("query") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const category = searchParams.get("brand");
    const search = searchParams.get("search");

    const requestBody = {
      page,
      limit: 12,
      search: search,
      query: query,
      minPrice: minPrice ? parseInt(minPrice) : 0,
      maxPrice: maxPrice ? parseInt(maxPrice) : 10000000,
      category: category !== "Tất cả sản phẩm" ? category : undefined,
    };
    console.log(requestBody);
    if (requestBody.query === "") {
      fetchProducts(page, minPrice, maxPrice, search);
    } else {
      fetch("http://localhost:8080/api/product/get-product-by-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProducts(data.data);
            setTotalPages(data.totalNoPage);
          } else {
            setProducts([]);
            setTotalPages(1);
          }
        })
        .catch((error) => console.error("Lỗi khi tìm kiếm sản phẩm:", error));
    }
  }, [searchParams, search, page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <div className="container mx-auto p-4 !max-w-full">
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-1">
          <LeftsideBar />
        </div>
        <main className="col-span-5 flex flex-col min-h-screen">
          <h2 className="text-2xl font-bold mb-4">Kết quả tìm kiếm</h2>

          <div className="flex-grow">
            {products.length === 0 ? (
              <p className="text-center text-lg text-red-500">
                Không có sản phẩm nào được tìm thấy
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-6">
                {products.map((product) => (
                  <Link
                    to={`/product-details/${product._id}`}
                    key={product.id}
                    className="border rounded shadow p-4 flex flex-col justify-between"
                  >
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                    <div className="mt-2">
                      <h3 className="font-bold text-lg truncate">{product.name}</h3>
                      <ProductRate productId = {product.id} />
                      <p className="text-red-500 font-bold mt-2 text-right">
                        {product.price.toLocaleString()} đ
                      </p>
                      {product.status && (
                        <p
                          className={`text-sm mt-2 ${
                            product.status === "In Stock"
                              ? "text-green-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {product.status === "In Stock" ? "Còn hàng" : "Giảm giá"}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchResults;
