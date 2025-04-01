import sendEmail from '../config/sendEmail.js'
import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'
import generatedAccessToken from '../utils/generatedAccessToken.js'
import genertedRefreshToken from '../utils/generatedRefreshToken.js'
import uploadImageClodinary from '../utils/uploadImageClodinary.js'
import generatedOtp from '../utils/generatedOtp.js'
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js'
import jwt from 'jsonwebtoken'
import otpGenerator from "otp-generator";
export const getUserController = async(request,response)=>{
    try {
        
        let { page, limit, search } = request.body 

        if(!page){
            page = 1
        }

        if(!limit){
            limit = 10
        }

        const query = search ? {
            $text : {
                $search : search
            }
        } : {}

        const skip = (page - 1) * limit

        const [data,totalCount] = await Promise.all([
            UserModel.find(query).sort({createdAt : -1 }).skip(skip).limit(limit),
            UserModel.countDocuments(query)
        ])

        return response.json({
            message : "User data",
            error : false,
            success : true,
            totalCount : totalCount,
            totalNoPage : Math.ceil( totalCount / limit),
            data : data
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export async function registerUserController(request, response) {
    try {
        const { name, email, password } = request.body;

        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Provide email, name, and password",
                error: true,
                success: false
            });
        }

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return response.json({
                message: "Email already registered",
                error: true,
                success: false
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        // 🔹 **Tạo mã OTP ngẫu nhiên (6 số)**
        const otpCode = otpGenerator.generate(6, { digits: true, upperCase: false, specialChars: false });
        const otpExpiry = new Date(Date.now() + 1 * 60 * 1000); // OTP có hiệu lực trong 1 phút

        // 🔹 **Lưu user với OTP vào database**
        const newUser = new UserModel({
            name,
            email,
            password: hashPassword,
            otp: otpCode,
            otpExpiry
        });

        await newUser.save();

        // 🔹 **Tạo nội dung email**
        const emailContent = `
            <h2>Hello ${name},</h2>
            <p>Your OTP for email verification is: <strong>${otpCode}</strong></p>
            <p>This OTP will expire in 1 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
        `;

        console.log("🟢 Sending OTP email...");
        await sendEmail({
            sendTo: email,
            subject: "Your OTP Code for Sneaker Store",
            html: emailContent
        });

        return response.json({
            message: "User registered successfully. Please check your email for OTP verification.",
            error: false,
            success: true,
            userId: newUser._id // ✅ Trả về userId để FE sử dụng
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


export async function verifyEmailController(request, response) {
    try {
        const { email, otp } = request.body;

        const user = await UserModel.findOne({ email: email, otp });

        if (!user) {
            return response.status(400).json({
                message: "Invalid OTP",
                data: { email,otp},
                error: true,
                success: false
            });
        }

        // Kiểm tra xem OTP đã hết hạn chưa
        if (user.otpExpiry < Date.now()) {
            return response.status(400).json({
                message: "OTP has expired. Please request a new one.",
                error: true,
                success: false
            });
        }

        // Cập nhật trạng thái xác thực email
        await UserModel.updateOne(
            { email: email },
            { verify_email: true, otp: null, otpExpiry: null }
        );
    console.log("🟢 Update OTP email...");
        return response.json({
            message: "Email verification successful!",
            success: true,
            error: false
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


//login controller
export async function loginController(request,response){
    try {
        const { email , password } = request.body


        if(!email || !password){
            return response.status(400).json({
                message : "provide email, password",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email }).select('-address_details -forgot_password_expiry -forgot_password_otp -orderHistory -shopping_cart')

        if(!user){
            return response.status(400).json({
                message : "User not register",
                error : true,
                success : false
            })
        }

        if(user.status !== "Active"){
            return response.status(400).json({
                message : "Contact to Admin",
                error : true,
                success : false
            })
        }

        const checkPassword = await bcryptjs.compare(password,user.password)

        if(!checkPassword){
            return response.status(400).json({
                message : "Check your password",
                error : true,
                success : false
            })
        }

        const accesstoken = await generatedAccessToken(user._id)
        const refreshToken = await genertedRefreshToken(user._id)

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date : new Date()
        })

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }
        response.cookie('accessToken',accesstoken,cookiesOption)
        response.cookie('refreshToken',refreshToken,cookiesOption)

        return response.json({
            message : "Login successfully",
            error : false,
            success : true,
            data : {
                accesstoken,
                refreshToken,
                user
            }
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//logout controller
export async function logoutController(request,response){
    try {
        const userid = request.userId //middleware

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        response.clearCookie("accessToken",cookiesOption)
        response.clearCookie("refreshToken",cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
            refresh_token : ""
        })

        return response.json({
            message : "Logout successfully",
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//upload user avatar
export async function uploadAvatar(request,response){
    try {
        const userId = request.userId // auth middlware
        const image = request.file  // multer middleware

        const upload = await uploadImageClodinary(image)
       
        const updateUser = await UserModel.findByIdAndUpdate(userId,{
            avatar : upload.url
        })

        return response.json({
            message : "upload profile",
            success : true,
            error : false,
            data : {
                _id : userId,
                avatar : upload.url
            }
        })

    } catch (error) {
        
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//update user details
export async function updateUserDetails(request,response){
    try {
        const { id } = request.body 

        if(!id){
            return response.status(400).json({
                message : "provide user id",
                error : true,
                success : false
            })
        }

        const updateUser = await UserModel.updateOne({ _id : id },{
            ...request.body
        })

        return response.json({
            message : "updated successfully",
            data : updateUser,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//forgot password not login
export async function forgotPasswordController(request,response) {
    try {
        const { email } = request.body 

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        const otp = otpGenerator.generate(6, { digits: true, upperCase: false, specialChars: false });
        const expireTime = new Date(Date.now() + 1 * 60 * 1000);

        const update = await UserModel.findByIdAndUpdate(user._id,{
            forgot_password_otp : otp,
            forgot_password_expiry : new Date(expireTime).toISOString()
        })
        const emailContent = `
            <h2>Hello ${user.name},</h2>
            <p>Your OTP for reset password verification is: <strong>${otp}</strong></p>
            <p>This OTP will expire in 1 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
        `;
        console.log("🟢 Sending OTP email...");
        await sendEmail({
            sendTo : email,
            subject : "Forgot password from Sneaker Store",
            html : emailContent
        })
        

        return response.json({
            message : "check your email",
            error : false,
            success : true,
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//verify forgot password otp
export async function verifyForgotPasswordOtp(request,response){
    try {
        const { email , otp }  = request.body

        if(!email || !otp){
            return response.status(400).json({
                message : "Provide required field email, otp.",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email: email })

        if(!user){
            return response.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        const currentTime = new Date().toISOString()

        if(user.forgot_password_expiry < currentTime  ){
            return response.status(400).json({
                message : "Otp is expired",
                error : true,
                success : false
            })
        }

        if(otp !== user.forgot_password_otp){
            return response.status(400).json({
                message : "Invalid otp",
                error : true,
                success : false
            })
        }

        // if otp is not expired
        // otp === user.forgot_password_otp

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            forgot_password_otp : "",
            forgot_password_expiry : ""
        })
        
        return response.json({
            message : "Verify otp successfully",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//reset the password
export async function resetpassword(request,response){
    try {
        const { email , newPassword} = request.body 

        if(!email || !newPassword ){
            return response.status(400).json({
                message : "provide required fields email, newPassword"
            })
        }

        const user = await UserModel.findOne({email: email })

        if(!user){
            return response.status(400).json({
                message : "Email is not available",
                error : true,
                success : false
            })
        }


        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword,salt)

        const update = await UserModel.findOneAndUpdate(user._id,{
            password : hashPassword
        })

        return response.json({
            message : "Password updated successfully.",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


//refresh token controler
export async function refreshToken(request,response){
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1]  /// [ Bearer token]

        if(!refreshToken){
            return response.status(401).json({
                message : "Invalid token",
                error  : true,
                success : false
            })
        }

        const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken){
            return response.status(401).json({
                message : "token is expired",
                error : true,
                success : false
            })
        }

        const userId = verifyToken?._id

        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        response.cookie('accessToken',newAccessToken,cookiesOption)

        return response.json({
            message : "New Access token generated",
            error : false,
            success : true,
            data : {
                accessToken : newAccessToken
            }
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//get login user details
export async function getUserDetails(request,response){
    try {
        const { id } = request.body 

        const user = await UserModel.findById(id).select('-password -refresh_token')

        return response.json({
            message : 'user details',
            data : user,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : "Something is wrong",
            error : true,
            success : false
        })
    }
}
export const deleteUserDetails = async(request,response)=>{
    try {
        const { _id } = request.body 

        if(!_id){
            return response.status(400).json({
                message : "provide _id ",
                error : true,
                success : false
            })
        }

        const deleteUser = await UserModel.deleteOne({_id : _id })

        return response.json({
            message : "Delete successfully",
            error : false,
            success : true,
            data : deleteUser
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
export async function changePasswordController(request, response) {
    try {
        const { email, oldPassword, newPassword } = request.body;

        if (!email || !oldPassword || !newPassword) {
            return response.status(400).json({
                message: "Provide email, old password, and new password",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        const isMatch = await bcryptjs.compare(oldPassword, user.password);
        if (!isMatch) {
            return response.status(400).json({
                message: "Incorrect old password",
                error: true,
                success: false
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashNewPassword = await bcryptjs.hash(newPassword, salt);

        user.password = hashNewPassword;
        await user.save();

        return response.json({
            message: "Password changed successfully",
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
export const updateUserProfile = async (request, response) => {
    try {
        const { id, address, phone, name, email } = request.body;

        if (!id) {
            return response.status(400).json({
                message: "Provide User ID",
                error: true,
                success: false
            });
        }

        // Tạo đối tượng chỉ chứa email và phone nếu chúng tồn tại trong request
        const updateFields = {};
        if (address) updateFields.address_details = address;
        if (phone) updateFields.mobile = phone;
        if (name) updateFields.name = name;
        if (email) updateFields.email = email;
        const updateUser = await UserModel.updateOne(
            { _id: id },
            { $set: updateFields } // Chỉ cập nhật các trường email, phone
        );

        return response.json({
            message: "Updated successfully",
            data: updateUser,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};