import { z } from "zod";

export const CarSchema = z.object({
  car_name: z.string().min(1, { message: "Car name is required" }),
  car_color: z.string().min(1, { message: "Car color is required" }),
  police_number: z.string().min(1, { message: "Police number is required" }),
  transmission: z.string().min(1, { message: "Transmission is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  max_persons: z.number().min(1, { message: "Max persons is required" }),
  price_per_day: z.number().min(1, { message: "Price per day is required" }),
  includes: z.array(z.string()).min(1, { message: "At least one include item is required" }),
});

export type TypeCarSchema = z.infer<typeof CarSchema>;