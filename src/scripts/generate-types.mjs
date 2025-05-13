import { exec } from "child_process";

const projectId = process.env.SUPABASE_PROJECT_ID;

if (!projectId) {
  console.error("Error: Missing Supabase project ID. Provide it via .env file.");
  process.exit(1);
}

const command = `npx supabase gen types typescript --project-id ${projectId} --schema public > src/lib/supabase/database.types.ts`;

console.log("Generating Supabase types...");
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error during type generation: ${stderr || error.message}`);
    process.exit(1);
  }
  console.log(stdout || "Types generated successfully.");
});
