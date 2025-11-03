import { addDays } from "date-fns";
import z from "zod";

export const projectSchema = z
  .object({
    title: z.string().min(1, { error: "Title is required" }),
    description: z
      .string()
      .min(10, { error: "Description should consist atleast 10 words" }),
    startDate: z
      .date()
      .refine((data) => data >= new Date(), {
        error: "Start date must be today or onwards",
      })
      .refine((data) => data <= addDays(new Date(), 120), {
        error: "Your start date cannot be after 120 days",
      }),
    dueDate: z
      .date()
      .refine((date) => date >= new Date(), {
        error: "Due date must be today or onwards",
      })
      .refine((date) => date <= addDays(new Date(), 180), {
        error: "Due date cannot exceed 180 days",
      }),
  })
  .refine((data) => addDays(data.startDate,2) <= data.dueDate, {
    error: "Your due date should be atleast 2 days after start date",
    path:["startDate"],
  });
export type IProjectSchema = z.infer<typeof projectSchema>;
