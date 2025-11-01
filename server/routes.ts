import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { parse } from "csv-parse/sync";
import { storage } from "./storage";
import { insertWarnNoticeSchema, insertEmailSubscriberSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all WARN notices (with optional filters)
  app.get("/api/notices", async (req, res) => {
    try {
      const { dateFrom, dateTo, industries, minWorkers, maxWorkers } = req.query;

      const filters: any = {};

      if (dateFrom && typeof dateFrom === "string") {
        filters.dateFrom = dateFrom;
      }

      if (dateTo && typeof dateTo === "string") {
        filters.dateTo = dateTo;
      }

      if (industries) {
        filters.industries = Array.isArray(industries) ? industries : [industries];
      }

      if (minWorkers && typeof minWorkers === "string") {
        filters.minWorkers = parseInt(minWorkers, 10);
      }

      if (maxWorkers && typeof maxWorkers === "string") {
        filters.maxWorkers = parseInt(maxWorkers, 10);
      }

      const hasFilters = Object.keys(filters).length > 0;
      const notices = hasFilters
        ? await storage.getFilteredWarnNotices(filters)
        : await storage.getAllWarnNotices();

      res.json(notices);
    } catch (error) {
      console.error("Error fetching notices:", error);
      res.status(500).json({ message: "Failed to fetch WARN notices" });
    }
  });

  // Get WARN notices by state
  app.get("/api/notices/:state", async (req, res) => {
    try {
      const { state } = req.params;
      const notices = await storage.getWarnNoticesByState(state.toUpperCase());
      res.json(notices);
    } catch (error) {
      console.error("Error fetching notices by state:", error);
      res.status(500).json({ message: "Failed to fetch notices for state" });
    }
  });

  // Create a new WARN notice
  app.post("/api/notices", async (req, res) => {
    try {
      const validatedData = insertWarnNoticeSchema.parse(req.body);
      const notice = await storage.createWarnNotice(validatedData);
      res.status(201).json(notice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Error creating notice:", error);
        res.status(500).json({ message: "Failed to create WARN notice" });
      }
    }
  });

  // Subscribe to email notifications
  app.post("/api/subscribers", async (req, res) => {
    try {
      const validatedData = insertEmailSubscriberSchema.parse(req.body);
      
      // Check if email already exists
      const existing = await storage.getEmailSubscriberByEmail(validatedData.email);
      if (existing) {
        return res.status(400).json({ message: "This email is already subscribed" });
      }

      const subscriber = await storage.createEmailSubscriber(validatedData);
      res.status(201).json(subscriber);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Error creating subscriber:", error);
        res.status(500).json({ message: "Failed to subscribe email" });
      }
    }
  });

  // Get statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const notices = await storage.getAllWarnNotices();
      
      const totalNotices = notices.length;
      const totalWorkers = notices.reduce((sum, n) => sum + n.workersAffected, 0);
      const uniqueStates = new Set(notices.map(n => n.state));
      const activeStates = uniqueStates.size;

      // Calculate this month's notices
      const now = new Date();
      const thisMonth = notices.filter(n => {
        const date = new Date(n.filingDate);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).length;

      res.json({
        totalNotices,
        totalWorkers,
        activeStates,
        recentIncrease: thisMonth,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Get all unique companies
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getUniqueCompanies();
      res.json(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  // Get notices by company
  app.get("/api/companies/:companyName", async (req, res) => {
    try {
      const { companyName } = req.params;
      const notices = await storage.getWarnNoticesByCompany(decodeURIComponent(companyName));
      res.json(notices);
    } catch (error) {
      console.error("Error fetching company notices:", error);
      res.status(500).json({ message: "Failed to fetch company notices" });
    }
  });

  // Get analytics data
  app.get("/api/analytics", async (req, res) => {
    try {
      const notices = await storage.getAllWarnNotices();

      // Group by month
      const monthlyData = notices.reduce((acc, notice) => {
        const date = new Date(notice.filingDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        
        if (!acc[monthKey]) {
          acc[monthKey] = { month: monthKey, notices: 0, workers: 0 };
        }
        acc[monthKey].notices++;
        acc[monthKey].workers += notice.workersAffected;
        return acc;
      }, {} as Record<string, { month: string; notices: number; workers: number }>);

      const timelineData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

      // Group by state (top 10)
      const stateData = notices.reduce((acc, notice) => {
        if (!acc[notice.state]) {
          acc[notice.state] = { state: notice.state, notices: 0, workers: 0 };
        }
        acc[notice.state].notices++;
        acc[notice.state].workers += notice.workersAffected;
        return acc;
      }, {} as Record<string, { state: string; notices: number; workers: number }>);

      const topStates = Object.values(stateData)
        .sort((a, b) => b.workers - a.workers)
        .slice(0, 10);

      // Group by industry
      const industryData = notices.reduce((acc, notice) => {
        const industry = notice.industry || "Unknown";
        if (!acc[industry]) {
          acc[industry] = { industry, count: 0, workers: 0 };
        }
        acc[industry].count++;
        acc[industry].workers += notice.workersAffected;
        return acc;
      }, {} as Record<string, { industry: string; count: number; workers: number }>);

      const industries = Object.values(industryData)
        .sort((a, b) => b.workers - a.workers);

      res.json({
        timeline: timelineData,
        byState: topStates,
        byIndustry: industries,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  // Import WARN notices from CSV
  app.post("/api/notices/import", upload.single("csv"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No CSV file uploaded" });
      }

      const csvContent = req.file.buffer.toString("utf-8");
      
      // Parse CSV
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      const results = {
        success: 0,
        failed: 0,
        duplicates: 0,
        errors: [] as Array<{ row: number; error: string }>,
      };

      // Get existing notices to check for duplicates
      const existingNotices = await storage.getAllWarnNotices();
      const existingKeys = new Set(
        existingNotices.map(n => 
          `${n.companyName.toLowerCase()}-${n.state}-${n.filingDate}`
        )
      );

      // Process each row
      for (let i = 0; i < records.length; i++) {
        const row = records[i] as any;
        const rowNum = i + 2; // +2 for header row and 1-indexed

        try {
          // Convert CSV row to notice object
          const noticeData = {
            companyName: row.companyName,
            state: row.state?.toUpperCase(),
            city: row.city,
            workersAffected: parseInt(row.workersAffected, 10),
            filingDate: row.filingDate,
            effectiveDate: row.effectiveDate || null,
            industry: row.industry || null,
            layoffType: row.layoffType || null,
          };

          // Validate with Zod schema
          const validated = insertWarnNoticeSchema.parse(noticeData);

          // Check for duplicate
          const duplicateKey = `${validated.companyName.toLowerCase()}-${validated.state}-${validated.filingDate}`;
          if (existingKeys.has(duplicateKey)) {
            results.duplicates++;
            continue;
          }

          // Insert the notice
          await storage.createWarnNotice(validated);
          existingKeys.add(duplicateKey); // Prevent duplicates within the same import
          results.success++;

        } catch (error) {
          results.failed++;
          if (error instanceof z.ZodError) {
            const validationError = fromZodError(error);
            results.errors.push({
              row: rowNum,
              error: validationError.message,
            });
          } else {
            results.errors.push({
              row: rowNum,
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        }
      }

      res.json(results);

    } catch (error) {
      console.error("Error importing CSV:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to import CSV file" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
