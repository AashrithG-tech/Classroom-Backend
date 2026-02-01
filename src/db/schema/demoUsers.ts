import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const demoUsers = pgTable("demo_users", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 150 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow(),
});
