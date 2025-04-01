import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


interface OrderData{
  products: {
    productId: string;
    quantity: number;
    size: number;
  }[]; // Mảng có nhiều phần tử
  totalAmt: string;
}
interface User {
  id: string;
  address: string;
  name: string;
  email: string;
  mobile: string;
}
interface ProductDetail {
  quantity: number; // Số lượng sản phẩm
  data: {
    _id: string;                // ID của sản phẩm
    name: string;               // Tên sản phẩm
    price: number;              // Giá sản phẩm
    discount?: number;  
    delivery_address: string;        // Chiết khấu (có thể có hoặc không)
    stock: number;              // Số lượng hàng trong kho
    description: string;        // Mô tả sản phẩm
    category: string[];         // Danh mục (danh sách ID)
    image: string[];            // Danh sách đường dẫn hình ảnh
    more_details: string;       // Chi tiết bổ sung
    publish: boolean;           // Trạng thái xuất bản
    createdAt: string;          // Thời gian tạo
    updatedAt: string;          // Thời gian cập nhật
    unit: string;               // Đơn vị sản phẩm
    __v: number;                // Phiên bản trong cơ sở dữ liệu MongoDB
  };
}

type ProductsDetail = ProductDetail[];
const CheckOutList: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
 
  const [productsDetail, setProductsDetail] = useState<ProductsDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    Name: "",  
    address: "",
    phone: "",
    email: "",
    agree: false,
    paymentMethod: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const orderData = location.state as OrderData;;
  // Fetch product details
  const fetchProductDetails = async (productId: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/product/get-product-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id: productId }),
      });
      const data = await response.json();
      if (data.success) {
        console.log('Chi tiết sản phẩm:', data.data);
        return data.data;

      }
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết sản phẩm:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    const fetchDetails = async () => {
      try {
        if (orderData.products.length > 0) {
          const data = await Promise.all(
            orderData.products.map(async (product) => {
              const productDetails = await fetchProductDetails(product.productId);
              return productDetails
                ? { quantity: product.quantity, data: productDetails }
                : null;
            })
          );
          // Loại bỏ phần tử null (do lỗi API)
          setProductsDetail(data.filter((item) => item !== null));
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDetails(); // Gọi hàm async

    const user = localStorage.getItem("user");

    let userData = {
      id: "",
      address: "",
      name: "",
      email: "",
      mobile: "",
    };
    
    if (user) {
      try {
        const parsedUser = JSON.parse(user); // Parse chuỗi thành object
        userData = {
          id: parsedUser._id || "",
          address: parsedUser.address || "",
          name: parsedUser.name || "",
          email: parsedUser.email || "",
          mobile: parsedUser.mobile || "",
        };
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
      }
    }
    setForm((prev) => ({
      ...prev,
      Name: userData.name,
      address: userData.address,
      phone: userData.mobile,
      email: userData.email,

    }));
    
    setUser(userData)// Lấy userId từ localStorage
    const userId = user ? JSON.parse(user)._id : null;
    if (!userId) {
      alert("Không tìm thấy userId. Vui lòng đăng nhập lại.");
      return;
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!productsDetail) return <div>Giỏ Hàng trống</div>;
  productsDetail.forEach((product :any) => {
    const discountedPrice = product.data.discount
    ? (parseFloat(product.data.price) * (1 - product.data.discount / 100)).toFixed(2)
    : product.data.price;

  const subtotal = (parseFloat(discountedPrice) * product.quantity).toFixed(2);
  const shippingCost = parseFloat(subtotal) >= 50 ? 0 : 5;
  const total = (parseFloat(subtotal) + shippingCost).toFixed(2);
  });
  

  const createOrder = async () => {
  console.log (validateForm())
  if (!validateForm()) {
    alert("Vui lòng tích phương thức thanh toán");
    return;
  };
  const userId = user?.id;
  const products = orderData.products;
  const totalAmt = orderData.totalAmt;
  const payment_method = form.paymentMethod;
  const delivery_address = form.address;
    try {
      const response = await fetch("http://localhost:8080/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ userId, products, totalAmt, payment_method, delivery_address }), // Truyền userId từ localStorage
      });
  
      const data = await response.json();
      if (data.success) {
        alert("Đặt hàng thành công!");
        navigate("/");
        
      } else {
        alert("Đặt hàng thất bại: " + data.message);
      }
    } catch (error) {
      console.error("Lỗi khi tạo order:", error);
      alert("Đã xảy ra lỗi khi đặt hàng.");
    }
    window.location.reload();
  };

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    
  };

  // Validate form
  const validateForm = () => {
    let status = true;
    const newErrors: { [key: string]: string } = {};
    if (!form.Name) {
      status = false;
      newErrors.Name = "Name is required";
    }
    if (!form.email) {
      status = false;
      newErrors.email = "Email is required";
    }
    if(!form.paymentMethod) {
      status = false;
      newErrors.paymentMethod = "PaymentMethod is required";
    }
    // if (!form.agree) newErrors.agree = "You must agree to terms";
    return status;
  };

  return (
  <>
    <div className="flex justify-center p-8">
      {/* Billing Details Form */}
      <div className="w-2/3 mr-8">
        <h2 className="text-xl font-semibold mb-4">Billing details</h2>
        <div className=" col-span-full  ">
          <div>
            <input
              type="text"
              name="Name"
              placeholder=" name *"
              value={form.Name}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-4"
            />
            {errors.Name && <p className="text-red-500 text-sm">{errors.Name}</p>}
          </div>
          <div className="col-span-2">
            <input
              type="text"
              name="address"
              placeholder="Street address *"
              value={form.address}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-4"
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone *"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-4"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address *"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-4"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
        </div>
      </div>

      {/* Your Order Section */}
  <div className="w-1/3 bg-gray-100 p-6 rounded-md">
  <h2 className="text-lg font-semibold mb-4">Your order</h2>
  <h3>Product</h3>
  <div className="border-b pb-4 mb-4">
    {productsDetail?.map((productDetail) => {
      const { quantity, data } = productDetail; // Giải cấu trúc từ từng phần tử trong mảng
      const subtotal = quantity * data.price; // Tính thành tiền

      return (
        <div key={data._id}>
          <div className="flex justify-between">
            <span className="font-bold">
              {data.name} x {quantity}  
            </span>
            <span className="font-bold">{subtotal.toLocaleString()} VNĐ</span>
          </div>
        </div>
      );
    })}
    
    <div className="flex justify-between text-sm text-gray-600 mt-2">
      <span>Shipping:</span>
      {/* {shippingCost === 0 ? ( */}
        <span className="font-bold">Free</span>
      {/* // ) : (
      //   <span>{shippingCost.toLocaleString()} VNĐ</span>
      // )} */}
    </div>
   
  </div>
  <div className="flex justify-between text-sm text-gray-600">
      <span>Total:</span>
      <span className="font-bold">{orderData.totalAmt.toLocaleString()} VNĐ</span>
      </div> 
  
</div>
</div>
<div>
<div>
        {/* Payment Methods */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="USING DEBIT CARD"
              checked={form.paymentMethod === "USING DEBIT CARD"}
              onChange={handleChange}
              className="mr-2"
            /> Debit Card
          </label>
          <label className="flex items-center mt-2">
            <input
              type="radio"
              name="paymentMethod"
              value="CASH ON DELIVERY"
              checked={form.paymentMethod === "CASH ON DELIVERY"}
              onChange={handleChange}
              className="mr-2"
            /> Cash On Delivery
          </label>
        </div>

        {/* Agree to terms */}
        <div className="mb-4 text-sm">
          <label className="flex items-start">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              className="mr-2 mt-1"
            /> I have read and agree to the website terms and conditions
          </label>
          {errors.agree && <p className="text-red-500 text-sm">{errors.agree}</p>}
        </div>

        {/* Place order button */}
        <button
          onClick={createOrder}
          className="w-full bg-purple-600 text-white py-2 rounded-md"
        >
          Place order
        </button>
      </div>
    </div>
  </>
  );
};

export default CheckOutList;
