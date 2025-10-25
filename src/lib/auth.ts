import { db } from "@/db"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { forgotPassword } from "./mail/forgotPassword"
import * as schema from "../db/schema"
export const auth=betterAuth({
    database:drizzleAdapter(db,{
        schema:schema,
        provider:"pg"
    }),
    emailAndPassword:{
        enabled:true,
        sendResetPassword:async({url,user})=>{
            await forgotPassword(user,url)
        }
    },
    socialProviders:{
        google:{
            clientSecret:process.env.GOOGLE_CLIENT_SECRET,
            clientId:process.env.GOOGLE_CLIENT_ID!
        },
        github:{
            clientId:process.env.GITHUB_CLIENT_ID!,
            clientSecret:process.env.GITHUB_CLIENT_SECRET,
        }
    }
})