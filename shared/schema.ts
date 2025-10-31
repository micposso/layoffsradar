import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// WARN Notices Table
export const warnNotices = pgTable("warn_notices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  city: text("city").notNull(),
  workersAffected: integer("workers_affected").notNull(),
  filingDate: date("filing_date").notNull(),
  effectiveDate: date("effective_date"),
  industry: text("industry"),
  layoffType: text("layoff_type"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWarnNoticeSchema = createInsertSchema(warnNotices).omit({
  id: true,
  createdAt: true,
});

export type InsertWarnNotice = z.infer<typeof insertWarnNoticeSchema>;
export type WarnNotice = typeof warnNotices.$inferSelect;

// Email Subscribers Table
export const emailSubscribers = pgTable("email_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
});

export const insertEmailSubscriberSchema = createInsertSchema(emailSubscribers).omit({
  id: true,
  subscribedAt: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
});

export type InsertEmailSubscriber = z.infer<typeof insertEmailSubscriberSchema>;
export type EmailSubscriber = typeof emailSubscribers.$inferSelect;

// Users table (keeping existing for compatibility)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
