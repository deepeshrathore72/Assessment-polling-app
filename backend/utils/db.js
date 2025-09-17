// Initializes and exports a singleton Prisma client and a connect helper.
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("PostgreSQL connected via Prisma");
    } catch (error) {
        console.error("Prisma connection error:", error);
        process.exit(1);
    }
};