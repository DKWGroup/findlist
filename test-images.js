// Test script to check products and their images
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://thijvnpkoefkdpsricjb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoaWp2bnBrb2Vma2Rwc3JpY2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA3MTI2MjgsImV4cCI6MjAzNjI4ODYyOH0.mHhj5Y7hFKDrBHEDJZQNhz_UINiMfIqnhKAfKEoLJp8";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  try {
    console.log("🔍 Checking products in database...");

    // Get products count
    const { count: productCount, error: countError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("Error getting product count:", countError);
      return;
    }

    console.log(`📊 Total products: ${productCount}`);

    // Get first few products with their data
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, title, code")
      .limit(5);

    if (productsError) {
      console.error("Error getting products:", productsError);
      return;
    }

    console.log("📝 Sample products:");
    products.forEach((product) => {
      console.log(`  - ${product.title} (${product.code}) [ID: ${product.id}]`);
    });

    // Get images count
    const { count: imageCount, error: imageCountError } = await supabase
      .from("product_images")
      .select("*", { count: "exact", head: true });

    if (imageCountError) {
      console.error("Error getting image count:", imageCountError);
      return;
    }

    console.log(`🖼️ Total product images: ${imageCount}`);

    // Get sample images
    const { data: images, error: imagesError } = await supabase
      .from("product_images")
      .select("*")
      .limit(5);

    if (imagesError) {
      console.error("Error getting images:", imagesError);
      return;
    }

    console.log("🖼️ Sample images:");
    images.forEach((image) => {
      console.log(
        `  - ${image.url} (pos: ${image.position}) [Product: ${image.product_id}]`
      );
    });

    // Try to add sample images to first product if no images exist
    if (imageCount === 0 && products.length > 0) {
      console.log("🔧 Adding sample images to first product...");

      const firstProduct = products[0];
      const sampleImages = [
        "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg",
        "https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg",
      ];

      const imageRows = sampleImages.map((url, index) => ({
        product_id: firstProduct.id,
        url: url,
        position: index,
      }));

      const { error: insertError } = await supabase
        .from("product_images")
        .insert(imageRows);

      if (insertError) {
        console.error("Error inserting sample images:", insertError);
      } else {
        console.log(
          `✅ Added ${sampleImages.length} sample images to product: ${firstProduct.title}`
        );
      }
    }
  } catch (error) {
    console.error("General error:", error);
  }
}

checkDatabase();
