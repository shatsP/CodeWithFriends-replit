import { type User, type InsertUser, type WaitlistEmail, type InsertWaitlistEmail, users, waitlistEmails } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, count, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  addToWaitlist(waitlistEmail: InsertWaitlistEmail): Promise<WaitlistEmail>;
  getWaitlistEmail(email: string): Promise<WaitlistEmail | undefined>;
  getWaitlistCount(): Promise<number>;
  confirmEmail(token: string): Promise<WaitlistEmail | undefined>;
  getWaitlistEmailByToken(token: string): Promise<WaitlistEmail | undefined>;
  regenerateConfirmationToken(email: string): Promise<string>;
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
    const confirmationToken = randomUUID();
    const waitlistEmail: WaitlistEmail = { 
      ...insertWaitlistEmail, 
      id,
      createdAt: new Date(),
      confirmed: false,
      confirmationToken,
      confirmedAt: null
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

  async confirmEmail(token: string): Promise<WaitlistEmail | undefined> {
    for (const [email, waitlistEmail] of Array.from(this.waitlistEmails.entries())) {
      if (waitlistEmail.confirmationToken === token && !waitlistEmail.confirmed) {
        const confirmedEmail = {
          ...waitlistEmail,
          confirmed: true,
          confirmedAt: new Date(),
          confirmationToken: null // Invalidate token after use
        };
        this.waitlistEmails.set(email, confirmedEmail);
        return confirmedEmail;
      }
    }
    return undefined;
  }

  async getWaitlistEmailByToken(token: string): Promise<WaitlistEmail | undefined> {
    for (const waitlistEmail of Array.from(this.waitlistEmails.values())) {
      if (waitlistEmail.confirmationToken === token) {
        return waitlistEmail;
      }
    }
    return undefined;
  }

  async regenerateConfirmationToken(email: string): Promise<string> {
    const waitlistEmail = this.waitlistEmails.get(email);
    if (waitlistEmail) {
      const newToken = randomUUID();
      const updatedEmail = {
        ...waitlistEmail,
        confirmationToken: newToken
      };
      this.waitlistEmails.set(email, updatedEmail);
      return newToken;
    }
    throw new Error('Email not found');
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
    const confirmationToken = randomUUID();
    const [waitlistEmail] = await db
      .insert(waitlistEmails)
      .values({
        ...insertWaitlistEmail,
        confirmationToken,
        confirmed: false
      })
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

  async confirmEmail(token: string): Promise<WaitlistEmail | undefined> {
    const [updatedEmail] = await db
      .update(waitlistEmails)
      .set({
        confirmed: true,
        confirmedAt: new Date(),
        confirmationToken: null // Invalidate token after use
      })
      .where(and(eq(waitlistEmails.confirmationToken, token), eq(waitlistEmails.confirmed, false)))
      .returning();
    return updatedEmail || undefined;
  }

  async getWaitlistEmailByToken(token: string): Promise<WaitlistEmail | undefined> {
    const [waitlistEmail] = await db
      .select()
      .from(waitlistEmails)
      .where(eq(waitlistEmails.confirmationToken, token));
    return waitlistEmail || undefined;
  }

  async regenerateConfirmationToken(email: string): Promise<string> {
    const newToken = randomUUID();
    const [updatedEmail] = await db
      .update(waitlistEmails)
      .set({ confirmationToken: newToken })
      .where(eq(waitlistEmails.email, email))
      .returning();
    
    if (!updatedEmail) {
      throw new Error('Email not found');
    }
    
    return newToken;
  }
}

export const storage = new DatabaseStorage();
