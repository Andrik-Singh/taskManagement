import { getTasks } from "@/server/tasks/get"

const page = async() => {
  const res=await getTasks()
  return (
    null
  )
}

export default page