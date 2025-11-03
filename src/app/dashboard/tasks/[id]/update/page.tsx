import NewTasks from "@/components/tasks/create-new-tasks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTasks } from "@/server/tasks/get"
import { notFound } from "next/navigation"

const page = async({params}:{params:Promise<{
    id:string
}>}) => {
  const {id} =await params
  const res=await getTasks(id)
  const data=res.data?.data[0]
  if(!data){
    notFound()
  }
  console.log(data)
  return (
    <div>
        <Card className="md:w-2xl sm:w-xl w-xs mx-auto mt-10">
            <CardHeader>
                <CardTitle>
                    Update Task: {data.taskTitle}
                </CardTitle>
            </CardHeader>
            <CardContent>
              <NewTasks prevData={data}/>
            </CardContent>
        </Card>
    </div>
  )
}

export default page