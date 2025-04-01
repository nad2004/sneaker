import { Router } from 'express'
import {changePasswordController,getUserController, updateUserProfile, deleteUserDetails, getUserDetails, refreshToken, verifyForgotPasswordOtp, forgotPasswordController, updateUserDetails, uploadAvatar, logoutController, registerUserController, verifyEmailController, loginController, resetpassword} from '../controllers/user.controller.js'
import auth from '../middleware/auth.js'
import upload from '../middleware/multer.js'

const userRouter = Router()
userRouter.post('/get',getUserController)
userRouter.post('/get-user-details',getUserDetails)
userRouter.post('/register',registerUserController)
userRouter.post('/verify-email',verifyEmailController)
userRouter.post('/login',loginController)
userRouter.get('/logout',auth,logoutController)
userRouter.put('/upload-avatar',auth,upload.single('image'),uploadAvatar)
userRouter.put('/update-user-details',auth,updateUserDetails)
userRouter.put('/forgot-password',forgotPasswordController)
userRouter.put('/verify-forgot-password-otp',verifyForgotPasswordOtp)
userRouter.put('/reset-password',resetpassword)
userRouter.post('/refresh-token',refreshToken)
userRouter.delete('/delete',deleteUserDetails)
userRouter.put('/update-profile', updateUserProfile)
userRouter.put('/change-password',auth,changePasswordController)
export default userRouter