import bcrypt from "bcryptjs"
import { loginUserValidation, registerUserValidation, updateUserValidation } from "../validation/user.validation.js"
import { validate } from "../validation/validation.js"
import { generateToken } from "../lib/jwt.js"
import  prisma  from "../lib/prisma.js"
import ResponseError from "../error/response_error.js"
import path from "path"
import fs from "fs"

export const register = async (req) => {
    const user = validate(registerUserValidation, req.body)
    // console.log(user.email)
    const isEmailExist = await prisma.user.findUnique({
        where: {
            email: user.email
        }
    })

    if(isEmailExist){
        throw new ResponseError("Email already exist",409)
    }
    user.password = await bcrypt.hash(user.password, 10)

    if (req.files) {
        const file = req.files.avatar;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const allowType = ['.png', '.jpg', '.jpeg'];
        const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    
        if (!allowType.includes(ext.toLowerCase())) {
            throw new ResponseError("Invalid Images", 422);
        }
    
        await new Promise((resolve, reject) => {
            file.mv(`./public/images/${fileName}`, (err) => {
                if (err) {
                    reject(new ResponseError(err.message, 500));
                }
                resolve();
            });
        });
    
        user.avatar = url;
    }
    

    const newUser = await prisma.user.create({
        data: user
    })
    
    return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar
    }
}

export const login = async (req, res) => {
    const user = validate(loginUserValidation, req)
    const isUserExist = await prisma.user.findUnique({
        where: {
            email: user.email
        }
    })

    if(!isUserExist){
      throw new ResponseError("Username or password is wrong",401)
    }

    const isPasswordMatch = await bcrypt.compare(user.password, isUserExist.password)

    if(!isPasswordMatch){
       throw new ResponseError("Username or password is wrong",401)
    }
    

    const token = generateToken(isUserExist.id)
    res.cookie('token', token, {
        httpOnly: true,  
        maxAge: 3600 * 1000,  
      });
    return token
}

export const getuserById = async(id)=>{
    const user = await prisma.user.findUnique({
        where: {
            id
        },
        include:{
            tasks: true
        }
    })

    if(!user){
        throw new ResponseError("User not found", 404);
      }
    return user
}

export const update = async (req) => {
    let user = validate(updateUserValidation, req.body);

    if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    if (user.email) {
        const emailExist = await prisma.user.findUnique({
            where: {
                email: user.email,
            },
        });

        if (emailExist) {
            throw new ResponseError(409, "Email already exist");
        }
    }

     user = await prisma.user.findUnique({
        where:{
            id:req.user.id
        }
    })

    if (req.files) {
        const file = req.files.avatar;
        const ext = path.extname(file.name);
        const fileName = `${file.md5}${ext}`;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if (!allowedType.includes(ext.toLowerCase())) {
            throw new ResponseError("Invalid image format", 422);
        }

        if (req.user.avatar) {
            const oldFilePath = `./public/images/${user.avatar}`;
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        await new Promise((resolve, reject) => {
            file.mv(`./public/images/${fileName}`, (err) => {
                if (err) {
                    reject(new ResponseError(err.message, 500));
                } else {
                    resolve();
                }
            });
        });

        const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
        user.avatar = url;
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: req.user.id,
        },
        data: user,
    });

    return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
    };
};

export const destroy = async (id) => {
    const user = await prisma.user.findUnique({
        where:{
            id
        }
    })
    const filepath = `./public/images/${user.avatar}`;
        fs.unlinkSync(filepath);
    await prisma.user.delete({
        where: {
            id: id
        }
    })
}