"use server";

import { db } from "@/db";
import { organizationMembers, projects, tasks } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ITaskSchema, taskSchema } from "@/zod/tasks";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
export async function SaveTasks(unsafeData: ITaskSchema, orgId?: string) {
  try {
    const authData = await auth.api.getSession({
      headers: await headers(),
    });
    if (!authData) {
      return {
        success: false,
        error: "Unauthorized User",
        data: null,
      };
    }
    const { user } = authData;
    const { data, success } = taskSchema.safeParse(unsafeData);
    if (!success) {
      return {
        success: false,
        error: "Unsanitized input",
        data: null,
      };
    }
    if (orgId) {
      const membership = await db
        .select()
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.orgId, orgId),
            eq(organizationMembers.userId, data.assigneeId)
          )
        );
      if (membership.length == 0) {
        return {
          success: false,
          error: "There is no member to assign in that organization",
          data: null,
        };
      }
      const role = await db
        .select({
          role: organizationMembers.role,
        })
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.orgId, orgId),
            eq(organizationMembers.userId, user.id)
          )
        );
      console.log(role);
    }
    const res = await db
      .insert(tasks)
      .values({
        taskTitle: data.taskTitle,
        taskDescription: data.taskDescription,
        dueDate: data.dueDate,
        repeatDaily: data.repeatDaily,
        assigneId: data.assigneeId,
        priority: data.priority,
      })
      .returning();
    return {
      data: res,
      success: true,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Internal server error occured",
      success: false,
      data: null,
    };
  }
}
export async function DeleteTasks(id: string) {
  try {
    const authData = await auth.api.getSession({
      headers: await headers(),
    });
    if (!authData) {
      return {
        success: false,
        error: "Unauthorized User",
      };
    }
    const { user } = authData;
    const res=await db.select().from(tasks).where(
        eq(tasks.id,id)
    )
    if(res.length == 0){
      return{
        success:false,
        error:"There are no tasks"
      }
    }
    const projectId=res[0].projectId
    if(!projectId && res[0].assigneId === user.id){
        await db.delete(tasks).where(
            eq(tasks.id,id)
        ).returning()
        return {
            success:true,
            error:null
        }
    }
    if(projectId){
      const orgIdTable=await db.select({
        orgId:projects.orgId
      }).from(projects).where(
        eq(projects.projectId,projectId)
      )
      const orgId=orgIdTable[0].orgId
      if(!orgId){
        await db.delete(tasks).where(
          eq(
            tasks.id,id
          )
        )
        return{
          success:true,
          error:null
        }
      }
      const roleTable=await db.select().from(organizationMembers).where(
        and(
          eq(organizationMembers.orgId,orgId),
          eq(organizationMembers.userId,user.id)
        )
      )
      const role=roleTable[0].role
      if(role== "user"){
        return{
          success:false,
          error:"You are not an admin"
        }
      }else{
        await db.delete(tasks).where(
          eq(tasks.id,id)
        )
        return {
          success:true,
          error:null
        }
      }
    }
  } catch (error) {
    console.error(error)
    return{
      success:false,
      error:"Internal server error occured"
    }
  }
}
