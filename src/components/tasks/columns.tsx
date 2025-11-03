"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Calendar, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import DeleteTasksModal from "./DeleteTasks";
export const column = (
  onTaskUpdate: (id: string, completed: boolean) => void
): ColumnDef<ITasks>[] => [
  {
    accessorKey: "completed",
    header: "Status",
    cell: ({ row }) => {
      return (
        <span className="flex items-center gap-2">
          <Checkbox
            onCheckedChange={(val: boolean) => {
              row.original.completed = val;
              onTaskUpdate(row.original.id,row.original.completed)
            }}
            checked={Boolean(row.original.completed)}
          ></Checkbox>
          {row.original.completed ? "Complete":"Incomplete"}
        </span>
      );
    },
  },
  {
    accessorKey: "taskTitle",
    header: "Title",
  },
  {
    accessorKey: "dueDate",
    header: "DueDate",
    cell: ({ row }) => {
      const repeatDaily = row.original.repeatDaily;
      const dueDate = row.original.dueDate;
      if (dueDate) {
        return (
          <Badge variant={"outline"}>
            <Calendar></Calendar> {dueDate.toLocaleDateString()}
          </Badge>
        );
      }
      if (repeatDaily) {
        return (
          <Badge variant={"outline"}>
            {new Date().toLocaleDateString()} 🔁
          </Badge>
        );
      }
      return <Badge variant={"outline"}>No due date</Badge>;
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      return (
        <Badge
          variant={
            row.original.priority == "High"
              ? "destructive"
              : row.original.priority == "Medium"
              ? "default"
              : row.original.priority == "Low"
              ? "secondary"
              : "outline"
          }
        >
          {row.original.priority}
        </Badge>
      );
    },
  },
  {
    header: "Actions",
    accessorKey: "id",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger className="ml-2 my-1">
          <FaEllipsisV className="opacity-70"></FaEllipsisV>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <DeleteTasksModal id={row.original.id}></DeleteTasksModal>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              className="w-full"
              href={`tasks/${row.original.id}/update`}
            >
              Update
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              className="w-full"
              href={`tasks/${row.original.id}`}
            >
              Learn more
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
