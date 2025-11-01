// Storage interface and implementation - adapted from javascript_database blueprint
import { 
  users, 
  warnNotices,
  companies,
  emailSubscribers,
  type User, 
  type UpsertUser,
  type WarnNotice,
  type InsertWarnNotice,
  type EmailSubscriber,
  type InsertEmailSubscriber,
  type Company,
  type InsertCompany
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, inArray, sql } from "drizzle-orm";

// Extended type that includes company information
export type WarnNoticeWithCompany = WarnNotice & {
  company?: Company | null;
};

export type WarnNoticeFilters = {
  dateFrom?: string;
  dateTo?: string;
  industries?: string[];
  minWorkers?: number;
  maxWorkers?: number;
};

export interface IStorage {
  // User methods - Required for Replit Auth (blueprint:javascript_log_in_with_replit)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // WARN Notice methods
  getAllWarnNotices(): Promise<WarnNoticeWithCompany[]>;
  getFilteredWarnNotices(filters: WarnNoticeFilters): Promise<WarnNoticeWithCompany[]>;
  getWarnNoticesByState(state: string): Promise<WarnNoticeWithCompany[]>;
  getWarnNoticesByCompany(companyName: string): Promise<WarnNoticeWithCompany[]>;
  getWarnNoticeById(id: string): Promise<WarnNotice | undefined>;
  createWarnNotice(notice: InsertWarnNotice): Promise<WarnNotice>;
  getUniqueCompanies(): Promise<string[]>;

  // Company methods
  getCompanyBySlug(slug: string): Promise<Company | undefined>;
  getOrCreateCompany(name: string, industry?: string): Promise<Company>;

  // Email Subscriber methods
  createEmailSubscriber(subscriber: InsertEmailSubscriber): Promise<EmailSubscriber>;
  getEmailSubscriberByEmail(email: string): Promise<EmailSubscriber | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods - Required for Replit Auth (blueprint:javascript_log_in_with_replit)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // WARN Notice methods
  async getAllWarnNotices(): Promise<WarnNoticeWithCompany[]> {
    const results = await db
      .select({
        notice: warnNotices,
        company: companies,
      })
      .from(warnNotices)
      .leftJoin(companies, eq(warnNotices.companyId, companies.id))
      .orderBy(desc(warnNotices.filingDate));

    return results.map(({ notice, company }) => ({
      ...notice,
      company,
    }));
  }

  async getFilteredWarnNotices(filters: WarnNoticeFilters): Promise<WarnNoticeWithCompany[]> {
    const conditions = [];

    if (filters.dateFrom) {
      conditions.push(gte(warnNotices.filingDate, filters.dateFrom));
    }

    if (filters.dateTo) {
      conditions.push(lte(warnNotices.filingDate, filters.dateTo));
    }

    if (filters.industries && filters.industries.length > 0) {
      conditions.push(inArray(warnNotices.industry, filters.industries));
    }

    if (filters.minWorkers !== undefined) {
      conditions.push(gte(warnNotices.workersAffected, filters.minWorkers));
    }

    if (filters.maxWorkers !== undefined) {
      conditions.push(lte(warnNotices.workersAffected, filters.maxWorkers));
    }

    if (conditions.length === 0) {
      return await this.getAllWarnNotices();
    }

    const results = await db
      .select({
        notice: warnNotices,
        company: companies,
      })
      .from(warnNotices)
      .leftJoin(companies, eq(warnNotices.companyId, companies.id))
      .where(and(...conditions))
      .orderBy(desc(warnNotices.filingDate));

    return results.map(({ notice, company }) => ({
      ...notice,
      company,
    }));
  }

  async getWarnNoticesByState(state: string): Promise<WarnNoticeWithCompany[]> {
    const results = await db
      .select({
        notice: warnNotices,
        company: companies,
      })
      .from(warnNotices)
      .leftJoin(companies, eq(warnNotices.companyId, companies.id))
      .where(eq(warnNotices.state, state))
      .orderBy(desc(warnNotices.filingDate));

    return results.map(({ notice, company }) => ({
      ...notice,
      company,
    }));
  }

  async getWarnNoticeById(id: string): Promise<WarnNotice | undefined> {
    const [notice] = await db.select().from(warnNotices).where(eq(warnNotices.id, id));
    return notice || undefined;
  }

  async getWarnNoticesByCompany(companyName: string): Promise<WarnNoticeWithCompany[]> {
    const results = await db
      .select({
        notice: warnNotices,
        company: companies,
      })
      .from(warnNotices)
      .leftJoin(companies, eq(warnNotices.companyId, companies.id))
      .where(eq(warnNotices.companyName, companyName))
      .orderBy(desc(warnNotices.filingDate));

    return results.map(({ notice, company }) => ({
      ...notice,
      company,
    }));
  }

  async createWarnNotice(insertNotice: InsertWarnNotice): Promise<WarnNotice> {
    const [notice] = await db
      .insert(warnNotices)
      .values(insertNotice)
      .returning();
    return notice;
  }

  async getUniqueCompanies(): Promise<string[]> {
    const result = await db
      .selectDistinct({ companyName: warnNotices.companyName })
      .from(warnNotices)
      .orderBy(warnNotices.companyName);
    
    return result.map(r => r.companyName);
  }

  // Email Subscriber methods
  async createEmailSubscriber(insertSubscriber: InsertEmailSubscriber): Promise<EmailSubscriber> {
    const [subscriber] = await db
      .insert(emailSubscribers)
      .values(insertSubscriber)
      .returning();
    return subscriber;
  }

  async getEmailSubscriberByEmail(email: string): Promise<EmailSubscriber | undefined> {
    const [subscriber] = await db
      .select()
      .from(emailSubscribers)
      .where(eq(emailSubscribers.email, email));
    return subscriber || undefined;
  }

  // Company methods
  async getCompanyBySlug(slug: string): Promise<Company | undefined> {
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.slug, slug));
    return company || undefined;
  }

  async getOrCreateCompany(name: string, industry?: string): Promise<Company> {
    // Generate slug from company name
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Check if company already exists
    const existing = await this.getCompanyBySlug(slug);
    if (existing) {
      return existing;
    }

    // Create new company
    const [company] = await db
      .insert(companies)
      .values({
        name,
        slug,
        logoUrl: null,
        headquarters: null,
        industry: industry || null,
      })
      .returning();

    return company;
  }
}

export const storage = new DatabaseStorage();
