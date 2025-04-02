import React from "react";
import { Card, Typography, Chip, Button, Divider } from "@mui/material";
import { CheckCircle, LocalShipping, Payment, ShoppingCart } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme, useMediaQuery } from '@mui/material';

const OrderDetails = () => {
  const { orderId } = useParams(); // Lấy orderId từ URL
  const [order, setOrder] = useState<any>(null);
  const theme = useTheme(); // Get current theme
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)'); // Detect dark mode

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.post("http://localhost:8080/api/order/get-order-details", {
          id: orderId, // Gửi orderId trong body của request
        });
        setOrder(response.data.data); // Lưu dữ liệu trả về vào state
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails(); // Gọi hàm fetch khi component mount
  }, [orderId]);

  // Nếu chưa có dữ liệu, hiển thị loading hoặc thông báo
  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="w-full mx-auto p-6"
      style={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[3],
        borderRadius: theme.shape.borderRadius,
      }}
    >
      {/* Order ID */}
      <Typography variant="h6" className="!font-semibold">
        Order ID: {order._id}
      </Typography>
      <Typography variant="body2" className="text-gray-500 !mb-4">
        Let's boost your sales with powerful insights and effective strategies today
      </Typography>

      {/* Order Status */}
      <div className="flex items-center gap-4 mb-6">
        <Chip icon={<ShoppingCart />} label="Order Made" variant="outlined" />
        <Chip icon={<Payment />} label="Order Paid" variant="outlined" />
        <Chip icon={<LocalShipping />} label="Shipped" color="primary" />
        <Chip icon={<CheckCircle />} label="Completed" variant="outlined" />
      </div>

      {/* Shipping Info */}
      <Card className="!p-4 !mb-4" style={{ backgroundColor: theme.palette.background.default }}>
        <div className="grid grid-cols-2 gap-4">
          {/* Seller Address */}
          <div>
            <Typography variant="subtitle1" className="!font-semibold">
              Shipping Address (Seller)
            </Typography>
            <Typography variant="body2" className="text-gray-400">
              Hà Nội <br />
              Thăng Long
            </Typography>
          </div>

          {/* Buyer Address */}
          <div>
            <Typography variant="subtitle1" className="font-semibold">
              Shipping Address (Buyer)
            </Typography>
            <Typography variant="body2" className="text-gray-400">
              {order.delivery_address}
            </Typography>
          </div>
        </div>
      </Card>

      {/* Order Items */}
      <Card className="p-4 mb-4" style={{ backgroundColor: theme.palette.background.default }}>
        <Typography variant="h6" className="!mb-2 !font-semibold">
          Order Items
        </Typography>
        <div className="space-y-4">
          {order.products.map((product: any, index: string) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img
                  src={product.productId?.image[0]}
                  alt={product.productId?.name || "Product Image"}
                  className="w-16 h-16 rounded-md"
                />
                <div>
                  <Typography variant="body1" className="!font-semibold">
                    {product.productId?.name || "Unknown Product"}
                  </Typography>
                  <Typography variant="body2" className="text-gray-400">
                    Color: Black | Size: {product.size}
                  </Typography>
                </div>
              </div>
              <Typography variant="body1" className="!font-semibold">
                {product.quantity} x {product.productId?.price || 0} đ
              </Typography>
            </div>
          ))}
        </div>
      </Card>

      {/* Order Summary */}
      <Card className="!p-4" style={{ backgroundColor: theme.palette.background.default }}>
        <Typography variant="h6" className="!mb-2 !font-semibold">
          Order Summary
        </Typography>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Typography variant="body2">Product Price ({order.products.length} product)</Typography>
            <Typography variant="body2">{order.totalAmt} đ</Typography>
          </div>
          <div className="flex justify-between">
            <Typography variant="body2">Shipping Cost Subtotal</Typography>
            <Typography variant="body2" className="text-red-500">
              -0 đ
            </Typography>
          </div>
          <div className="flex justify-between">
            <Typography variant="body2">Discount</Typography>
            <Typography variant="body2" className="text-red-500">
              - 0 đ
            </Typography>
          </div>
        </div>

        <Divider className="!my-2" />

        <div className="flex justify-between">
          <Typography variant="h6" className="!font-semibold">
            Total
          </Typography>
          <Typography variant="h6" className="!font-semibold">
            {order.totalAmt} đ
          </Typography>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-4">
          <Button variant="contained" color="primary" fullWidth>
            Track Order
          </Button>
          <Button variant="outlined" color="secondary" fullWidth>
            Contact Support
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderDetails;
