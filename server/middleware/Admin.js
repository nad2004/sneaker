import UserModel from "../models/user.model.js"

export const admin = async(request,response,next)=>{
    try {
       const  {userId} = request.body
       const user = await UserModel.findById(userId)
        console.log(userId)
       if(user.role !== 'ADMIN' && user.role !== 'STAFF'){
            return response.status(400).json({
                data : user,
                message : "Permission denial",
                error : true,
                success : false
            })
       }

       next()

    } catch (error) {
        return response.status(500).json({
            er: error.message,
            message : "Permission denial",
            error : true,
            success : false
        })
    }
}
