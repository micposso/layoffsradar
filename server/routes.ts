import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWarnNoticeSchema, insertEmailSubscriberSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all WARN notices
  app.get("/api/notices", async (req, res) => {
    try {
      const notices = await storage.getAllWarnNotices();
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

  const httpServer = createServer(app);

  return httpServer;
}
