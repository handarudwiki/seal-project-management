import dotevn from "dotenv";
import jwt from "jsonwebtoken";

dotevn.config();

export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRED_IN,
    });
}
