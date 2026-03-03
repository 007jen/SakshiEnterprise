import 'dotenv/config'; // 1. CRITICAL: Loads your .env variables
import { defineConfig } from '@prisma/config';

export default defineConfig({
    schema: './prisma/schema.prisma', // 2. Tells Prisma where your models are
    engine: 'classic',               // Keeps using Rust engines in v6.18+
    datasource: {
        url: process.env.DATABASE_URL!, // '!' handles the TS string error
    },
});
