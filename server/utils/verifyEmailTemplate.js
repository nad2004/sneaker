const verifyEmailTemplate = ({name,url})=>{
    return`
<p>Chào ${name}</p>    
<p>Cảm ơn bạn đã đăng ký cho Sơn</p>   
<a href=${url} style="color:black;background :orange;margin-top : 10px,padding:20px,display:block">
    Verify Email
</a>
`
}

export default verifyEmailTemplate