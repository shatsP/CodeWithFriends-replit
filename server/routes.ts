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

  // Confirm email subscription
  app.post("/api/waitlist/confirm/:token", async (req, res) => {
    try {
      const { token } = req.params;
      
      if (!token) {
        return res.status(400).json({ 
          message: "Confirmation token is required" 
        });
      }

      const confirmed = await storage.confirmEmail(token);
      
      if (!confirmed) {
        return res.status(404).json({ 
          message: "Invalid or expired confirmation token" 
        });
      }

      res.json({ 
        message: "Email confirmed successfully",
        confirmed: true 
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Resend confirmation email
  app.post("/api/waitlist/resend-confirmation", async (req, res) => {
    try {
      // Validate request body with Zod
      const validatedData = z.object({ 
        email: z.string().email("Please enter a valid email address") 
      }).parse(req.body);

      const waitlistEntry = await storage.getWaitlistEmail(validatedData.email);
      
      if (!waitlistEntry) {
        return res.status(404).json({ 
          message: "Email not found in waitlist" 
        });
      }

      if (waitlistEntry.confirmed) {
        return res.status(400).json({ 
          message: "Email is already confirmed" 
        });
      }

      // Generate new confirmation token
      const newToken = await storage.regenerateConfirmationToken(validatedData.email);
      
      // In a real app, you would send the confirmation email here
      // For development/testing only, return the token
      const response: any = { message: "Confirmation email resent" };
      if (process.env.NODE_ENV === 'development') {
        response.token = newToken;
      }
      
      res.json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: error.errors[0]?.message || "Invalid email format" 
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
