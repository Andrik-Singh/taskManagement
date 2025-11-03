"use client";
import { FormProvider, useForm } from "react-hook-form";
import { Card } from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { IProjectSchema, projectSchema } from "@/zod/projects";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { error } from "console";
import { Textarea } from "../ui/textarea";
import { Calendar29 } from "../date-picker";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { makeNewProject } from "@/server/projects/post";
import { toast } from "sonner";

const ProjectForm = ({prevData}:{prevData?:IProjectSchema}) => {
  const router = useRouter();
  const methods = useForm<IProjectSchema>({
    resolver: zodResolver(projectSchema),
    defaultValues:prevData
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;
  const formSubmit = async (unsafeData: IProjectSchema) => {
    if(!prevData){
      const data=await makeNewProject(unsafeData)
      if(data?.success){
        toast.success("Project created successfully")
        router.push("/dashboard/projects")
      }else{
        toast.error(data.error)
      }
    }
  };
  return (
    <form onSubmit={handleSubmit(formSubmit)}>
      <Field>
        <FieldGroup>
          <Field>
            <Label htmlFor="title">Project title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="e.g Make the dashboard"
            ></Input>
            {errors.title?.message && (
              <FieldError>{errors.title.message}</FieldError>
            )}
          </Field>
          <Field>
            <Label htmlFor="description">Project descripiton</Label>
            <Textarea
              placeholder="e.g Use the help of figma to create a new dashboard...."
              id="description"
              {...register("description")}
            ></Textarea>
            {errors.description?.message && (
              <FieldError>{errors.description.message}</FieldError>
            )}
          </Field>
          <Field>
            <section className="flex flex-row gap-5 flex-wrap">
              <FormProvider {...methods}>
                <Field>
                  <Calendar29
                    numerator="startDate"
                    id="Start_Date"
                  ></Calendar29>
                  {errors.startDate?.message && (
                    <FieldError>{errors.startDate.message}</FieldError>
                  )}
                </Field>
              </FormProvider>
              <FormProvider {...methods}>
                <Field>
                  <Calendar29 numerator="dueDate" id="Due_Date"></Calendar29>
                  {errors.dueDate?.message && (
                    <FieldError>{errors.dueDate.message}</FieldError>
                  )}
                </Field>
              </FormProvider>
            </section>
          </Field>
          <Field>
            <div className="flex flex-row flex-wrap gap-5">
              <Button
              disabled={isSubmitting}
              variant={"outline"}
                onClick={() => {
                  router.back();
                }}
              >
                Cancel
              </Button>
              <Button
              disabled={isSubmitting}
              type="submit">Submit</Button>
            </div>
          </Field>
        </FieldGroup>
      </Field>
    </form>
  );
};

export default ProjectForm;
