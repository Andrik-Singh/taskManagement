"use client";

import { ITaskSchema, taskSchema } from "@/zod/tasks";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Calendar29 } from "../date-picker";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { authClient } from "@/lib/authClient";
import { useEffect, useState } from "react";
import { SaveTasks } from "@/server/tasks/post";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateTask } from "@/server/tasks/update";

const NewTasks = ({ id, prevData }: { id?: []; prevData?: ITasks }) => {
  console.log(prevData?.repeatDaily);
  const { data } = authClient.useSession();
  const [saveDate, setSaveDate] = useState<Date | null>(null);
  const router = useRouter();
  const methods = useForm<ITaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      taskTitle: prevData?.taskTitle,
      taskDescription: prevData?.taskDescription,
      dueDate: prevData?.dueDate,
      assigneeId: prevData?.assigneeId,
      priority: prevData?.priority,
      repeatDaily: prevData?.repeatDaily ? prevData.repeatDaily : false,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    setError,
  } = methods;
  const disabled = useWatch({
    control: control,
    name: "repeatDaily",
  });
  const date = useWatch({
    control: control,
    name: "dueDate",
  });
  const submitForm = async (unsafeData: ITaskSchema) => {
    if (!unsafeData.repeatDaily && unsafeData.dueDate === null) {
      setError("dueDate", {
        message: "Task should either have a due date or be repeated daily",
      });
      return;
    }
    if (!prevData) {
      const res = await SaveTasks(unsafeData);
      if (!res.success) {
        toast.error(res.error);
      } else {
        toast.success("Success in saving task");
        router.push("/dashboard/tasks");
      }
    } else {
      const res = await updateTask(prevData.id, unsafeData);
      if (!res.success) {
        toast.error(res.error);
      } else {
        toast.success("Success in saving task");
        router.push("/dashboard/tasks");
      }
    }
  };
  useEffect(() => {
    if (prevData?.assigneeId) {
      setValue("assigneeId", prevData.assigneeId);
    } else if (data?.user.id) {
      setValue("assigneeId", data.user.id);
    }
  }, [data]);
  useEffect(() => {
    const save = () => {
      if (date === null) {
        return;
      } else {
        setSaveDate(date);
      }
    };
    save();
  }, [date]);
  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <Field>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
              id="title"
              placeholder="e.g Drink a coffee"
              {...register("taskTitle")}
            ></Input>
            {errors.taskTitle?.message && (
              <FieldError>{errors.taskTitle?.message}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="description">Title</FieldLabel>
            <Textarea
              id="description"
              placeholder="Add a more detailed description "
              {...register("taskDescription")}
            ></Textarea>
            {errors.taskDescription?.message && (
              <FieldError>{errors.taskDescription.message}</FieldError>
            )}
          </Field>
          <Field>
            <div className="flex flex-wrap gap-5">
              <Field>
                <FormProvider {...methods}>
                  <Calendar29 numerator="dueDate" disabled={disabled} id="Due Date" />
                  {errors.dueDate?.message && (
                    <FieldError>{errors.dueDate.message}</FieldError>
                  )}
                </FormProvider>
              </Field>
              <Field>
                <FieldLabel className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                  <Checkbox
                    id="toggle-2"
                    defaultChecked={
                      prevData?.repeatDaily ? prevData.repeatDaily : false
                    }
                    onCheckedChange={(value: boolean) => {
                      setValue("repeatDaily", value);
                      if (value) {
                        setValue("dueDate", null);
                      } else {
                        setValue("dueDate", saveDate);
                      }
                    }}
                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                  />
                  <div className="grid gap-1.5 font-normal">
                    <p className="text-sm leading-none font-medium">
                      Repeat daily
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Repeat the tasks daily.
                    </p>
                  </div>
                </FieldLabel>
              </Field>
            </div>
          </Field>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="assignee" className="text-sm font-medium">
                  Assign to
                </FieldLabel>
                <Select
                  onValueChange={(val) => {
                    setValue("assigneeId", val);
                  }}
                  disabled={!id}
                  defaultValue={data?.user.name || ""}
                >
                  <SelectTrigger id="assignee" className="mt-2">
                    <SelectValue placeholder={data?.user.name}>You</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {id && id.length > 0 ? (
                        id.map((assigneeId) => (
                          <SelectItem value={assigneeId} key={assigneeId}>
                            {assigneeId}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="you" disabled>
                          No assignees available
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError>{errors.assigneeId?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="priority" className="text-sm font-medium">
                  Priority
                </FieldLabel>
                <Select
                  onValueChange={(val: "Low" | "Medium" | "High") => {
                    setValue("priority", val);
                  }}
                  defaultValue="Medium"
                >
                  <SelectTrigger id="priority" className="mt-2">
                    <SelectValue></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Priority Level</SelectLabel>
                      {["Low", "Medium", "High"].map((val) => (
                        <SelectItem key={val} value={val}>
                          {val}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>
          <div className="flex flex-row justify-end gap-5">
            <Button
              onClick={() => {
                router.back();
              }}
              type="button"
              variant={"destructive"}
            >
              Cancel
            </Button>
            <Button type="submit">{prevData ? "Update" : "Create"}</Button>
          </div>
        </FieldGroup>
      </Field>
    </form>
  );
};

export default NewTasks;
