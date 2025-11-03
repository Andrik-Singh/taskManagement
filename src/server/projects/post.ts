"use server";

import { db } from "@/db";
import { projectMembers, projects } from "@/db/schema";
import { auth } from "@/lib/auth";
import { IProjectSchema, projectSchema } from "@/zod/projects";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { success } from "zod";

export async function makeNewProject(unsafeData: IProjectSchema) {
  try {
    const authData = await auth.api.getSession({
      headers: await headers(),
    });
    if (!authData) {
      return {
        error: "Unauthorized User",
        success: false,
      };
    }
    const { user } = authData;
    const { data, success, error } = projectSchema.safeParse(unsafeData);
    if (!success) {
      return {
        success: false,
        error: error.message,
      };
    }
    const res = await db
      .insert(projects)
      .values({
        projectname: data.title,
        projectDescription: data.description,
        startDate: data.startDate,
        dueDate: data.dueDate,
        madeBy: user.id,
      })
      .returning({ id: projects.projectId });
      if(res.length === 0){
        return{
            success:false,
            error:"Unable to create a new project"
        }
      }
    const id = res[0].id;
    const newRes = await db.insert(projectMembers).values({
      projectId: id,
      memberId: user.id,
    }).returning();
    if(newRes.length === 0){
        await db.delete(projects).where(eq(projects.projectId,id))
        return{
            success:false,
            error:"Unable to create project"
        }
    }
    
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Internal server error occured",
    };
  }
}
