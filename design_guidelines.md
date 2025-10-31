# Design Guidelines: WARN Layoff Notices Aggregation Platform

## Design Approach

**Selected Approach:** Design System (Material Design + Civic Tech References)

**Justification:** This is a utility-focused, data-dense application requiring clarity and trustworthiness. The serious subject matter (employment layoffs) demands a professional, respectful design that prioritizes information accessibility over visual flair.

**References:** Draw inspiration from professional data platforms like ProPublica, The Markup, and government data portals (data.gov, BLS.gov) that balance visual professionalism with data clarity.

**Core Principles:**
- Data First: Information hierarchy drives every layout decision
- Restrained Professionalism: Clean, serious aesthetic appropriate for sensitive employment data
- Functional Clarity: Every element serves the user's need to understand layoff trends
- Trustworthy Design: Build credibility through consistent, professional presentation

## Typography

**Font Families:**
- Primary: Inter or IBM Plex Sans (professional, excellent readability for data)
- Monospace: JetBrains Mono or IBM Plex Mono (for numerical data, dates, statistics)

**Hierarchy:**
- H1: 3xl-4xl (page titles, "WARN Layoff Tracker")
- H2: 2xl-3xl (section headers, "Latest Notices," state names)
- H3: xl-2xl (subsection headers, company names in listings)
- Body: base-lg (primary content, descriptions)
- Small: sm-base (metadata, dates, locations)
- Data/Stats: lg-xl with monospace font (numbers of affected workers, percentages)

**Weights:**
- Headlines: 600-700 (semibold to bold)
- Body: 400 (regular)
- Data emphasis: 500-600 (medium to semibold)
- Metadata: 400-500 (regular to medium)

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 24 for consistent rhythm
- Micro spacing (between related elements): 2-4
- Component internal spacing: 4-8
- Section spacing: 12-16
- Major section breaks: 24

**Grid System:**
- Container: max-w-7xl with px-4 md:px-6 lg:px-8
- Map section: Full-width container (w-full) with controlled max-width
- Content sections: Standard container width
- Data tables/lists: max-w-6xl for optimal readability

**Responsive Breakpoints:**
- Mobile-first approach
- Single column on mobile, multi-column on tablet+
- Map scales responsively with minimum height constraints

## Component Library

### Navigation
- Top navigation bar with logo, main links (Home, About, Search, Subscribe)
- Sticky header on scroll for easy navigation
- Clean, horizontal layout with subtle dividers
- Search functionality prominently placed

### Interactive US Map (Hero Element)
- SVG-based clickable US map showing state-level data
- Hover states show preview: state name, total notices, affected workers
- Click navigates to state-specific page
- Legend showing data ranges with clear labeling
- Minimum height: h-96 to h-screen (responsive)
- No background image needed - map IS the visual centerpiece

### Email Signup Section
- Clean, focused design immediately below map
- Single-column layout on mobile, potential two-column on desktop (form + benefits)
- Form elements: email input with validation, clear CTA button
- Trust indicators: privacy statement, frequency information ("Weekly digest")
- Confirmation message on successful signup
- Spacing: py-16 md:py-24 for breathing room

### Latest WARN Notices Section
- Card-based layout with clean separation between notices
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for notice cards
- Each card contains:
  - Company name (prominent, text-xl font-semibold)
  - Location (state + city, with location icon)
  - Number of workers affected (large, monospace)
  - Filing date (metadata styling)
  - Industry/sector tag
  - "View Details" link
- Sort/filter controls above listings (by date, state, size)
- Load more functionality or pagination

### Data Tables (State Pages)
- Responsive table design that stacks on mobile
- Striped rows for readability
- Sortable columns (company, date, workers affected, location)
- Hover highlight on rows
- Compact spacing for data density while maintaining readability

### Filter/Search Components
- Multi-select dropdowns for states
- Date range picker
- Company name search
- Number range filter (workers affected)
- Clear filters option
- Sticky filter bar on state pages

### Footer
- Multi-column layout (About, Resources, Legal, Contact)
- Data source attribution (required for credibility)
- Last updated timestamp
- Social links (if applicable)
- Secondary email signup option
- Newsletter archive link

### Statistics Dashboard Cards
- Key metrics prominently displayed: Total notices, Workers affected, States with recent activity
- Grid of stat cards: grid-cols-2 md:grid-cols-4
- Large numbers with monospace font
- Contextual labels and trend indicators
- Spacing: p-6 per card

### State Detail Pages
- State name header with total statistics
- Breadcrumb navigation
- Filtered table of notices for that state
- Timeline view option showing notices over time
- Export/download option for data

## Images

**No Large Hero Image:** The interactive US map serves as the primary visual element and homepage hero. No background image needed.

**Supporting Images:**
- State flag icons (small, 24x24 or 32x32) next to state names in listings
- Company logos (if available, 48x48) in detailed notice views
- Placeholder for missing company logos (generic building/office icon)
- Data visualization charts (programmatically generated, not image files)

**Image Treatment:**
- Minimal use of decorative imagery - focus on functional visuals
- Icons from Heroicons (outline style for consistency)
- Ensure all images have proper alt text for accessibility

## Animations

**Minimal Animation Philosophy:** Given the serious subject matter, use subtle, purposeful animations only.

**Permitted Animations:**
- Map state hover effects (subtle scale or outline)
- Smooth scroll to sections
- Loading states for data fetching (simple spinner)
- Filter application transitions (200ms ease)
- Card hover lift (translate-y-1, subtle shadow increase)

**Forbidden:**
- Flashy page transitions
- Decorative motion graphics
- Distracting hero animations
- Auto-playing content

## Accessibility

- WCAG 2.1 AA compliance minimum
- Keyboard navigation for map (tab through states)
- Focus indicators on all interactive elements
- Semantic HTML throughout
- ARIA labels for map regions and data visualizations
- High contrast text (avoid low-contrast gray text)
- Form labels properly associated with inputs
- Error messages clearly visible and announced

## Page-Specific Guidelines

**Homepage:**
1. Interactive map (h-96 md:h-screen max viewport)
2. Email signup section (py-16 md:py-24)
3. Statistics overview cards (py-12)
4. Latest notices grid (py-16, 9-12 most recent notices)
5. Footer

**State Pages:**
- Header with state info + breadcrumbs
- Statistics specific to state
- Filterable/sortable table of all notices for that state
- Timeline visualization option

**Search/All Notices Page:**
- Advanced filter sidebar (sticky on desktop)
- Results grid with sorting options
- Pagination controls