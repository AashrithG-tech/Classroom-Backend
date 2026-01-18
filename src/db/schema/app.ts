import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* reusable timestamps */
const timestamps = {
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
};

/* departments table */
export const departments = pgTable("departments", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    code: varchar("code", { length: 200 }).notNull().unique(),
    name: varchar("name", { length: 200 }).notNull(),
    description: varchar("description", { length: 300 }),
    ...timestamps,
});

/* subjects table */
export const subjects = pgTable("subjects", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    departmentId: integer("department_id")
        .notNull()
        .references(() => departments.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 200 }).notNull(),
    code: varchar("code", { length: 200 }).notNull().unique(),
    description: varchar("description", { length: 300 }),
    ...timestamps,
});

/* relations */
export const departmentRelations = relations(departments, ({ many }) => ({
    subjects: many(subjects),
}));

export const subjectRelations = relations(subjects, ({ one }) => ({
    department: one(departments, {
        fields: [subjects.departmentId],
        references: [departments.id],
    }),
}));

/* types */
export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;

export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;
