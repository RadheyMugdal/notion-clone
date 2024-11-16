import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import { loadEnvConfig } from '@next/env';
import { cwd } from "process";

loadEnvConfig(cwd());



export default defineConfig({
    dialect:"postgresql",
    schema:"./src/db/schema.ts",
    out:"./migrations",
    dbCredentials:{
        url:process.env.DATABASE_URL as string
    },
})