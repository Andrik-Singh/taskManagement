"use server";

import { db } from "@/db";
import { inviteeTable, organizationMembers } from "@/db/schema";
import { auth } from "@/lib/auth";
import { error } from "console";
import { addDays } from "date-fns";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { success } from "zod";

export async function createNewLink(orgId: string) {
  try {
    const authData = await auth.api.getSession({
      headers: await headers(),
    });
    if (!authData) {
      return {
        success: false,
        error: "Unauthorized user",
        token: null,
      };
    }
    const { user } = authData;
    const roleTable = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.orgId, orgId),
          eq(organizationMembers.userId, user.id)
        )
      );
    if(roleTable.length === 0){
      return{
        success:false,
        error:"No member found in the organization",
        token:null
      }
    }
    const role = roleTable[0].role;
    if(role === "user"){
      return{
        success:false,
        error:"Only admin or owner can invite users",
        token:null
      }
    }
    const token = crypto.randomUUID();

    const res = await db.insert(inviteeTable).values({
      orgId: orgId,
      token,
      createdBy: user.id,
      expiresAt:addDays(new Date(),30),
    }).returning();
    if(res.length === 0){
      return{
        success:false,
        error:"The link cannot be made at a moment",
        token:null
      }
    }
    return{
      success:true,
      error:null,
      token
    }
  } catch (error) {
    console.error(error)
    return{
      success:false,
      error:"Internal server errror occured",
      token:null
    }
  }
}
