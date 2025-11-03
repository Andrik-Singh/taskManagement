"use server";

import { db } from "@/db";
import { organizationMembers, projects, tasks } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, asc, count, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";

type Filters = {
  page: number;
  sortBy: string;
  priority: "Low" | "Medium" | "High" | "all";
  showcompleted: string;
};

export async function getTasks(
  id?: string,
  {
    page = 1,
    sortBy = "createdAt.Desc",
    priority = "all",
    showcompleted = "all",
  }: Partial<Filters> = {}
) {
  try {
    const authData = await auth.api.getSession({
      headers: await headers(),
    });
    if (!authData) {
      return {
        success: false,
        error: "Unauthorized user",
        data: null,
      };
    }

    const { user } = authData;
    const orderClause =
      sortBy === "createdAt.Asc"
        ? asc(tasks.createdAt)
        : sortBy === "dueDate.Desc"
        ? desc(tasks.dueDate)
        : sortBy === "dueDate.Asc"
        ? asc(tasks.dueDate)
        : desc(tasks.createdAt);

    const conditions = [eq(tasks.assigneId, user.id)];

    if (id) {
      conditions.push(eq(tasks.id, id));
    }
    if (priority !== "all") {
      console.log(priority);
      conditions.push(eq(tasks.priority, priority));
    }
    if (showcompleted === "completed") {
      console.log(showcompleted);
      conditions.push(eq(tasks.completed, true));
    } else if (showcompleted === "incomplete") {
      conditions.push(eq(tasks.completed, false));
    }
    console.log(id);
    const res: ITasks[] = id
      ? await db
          .select({
            createdAt: tasks.createdAt,
            completed: tasks.completed,
            id: tasks.id,
            dueDate: tasks.dueDate,
            repeatDaily: tasks.repeatDaily,
            priority: tasks.priority,
            taskTitle: tasks.taskTitle,
            taskDescription: tasks.taskDescription,
            prjectId: tasks.projectId,
            completedAt: tasks.completedAt,
            completedNumberOfTimes: tasks.completedNumberOfTimes,
            assigneeId: tasks.assigneId,
          })
          .from(tasks)
          .where(eq(tasks.id, id))
      : await db
          .select({
            createdAt: tasks.createdAt,
            completed: tasks.completed,
            id: tasks.id,
            dueDate: tasks.dueDate,
            repeatDaily: tasks.repeatDaily,
            priority: tasks.priority,
            taskTitle: tasks.taskTitle,
          })
          .from(tasks)
          .where(and(...conditions))
          .limit(10)
          .offset(page * 10 - 10)
          .orderBy(orderClause);
    const countConditions = [eq(tasks.assigneId, user.id)];

    if (priority !== "all") {
      countConditions.push(eq(tasks.priority, priority));
    }

    if (showcompleted === "completed") {
      countConditions.push(eq(tasks.completed, true));
    } else if (showcompleted === "incomplete") {
      countConditions.push(eq(tasks.completed, false));
    }

    const totalPages = await db
      .select({
        count: count(tasks),
      })
      .from(tasks)
      .where(and(...countConditions));
    return {
      success: true,
      error: null,
      data: {
        data: res,
        totalPages: totalPages[0].count,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Internal server error occured",
      data: null,
    };
  }
}
export async function completedTask(
  object: {
    id: string;
    completed: boolean;
  }[]
) {
  try {
    const authData = await auth.api.getSession({
      headers: await headers(),
    });
    if (!authData) {
      return {
        success: false,
        error: "Unauthorized user",
      };
    }
    const { user } = authData;
    const successTasks = [];
    for (const data of object) {
      const res = await db.select().from(tasks).where(eq(tasks.id, data.id));
      const projId = res[0].projectId;
      if (!projId || res[0].assigneId === user.id) {
        if (res[0].repeatDaily) {
          if (data.completed) {
            await db
              .update(tasks)
              .set({
                completed: data.completed,
                completedNumberOfTimes: res[0].completedNumberOfTimes++,
              })
              .where(eq(tasks.id, data.id));
          } else {
            await db
              .update(tasks)
              .set({
                completed: data.completed,
                completedNumberOfTimes: res[0].completedNumberOfTimes--,
              })
              .where(eq(tasks.id, data.id));
          }
        } else {
          if (data.completed) {
            console.log("first");
            await db
              .update(tasks)
              .set({
                completed: data.completed,
                completedAt: new Date(),
              })
              .where(eq(tasks.id, data.id));
          } else {
            await db
              .update(tasks)
              .set({
                completed: data.completed,
                completedAt: null,
              })
              .where(eq(tasks.id, data.id));
          }
        }
        successTasks.push(res);
      }

      if (projId) {
        const projectRes = await db
          .select()
          .from(projects)
          .leftJoin(
            organizationMembers,
            eq(organizationMembers.orgId, projects.orgId)
          )
          .where(eq(projects.projectId, projId));
        console.log(projectRes);
        successTasks.push(projectRes);
      }
    }
    return {
      success: successTasks.length > 0,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Internal server error occured",
    };
  }
}
