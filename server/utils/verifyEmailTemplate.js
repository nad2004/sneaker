const verifyEmailTemplate = ({name,otp})=>{
    return`
<p>Chào ${name}</p>    
<p>Cảm ơn bạn đã đăng ký cho Sơn</p>   
<div style="background:yellow; font-size:20px;padding:20px;text-align:center;font-weight : 800;">
        ${otp}
    </div>
    <p>This otp is valid for 1 min only. Enter this otp in the Sneaker Store website to proceed with resetting your password.</p>
`
}

export default verifyEmailTemplate