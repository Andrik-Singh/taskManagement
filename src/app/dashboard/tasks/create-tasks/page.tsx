import NewTasks from "@/components/tasks/create-new-tasks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const page = () => {
  
  return (
    <div>
        <Card className="md:w-2xl sm:w-xl w-xs mx-auto mt-10">
            <CardHeader>
                <CardTitle>
                    Create a new task
                </CardTitle>
            </CardHeader>
            <CardContent>
              <NewTasks/>
            </CardContent>
        </Card>
    </div>
  )
}

export default page