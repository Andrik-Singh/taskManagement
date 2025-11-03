// generate-erd.ts
import { generateErd } from "drizzle-erd";
import * as schema from "./schema"; // Add .ts extension
import { writeFileSync } from "fs";

async function generate() {
  const result = await generateErd({ schema });
  writeFileSync("ERD.svg", result.svg);
  console.log("ERD generated successfully!");
}

generate().catch(console.error);