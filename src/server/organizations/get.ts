"use server"

import { db } from "@/db"
import { organization } from "@/db/schema"
import { eq } from "drizzle-orm"
import { success } from "zod"

export async function getOrgName(orgId:string | null) {
    try {
        if(!orgId){
            return{
                success:false,
                name:null
            }
        }
        const [name]=await db.select({
            name:organization.orgId
        }).from(organization).where(eq(organization.orgId,orgId))
        return{
            success:true,
            name:name.name
        }
    } catch (error) {
        console.error(error)
        return{
            success:false,
            name:null
        }
    }
}