import TasksSection from "@/components/projects/TasksSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProject } from "@/server/projects/get";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import React from "react";
import {
  CalendarIcon,
  Edit2,
  Plus,
  FolderOpen,
  CalendarDays,
} from "lucide-react";
import DeleteModal from "@/components/projects/DeleteModal";
import CopyLinkButton from "@/components/projects/CopyLinkButon";

const ProjectPage = async ({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await params;
  const data = await getProject(id);

  if (!data.success || !data.data) {
    if (data.error === "Unauthorized user") {
      return redirect("/sign-in");
    }
    if (data.error === "Project not found") {
      return notFound();
    }
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="max-w-md w-full border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{data.error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const project = data.data;
  const startDate = project.startDate ? new Date(project.startDate) : null;
  const dueDate = project.dueDate ? new Date(project.dueDate) : null;
  const today = new Date();
  const daysRemaining = dueDate
    ? Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const isOverdue = daysRemaining !== null && daysRemaining < 0;
  const getStatus = () => {
    if (!dueDate) return "active";
    if (isOverdue) return "overdue";
    if (daysRemaining && daysRemaining <= 3) return "urgent";
    return "active";
  };

  const status = getStatus();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-7xl space-y-6 p-6 md:p-8">
        <Card className="border-none shadow-xl bg-linear-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-3">
                    <FolderOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                      {project.projectname}
                    </h1>
                  </div>
                </div>

                {project.projectDescription && (
                  <p className="text-base text-muted-foreground md:text-lg max-w-3xl pl-[60px]">
                    {project.projectDescription}
                  </p>
                )}
              </div>

              <Badge
                variant={
                  status === "overdue"
                    ? "destructive"
                    : status === "urgent"
                    ? "default"
                    : "secondary"
                }
                className="h-7 px-3 text-xs font-semibold shrink-0"
              >
                {status === "overdue"
                  ? "Overdue"
                  : status === "urgent"
                  ? "Due Soon"
                  : "Active"}
              </Badge>
            </div>
          </CardHeader>
        </Card>
        <Card className="border-none shadow-lg overflow-hidden">
          <div className=" px-6 py-">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              Project Timeline
            </h2>
          </div>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Start Date
                </p>
                {startDate ? (
                  <div className="flex items-center gap-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-4">
                    <div className="rounded-lg bg-green-500/10 p-2">
                      <CalendarIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">
                        {startDate.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {startDate.toLocaleDateString("en-US", {
                          weekday: "long",
                        })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-muted/50 p-4 text-center">
                    <p className="text-sm text-muted-foreground">Not set</p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Due Date
                </p>
                {dueDate ? (
                  <div
                    className={`flex items-center gap-3 rounded-lg border p-4 ${
                      isOverdue
                        ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900"
                        : "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900"
                    }`}
                  >
                    <div
                      className={`rounded-lg p-2 ${
                        isOverdue ? "bg-red-500/10" : "bg-orange-500/10"
                      }`}
                    >
                      <CalendarIcon
                        className={`h-5 w-5 ${
                          isOverdue ? "text-red-600" : "text-orange-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">
                        {dueDate.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p
                        className={`text-xs font-medium ${
                          isOverdue ? "text-red-600" : "text-muted-foreground"
                        }`}
                      >
                        {isOverdue
                          ? `${Math.abs(daysRemaining!)} days overdue`
                          : daysRemaining === 0
                          ? "Due today"
                          : `${daysRemaining} days remaining`}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-muted/50 p-4 text-center">
                    <p className="text-sm text-muted-foreground">Not set</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-wrap gap-3">
          <Link href={`/dashboard/projects/${id}/add-tasks`}>
            <Button
              size="lg"
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Tasks
            </Button>
          </Link>
          <Link href={`/dashboard/projects/${id}/update-tasks`}>
            <Button
              variant="outline"
              size="lg"
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Project
            </Button>
          </Link>
          <DeleteModal  id={id}></DeleteModal>
          {project.orgId && <CopyLinkButton id={project.orgId} />}

        </div>
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <TasksSection projectId={id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectPage;
