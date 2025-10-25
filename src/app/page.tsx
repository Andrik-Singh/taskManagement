import SignOutButton from "@/components/SignOutButton";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

const page = async () => {
  const authData = await auth.api.getSession({
    headers: await headers(),
  });
  console.log(authData);
  return (
    <div>
      {authData ? (
        <>
          <SignOutButton></SignOutButton>
          <Link href={"/dashboard"}>Dashboard</Link>
        </>
      ) : (
        <>
          <Link href={"/sign-in"}>
            <Button>Sign in</Button>
          </Link>
          <Link href={"/sign-up"}>
            <Button>Sign up</Button>
          </Link>
          <Link href={"/dashboard"}>Dashboard</Link>
        </>
      )}
    </div>
  );
};

export default page;
