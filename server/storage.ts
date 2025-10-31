// Storage interface and implementation - adapted from javascript_database blueprint
import { 
  users, 
  warnNotices, 
  emailSubscribers,
  type User, 
  type InsertUser,
  type WarnNotice,
  type InsertWarnNotice,
  type EmailSubscriber,
  type InsertEmailSubscriber
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User methods (keeping for compatibility)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // WARN Notice methods
  getAllWarnNotices(): Promise<WarnNotice[]>;
  getWarnNoticesByState(state: string): Promise<WarnNotice[]>;
  getWarnNoticeById(id: string): Promise<WarnNotice | undefined>;
  createWarnNotice(notice: InsertWarnNotice): Promise<WarnNotice>;

  // Email Subscriber methods
  createEmailSubscriber(subscriber: InsertEmailSubscriber): Promise<EmailSubscriber>;
  getEmailSubscriberByEmail(email: string): Promise<EmailSubscriber | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // WARN Notice methods
  async getAllWarnNotices(): Promise<WarnNotice[]> {
    return await db.select().from(warnNotices).orderBy(desc(warnNotices.filingDate));
  }

  async getWarnNoticesByState(state: string): Promise<WarnNotice[]> {
    return await db
      .select()
      .from(warnNotices)
      .where(eq(warnNotices.state, state))
      .orderBy(desc(warnNotices.filingDate));
  }

  async getWarnNoticeById(id: string): Promise<WarnNotice | undefined> {
    const [notice] = await db.select().from(warnNotices).where(eq(warnNotices.id, id));
    return notice || undefined;
  }

  async createWarnNotice(insertNotice: InsertWarnNotice): Promise<WarnNotice> {
    const [notice] = await db
      .insert(warnNotices)
      .values(insertNotice)
      .returning();
    return notice;
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
}

export const storage = new DatabaseStorage();
