import { type User, type InsertUser, type WaitlistEmail, type InsertWaitlistEmail, users, waitlistEmails } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, count } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  addToWaitlist(waitlistEmail: InsertWaitlistEmail): Promise<WaitlistEmail>;
  getWaitlistEmail(email: string): Promise<WaitlistEmail | undefined>;
  getWaitlistCount(): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private waitlistEmails: Map<string, WaitlistEmail>;

  constructor() {
    this.users = new Map();
    this.waitlistEmails = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async addToWaitlist(insertWaitlistEmail: InsertWaitlistEmail): Promise<WaitlistEmail> {
    const id = randomUUID();
    const waitlistEmail: WaitlistEmail = { 
      ...insertWaitlistEmail, 
      id,
      createdAt: new Date()
    };
    this.waitlistEmails.set(waitlistEmail.email, waitlistEmail);
    return waitlistEmail;
  }

  async getWaitlistEmail(email: string): Promise<WaitlistEmail | undefined> {
    return this.waitlistEmails.get(email);
  }

  async getWaitlistCount(): Promise<number> {
    return this.waitlistEmails.size;
  }
}

export class DatabaseStorage implements IStorage {
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

  async addToWaitlist(insertWaitlistEmail: InsertWaitlistEmail): Promise<WaitlistEmail> {
    const [waitlistEmail] = await db
      .insert(waitlistEmails)
      .values(insertWaitlistEmail)
      .returning();
    return waitlistEmail;
  }

  async getWaitlistEmail(email: string): Promise<WaitlistEmail | undefined> {
    const [waitlistEmail] = await db
      .select()
      .from(waitlistEmails)
      .where(eq(waitlistEmails.email, email));
    return waitlistEmail || undefined;
  }

  async getWaitlistCount(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(waitlistEmails);
    return result.count;
  }
}

export const storage = new DatabaseStorage();
