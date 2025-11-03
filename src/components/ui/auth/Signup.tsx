"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ISignupSchema, signUpSchema } from "@/zod/signup";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  authClient,
  signInWithGIthub,
  signInWithGoogle,
} from "@/lib/authClient";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
const Signup = () => {
  const router=useRouter()
  const [isSubmitting, setisSubmitting] = useState(false);
  const methods = useForm<ISignupSchema>({
    resolver: zodResolver(signUpSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const formSubmit = async (unsafeData: ISignupSchema) => {
    const { data, error } = await authClient.signUp.email({
      name: unsafeData.name,
      email: unsafeData.email,
      password: unsafeData.password,
      callbackURL: process.env.BETTER_AUTH_URL,
    });
    if (error) {
      toast.error(
        `${
          (errors.root?.message && errors.root.message) || "Unable to sign in"
        }`
      );
    } else {
      toast.success("Signed in");
      router.refresh()
    }
  };
  return (
    <Card className="w-xs mx-auto mt-5">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription className="space-y-2 mt-2 flex flex-col">
          <Button
            onClick={async () => {
              try {
                setisSubmitting(true);
                const { data, error } = await signInWithGoogle();
                if (error) {
                  console.error(error);
                  toast.error("Unable to sign in");
                } else {
                  toast.success("Sign in succesfull");
                }
              } catch (error) {
                console.error(error);
              } finally {
                setisSubmitting(false);
              }
            }}
            variant="outline"
            type="button"
          >
            Sign up with Google
          </Button>
          <Button
            onClick={async () => {
              try {
                setisSubmitting(true);
                const { data, error } = await signInWithGIthub();
                if (error) {
                  console.error(error);
                  toast.error("Unable to sign in");
                } else {
                  toast.success("Sign in succesfull");
                }
              } catch (error) {
                console.error(error);
              } finally {
                setisSubmitting(false);
              }
            }}
            variant="outline"
            type="button"
          >
            Sign up with Github
          </Button>
        </CardDescription>
        <FieldSeparator>Or</FieldSeparator>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(formSubmit)}>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                {...register("name")}
                id="name"
                type="text"
                placeholder="John Doe"
                className={`${
                  errors.name?.message
                    ? "outline-red-500 border-red-500"
                    : "outline-none border-none"
                }`}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
                className={`${
                  errors.email?.message ? "outline-red-500 border-red-500" : ""
                }`}
              />
              <FieldDescription
                className={`${
                  errors.email?.message ? "text-red-500" : "text-none "
                }`}
              >
                {errors.email?.message
                  ? errors.email.message
                  : "We'll use this to contact you. We will not share your emailwith anyone else."}
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className={`${
                  errors.password?.message
                    ? "outline-red-500 border-red-500"
                    : ""
                }`}
              />
              <FieldDescription
                className={`${
                  errors.password?.message ? "text-red-500" : "text-none "
                }`}
              >
                {errors.password?.message
                  ? errors.password.message
                  : "Must be at least 8 characters long."}
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                {...register("confirmPassword")}
                className={`${
                  errors.confirmPassword?.message
                    ? "outline-red-500 border-red-500"
                    : ""
                }`}
              />
              <FieldDescription
                className={`${
                  errors.confirmPassword?.message
                    ? "text-red-500"
                    : "text-none "
                }`}
              >
                {errors.confirmPassword?.message
                  ? errors.confirmPassword.message
                  : "Please confirm your password"}
                .
              </FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button disabled={isSubmitting} type="submit">
                  Create Account
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/sign-in">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default Signup;
