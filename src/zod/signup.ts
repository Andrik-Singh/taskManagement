import z from "zod";
export const signUpSchema=z.object({
    name:z.string().min(1,{error:"You must provide name"}),
    email:z.email({error:"Invalid email"}).min(1,{error:"You must provide email"}),
    password:z.string().min(8,{error:"Paswword must be 8 characters long"}),
    confirmPassword:z.string().min(8,{error:"Paswword must be 8 characters long"}),
}).refine((data)=> data.password === data.confirmPassword,{
    error:"Password donot match",
    path:["password","confirmPassword"]
})
export type ISignupSchema=z.infer<typeof signUpSchema>