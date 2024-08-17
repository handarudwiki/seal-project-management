import { z } from "zod";

export const registerUserValidation = z.object({
    'name': z.string().min(3).max(255),
    'email': z.string().email(),
    'password': z.string().min(6).max(255),
})

export const loginUserValidation = z.object({
    'email': z.string().email(),
    'password': z.string().min(6).max(255)
})

export const updateUserValidation = z.object({
    'name': z.string().min(3).max(255).optional(),
    'email': z.string().email().optional(),
    'password': z.string().min(6).max(255).optional(),
})