"use client";

import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useTransition } from "react";
import { deleteProject } from "@/server/projects/delete";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DeleteModal = ({ id }: { id: string }) => {
  const [isPending, startTask] = useTransition();
  const router = useRouter();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          <div className="text-destructive">
            Are you sure? This action can&apos;t be reversed
          </div>
        </DialogTitle>
        <DialogFooter className="space-x-4">
          <DialogClose disabled={isPending}>Close</DialogClose>
          <Button
            disabled={isPending}
            onClick={() => {
              startTask(async () => {
                const data = await deleteProject(id);
                if (!data?.success) {
                  toast.error(data?.error);
                } else {
                  toast.success("Succesfully deleted data");
                  router.refresh();
                }
              });
            }}
            variant={"destructive"}
          >
            <span>Delete</span>
            <Trash></Trash>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
