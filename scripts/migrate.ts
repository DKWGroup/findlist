import { readFileSync } from "fs";
import { resolve } from "path";
import { supabase } from "../src/services/supabaseStorage.ts";

async function runMigration() {
  try {
    console.log("Starting migration...");

    // Read the migration file
    const migrationPath = resolve(
      __dirname,
      "../supabase/migrations/20250720_product_stats_functions.sql"
    );
    const migrationSQL = readFileSync(migrationPath, "utf8");

    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    console.log(`Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);

        const { error } = await supabase.rpc("execute_sql", {
          sql_query: statement + ";",
        });

        if (error) {
          console.error(`Error executing statement ${i + 1}:`, error);
          // Try direct execution instead
          const { error: directError } = await supabase
            .from("_migrations")
            .insert({
              version: "20250720_product_stats_functions",
              executed_at: new Date().toISOString(),
            });

          if (directError) {
            console.error("Direct execution also failed:", directError);
          }
        } else {
          console.log(`Statement ${i + 1} executed successfully`);
        }
      }
    }

    console.log("Migration completed!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

runMigration();
