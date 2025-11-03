interface SideBarProps {
  title: string;
  link: string;
  icon: JSXElementConstructor.Element;
}
interface ITasks {
  createdAt: Date | null;
  completed: boolean | null;
  id: string;
  dueDate: Date | null;
  repeatDaily: boolean | null;
  priority: "Low"|"Medium"|"High";
  taskTitle: string;
  taskDescription?:string,
  projectId?:string | null,
  completedAt?:Date | null,
  completedNumberOfTimes?:number,
  assigneeId?:string 
}
