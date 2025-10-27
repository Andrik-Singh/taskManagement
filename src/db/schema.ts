import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  index,
  uniqueIndex,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
export const priorityEnum = pgEnum("priorityEnum", ["Low", "Medium", "High"]);
export const roleEnum = pgEnum("roleEnum", ["user", "admin", "owner"]);
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    taskTitle: text("taskTitle").notNull(),
    taskDescription: text("taskDescription").notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").$onUpdate(() => new Date()),
    dueDate: timestamp("dueDate"),
    repeatDaily: boolean("repeatDaily"),
    completed: boolean("completed").default(false),
    priority: priorityEnum("priority").notNull(),
    assigneId: text("assigneeId")
      .references(() => user.id)
      .notNull(),
    projectId: text("projectId").references(() => projects.projectId,{
      onDelete:"cascade"
    }),
    extraResources: text("extraResources"),
  },
  (table) => ({
    prioritIndex: index("prioritIndex").on(
      table.assigneId,
      table.completed,
      table.priority
    ),
    assigneIdIndex: index("assigneIdIndex").on(table.assigneId),
    orgIndex: index("orgIndex").on(table.projectId),
  })
);
export const completedTask = pgTable(
  "completedTask",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    taskTitle: text("taskTitle").notNull(),
    taskDescription: text("taskDescription").notNull(),
    completedAt: timestamp("completedAt").defaultNow(),
    dueDate: timestamp("dueDate"),
    assigneId: text("assigneId")
      .references(() => user.id)
      .notNull(),
    priority: priorityEnum("priority").notNull(),
  },
  (table) => ({
    CompletedassigneId: index("assigneId").on(table.assigneId),
  })
);
export const organization = pgTable("organization", {
  orgId: uuid("orgId").primaryKey().defaultRandom(),
  owner: text("ownerId").references(() => user.id),
  organizationName: text("organizationName").notNull(),
  crearedAt: timestamp("createdAt").notNull(),
});
export const organizationMembers = pgTable(
  "organizationMembers",
  {
    orgId: text("orgId")
      .references(() => organization.orgId, { onDelete: "cascade" })
      .notNull(),
    userId: text("userId")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    joinedAt: timestamp("joinedAt").defaultNow(),
    role: text("role").notNull(),
    memberDescription: text("memberDescription").notNull(),
  },
  (table) => ({
    primaryKey: primaryKey({ columns: [table.orgId, table.userId] }),
  })
);
export const projects = pgTable("projectTask", {
  projectId: uuid().primaryKey().defaultRandom(),
  projectame: text("projectName").notNull(),
  projectDescription: text("projectDescription").notNull(),
  startDate: timestamp("startDate").notNull(),
  dueDate: timestamp("dueDate").notNull(),
  projectResources: text("projectResources"),
  orgId: text("orgId").references(() => organization.orgId, {
    onDelete: "cascade",
  }),
  madeBy: text("madeBy")
    .references(() => user.id)
    .notNull(),
},(table)=>({
  projectOrgId:index("projectOrgId").on(table.orgId)
}));
export const completedProjects = pgTable("completedProjects", {
  completedProjectId: uuid("completedProjectId").primaryKey().defaultRandom(),
  completedProjectame: text("completedProjectame").notNull(),
  completedProjectDescription: text("completedProjectDescription").notNull(),
  projetCompletedAt: timestamp("projetCompletedAt").defaultNow(),
  orgId: text("orgId").references(() => organization.orgId, {
    onDelete: "cascade",
  }),
  madeBy: text("madeBy")
    .references(() => user.id)
    .notNull(),
});
export const inviteeTable=pgTable("inviteeTable",{
  inviteeId:uuid("inviteeId").primaryKey().defaultRandom(),
  token:text("token").unique(),
  createdBy:text("createdBy").references(()=>user.id).notNull(),
  orgId:text("orgId").references(()=>organization.orgId).notNull(),
  createdAt:timestamp("createdAt").defaultNow().notNull(),
  expiresAt:timestamp("expiresAt").notNull(),
})