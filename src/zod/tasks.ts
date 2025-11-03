
import { addDays } from "date-fns";
import z from "zod";

export const taskSchema = z.object({
  taskTitle: z
    .string()
    .min(5, { message: "Title should be at least 5 letters" }),
  taskDescription: z
    .string()
    .min(10, { message: "Description should be at least 10 letters" }),
  dueDate: z
    .date()
    .refine((date)=>date>=new Date(),{error:"Your due date should be today or later"}
    )
    .refine((date)=>date<=addDays(new Date(),120),{error:"Your due date cannot be more than 120 days from now"}).nullable(),
  repeatDaily: z.boolean().optional(),
  priority: z.enum(["Low", "Medium", "High"]).catch("Medium"),
  assigneeId: z.string().min(1,{error:"Asignee id required"}),
});

export type ITaskSchema = z.infer<typeof taskSchema>;
