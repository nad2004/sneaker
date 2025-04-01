import React from "react";
import {useNavigate} from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SpotlightCard from './SpotlightCard';
import { motion } from "framer-motion";
import { Card, CardContent, CardMedia, Typography, Button, Chip } from "@mui/material";
import ProductRate from "../../components/ProductRate";
import { useEffect, useState } from "react";
import KobeShoe from "./assets/b.png";
import JordanShoe from "./assets/a.png";
import AdidasShoe from "./assets/c.png";
import NewBalanceShoe from "./assets/d.png";
import Image1 from "./assets/SVG.png"; // Đặt đúng đường dẫn ảnh của bạn
import Image2 from "./assets/SVG2.png";
import Image3 from "./assets/SVG3.png";
import Image4 from "./assets/SVG4.png";
import Image5 from "./assets/e.png";
import Image6 from "./assets/f.png";
import Image7 from "./assets/g.png";
import Image8 from "./assets/h.png";
import Image9 from "./assets/i.png";
const productsSection = [
  {
    id: 1,
    name: "Nike Jordan at an affordable price",
    image: JordanShoe,
  },
  {
    id: 2,
    name: "Adidas Superstar: Impossible is Nothing",
    image: AdidasShoe,
  },
  {
    id: 3,
    name: "Unbeatable quality, unbeatable prices",
    image: NewBalanceShoe,
  },
];

const features = [
    {
      img: Image1,
      title: "Secure Online Payments",
      description: "Fast and safe transactions with multiple payment options.",
    },
    {
      img: Image2,
      title: "Exclusive Deals & Offers",
      description: "Stay updated with the latest discounts and promotions.",
    },
    {
      img: Image3,
      title: "Guaranteed Quality",
      description: "We ensure top-notch quality for all our products.",
    },
    {
      img: Image4,
      title: "Super Fast Delivery",
      description: "Get your order delivered within an hour in select areas.",
    },
  ];
const banners = [
    {
        title: "Make your fashion shopping easy with us",
        subtitle: "Only this week. Don’t miss...",
        buttonText: "Shop Now",
        image: Image5, // Thay bằng đường dẫn ảnh của bạn
    },
    {
        title: "Get your everyday needs here",
        subtitle: "A different kind of grocery store",
        buttonText: "Shop Now",
        image: Image6, // Thay bằng đường dẫn ảnh của bạn
    }
];
const banners2 = [
    {
        title: "Make your fashion shopping easy with us",
        subtitle: "Only this week. Don’t miss...",
        buttonText: "Shop Now",
        image: Image7, // Thay bằng đường dẫn ảnh của bạn
    },
    {
        title: "Get your everyday needs here",
        subtitle: "A different kind of grocery store",
        buttonText: "Shop Now",
        image: Image8, // Thay bằng đường dẫn ảnh của bạn
    }
];
  interface Product {
    id: string;
    name: string;
    price: string | number;  // price có thể là số hoặc chuỗi
    image: [string];
    discount: number;  // Thêm discount
    description: string;
  }
const HomePage = () => {
    const fadeInVariant = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };
        const navigate = useNavigate(); 
        const [products, setProducts] = useState<Product[]>([]);
        const ProductCard = ({ product }) => {
       
        const handleProductClick = (id: any) => {
            navigate(`/product-details/${id}`);  // Chuyển hướng đến trang chi tiết sản phẩm
          };
        return (
            <Card  key={product.id} className="shadow-md rounded-lg w-56">
            <motion.div variants={fadeInVariant}  initial="hidden" whileInView="visible"  className="relative h-60 flex justify-center items-center bg-gray-100">
            <CardMedia
              component="img"
              image={product.image[0]}
              alt={product.name}
              className="h-32 w-auto !object-fill"
            />
            {product.discount > 0 && (
              <Chip
                label={`-${product.discount}%`}
                className="absolute top-2 left-2 !bg-red-500 !text-white text-xs"
              />
            )}
          </motion.div>

            <CardContent className="flex flex-col items-start p-4">
            <Typography
                className="text-sm font-medium h-12 overflow-hidden text-ellipsis text-start line-clamp-2"
            >
                {product.name}
            </Typography>
            <ProductRate productId = {product.id} />
            {/* Giá tiền căn trái và đậm hơn */}
            <motion.div  initial="hidden" 
            whileInView="visible"  variants={fadeInVariant} className="w-full flex items-center gap-2 my-2">
            <Typography className="text-red-600 !font-semibold text-lg">
             {product.price.toLocaleString()}đ
             </Typography>
            </motion.div>

            <Button
                onClick={() => {handleProductClick(product.id)}}
                variant="outlined"
                color="neutral"
                className="!w-full !normal-case !rounded-full !mt-2 !px-4 !py-2 !hover:bg-purple-50"
            >
                Add to cart
            </Button>
            </CardContent>
        </Card>
        );
      };
      const fetchProducts = async () => {
        try {
          const response = await fetch("http://localhost:8080/api/product/get", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ limit: 50 }), // Thay đổi limit để lấy 12 sản phẩm mỗi lần
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
           
          }
        } catch (error) {
          console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        }
      };
    
      useEffect(() => {
        fetchProducts();
      }, []);
   
      const handleProductClick = (id: any) => {
        navigate(`/product-details/${id}`);  // Chuyển hướng đến trang chi tiết sản phẩm
      };

  return (
   <>
    <motion.div  initial="hidden" whileInView="visible"  variants={fadeInVariant} className="bg-gray-100  font-sans">
      {/* Slider Section */}
      <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="bg-gray-100 min-h-40 flex flex-col items-center">
      {/* Slider Section */}
      <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="w-[70%] relative rounded-lg overflow-hidden">
        <Swiper className="h-96">
          <SwiperSlide className="relative">
            <img src={KobeShoe} alt="Nike Kobe X 10" className="w-full h-96 object-cover" />
            <motion.div className="absolute top-4 left-4 text-white font-bold text-xl md:text-2xl lg:text-3xl italic">
              NIKE KOBE X 10 AS ALL STAR BLACK <br /> MULTICOLOR VOLT ORANGE
            </motion.div>
          </SwiperSlide>
        </Swiper>
      </motion.div>
    </motion.div>

      {/* Features Section */}
      
      <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="grid grid-cols-4 gap-6 px-8 py-6">
      {features.map((feature, idx) => (
        <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} key={idx} className="flex items-center space-x-4">
          {/* Hình ảnh bên trái */}
          <img src={feature.img} alt={feature.title} className="h-12 w-12" />
          
          {/* Nội dung bên phải */}
          <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant}>
            <h3 className="font-semibold text-base">{feature.title}</h3>
            <p className="text-gray-500 text-sm">
              {feature.description}
            </p>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
    
      {/* Product Section */}
      <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="grid grid-cols-3 gap-6 px-8 pb-8">
        {productsSection.map((product) => (
            
            <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} key={product.id}  className=" relative rounded-lg shadow-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover "
            />
            <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="absolute bottom-0 bg-gradient-to-t from-black to-transparent p-4 w-full">
              <h3 className="text-white font-bold text-lg">{product.name}</h3>
              <button onClick={() => navigate("/shop")} className="mt-2 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-400">
                Shop Now
              </button>
            </motion.div>
          </motion.div>
        
         
        ))}
      </motion.div>
    </motion.div>
    <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className=" bg-white">
    <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="flex justify-between items-center mb-4 p-6">
        <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="flex items-baseline gap-2">
            <Typography variant="h6" className="!font-semibold">
            New Arrivals
            </Typography>
            <Typography variant="body2" className="text-gray-500">
            Don't miss this opportunity at a special discount just for this week.
            </Typography>
        </motion.div>
        <Button
        onClick={() => navigate("/shop")}
        variant="outlined"
        color="neutral"
        className="!rounded-full !normal-case !font-semibold !border-gray-300 text-gray-600 px-4 py-1 text-sm hover:bg-gray-100"
        >
            View All →
        </Button>
    </motion.div>
      <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="grid grid-cols-6 gap-4">
        {products.slice(0, 6).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>
    </motion.div>
  <SpotlightCard className="custom-spotlight-card mt-4" spotlightColor="rgba(0, 229, 255, 0.2)">
  <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="grid grid-cols-4 gap-12">
  {products.slice(8, 12).map((product, index) => (
    <Card key={index} className="relative shadow-md rounded-lg overflow-hidden ">
      {/* Hình ảnh sản phẩm */}
      <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant}
        className="h-[500px] bg-no-repeat bg-bottom bg-contain bg-blend-multiply !bg-gray-200"
        style={{ backgroundImage: `url(${product.image[0]})` }}
      ></motion.div>

      {/* Nội dung trên ảnh */}
      <CardContent className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-4 flex flex-col justify-between">
        <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant}>
          <Typography className="text-xs text-orange-500 font-semibold">
          <span className="bg-orange-300 text-black text-sm font-semibold px-3 py-1 rounded-full w-max">
                Only This Week
            </span>
          </Typography>
          <Typography className="!text-black !font-bold !text-lg !mt-1 !line-clamp-2">
            {product.name}
          </Typography>
          <Typography className="!text-gray-700 !text-sm !mt-1">
            {product.description || "Limited-time offer on our best products!"}
          </Typography>
          <Button
          onClick={() => navigate("/shop")}
          variant="contained"
          color="default"
          className="!bg-white !font-semibold !text-black !rounded-full !mt-2 !px-4 !py-2"
        >
          Shop Now
        </Button>
        </motion.div>
       
      </CardContent>
    </Card>
  ))}
</motion.div>
</SpotlightCard>
<motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="flex justify-between items-center mb-4 p-6">
        <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="flex items-baseline gap-2">
            <Typography variant="h6" className="!font-semibold">
            Featured Products
            </Typography>
            <Typography variant="body2" className="text-gray-500">
            Do not miss the current offers until the end of March.
            </Typography>
        </motion.div>
        <Button
        onClick={() => navigate("/shop")}
        variant="outlined"
        color="neutral"
        className="!rounded-full !normal-case !font-semibold !border-gray-300 text-gray-600 px-4 py-1 text-sm hover:bg-gray-100"
        >
            View All →
        </Button>
</motion.div>
<motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="grid grid-cols-3 gap-6">
  {/* Hàng 1: 3 sản phẩm đầu tiên */}
  {products.slice(0, 3).map((product, index) => (
    <Card key={index} className="relative shadow-md rounded-lg overflow-hidden p-4 h-72" >
      <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="flex items-center h-full">
        {/* Hình ảnh sản phẩm */}
        <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="w-1/3 flex justify-center">
          <img src={product.image[0]} alt={product.name} className=" !object-fill" />
        </motion.div>
        
        {/* Nội dung sản phẩm */}
        <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="w-2/3 pl-4">
          {/* Icon yêu thích */}
          <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="flex justify-between">
            <Typography className="text-sm !font-semibold">{product.name}</Typography>
          </motion.div>
          <ProductRate productId = {product.id} />
          {/* Giá sản phẩm */}
          <Typography className="text-red-500  !font-bold">${product.price.toLocaleString()}</Typography>

          {/* Nút thêm vào giỏ hàng */}
          <Button
            onClick={() => {handleProductClick(product.id)}}
            variant="outlined"
            color="neutral"
            className="!w-full !normal-case !rounded-full !mt-2 !px-4 !py-2 !hover:bg-purple-50"
    >
        Add to cart
    </Button>
        </motion.div>
      </motion.div>
    </Card>
  ))}

  {/* Hàng 2: 2 sản phẩm tiếp theo */}
  {products.slice(3, 5).map((product, index) => (
    <Card
      key={index + 3} /* Đảm bảo key duy nhất */
      className={`relative shadow-md rounded-lg overflow-hidden p-4 h-72 ${
        index === 1 ? "col-start-3" : "" /* Đưa sản phẩm cuối vào giữa */
      }`}
    >
      <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="flex items-center h-full">
        {/* Hình ảnh sản phẩm */}
        <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="w-1/3 flex justify-center">
          <img src={product.image[0]} alt={product.name} className=" !object-fill" />
        </motion.div>

        {/* Nội dung sản phẩm */}
        <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="w-2/3 pl-4 ">
          {/* Icon yêu thích */}
          <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="flex justify-between">
            <Typography className="text-sm !font-semibold">{product.name}</Typography>
          </motion.div>
          <ProductRate productId = {product.id} />
          {/* Giá sản phẩm */}
          <Typography className="text-red-500 !font-bold">${product.price.toLocaleString()}</Typography>

          {/* Nút thêm vào giỏ hàng */}
          <Button
            onClick={() => {handleProductClick(product.id)}}
            variant="outlined"
            color="neutral"
            className="!w-full !normal-case !rounded-full !mt-2 !px-4 !py-2 !hover:bg-purple-50 "
    >
        Add to cart
    </Button>
        </motion.div>
      </motion.div>
    </Card>
  ))}
</motion.div>
<motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="grid grid-cols-2 gap-4 px-6 mt-8">
  {banners.map((banner, index) => (
    <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} key={index} className="relative rounded-lg overflow-hidden group h-[400px]">
      {/* Ảnh nền */}
      <img src={banner.image} alt="Banner" className="w-full h-full object-cover" />

      {/* Lớp overlay tối màu */}
      <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition-all duration-300"></motion.div>

      {/* Nội dung text */}
      <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="absolute inset-0 flex flex-col justify-center px-10 text-white">
        {/* Badge */}
        <span className="bg-orange-300 text-black text-sm font-semibold px-3 py-1 rounded-full w-max">
          Only This Week
        </span>

        {/* Tiêu đề */}
        <h2 className="text-4xl font-extrabold leading-tight mt-4">{banner.title}</h2>

        {/* Mô tả */}
        <p className="text-base text-gray-300 mt-2">{banner.subtitle}</p>

        {/* Nút CTA */}
        <Button
        onClick={() => navigate("/shop")}
        variant="outlined"
        color="neutral"
        className="!mt-6 !bg-white !text-black !font-bold !px-5 !py-3 !rounded-full !flex !items-center !w-max !hover:bg-gray-200 !transition"
        >
          {banner.buttonText} →
        </Button>
      </motion.div>
    </motion.div>
  ))}
</motion.div>
<motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="flex justify-between items-center mb-4 p-6">
        <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="flex items-baseline gap-2">
            <Typography variant="h6" className="!font-semibold">
            Best Sellers
            </Typography>
            <Typography variant="body2" className="text-gray-500">
            Some of the new products arriving this weeks
            </Typography>
        </motion.div>
        <Button
            onClick={() => navigate("/shop")}
            variant="outlined"
            color="neutral"
            className="!rounded-full !normal-case !font-semibold !border-gray-300 text-gray-600 px-4 py-1 text-sm hover:bg-gray-100"
        >
            View All →
        </Button>
</motion.div>

 <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="grid grid-cols-3 gap-4 px-6 mt-8">
            {/* Cột trái */}
            <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="grid grid-cols-2 gap-4">
                {products.slice(20, 24).map((product, index) => (
                     <Card key={product.id} className="shadow-md rounded-lg w-56">
                     <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="relative h-60 flex justify-center items-center bg-gray-100">
                     <CardMedia
                       component="img"
                       image={product.image[0]}
                       alt={product.name}
                       className="h-32 w-auto !object-fill"
                     />
                     {product.discount > 0 && (
                       <Chip
                         label={`-${product.discount}%`}
                         className="absolute top-2 left-2 !bg-red-500 !text-white text-xs"
                       />
                     )}
                   </motion.div>
             
                   <CardContent className="flex flex-col items-start p-4">
                         <Typography
                             className="text-sm font-medium h-6 overflow-hidden text-ellipsis text-start line-clamp-2"
                         >
                             {product.name}
                         </Typography>
                         <ProductRate productId = {product.id} />
                         {/* Giá tiền căn trái và đậm hơn */}
                         <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="w-full flex items-center gap-2 my-2">
                         <Typography className="text-red-600 !font-semibold text-lg">
                     ${product.price.toLocaleString()}
                     </Typography>
                         </motion.div>
             
                         <Button
                            onClick={() => {handleProductClick(product.id)}}
                            variant="outlined"
                            color="neutral"
                            className="!w-full !normal-case !rounded-full !mt-2 !px-4 !py-2 !hover:bg-purple-50"
                         >
                             Add to cart
                         </Button>
                         </CardContent>
                     </Card>
                ))}
            </motion.div>

            {/* Cột giữa (Banner) */}
            <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="flex flex-col gap-4">
                {banners2.map((banner, index) => (
                    <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} key={index} className="relative rounded-lg overflow-hidden group h-[450px]">
                    {/* Ảnh nền */}
                    <img src={banner.image} alt="Banner" className="w-full h-full object-cover" />
              
                    {/* Lớp overlay tối màu */}
                    <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition-all duration-300"></motion.div>
              
                    {/* Nội dung text */}
                    <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="absolute inset-0 flex flex-col justify-center px-10 text-white">
                      {/* Badge */}
                      <span className="bg-orange-300 text-black text-sm font-semibold px-3 py-1 rounded-full w-max">
                        Only This Week
                      </span>
              
                      {/* Tiêu đề */}
                      <h2 className="text-4xl font-extrabold leading-tight mt-4">{banner.title}</h2>
              
                      {/* Mô tả */}
                      <p className="text-base text-gray-300 mt-2">{banner.subtitle}</p>
              
                      {/* Nút CTA */}
                      <Button
                        onClick={() => navigate("/shop")}
                        variant="outlined"
                        color="neutral"
                        className="!mt-6 !bg-white !text-black !font-bold !px-5 !py-3 !rounded-full !flex !items-center !w-max !hover:bg-gray-200 !transition"
                      >
                        {banner.buttonText} →
                      </Button>
                    </motion.div>
                  </motion.div>
                ))}
            </motion.div>

            {/* Cột phải */}
            <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="grid grid-cols-2 gap-4">
                {products.slice(16, 20).map((product, index) => (
                     <Card key={product.id} className="shadow-md rounded-lg w-56">
                     <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="relative h-60 flex justify-center items-center bg-gray-100">
                     <CardMedia
                       component="img"
                       image={product.image[0]}
                       alt={product.name}
                       className="h-32 w-auto !object-fill"
                     />
                     {product.discount > 0 && (
                       <Chip
                         label={`-${product.discount}%`}
                         className="absolute top-2 left-2 !bg-red-500 !text-white text-xs"
                       />
                     )}
                   </motion.div>
             
                   <CardContent className="flex flex-col items-start p-4">
                         <Typography
                             className="text-sm font-medium h-6 overflow-hidden text-ellipsis text-start line-clamp-2"
                         >
                             {product.name}
                         </Typography>
                         <ProductRate productId = {product.id} />
                         {/* Giá tiền căn trái và đậm hơn */}
                         <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="w-full flex items-center gap-2 my-2">
                         <Typography className="text-red-600 !font-semibold text-lg">
                     ${product.price.toLocaleString()}
                     </Typography>
                         </motion.div>
             
                         <Button
                            onClick={() => {handleProductClick(product.id)}}
                            variant="outlined"
                            color="neutral"
                            className="!w-full !normal-case !rounded-full !mt-2 !px-4 !py-2 !hover:bg-purple-50"
                         >
                             Add to cart
                         </Button>
                         </CardContent>
                     </Card>
                ))}
            </motion.div>
        </motion.div>
    <motion.div initial="hidden" whileInView="visible" variants={fadeInVariant} className="w-full overflow-hidden rounded-lg my-8">
      <img
        src={Image9}
        alt="Promotional Banner"
        className="w-full h-auto object-cover"
      />
    </motion.div>

 </>
  );
};

export default HomePage;
