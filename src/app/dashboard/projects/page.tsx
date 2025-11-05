import ProjectCard from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { getAllProjects } from "@/server/projects/get";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
  const res = await getAllProjects();
  console.log(res);
  if (res.error === "Unauthorized user") {
    redirect("/sign-in");
  }
  const data: {
    projectTask: {
      projectId: string;
      projectname: string;
      projectDescription: string;
      startDate: Date;
      dueDate: Date;
      projectResources: string | null;
      orgId: string | null;
      madeBy: string;
    } | null;
    projectMembers: {
      projectId: string | null;
      memberId: string | null;
      memberDescription: string | null;
    };
  }[] = res.data ?? [];
  return (
    <div className="sm:px-10 px-0 mt-5">
      <section className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link href={"/dashboard/projects/create-new"}>
          <Button>Create a new project</Button>
        </Link>
      </section>
      {data.length === 0 ? (
        <div>No project create new</div>
      ) : (
        <section className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-5 gap-5">
          {data?.map((data) => (
            <ProjectCard
              data={data.projectTask}
              key={data.projectMembers.projectId}
            ></ProjectCard>
          ))}
        </section>
      )}
    </div>
  );
};

export default Page;
