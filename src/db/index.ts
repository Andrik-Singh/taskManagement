import { drizzle } from 'drizzle-orm/neon-http';
if(!process.env.DATABASE_URL){
    throw new Error("No database connection is there")
}
export const db = drizzle(process.env.DATABASE_URL!);
