import { db } from "@/db";
import { projectMembers, projects, tasks } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getAllProjects() {
  try {
    const authData = await auth.api.getSession({
      headers: await headers(),
    });
    if (!authData) {
      return {
        success: false,
        error: "Unauthorized user",
        data: null,
      };
    }
    const { user } = authData;
    const res = await db
      .select()
      .from(projectMembers)
      .leftJoin(projects, eq(projectMembers.projectId, projects.projectId))
      .where(eq(projectMembers.memberId, user.id.toString()));
    return {
      success: true,
      error: null,
      data: res,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Internal server errror occured",
      success: false,
      data: null,
    };
  }
}
export async function getProject(id: string) {
  try {
    const authData = await auth.api.getSession({
      headers: await headers(),
    });
    if (!authData) {
      return {
        success: false,
        error: "Unauthorized user",
        data: null,
      };
    }
    const res=await db.select().from(projects).where(eq(projects.projectId,id))
    if(res.length===0){
      return {
        success: false,
        error: "Project not found",
        data: null,
      };
    }
    return{
      success:true,
      error:null,
      data:res[0], 
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Internal server error occurred",
      data: null,
    };
  }
}
export async function getTasksBasedOnProject(id:string) {
  try {
    const res = await db.select().from(tasks).where(eq(tasks.projectId, id));
    return {
      success: true,
      error: null,
      data: res,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Internal server error occurred",
      data: null,
    };
  }
}
