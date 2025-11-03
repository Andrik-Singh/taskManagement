"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";


export function AppSidebar({ items }: { items: SideBarProps[] }) {
  const path = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between items-center text-black dark:text-white">
            <h1 className="text-xl font-mono">TaskFlow</h1>
            <SidebarTrigger />
          </SidebarGroupLabel>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="px-3 gap-4">
              {items.map((item) => {
                const isActive = item.link === path;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      size={"default"}
                      asChild
                      className={`w-full flex items-center gap-2 transition-all rounded-xl   ${
                        isActive
                          ? "bg-blue-200 text-indigo-600"
                          : "hover:bg-gray-100 dark:hover:bg-gray-900"
                      }`}
                    >
                      <Link
                        href={item.link}
                        className="flex items-center gap-2 px-3"
                      >
                        <span className="text-xl"><item.icon/></span>

                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
