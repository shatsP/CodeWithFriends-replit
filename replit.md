# Overview

This is a full-stack web application built with React frontend and Express.js backend, featuring a modern tech stack with TypeScript, Tailwind CSS, and shadcn/ui components. The application appears to be a landing page with waitlist functionality, designed with a dark theme and modern UI components. The project uses Drizzle ORM for database operations with PostgreSQL and includes comprehensive form handling, state management, and responsive design.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React SPA**: Single-page application using React 18 with TypeScript
- **Routing**: Client-side routing implemented with Wouter library
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system and CSS variables for theming
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Server Framework**: Express.js with TypeScript for RESTful API endpoints
- **Database Layer**: Drizzle ORM with PostgreSQL database using Neon serverless driver
- **Schema Validation**: Zod schemas shared between frontend and backend for type safety
- **Storage Pattern**: Abstract storage interface with in-memory implementation for development
- **Middleware**: Express middleware for JSON parsing, URL encoding, and request logging

## Data Storage
- **Primary Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Database schemas defined in shared TypeScript files
- **Tables**: User management and waitlist email collection
- **Migrations**: Drizzle Kit for database schema migrations

## Development Setup
- **Monorepo Structure**: Shared code between client and server with TypeScript path mapping
- **Development Server**: Vite dev server with Express backend integration
- **Hot Reloading**: Development environment with hot module replacement
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared utilities

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL database provider via `@neondatabase/serverless`
- **Connection Pooling**: PostgreSQL connection management through Neon's serverless driver

## UI and Styling
- **Radix UI**: Headless UI component library for accessible, unstyled components
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **shadcn/ui**: Pre-built component library with consistent design patterns
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Replit Integration**: Development environment plugins for Replit platform
- **PostCSS**: CSS processing with Autoprefixer for browser compatibility
- **ESBuild**: Fast JavaScript bundler for production builds

## Form and Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation library
- **Hookform Resolvers**: Integration between React Hook Form and Zod validation

## Utility Libraries
- **Date-fns**: Modern date utility library for date manipulation
- **clsx & Tailwind Merge**: Utility libraries for conditional CSS class handling
- **Class Variance Authority**: Type-safe variant handling for component styling