import * as z from "zod"
export const signInSchema=z.object({
    email:z.email({error:"Invalid email"}).min(5,{error:"Email must be provided"}),
    password:z.string().min(8,{error:"Minimum password length is 8"}),
    remeberMe:z.boolean()
})
export type ISignInSchema =z.infer<typeof signInSchema>