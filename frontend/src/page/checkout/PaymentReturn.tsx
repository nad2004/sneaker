import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const VnpayReturn: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"success" | "failed" | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  useEffect(() => {
    // Lấy tham số từ URL
    const responseCode = searchParams.get("vnp_ResponseCode");
    const orderId = searchParams.get("vnp_TxnRef");
    
    setOrderId(orderId);

    if (responseCode === "00") {
      setStatus("success"); // Thanh toán thành công
    } else {
      setStatus("failed");
      setErrorCode(responseCode); // Lưu mã lỗi nếu có
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center p-6">
      {status === "success" ? (
        <div className="text-green-600">
          <h2 className="text-2xl font-bold">✅ Thanh toán thành công!</h2>
          <p>Mã đơn hàng: <strong>{orderId}</strong></p>
        </div>
      ) : (
        <div className="text-red-600">
          <h2 className="text-2xl font-bold">❌ Thanh toán thất bại!</h2>
          <p>Mã đơn hàng: <strong>{orderId}</strong></p>
          <p>Lỗi: <strong>{errorCode}</strong></p>
        </div>
      )}
    </div>
  );
};

export default VnpayReturn;
