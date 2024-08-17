import ResponseError from "../error/response_error.js"
import jwt from "jsonwebtoken"
import prisma from "../lib/prisma.js"

export const authMiddleware =async (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
       return next(new ResponseError("Unauthorized", 401))
    }
    
    const {userId} = jwt.verify(token, process.env.JWT_SECRET)
    
    if(!userId) {
        const error =  new ResponseError("Unauthorized", 401)
        return next(error)
    }
    
    const user = await prisma.user.findUnique({where: {id: userId}})
    
    req.user = {
        id : user.id,
        email : user.email,
        name : user.name,
        avatar : user.avatar
    }
    next()
}