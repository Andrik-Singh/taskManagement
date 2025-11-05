export const dynamic="force-dynamic"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { getName } from "@/server/auth";
import DeleteModal from "./DeleteModal";
import Link from "next/link";
import { Button } from "../ui/button";
import { getOrgName } from "@/server/organizations/get";
export const revalidate=0
interface Proptype {
  projectId: string;
  projectname: string;
  projectDescription: string;
  startDate: Date;
  dueDate: Date;
  projectResources: string | null;
  orgId: string | null;
  madeBy: string;
}
const ProjectCard = async ({ data }: { data: Proptype | null }) => {
  if (!data) {
    return <div>There was an error fetching data</div>;
  }
  const { success, error, name } = await getName(data.madeBy);
  const orgName=await getOrgName(data.orgId)
  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.projectname}</CardTitle>
        <CardDescription>{name}</CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <section className="space-y-4">
            <p>{data.projectDescription}</p>
            <div className="flex flex-row justify-between">
              <span>Start Date:{data.startDate.toLocaleDateString()}</span>
              <span>Due Date:{data.dueDate.toLocaleDateString()}</span>
            </div>
            <div>{orgName.name ?? "No organization"}</div>
          </section>
        </CardDescription>
      </CardContent>
      <CardFooter className="ml-auto space-x-4">
        <DeleteModal id={data.projectId}></DeleteModal>
        <Link href={`/dashboard/projects/${data.projectId}`}>
          <Button>
            View More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
