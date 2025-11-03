"use client";

import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useTransition } from "react";
import { DeleteTasks } from "@/server/tasks/post";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const DeleteTasksModal = ({ id }: { id: string }) => {
  const router=useRouter()
  const [isPending,startTask]= useTransition()
  const handleDelete = () => {
    startTask(async()=>{
        const data=await DeleteTasks(id)
        if(data?.success){
          toast.success("Deleted Task") 
          router.push("/dashboard/tasks")
        }else{
          toast.error(data?.error)
        }
    })
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
        variant={"destrucTiveGhost"}
        >
          <span>Delete</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Task</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTasksModal;
