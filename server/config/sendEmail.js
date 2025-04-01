import nodemailer from "nodemailer";

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "anhdung2004hd123@gmail.com", // Thay bằng email của bạn
                pass: "zvkk wckp glyr fqnv"   // Thay bằng App Password (16 ký tự)
            }
        });

        const mailOptions = {
            from: "anhdung2004hd123@gmail.com",
            to: sendTo,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email gửi thành công:", info.response);
        return info;
    } catch (error) {
        console.error("❌ Lỗi gửi email:", error);
        return null;
    }
};
export default sendEmail;