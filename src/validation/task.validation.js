import { z } from "zod";

export const createTaskValidation = z.object({
    'name': z.string().min(3).max(255),
    'description': z.string().min(3).max(255).optional(),
    'user_id' : z.number().int(),
    'project_id': z.number().int(),
})

export const updateTaskValidation = z.object({
    'name': z.string().min(3).max(255).optional(),
    'description': z.string().min(3).max(255).optional(),
    'user_id' : z.number().int().optional(),
    'project_id': z.number().int().optional(),
})