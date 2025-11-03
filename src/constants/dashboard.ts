"use client"
import { Building, ClipboardList, Folder, LayoutDashboard, Settings, User } from "lucide-react";

export const items=[
  {
    title:"Dashboard",
    link:"/dashboard",
    icon:LayoutDashboard
  },
  {
  title:"Tasks",
  link:"/dashboard/tasks",
  icon:ClipboardList
},
{
  title:"Personal",
  link:"/dashboard/personal",
  icon:User
},
{
  title:"Projects",
  link:"/dashboard/projects",
  icon:Folder
},
{
  title:"Organizations",
  link:"/dashboard/organizations",
  icon:Building
},
{
  title:"Settings",
  link:"/dashboard/settings",
  icon:Settings
}]