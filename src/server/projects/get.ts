import { db } from "@/db";
import { projectMembers, projects } from "@/db/schema";
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
    return{
        success:true,
        error:null,
        data:res
    }
  } catch (error) {
    console.error(error)
    return{
        error:"Internal server errror occured",
        success:false,
        data:null
    }
  }
}
