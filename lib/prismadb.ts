import { PrismaClient } from "@prisma/client";

// Declare a global variable for the Prisma Client
declare global {
  const prisma: PrismaClient | undefined; // Use 'var' for global scope
}

// Create an instance of the Prisma Client
const client = global.prisma || new PrismaClient();

// If in development mode, assign the client to the global variable
if (process.env.NODE_ENV !== "production") {
  global.prisma = client; // This will prevent new instances in development
}

// Export the Prisma Client instance
export default client;
