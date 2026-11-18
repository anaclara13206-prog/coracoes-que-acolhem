import "dotenv/config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;
const caPath = process.env.DATABASE_CA_CERT;

if (!connectionString) {
  throw new Error("DATABASE_URL foi definida.");
}

if (!caPath) {
  throw new Error("DATABASE_CA_CERT foi definida.");
}

const ca = readFileSync(resolve(process.cwd(), caPath), "utf8");

const adapter = new PrismaPg({
  connectionString,
  ssl: {
    ca,
    rejectUnauthorized: true,
  },
});

const prisma = new PrismaClient({ adapter });

export default prisma;