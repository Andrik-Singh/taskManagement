"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/authClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { error: "Password should be atleast 8 characters long" }),
    confirmPassword: z
      .string()
      .min(1, { error: "Password should be atleast 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Password do not match",
  });
const ResetPassword = () => {
  const params=useSearchParams()
  const token=params.get("token")
  const methods = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;
  const formSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    if(!token){
      toast.error("Invalid token")
      return
    }
    const {error}=await authClient.resetPassword({
      newPassword:data.password,
      token:token
    })
    if(error){
      console.error(error)
      toast.error("Unable to reset your password")
    }else{
      toast.success("Password reset complete")
    }
  };
  return (
    <div>
      <Card className="w-xs mx-auto">
        <CardHeader>
          <CardTitle>Enter your new password</CardTitle>
        </CardHeader>
        <FieldSeparator></FieldSeparator>
        <CardContent>
          <form onSubmit={handleSubmit(formSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="pass">Enter new password</FieldLabel>
                <Input
                  id="pass"
                  placeholder="New Password"
                  {...register("password")}
                  autoComplete="password"
                ></Input>
                {errors.password?.message && (
                  <FieldError>{errors.password.message}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPass">
                  Confirm new password
                </FieldLabel>
                <Input
                  id="confirmPass"
                  placeholder="Confirm New Password"
                  {...register("confirmPassword")}
                  autoComplete="password"
                ></Input>
                {errors.password?.message && (
                  <FieldError>{errors.password.message}</FieldError>
                )}
              </Field>
              <Field>
                <Button disabled={isSubmitting}>Continue</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
