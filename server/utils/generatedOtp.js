import otpGenerator from "otp-generator";

const generatedOtp = ()=>{
    return  otpGenerator.generate(6, { digits: true, upperCase: false, specialChars: false });
   

}
export default generatedOtp