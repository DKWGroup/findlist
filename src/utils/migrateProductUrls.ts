// Migration utility to update existing products with new URL system

import { supabase } from "../services/supabaseStorage";
import { generateUrlSlugForProduct } from "../utils/productUrlUtils";

/**
 * Migrate existing products to use the new URL system
 * This will update products that don't have proper url_alias values
 */
export const migrateProductUrls = async (): Promise<{
  success: boolean;
  migrated: number;
  errors: string[];
}> => {
  const errors: string[] = [];
  let migrated = 0;

  try {
    console.log("🔄 Starting product URL migration...");

    // Fetch all products that need URL migration
    const { data: products, error: fetchError } = await supabase
      .from("products")
      .select("id, title, code, url_alias")
      .or('url_alias.is.null,url_alias.eq.""');

    if (fetchError) {
      throw new Error(`Failed to fetch products: ${fetchError.message}`);
    }

    if (!products || products.length === 0) {
      console.log("✅ No products need migration");
      return { success: true, migrated: 0, errors: [] };
    }

    console.log(`📦 Found ${products.length} products to migrate`);

    // Process each product
    for (const product of products) {
      try {
        // Generate new URL alias from title
        const newAlias = generateUrlSlugForProduct(product.title);

        // Update the product
        const { error: updateError } = await supabase
          .from("products")
          .update({ url_alias: newAlias })
          .eq("id", product.id);

        if (updateError) {
          errors.push(
            `Failed to update product ${product.id}: ${updateError.message}`
          );
          continue;
        }

        migrated++;
        console.log(`✅ Migrated product: ${product.title} -> ${newAlias}`);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        errors.push(`Failed to process product ${product.id}: ${errorMessage}`);
      }
    }

    console.log(
      `🎉 Migration completed: ${migrated} products migrated, ${errors.length} errors`
    );

    return {
      success: errors.length === 0,
      migrated,
      errors,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Migration failed:", errorMessage);

    return {
      success: false,
      migrated,
      errors: [errorMessage, ...errors],
    };
  }
};

/**
 * Validate that all products have proper URLs
 */
export const validateProductUrls = async (): Promise<{
  valid: boolean;
  issues: string[];
}> => {
  const issues: string[] = [];

  try {
    // Check for products without url_alias
    const { data: productsWithoutAlias, error: aliasError } = await supabase
      .from("products")
      .select("id, title")
      .or('url_alias.is.null,url_alias.eq.""');

    if (aliasError) {
      issues.push(`Error checking url_alias: ${aliasError.message}`);
    } else if (productsWithoutAlias && productsWithoutAlias.length > 0) {
      issues.push(`${productsWithoutAlias.length} products missing url_alias`);
    }

    // Check for products without code
    const { data: productsWithoutCode, error: codeError } = await supabase
      .from("products")
      .select("id, title")
      .or('code.is.null,code.eq.""');

    if (codeError) {
      issues.push(`Error checking codes: ${codeError.message}`);
    } else if (productsWithoutCode && productsWithoutCode.length > 0) {
      issues.push(`${productsWithoutCode.length} products missing code`);
    }

    // Check for duplicate url_alias
    const { data: aliasConflicts, error: conflictError } = await supabase.rpc(
      "check_duplicate_url_aliases"
    );

    if (conflictError) {
      issues.push(
        `Error checking for duplicate aliases: ${conflictError.message}`
      );
    } else if (aliasConflicts && aliasConflicts.length > 0) {
      issues.push(`Found ${aliasConflicts.length} duplicate url_alias values`);
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      valid: false,
      issues: [`Validation failed: ${errorMessage}`],
    };
  }
};

/**
 * Run a complete migration and validation
 */
export const runCompleteMigration = async (): Promise<void> => {
  console.log("🚀 Starting complete product URL migration...");

  // Step 1: Validate current state
  console.log("1️⃣ Validating current state...");
  const validation = await validateProductUrls();
  if (!validation.valid) {
    console.log("⚠️ Found issues before migration:", validation.issues);
  }

  // Step 2: Run migration
  console.log("2️⃣ Running migration...");
  const migration = await migrateProductUrls();

  if (migration.success) {
    console.log(
      `✅ Migration successful: ${migration.migrated} products updated`
    );
  } else {
    console.log(`❌ Migration completed with errors:`, migration.errors);
  }

  // Step 3: Validate after migration
  console.log("3️⃣ Validating after migration...");
  const postValidation = await validateProductUrls();
  if (postValidation.valid) {
    console.log("✅ All validations passed");
  } else {
    console.log("⚠️ Still have issues after migration:", postValidation.issues);
  }
};
