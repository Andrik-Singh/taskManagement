import { getTasksBasedOnProject } from "@/server/projects/get"

const TasksSection = async({projectId}: {projectId: string}) => {
  const res=await getTasksBasedOnProject(projectId)
  console.log(res)
  return (
    <div>TasksSection</div>
  )
}

export default TasksSection