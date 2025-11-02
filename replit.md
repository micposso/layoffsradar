# WARN Layoff Tracker

## Overview

The WARN Layoff Tracker is a data-driven web application that aggregates and displays Worker Adjustment and Retraining Notification (WARN) Act notices across the United States. The platform provides real-time tracking of employment layoffs, company closures, and mass worker dislocations through an interactive map interface and searchable database.

The application serves as a civic technology tool, presenting sensitive employment data with professional clarity and trustworthiness. It enables users to browse layoff notices by state, search by company or location, and subscribe to email notifications for updates.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Updates

**November 1, 2025:**
- Replaced custom SVG map with react-simple-maps package for better reliability
- Implemented analytics dashboard with Recharts visualizations (timeline, state distribution, industry breakdown)
- Added advanced filtering with date ranges (filing/effective), worker count slider, and industry multi-select
- Created company detail pages with historical trends and statistics
- Enhanced UI/UX with interactive company links and timeline charts
- Fixed filtering bugs: worker range initialization from dataset, effective date support
- **Implemented Replit Auth for secure authentication**:
  - OAuth integration supporting Google, GitHub, email/password, Apple, X
  - Session-based authentication with PostgreSQL session storage
  - Protected CSV import endpoint with isAuthenticated middleware
  - User profile display in Header with avatar and logout functionality
  - Automatic redirect to login for protected routes
- **Added Company Logos Feature**:
  - Created normalized companies table with slug-based deduplication
  - All WARN notices now linked to canonical company records via foreign key
  - Company logos display in Recent Companies component (fallback to initials)
  - CSV import automatically creates/links company records
  - Logo URLs stored for future logo upload capability
- **Dedicated Subscribe Page with Advanced Preferences**:
  - New /subscribe route with comprehensive subscription form
  - State-specific alert filtering (users can choose to receive alerts for specific states)
  - Marketing communications opt-in checkbox
  - Database schema extended with state_preference and marketing_opt_in fields
  - Welcome emails now personalize based on state preference
  - Full end-to-end testing completed and passing
- **Enhanced Homepage Subscribe Section**:
  - Added state dropdown to homepage subscribe form
  - Two-column layout with email and state filter fields
  - Fully integrated with Resend for personalized welcome emails
  - Users can subscribe with state preference without leaving homepage
  - "More options" link for full subscription page with marketing opt-in
- **About Page**:
  - New /about route with comprehensive WARN Act information
  - Educational content explaining what WARN notices are and how they work
  - Sections covering compliance requirements, notice recipients, and important dates
  - Professional card-based layout with icons for visual clarity
  - Data sources disclosure and legal disclaimer

**CSV Import Feature:**
- Admin import page at /admin/import for bulk uploading WARN notices
- File upload with validation, duplicate detection, and error reporting
- Automatically refreshes all data views after successful import
- **Security**: Import endpoint protected with authentication - safe for public deployment
  - Only authenticated users can access /admin/import page
  - CSV upload requires valid session

**Email Notifications:**
- Resend integration configured with custom domain (updates@layoffsradar.com)
- Automated welcome emails sent on subscription
- Email branding: "LAYOFFS RADAR Alert"
- Personalized messaging based on subscriber preferences

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

*Public endpoints:*
- `GET /api/notices` - Retrieve all WARN notices
- `GET /api/notices/:state` - Retrieve notices filtered by state
- `GET /api/stats` - Get aggregate statistics
- `GET /api/analytics` - Get analytics data for dashboard
- `GET /api/companies` - List all companies with notice counts
- `GET /api/companies/:companyName` - Get company-specific data
- `POST /api/notices` - Create new WARN notice (with validation)
- `POST /api/subscribers` - Subscribe to email notifications

*Authentication endpoints:*
- `POST /api/login` - Initiate Replit OpenID Connect login
- `GET /api/logout` - Logout and destroy session
- `GET /api/auth/user` - Get current authenticated user (requires auth)

*Protected endpoints:*
- `POST /api/notices/import` - Bulk CSV import (requires authentication)

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

**Companies Table:**
- Canonical company records with normalized data
- Fields: id (UUID), name, slug (unique, URL-friendly), logoUrl, headquarters, industry
- Slug generation handles name variations ("Acme Inc" = "Acme, Inc." = slug: "acme-inc")
- Logo URLs stored as text, future logo upload UI planned
- Created/updated timestamps for tracking changes

**WARN Notices Table:**
- Primary data entity storing layoff information
- Fields: companyId (FK to companies), company name, state (2-char code), city, workers affected, filing date, effective date, industry, layoff type
- UUID primary keys with automatic generation
- Foreign key to companies table for normalized company data
- Date fields for temporal queries and sorting
- Created timestamp for tracking data freshness

**Email Subscribers Table:**
- Stores user subscriptions for notifications
- Fields: id (UUID), email (unique), statePreference (2-char code, optional), marketingOptIn (0/1), subscribedAt
- State preference enables state-specific alert filtering
- Marketing opt-in for product updates and feature announcements
- Email uniqueness constraint prevents duplicate subscriptions
- Subscription timestamp tracking
- Separate from notices for clean data separation

**Users Table:**
- Stores authenticated user information from Replit Auth
- Fields: id (UUID), email (unique), firstName, lastName, profileImageUrl, createdAt, updatedAt
- Populated automatically during OAuth login flow
- Used for session management and user profile display

**Sessions Table:**
- PostgreSQL-backed session storage using connect-pg-simple
- Fields: sid (session ID), sess (JSON session data), expire (timestamp)
- Automatically managed by Express session middleware
- Indexed on expire column for efficient cleanup

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

**Map Visualization:**
- **react-simple-maps**: SVG-based interactive US map component
  - Uses GeoJSON topology from us-atlas CDN
  - geoAlbersUsa projection optimized for US maps
  - Interactive hover tooltips and click navigation
  - Color-coded by WARN notice density (5-tier scale)
  - Renders all 50 states plus DC and territories

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

**Authentication:**
- **Replit Auth**: OpenID Connect authentication provider
  - Blueprint: `javascript_log_in_with_replit`
  - OAuth integration with Google, GitHub, email/password, Apple, X
  - Server-side: `openid-client`, `passport`, `express-session`
  - Frontend: `useAuth()` hook for checking authentication status
  - Protected routes redirect to login when unauthenticated
  - Session storage: PostgreSQL via `connect-pg-simple`
  - Middleware: `isAuthenticated` for route protection
  
**Session Storage:**
- **connect-pg-simple**: PostgreSQL session store for authentication
  - Stores session data in dedicated `sessions` table
  - Automatic session expiration and cleanup
  - Secure session management with httpOnly cookies