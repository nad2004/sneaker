import { useState } from "react";
import axios from "axios";
import { Button, CircularProgress } from "@mui/material";

export default function GenerateQR() {
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null); // Đặt null thay vì true

  const generateQR = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/payment/vnpay-qr", {
        orderId: "ORD-2",
        amount: 10000
      });

      console.log(response.data);
      setImg(response.data.qrCode); // Gán URL hình ảnh QR vào state
    } catch (error) {
      console.error("Lỗi tạo QR:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <Button
        variant="contained"
        color="primary"
        onClick={generateQR}
        className="w-80"
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Tạo QR"}
      </Button>

      {img && ( // Kiểm tra nếu img có dữ liệu thì mới hiển thị
        <img src={img} alt="Mã QR VNPAY" />
      )}
    </div>
  );
}
