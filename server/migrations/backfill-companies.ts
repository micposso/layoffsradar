import { db } from "../db";
import { companies, warnNotices } from "@shared/schema";
import { sql } from "drizzle-orm";

// Generate a URL-friendly slug from company name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
    .trim();
}

export async function backfillCompanies() {
  console.log("Starting company backfill migration...");

  try {
    // Get distinct company names from warn_notices
    const distinctCompanies = await db
      .selectDistinct({
        name: warnNotices.companyName,
      })
      .from(warnNotices);

    console.log(`Found ${distinctCompanies.length} distinct companies`);

    // Insert companies into the companies table
    for (const company of distinctCompanies) {
      const slug = generateSlug(company.name);
      
      // Check if company already exists
      const existing = await db
        .select()
        .from(companies)
        .where(sql`${companies.slug} = ${slug}`)
        .limit(1);

      if (existing.length === 0) {
        await db.insert(companies).values({
          name: company.name,
          slug: slug,
          logoUrl: null,
          headquarters: null,
          industry: null,
        });
        console.log(`Created company: ${company.name} (${slug})`);
      } else {
        console.log(`Company already exists: ${company.name}`);
      }
    }

    // Link warn_notices to companies by matching normalized slugs
    console.log("Linking warn_notices to companies...");
    
    const allCompanies = await db.select().from(companies);
    const allNotices = await db.select().from(warnNotices);
    
    let linkedCount = 0;
    for (const notice of allNotices) {
      const noticeSlug = generateSlug(notice.companyName);
      
      // Find the company with matching slug
      const matchingCompany = allCompanies.find(c => c.slug === noticeSlug);
      
      if (matchingCompany) {
        await db
          .update(warnNotices)
          .set({ companyId: matchingCompany.id })
          .where(sql`${warnNotices.id} = ${notice.id}`);
        linkedCount++;
      } else {
        console.warn(`No company found for notice: ${notice.companyName} (slug: ${noticeSlug})`);
      }
    }
    
    console.log(`Linked ${linkedCount} out of ${allNotices.length} notices to companies`);

    console.log("Company backfill migration completed successfully!");
  } catch (error) {
    console.error("Error during company backfill:", error);
    throw error;
  }
}

// Run migration
backfillCompanies()
  .then(() => {
    console.log("Migration completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
