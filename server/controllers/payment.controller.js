import axios from "axios";
import crypto from "crypto";
import QRCode from "qrcode";
import moment from "moment";

export async function createCollectionLink (req, res){
    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
//parameters
var accessKey = 'F8BBA842ECF85';
var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
var orderInfo = 'pay with MoMo';
var partnerCode = 'MOMO';
var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
var requestType = "payWithMethod";
var amount = req.body.amount;
var orderId = req.body.orderId;
var requestId = orderId;
var extraData ='';
var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
var orderGroupId ='';
var autoCapture =true;
var lang = 'vi';

//before sign HMAC SHA256 with format
//accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
//puts raw signature
console.log("--------------------RAW SIGNATURE----------------")
console.log(rawSignature)
//signature

var signature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');
console.log("--------------------SIGNATURE----------------")
console.log(signature)

//json object send to MoMo endpoint
const requestBody = JSON.stringify({
    partnerCode : partnerCode,
    partnerName : "Test",
    storeId : "MomoTestStore",
    requestId : requestId,
    amount : amount,
    orderId : orderId,
    orderInfo : orderInfo,
    redirectUrl : redirectUrl,
    ipnUrl : ipnUrl,
    lang : lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData : extraData,
    orderGroupId: orderGroupId,
    signature : signature
});
//option for axios
const options = {
    method: 'POST',
    url: 'https://test-payment.momo.vn/v2/gateway/api/create',
    headers: {
                 'Content-Type': 'application/json',
                 'Content-Length': Buffer.byteLength(requestBody)
             },
    data: requestBody
}
let response;
try {
    response = await axios(options);
    return res.status(200).json(response.data);
} catch (err) {
    return res.status(500).json({
        message: err.message || err,
        error: true,
        success: false
    });
}

//Create the HTTPS objects
// const https = require('https');
// const options = {
//     hostname: 'test-payment.momo.vn',
//     port: 443,
//     path: '/v2/gateway/api/create',
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         'Content-Length': Buffer.byteLength(requestBody)
//     }
// }

// //Send the request and get the response
// const req = https.request(options, res => {
//     console.log(`Status: ${res.statusCode}`);
//     console.log(`Headers: ${JSON.stringify(res.headers)}`);
//     res.setEncoding('utf8');
//     res.on('data', (body) => {
//         console.log('Body: ');
//         console.log(body);
//         console.log('resultCode: ');
//         console.log(JSON.parse(body).resultCode);
//     });
//     res.on('end', () => {
//         console.log('No more data in response.');
//     });
// })

// req.on('error', (e) => {
//     console.log(`problem with request: ${e.message}`);
// });
// // write data to request body
// console.log("Sending....")
// req.write(requestBody);
// req.end();
}

export  async function createQRCode(req, res) {
    const { orderId, products } = req.body;
    const phone = "0705303068"
    if ( !orderId || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: "Thiếu thông tin cần thiết (số điện thoại, orderId hoặc danh sách sản phẩm)" });
    }

    // Tính tổng tiền đơn hàng
    const totalAmount = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

    // Tạo chuỗi sản phẩm mô tả đơn hàng
    const productList = products.map(p => `${p.name} x${p.quantity} (${p.price}đ)`).join(", ");

    // Tạo URL thanh toán MoMo
    let momoUrl = `https://me.momo.vn/${phone}-${totalAmount}-${orderId}-${encodeURIComponent(productList)}`;

    try {
        const qrImage = await QRCode.toDataURL(momoUrl);
        res.json({ qrUrl: momoUrl, qrImage, orderId, totalAmount, productList });
    } catch (error) {
        res.status(500).json({ error: "Lỗi tạo QR",
            details: error.message || error
         });
    }
}
const vnp_TmnCode = "SJK2WQVN"; // Thay bằng mã Merchant của bạn
const vnp_HashSecret = "5U9XU89TRA6PW70TVNU2F155G4AWB3AU"; // Thay bằng secret key của bạn
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const vnp_ReturnUrl = "http://localhost:5173/payment-return";
export async function generateQRVNPay(req, res){

    const { orderId, amount } = req.body;

    // Lấy địa chỉ IP của người dùng
    const ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket?.remoteAddress;

    // Tạo thời gian giao dịch
    const createDate = moment().format("YYYYMMDDHHmmss");
    // Tạo thời gian hết hạn (2 phút sau)
    const expireDate = moment().add(2, 'minutes').format("YYYYMMDDHHmmss");
    // Danh sách tham số cần gửi
    const vnp_Params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: vnp_TmnCode,
        vnp_Amount: amount * 100, // VNPay yêu cầu số tiền nhân 100
        vnp_CurrCode: "VND",
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Thanh toán đơn hàng ${orderId}`,
        vnp_OrderType: "other",
        vnp_Locale: "vn",
        vnp_ReturnUrl: vnp_ReturnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
        vnp_ExpireDate: expireDate // Thêm tham số thời gian hết hạn
    };

    // Sắp xếp tham số theo thứ tự a-z
    const sortedParams = Object.keys(vnp_Params)
        .sort()
        .reduce((acc, key) => {
            acc[key] = vnp_Params[key];
            return acc;
        }, {});

    // Tạo chuỗi query string
    const queryString = new URLSearchParams(sortedParams).toString();

    // Tạo chữ ký bảo mật (HMAC SHA512)
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const secureHash = hmac.update(Buffer.from(queryString, "utf-8")).digest("hex");

    // Tạo URL thanh toán VNPAY
    const paymentUrl = `${vnp_Url}?${queryString}&vnp_SecureHash=${secureHash}`;

    // Tạo mã QR từ URL thanh toán
    try {
        const qrCode = await QRCode.toDataURL(paymentUrl);
        res.json({ qrCode, paymentUrl });
    } catch (error) {
        res.status(500).json({ error: "Lỗi tạo QR", details: error.message });
    }
  }
  export async function handleVnpayReturn (req, res)  {
    let vnp_Params = req.query;

    // Lấy vnp_SecureHash từ URL trả về của VNPay
    const secureHash = vnp_Params["vnp_SecureHash"];

    // Xóa SecureHash & SecureHashType để tạo chữ ký kiểm tra
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    // Sắp xếp tham số theo thứ tự a-z
    vnp_Params = Object.keys(vnp_Params)
        .sort()
        .reduce((acc, key) => {
            acc[key] = vnp_Params[key];
            return acc;
        }, {});

    // Tạo chữ ký bảo mật mới
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    // Kiểm tra chữ ký
    if (secureHash !== signed) {
        return res.redirect("http://localhost:5173/payment-failed?error=invalid_signature");
    }

    // Kiểm tra mã phản hồi từ VNPay
    const responseCode = vnp_Params["vnp_ResponseCode"];
    if (responseCode === "00") {
        // Thanh toán thành công
        return res.redirect(`http://localhost:5173/payment-success?orderId=${vnp_Params["vnp_TxnRef"]}`);
    } else {
        // Thanh toán thất bại
        return res.redirect(`http://localhost:5173/payment-failed?orderId=${vnp_Params["vnp_TxnRef"]}&error=${responseCode}`);
    }
};