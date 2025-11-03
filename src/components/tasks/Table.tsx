"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityColumn,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState, useTransition } from "react";
import { column } from "./columns";
import FilteredComponent from "./FilteredComponent";
import PaginationComponent from "../PaginationComponent";
import { completedTask, getTasks } from "@/server/tasks/get";
import { Button } from "../ui/button";
import { toast } from "sonner";

export function Datatable({ data }: { data: {
  data:ITasks[],
  totalPages:number
} }) {
  const [changedTasks, setChangedTasks] = useState<
    {
      id: string;
      completed: boolean;
    }[]
  >([]);
  const [tableData, setTableData] = useState(data)
  const [isPending,startTask]= useTransition()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    completed:true,
    taskTitle:true,
    dueDate:true,
    priority:true,
    Actions:true
  })
  const totalPages=Math.ceil(tableData.totalPages/10)
  const onTaskUpdate = (id: string, checked: boolean) => {
    const checkId = changedTasks.some((data) => data.id === id);

    if (!checkId) {
      setChangedTasks((prev) => [
        ...prev,
        {
          id: id,
          completed: checked,
        },
      ]);
    } else {
      const newTasks = changedTasks.filter((task) => task.id !== id); 
      setChangedTasks(newTasks);
    }
  };
  const columns = column;
  const table = useReactTable({
    data: tableData.data,
    columns: columns(onTaskUpdate),
    getCoreRowModel: getCoreRowModel(),
    initialState:{
      columnVisibility:columnVisibility
    },
    onColumnVisibilityChange:setColumnVisibility

  });
  return (
    <>
      <FilteredComponent ></FilteredComponent>
      <div className=" mx-auto rounded-md border mb-10">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
              className="divide-x divide-border mx-1"
              key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                className="mx-2 divide-x divide-border"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                    key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between w-full">
        <PaginationComponent totalPages={totalPages}></PaginationComponent>
        <Button
        disabled={changedTasks.length === 0 || isPending}
        onClick={()=>{
          startTask(async()=>{
            const { success,error }=await completedTask(changedTasks)
            console.log(success,error)
            if(success){
              toast.success("Status of task has been changed")
            }
            setChangedTasks([])
          })
        }}
        >
          {isPending ? "Updating ..." :"Change Form"}
        </Button>
      </div>
    </>
  );
}
