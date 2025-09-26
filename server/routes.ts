import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistEmailSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Add email to waitlist
  app.post("/api/waitlist", async (req, res) => {
    try {
      const validatedData = insertWaitlistEmailSchema.parse(req.body);
      
      // Check if email already exists
      const existingEmail = await storage.getWaitlistEmail(validatedData.email);
      if (existingEmail) {
        return res.status(409).json({ 
          message: "Email already registered for waitlist" 
        });
      }

      const waitlistEmail = await storage.addToWaitlist(validatedData);
      res.status(201).json({ 
        message: "Successfully added to waitlist",
        email: waitlistEmail.email 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: error.errors[0]?.message || "Invalid email format" 
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get waitlist count
  app.get("/api/waitlist/count", async (req, res) => {
    try {
      const count = await storage.getWaitlistCount();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
