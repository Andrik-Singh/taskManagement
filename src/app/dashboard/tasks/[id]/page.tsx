import CheckboxChanger from "@/components/tasks/CheckboxChanger";
import DeleteTasksModal from "@/components/tasks/DeleteTasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTasks } from "@/server/tasks/get";
import Link from "next/link";
import { notFound } from "next/navigation";

const TaskDetailPage = async ({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await params;
  const res = await getTasks(id);
  const data = res.data?.data[0];
  
  if (!data) {
    return notFound();
  }

  const displayDueDate = data.repeatDaily
    ? new Date().toLocaleDateString()
    : data?.dueDate?.toLocaleDateString() ?? "No due date";

  return (
    <section className="container mx-auto px-4 sm:px-6 mt-10 max-w-7xl">
      <div className="flex gap-6 flex-col lg:flex-row">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-2xl">{data.taskTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <CardDescription className="text-base">
              {data.taskDescription}
            </CardDescription>
            
            <section className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-1">
                <h2 className="font-semibold text-sm text-muted-foreground">
                  Created At
                </h2>
                <p className="text-sm">
                  {data.createdAt?.toLocaleDateString() ?? "N/A"}
                </p>
              </div>

              <div className="space-y-1">
                <h2 className="font-semibold text-sm text-muted-foreground">
                  Due Date
                </h2>
                <p className="text-sm">{displayDueDate}</p>
              </div>

              <div className="space-y-1">
                <h2 className="font-semibold text-sm text-muted-foreground">
                  Priority
                </h2>
                <Badge
                  variant={
                    data.priority === "High"
                      ? "destructive"
                      : data.priority === "Low"
                      ? "secondary"
                      : "default"
                  }
                >
                  {data.priority}
                </Badge>
              </div>

              <div className="space-y-1">
                <h2 className="font-semibold text-sm text-muted-foreground">
                  Status
                </h2>
                <p className="text-sm">
                  {data.completed ? "✓ Complete" : "○ Incomplete"}
                </p>
              </div>

              {!data.repeatDaily ? (
                <div className="space-y-1">
                  <h2 className="font-semibold text-sm text-muted-foreground">
                    {data.completedAt ? "Completed At" : "Completion Status"}
                  </h2>
                  <p className="text-sm">
                    {data.completedAt
                      ? data.completedAt.toLocaleDateString()
                      : "Not yet completed"}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <h2 className="font-semibold text-sm text-muted-foreground">
                    Times Completed
                  </h2>
                  <p className="text-sm">
                    {data.completedNumberOfTimes ?? 0} times
                  </p>
                </div>
              )}
            </section>
          </CardContent>
          
          <CardFooter className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/dashboard/tasks/${id}/update`}>Edit Task</Link>
            </Button>
            <DeleteTasksModal id={data.id} />
            <Button variant="outline" asChild>
              <Link href="/dashboard/tasks">Go Back</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="lg:w-80 w-full">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CheckboxChanger
              id={data.id}
              completed={data.completed ?? false}
            />
            <Button className="w-full" variant="secondary">
              Ask AI
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TaskDetailPage;