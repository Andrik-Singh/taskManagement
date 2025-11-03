"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { authClient } from "@/lib/authClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SignOutButton = () => {
  const [isPending, startTransition] = useTransition();
  const router=useRouter()
  return (
    <Button
      onClick={() => {
        startTransition(async () => {
          const { data, error } = await authClient.signOut();
          if (error) {
            toast.error("Unable top sign out try it later");
          } else {
            toast.success("Succesfully signed out");
          }
          router.refresh()
        });
      }}
      variant={"destructive"}
      disabled={isPending}
    >
      Sign Out
    </Button>
  );
};

export default SignOutButton;
