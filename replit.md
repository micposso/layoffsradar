# WARN Layoff Tracker

## Overview

The WARN Layoff Tracker is a data-driven web application that aggregates and displays Worker Adjustment and Retraining Notification (WARN) Act notices across the United States. The platform provides real-time tracking of employment layoffs, company closures, and mass worker dislocations through an interactive map interface and searchable database.

The application serves as a civic technology tool, presenting sensitive employment data with professional clarity and trustworthiness. It enables users to browse layoff notices by state, search by company or location, and subscribe to email notifications for updates.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React 18+ with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation

**Design System:**
The application implements a professional, data-focused design inspired by civic tech platforms (ProPublica, The Markup, government data portals). The design emphasizes:
- Typography: Inter/IBM Plex Sans for readability, JetBrains Mono for numerical data
- Color scheme: Neutral base with professional, restrained palette
- Layout: Container-based with max-width constraints for optimal readability
- Components: Custom Shadcn/ui components configured for the "new-york" style variant

**Key Frontend Features:**
- Interactive US map visualization for state-level data aggregation
- Real-time notice cards with company information, worker counts, and dates
- Advanced filtering and search capabilities
- Email subscription form with client-side validation
- Responsive design with mobile-first approach

### Backend Architecture

**Technology Stack:**
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database ORM**: Drizzle ORM
- **Validation**: Zod schemas shared between client and server
- **Build Tool**: Vite for frontend, esbuild for backend

**API Design:**
RESTful API with the following endpoints:
- `GET /api/notices` - Retrieve all WARN notices
- `GET /api/notices/:state` - Retrieve notices filtered by state
- `POST /api/notices` - Create new WARN notice (with validation)
- `POST /api/subscribers` - Subscribe to email notifications

**Request/Response Pattern:**
- Request validation using Zod schemas from shared schema definitions
- Centralized error handling with appropriate HTTP status codes
- JSON responses with structured error messages
- Request logging middleware for API endpoints

### Data Storage

**Database Solution:**
- **Provider**: Neon (serverless PostgreSQL)
- **ORM**: Drizzle ORM with type-safe queries
- **Connection**: Connection pooling via @neondatabase/serverless with WebSocket support

**Schema Design:**

**WARN Notices Table:**
- Primary data entity storing layoff information
- Fields: company name, state (2-char code), city, workers affected, filing date, effective date, industry, layoff type
- UUID primary keys with automatic generation
- Date fields for temporal queries and sorting
- Created timestamp for tracking data freshness

**Email Subscribers Table:**
- Stores user subscriptions for notifications
- Email uniqueness constraint
- Subscription timestamp tracking
- Separate from notices for clean data separation

**Users Table:**
- Authentication support structure (currently minimal usage)
- Username/password fields with uniqueness constraints
- Maintains compatibility with potential future auth features

**Database Rationale:**
- Serverless PostgreSQL chosen for scalability and zero-maintenance
- Drizzle ORM provides type safety and schema-driven development
- Schema migrations managed via drizzle-kit
- Shared TypeScript types ensure consistency across stack

### External Dependencies

**Database Services:**
- **Neon Database**: Serverless PostgreSQL hosting
  - Environment variable: `DATABASE_URL`
  - Connection pooling and WebSocket support for serverless environments
  - Managed through Drizzle migrations

**UI Component Library:**
- **Radix UI**: Headless accessible component primitives
  - Provides 25+ accessible UI components (dialogs, dropdowns, forms, etc.)
  - Full keyboard navigation and ARIA compliance
- **Shadcn/ui**: Pre-configured Radix components with Tailwind styling
  - Custom configuration in `components.json`
  - "new-york" style variant with neutral color base

**Development Tools:**
- **Replit Plugins**: Runtime error modal, cartographer, dev banner (development only)
- **Vite**: Frontend build tool and dev server
  - HMR (Hot Module Replacement) integration
  - Middleware mode for Express integration

**Fonts:**
- **Google Fonts**: Inter, IBM Plex Sans, IBM Plex Mono, JetBrains Mono
  - Professional typography for data presentation
  - Preconnected for performance optimization

**Validation & Forms:**
- **Zod**: Schema validation library
  - Shared schemas between client and server via `shared/schema.ts`
  - Type inference for TypeScript integration
  - Runtime validation with detailed error messages
- **React Hook Form**: Form state management with Zod resolver integration

**Date Handling:**
- **date-fns**: Date formatting and manipulation
  - Used for relative time displays ("2 days ago")
  - Date parsing for API responses

**State Management:**
- **TanStack Query**: Server state management
  - Automatic caching and refetching
  - Optimistic updates support
  - Query invalidation strategies

**Session Storage:**
- **connect-pg-simple**: PostgreSQL session store (included but not actively used in current implementation)