"use server";

import { db } from "@/db";
import { tasks } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ITaskSchema, taskSchema } from "@/zod/tasks";
import { headers } from "next/headers";
import { success } from "zod";

export async function updateTask(id: string, unsafeData: ITaskSchema) {
  try {
    const authData = await auth.api.getSession({
      headers: await headers(),
    });
    if (!authData) {
      return {
        success: false,
        error: "Unauthorized user",
      };
    }
    const { user } = authData;
    const { data,success }=taskSchema.safeParse(unsafeData)
    if(!success){
        return{
            success:false,
            error:"Unsanitized input",
            data:null,
        }
    }
    const res=await db.update(tasks).set({
        taskTitle:data.taskTitle,
        taskDescription:data.taskDescription,
        dueDate:data.dueDate,
        repeatDaily:data.repeatDaily,
        priority:data.priority,
        assigneId:data.assigneeId
    }).returning()
    return{
        success:true,
        error:null,
        data:res
    }
  } catch (error) {
    console.error(error)
    return{
        error:"Internal server error occured",
        success:false,
        data:null
    }
  }
}
