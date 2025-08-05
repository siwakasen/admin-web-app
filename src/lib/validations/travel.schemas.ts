import { z } from "zod";

export const TravelPackageSchema = z.object({
  package_name: z.string().min(1, { message: "Package name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  package_price: z.number().min(1, { message: "Package price is required" }),
  duration: z.number().min(1, { message: "Duration is required" }),
  max_persons: z.number().min(1, { message: "Max persons is required" }),
  itineraries: z.array(z.string()).min(1, { message: "At least one itinerary item is required" }),
  includes: z.array(z.string()).min(1, { message: "At least one include item is required" }),
});


export type TypeTravelPackageSchema = z.infer<typeof TravelPackageSchema>;