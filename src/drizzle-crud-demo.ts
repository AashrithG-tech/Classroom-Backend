import { eq } from "drizzle-orm";
import { db, pool, demoUsers } from "./db";

async function main() {
    try {
        console.log("Performing CRUD operations...");

        // CREATE
        const [newUser] = await db
            .insert(demoUsers)
            .values({ name: "Admin User", email: "admin@example.com" })
            .returning();

        if (!newUser) {
            throw new Error("Failed to create user");
        }

        console.log("✅ CREATE: New user created:", newUser);

        // READ
        const found = await db
            .select()
            .from(demoUsers)
            .where(eq(demoUsers.id, newUser.id));

        console.log("✅ READ: Found user:", found[0]);

        // UPDATE
        const [updatedUser] = await db
            .update(demoUsers)
            .set({ name: "Super Admin" })
            .where(eq(demoUsers.id, newUser.id))
            .returning();

        if (!updatedUser) {
            throw new Error("Failed to update user");
        }

        console.log("✅ UPDATE: User updated:", updatedUser);

        // DELETE
        await db
            .delete(demoUsers)
            .where(eq(demoUsers.id, newUser.id));

        console.log("✅ DELETE: User deleted.");
        console.log("\nCRUD operations completed successfully.");
    } catch (error) {
        console.error("❌ Error performing CRUD operations:", error);
        process.exitCode = 1;
    } finally {
        if (pool && typeof (pool as any).end === "function") {
            await (pool as any).end();
            console.log("Database pool closed.");
        }
    }
}

main();
