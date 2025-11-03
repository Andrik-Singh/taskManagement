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
  return (
    <div className="sm:px-10 px-0 mt-5">
      <section className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link href={"/dashboard/projects/create-new"}>
          <Button>Create a new project</Button>
        </Link>
      </section>
    </div>
  );
};

export default Page;
