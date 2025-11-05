"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { error } from "console";
import { eq } from "drizzle-orm";
import { success } from "zod";

export async function getName(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        error: "No id passed",
        name: null,
      };
    }
    const [authData] = await db
      .select({ name: user.name })
      .from(user)
      .where(eq(user.id, id));
    return {
      success: true,
      error: null,
      name: authData.name,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Internal server error occured",
      name: null,
    };
  }
}
