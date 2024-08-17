import { ZodError } from "zod";
import ResponseError from "../error/response_error.js";

export const errorMiddleware = (err, req, res, next) => {
    if (err instanceof ResponseError) {
        res.status(err.status).json({ 
            status : "error",
            message : err.message
         });
    } else if(err instanceof ZodError){
        res.status(400).json({ 
            status : "error",
            message :"Validation Error",
            details : err.errors.map(error =>  `${error.message} at ${error.path.join(".")}`)
         });
    }else{
        return res.status(500).json({
            status : "error",
            message : "Internal Server Error"
        })
    }
}