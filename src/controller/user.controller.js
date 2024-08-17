import { destroy, getuserById, login, register, update } from "../service/user.service.js"

export const registerController = async (req, res, next)=>{
    try {
        const user = await register(req)
        return res.status(200).json({
            status : "success",
            data : user
        })
    } catch (error) {
        next(error)
    }
}

export const loginController = async (req, res, next)=>{
    try {
        const token = await login(req.body, res)
        return res.status(200).json({
            status : "success",
            token : token
        })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

export const logout = async (req, res, next)=>{
    // return res.json("test")
    try {
        res.clearCookie("token")
        return res.status(200).json({
            status : "success",
            data : "Logout successfully"
        })
    } catch (error) {
        next(error)
    }
}

export const getuserByIdController = async (req, res, next)=>{
    try {
        const user = await getuserById(req.user.id);
        return res.status(200).json({
            status : "success",
            data : user
        })
    } catch (error) {
        return res.status(500).json({
            status : "error",
            message : error.message
        })
        console.log(error.message)
        next(error)
    }
}

export const updateUserController = async (req, res, next)=>{
    try {
        const user = await update(req)
        return res.status(200).json({
            status : "success",
            data : user
        })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}


export const deleteUserController = async (req, res, next)=>{
    try {
        await destroy(req.user.id)
        res.clearCookie("token")
        return res.status(200).json({
            status : "success",
            data : "User deleted successfully"
        })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
