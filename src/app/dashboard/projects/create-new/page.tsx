import ProjectForm from "@/components/projects/create-new-projects"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const CreateNewProject = () => {
  return (
    <div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            Create a new project
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm></ProjectForm>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateNewProject