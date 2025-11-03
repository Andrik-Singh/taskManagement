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
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { authClient } from "@/lib/authClient";
import { useEffect, useState } from "react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

const Page = () => {
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [lastEmail, setLastEmail] = useState<string>("");
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const formSubmit = async (unsafeData: ForgotPasswordForm) => {
    try {
      const { data, error } = await authClient.forgetPassword({
        email: unsafeData.email,
        redirectTo: '/reset-password',
      });
      
      if (error) {
        toast.error(error.message || "We couldn't send the password reset email");
        return;
      }
      setSubmitted(true);
      setLastEmail(unsafeData.email);
      setCountdown(60)
      toast.success("Password reset email sent! Check your inbox.");
      
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return; 
    
    const email = getValues("email") || lastEmail;
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      const { data, error } = await authClient.forgetPassword({
        email,
        redirectTo: '/reset-password',
      });
      
      if (error) {
        toast.error(error.message || "Failed to resend email");
        return;
      }
      
      setSubmitted(true);
      toast.success("Reset email sent again!");
    } catch (err) {
      console.error("Resend error:", err);
      toast.error("Failed to resend email");
    }
  };

  useEffect(() => {
    if (!submitted) {
      return
    };
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSubmitted(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  return (
    <div className="flex justify-center items-center min-h-screen w-full px-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Reset your password
          </CardTitle>
          <p className="text-center text-sm text-gray-600 mt-2">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </CardHeader>
        <FieldSeparator />
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(formSubmit)} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                  disabled={isSubmitting || countdown > 0}
                  className={`${
                    errors.email ? "border-red-400 focus:ring-red-400" : ""
                  }`}
                />
                <FieldError>{errors.email?.message}</FieldError>
              </Field>

              {submitted && countdown > 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">
                    ✓ Reset email sent! Check your inbox and spam folder.
                  </p>
                </div>
              )}

              <div className="flex justify-between gap-3 pt-2">
                <Link href="/sign-in" className="flex-1">
                  <Button 
                    variant="outline" 
                    type="button"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    Go back
                  </Button>
                </Link>
                
                {submitted && countdown > 0 ? (
                  <Button 
                    type="button"
                    className="flex-1"
                    disabled
                  >
                    Resend in {countdown}s
                  </Button>
                ) : submitted && countdown === 0 ? (
                  <Button 
                    type="button"
                    className="flex-1"
                    onClick={handleResend}
                  >
                    Resend email
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? "Sending..." : "Send reset email"}
                  </Button>
                )}
              </div>

              <div className="text-center pt-4">
                <p className="text-xs text-gray-500">
                  Didn&apos;t receive the email? Check your spam folder or try resending.
                </p>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;