import ProjectForm from "@/components/projects/create-new-projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProject } from "@/server/projects/get";
import { IProjectSchema } from "@/zod/projects";

const UpdateProject = async ({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await params;
  const res = await getProject(id);
  if (!res.success || !res.data) {
    return(
        <div>{res.error}</div>
    )
  }
  const propData: IProjectSchema = {
    title: res.data.projectname,
    description: res.data.projectDescription,
    startDate: res.data.startDate,
    dueDate: res.data.dueDate,
  };
  return (
    <div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Update project: {res.data?.projectname}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm id={res.data.projectId} prevData={propData}></ProjectForm>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateProject;
