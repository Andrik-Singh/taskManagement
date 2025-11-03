"use client";
import { useTransition } from "react";
import { Button } from "../ui/button";
import { completedTask } from "@/server/tasks/get";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CheckboxChanger = ({
  id,
  completed,
}: {
  id: string;
  completed: boolean;
}) => {
  const [isPending, startTask] = useTransition();
  const router=useRouter()
  return (
    <Button
      disabled={isPending}
      variant={"link"}
      onClick={() => {
        startTask(async () => {
          const data = await completedTask([
            {
              id: id,
              completed:!completed,
            },
          ]);
          if(data.success){
            toast.success("Success in changing tasks")
            router.refresh()
          }else{
            toast.error(data.error)
          }
        });
      }}
      className="cursor-pointer"
    >
      Mark as {completed ? "Incomplete" : "Complete"}
    </Button>
  );
};

export default CheckboxChanger;
