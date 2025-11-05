"use server";

import { db } from "@/db";
import { organization, organizationMembers, projects } from "@/db/schema";
import { auth } from "@/lib/auth";
import { error } from "console";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { success } from "zod";

export async function deleteProject(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        error: "No id provided",
        data: null,
      };
    }
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
      .from(projects)
      .where(eq(projects.projectId, id));
    if (res.length === 0) {
      return {
        success: false,
        error: "Project not found",
        data: null,
      };
    }
    let deletedData;
    const orgId = res[0].orgId;
    if (orgId === null) {
      if (res[0].madeBy === user.id) {
        deletedData = await db
          .delete(projects)
          .where(eq(projects.projectId, id))
          .returning();
        return {
          success: true,
          error: "Project not found",
          data: deletedData,
        };
      }
    } else {
      const roleTable = await db
        .select()
        .from(organizationMembers)
        .where(
          and(
            eq(organizationMembers.userId, user.id),
            eq(organizationMembers.orgId, orgId)
          )
        );
      const role = roleTable[0].role;
      if (role === "user") {
        return {
          success: false,
          error: "Only admin can delete projects",
          data: null,
        };
      } else {
        deletedData = await db
          .delete(projects)
          .where(eq(projects.projectId, id));
        return {
          success: true,
          error: "Project not found",
          data: deletedData,
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      error: "Failed to delete project",
      data: null,
    };
  }
}
