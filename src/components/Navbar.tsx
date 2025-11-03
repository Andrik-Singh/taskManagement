import { auth } from "@/lib/auth";
import { Menu } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ModeToggle } from "./Themechanger";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";
import { CommandDialogDemo } from "./CommandMenu";
const Navbar = async () => {
  const authData = await auth.api.getSession({
    headers: await headers(),
  });
  if (!authData) {
    redirect("/sign-in");
  }
  const { user } = authData;
  return (
    <header className="flex px-5 py-3 justify-between border-b shadow-sm shadow-gray-200 border-black items-center">
      <SidebarTrigger />
      <nav className="space-x-5 font-mono">
        <CommandDialogDemo/>
      </nav>
      <div className="flex items-center gap-2">
        <ModeToggle></ModeToggle>
        <Avatar>
            <AvatarImage src={user.image || ""}></AvatarImage>
            <AvatarFallback>{user.name}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Navbar;
