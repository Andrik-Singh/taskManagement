import { SidebarProvider } from "@/components/ui/sidebar"
import Navbar from "@/components/Navbar"
import { AppSidebar } from "@/components/app-sidebar"
import { items } from "@/constants/dashboard"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <main className="w-screen">
        <AppSidebar items={items}/>
        <Navbar></Navbar>
        {children}
      </main>
    </SidebarProvider>
  )
}