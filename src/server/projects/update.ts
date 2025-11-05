"use server"
import { db } from "@/db";
import { organization, organizationMembers, projects } from "@/db/schema";
import { auth } from "@/lib/auth";
import { IProjectSchema, projectSchema } from "@/zod/projects";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function updateProjects(
  id: string,
  unsafeData: IProjectSchema,
  orgId?: string
) {
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
    if (!id || !unsafeData) {
      return {
        success: false,
        error: "Project ID and data are required",
      };
    }
    const { data, success } = projectSchema.safeParse(unsafeData);
    if (!success) {
      return {
        success: false,
        error: "Unsanitized input",
      };
    }
    const res = await db.select().from(projects).where(eq(projects.projectId, id));
    if (res.length === 0) {
      return {
        success: false,
        error: "Project not found",
      };
    }
    const project = res[0];
    if (project.orgId) {
      if (!orgId) {
        return {
          success: false,
          error: "Organization ID is required",
        };
      }
      if (project.orgId !== orgId) {
        return {
          success: false,
          error: "Unauthorized",
        };
      }
      const [roleTable] = await db
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
      const role = roleTable.role;
      if (role === "user") {
        return {
          success: false,
          error: "Only admins can update projects",
        };
      }
      await db
        .update(projects)
        .set({
          projectname: data.title,
          projectDescription: data.description,
          startDate: data.startDate,
          dueDate: data.dueDate,
        })
        .where(eq(projects.projectId, id));
    } else {
      if (project.madeBy !== user.id) {
        return {
          success: false,
          error: "Unauthorized",
        };
      }
      await db
        .update(projects)
        .set({
          projectname: data.title,
          projectDescription: data.description,
          startDate: data.startDate,
          dueDate: data.dueDate,
        })
        .where(eq(projects.projectId, id));
    }
    return{
        success:true,
        error:null
    }
  } catch (error) {
    return {
      success: false,
      error: "Internal server error",
    };
  }
}
