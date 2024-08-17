import { z } from "zod";

const dateSchema = z.preprocess((arg) => {
  if (typeof arg === "string" || arg instanceof Date) {
    return new Date(arg);
  }
}, z.date());

const dateRangeValidation = z
  .object({
    start_date: dateSchema,
    end_date: dateSchema,
  })
  .refine(
    (data) => {
      return data.end_date > data.start_date;
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    }
  );

export const createProjectValidation = z
  .object({
    name: z.string().min(3).max(255),
    description: z.string().min(3).max(255).optional(),
    start_date: dateSchema,
    end_date: dateSchema,
  })
  .and(dateRangeValidation);

export const updateProjectValidation = z
  .object({
    name: z.string().min(3).max(255),
    description: z.string().min(3).max(255).optional(),
    start_date: dateSchema,
    end_date: dateSchema,
  })
  .and(dateRangeValidation);
