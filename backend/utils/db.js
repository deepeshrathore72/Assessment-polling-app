// Initializes and exports a singleton Prisma client and a connect helper.
import 'dotenv/config';
import { PrismaClient } from "@prisma/client";

const maskDatabaseUrl = (url) => {
    if (!url) return '<empty>';
    try {
        // mask password portion (between : and @)
        return url.replace(/(:\/\/[^:]+:)([^@]+)(@)/, (m, p1, p2, p3) => `${p1}****${p3}`);
    } catch {
        return url;
    }
};

console.log('Using DATABASE_URL:', maskDatabaseUrl(process.env.DATABASE_URL));

export const prisma = new PrismaClient();

export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("PostgreSQL connected via Prisma");
    } catch (error) {
        console.error("Prisma connection error:", error);
        // keep process alive for easier diagnostics when running locally
        // (caller can exit if desired)
        // process.exit(1);
    }
};
