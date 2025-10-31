import { db } from "./db";
import { warnNotices } from "@shared/schema";

async function seed() {
  console.log("Seeding database with sample WARN notices...");

  const sampleNotices = [
    {
      companyName: "TechCorp Solutions",
      state: "CA",
      city: "San Francisco",
      workersAffected: 450,
      filingDate: "2024-10-15",
      effectiveDate: "2024-12-01",
      industry: "Technology",
      layoffType: "Permanent Closure",
    },
    {
      companyName: "Manufacturing Plus Inc",
      state: "TX",
      city: "Houston",
      workersAffected: 320,
      filingDate: "2024-10-20",
      effectiveDate: "2024-11-30",
      industry: "Manufacturing",
      layoffType: "Mass Layoff",
    },
    {
      companyName: "Retail Giants Corp",
      state: "NY",
      city: "New York",
      workersAffected: 275,
      filingDate: "2024-10-25",
      effectiveDate: "2025-01-15",
      industry: "Retail",
      layoffType: "Store Closure",
    },
    {
      companyName: "AutoParts Distribution",
      state: "MI",
      city: "Detroit",
      workersAffected: 180,
      filingDate: "2024-10-22",
      effectiveDate: "2024-12-15",
      industry: "Automotive",
      layoffType: "Permanent Closure",
    },
    {
      companyName: "Financial Services Group",
      state: "IL",
      city: "Chicago",
      workersAffected: 195,
      filingDate: "2024-10-18",
      effectiveDate: "2024-12-31",
      industry: "Finance",
      layoffType: "Reorganization",
    },
    {
      companyName: "Healthcare Systems LLC",
      state: "FL",
      city: "Miami",
      workersAffected: 240,
      filingDate: "2024-10-12",
      effectiveDate: "2024-11-20",
      industry: "Healthcare",
      layoffType: "Facility Closure",
    },
    {
      companyName: "Logistics Express",
      state: "WA",
      city: "Seattle",
      workersAffected: 310,
      filingDate: "2024-10-28",
      effectiveDate: "2025-01-05",
      industry: "Transportation",
      layoffType: "Mass Layoff",
    },
    {
      companyName: "Energy Solutions Corp",
      state: "PA",
      city: "Pittsburgh",
      workersAffected: 165,
      filingDate: "2024-10-10",
      effectiveDate: "2024-12-10",
      industry: "Energy",
      layoffType: "Permanent Closure",
    },
    {
      companyName: "Construction Builders Inc",
      state: "AZ",
      city: "Phoenix",
      workersAffected: 220,
      filingDate: "2024-10-16",
      effectiveDate: "2024-11-25",
      industry: "Construction",
      layoffType: "Project Completion",
    },
    {
      companyName: "Telecommunications Network",
      state: "GA",
      city: "Atlanta",
      workersAffected: 285,
      filingDate: "2024-10-08",
      effectiveDate: "2024-12-05",
      industry: "Telecommunications",
      layoffType: "Reorganization",
    },
    {
      companyName: "Food Processing Co",
      state: "OH",
      city: "Cleveland",
      workersAffected: 145,
      filingDate: "2024-10-14",
      effectiveDate: "2024-11-28",
      industry: "Food Processing",
      layoffType: "Permanent Closure",
    },
    {
      companyName: "Aerospace Components",
      state: "CA",
      city: "Los Angeles",
      workersAffected: 380,
      filingDate: "2024-10-19",
      effectiveDate: "2025-01-10",
      industry: "Aerospace",
      layoffType: "Contract Termination",
    },
    {
      companyName: "Chemical Industries Ltd",
      state: "NJ",
      city: "Newark",
      workersAffected: 205,
      filingDate: "2024-10-11",
      effectiveDate: "2024-12-20",
      industry: "Chemical",
      layoffType: "Permanent Closure",
    },
    {
      companyName: "Publishing House Media",
      state: "MA",
      city: "Boston",
      workersAffected: 125,
      filingDate: "2024-10-23",
      effectiveDate: "2024-12-15",
      industry: "Media",
      layoffType: "Reorganization",
    },
    {
      companyName: "Insurance Partners Group",
      state: "NC",
      city: "Charlotte",
      workersAffected: 170,
      filingDate: "2024-10-17",
      effectiveDate: "2024-12-01",
      industry: "Insurance",
      layoffType: "Merger",
    },
    {
      companyName: "Hospitality Services",
      state: "NV",
      city: "Las Vegas",
      workersAffected: 260,
      filingDate: "2024-10-21",
      effectiveDate: "2024-11-30",
      industry: "Hospitality",
      layoffType: "Permanent Closure",
    },
    {
      companyName: "Software Development Inc",
      state: "TX",
      city: "Austin",
      workersAffected: 155,
      filingDate: "2024-10-13",
      effectiveDate: "2024-12-08",
      industry: "Technology",
      layoffType: "Restructuring",
    },
    {
      companyName: "Pharmaceutical Research",
      state: "CT",
      city: "Hartford",
      workersAffected: 190,
      filingDate: "2024-10-09",
      effectiveDate: "2024-11-22",
      industry: "Pharmaceutical",
      layoffType: "Facility Closure",
    },
  ];

  try {
    for (const notice of sampleNotices) {
      await db.insert(warnNotices).values(notice);
    }
    console.log(`✓ Successfully seeded ${sampleNotices.length} WARN notices`);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("Seeding complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
