export const dynamic = "force-dynamic";
import { Datatable } from "@/components/tasks/Table";
import { Button } from "@/components/ui/button";
import { getTasks } from "@/server/tasks/get";
import Link from "next/link";
import { redirect } from "next/navigation";
export const revalidate = 0;
const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    priority: "Low" | "Medium" | "High" | "all";
    [key: string]: string;
  }>;
}) => {
  const params = await searchParams;
  const page = params.page;
  const showCompleted = params.completed;
  let priority: "Low" | "Medium" | "High" | "all" = "all";
  if (params.priority) {
    const normalized =
      params.priority.charAt(0).toUpperCase() +
      params.priority.slice(1).toLowerCase();
    if (["Low", "Medium", "High"].includes(normalized)) {
      priority = normalized as "Low" | "Medium" | "High";
    }
  }
  const sortBy = params.sortBy;
  const data: {
    error: string | null;
    data: {
      data: ITasks[];
      totalPages: number;
    } | null;
    success: boolean;
  } = await getTasks(undefined, {
    page: Number(page),
    sortBy: sortBy,
    showcompleted:
      showCompleted === "completed"
        ? "completed"
        : showCompleted === "incomplete"
        ? "incomplete"
        : "all",
    priority: priority,
  });
  const cacheKey = JSON.stringify({
    page: page,
    priority,
    showCompleted,
    sortBy,
  });

  console.log(data.data);
  if (data.error === "Unauthorized user") {
    redirect("/sign-in");
  }
  if (!data.data) {
    return (
      <div>
        No tasks found
        <Button>
          <Link href={"/dashboard/tasks/create-tasks"}>Create a new one</Link>
        </Button>
      </div>
    );
  }
  return (
    <div key={cacheKey} className="max-w-3xl mx-auto py-10">
      <header className="flex justify-between w-full">
        <h1 className="font-semibold text-2xl">Your Tasks</h1>

        <Link href={"/dashboard/tasks/create-tasks"}>
          <Button>Create a new task</Button>
        </Link>
      </header>
      <Datatable data={data.data}></Datatable>
    </div>
  );
};

export default page;
