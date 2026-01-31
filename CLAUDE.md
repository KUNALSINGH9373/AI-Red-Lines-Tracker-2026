# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI Red Lines Tracker** is an interactive web dashboard tracking frontier AI model capabilities against critical AI risk thresholds. It visualizes official risk assessments from major AI labs (OpenAI, Anthropic, Google DeepMind) across four risk categories:

- Biological and Chemical Threats
- Cybersecurity (offensive operations)
- Persuasion and Manipulation
- AI Self-Improvement (autonomous research)

Data is sourced from official system cards and preparedness frameworks.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm lint
```

**Requirements**: Node.js 18+

## Architecture Overview

### Data Flow Architecture

```
JSON Data Files (/data/[lab]/)
    ↓
Data Accessors (/lib/data/[lab]-data.ts)
    ├── getModels()
    ├── getRiskAssessments()
    ├── getRiskCategories()
    ├── getEvents()
    └── getSources()
    ↓
Business Logic (/lib/data/)
    ├── risk-calculations.ts (scoring, aggregation)
    └── chart-transformers.ts (visualization formatting)
    ↓
UI Components (pages, features)
```

### Directory Structure

```
/app                          # Next.js App Router pages
  ├── layout.tsx             # Root layout with theme provider
  ├── page.tsx               # Home/landing page
  └── [lab]/page.tsx         # Dashboard pages (openai/, anthropic/, google-deepmind/)

/components                   # React components
  ├── /ui                    # shadcn/ui pre-built components
  ├── /layout                # Header, footer, theme provider/toggle
  ├── /features
  │   ├── /dashboard         # KPI cards, updates feed
  │   └── /charts            # Recharts wrappers (line, bar, radar, heatmap, gauge)
  └── /shared                # Source badges, citations

/lib                         # Business logic and utilities
  ├── /data                  # Data accessors and transformations
  │   ├── [lab]-data.ts      # Lab-specific data functions
  │   ├── risk-calculations.ts
  │   └── chart-transformers.ts
  ├── /types                 # TypeScript type definitions (risk-data.ts)
  └── /constants             # Thresholds, risk levels, color schemes

/data                        # JSON data files
  └── /[lab]/               # Per-lab directories (openai/, anthropic/, google-deepmind/)
      ├── models.json       # Model definitions
      ├── risk-assessments.json  # Risk scores and levels
      ├── events.json       # Timeline events
      └── sources.json      # Document citations
```

### Multi-Lab Architecture

Each lab (OpenAI, Anthropic, Google DeepMind) follows a modular pattern:

1. **Route**: `/app/[lab]/page.tsx` - Lab-specific dashboard
2. **Data**: `/data/[lab]/` - Four JSON files per lab
3. **Accessor**: `/lib/data/[lab]-data.ts` - Standardized data fetching functions
4. **Components**: Shared chart and dashboard components reused across labs

This allows adding a new lab by:
- Creating `/app/[newlab]/page.tsx`
- Adding `/data/[newlab]/` with four JSON files
- Creating `/lib/data/[newlab]-data.ts` following existing patterns

### Key Type System

Core types defined in `/lib/types/risk-data.ts`:

- **Model**: Model information (name, version, releaseDate)
- **RiskAssessment**: Scores and levels per model
- **RiskCategory**: Bio/chem, cybersecurity, persuasion, self-improvement
- **RiskLevel**: "low" | "medium" | "high" | "critical"
- **Event**: Timeline entries for model releases and updates
- **Source**: Document citations with links

Risk scoring scale: **0.0–1.0**
- Low: < 0.25 (green, #10b981)
- Medium: 0.25–0.50 (yellow, #f59e0b)
- High: 0.50–0.75 (orange, #ef4444)
- Critical: ≥ 0.75 (dark red, #991b1b)

## Technology Stack

- **Framework**: Next.js 16.1.6 (App Router, React Server Components)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4 with CSS variables for theming
- **Components**: shadcn/ui (Radix UI based)
- **Visualization**: Recharts 3.7.0
- **Icons**: Lucide React
- **Theming**: next-themes (dark/light mode with persistence)
- **Utilities**: date-fns, class-variance-authority, clsx, tailwind-merge

## Common Development Tasks

### Adding a New Lab

1. Create `/app/[newlab]/page.tsx` (use existing lab pages as templates)
2. Create `/data/[newlab]/` with models.json, risk-assessments.json, events.json, sources.json
3. Create `/lib/data/[newlab]-data.ts` following the accessor pattern (getModels, getRiskAssessments, etc.)
4. Dashboard pages can reuse all existing chart and feature components

### Updating Risk Data

When new system cards are released:

1. Download PDF to `/public/docs/[lab]/`
2. Extract risk assessments from the system card:
   - Risk level (low/medium/high/critical)
   - Risk score (0.0–1.0)
   - Threshold proximity (how close to crossing)
   - Mitigations implemented
   - Source section reference
3. Update the four JSON files in `/data/[lab]/`:
   - **models.json**: Add model if new
   - **risk-assessments.json**: Add assessment entry with date and scores
   - **events.json**: Add release/update event
   - **sources.json**: Add document citation
4. Verify locally: `npm run dev` and check dashboard

### Creating a New Chart Component

Chart components in `/components/features/charts/` wrap Recharts:

1. Accept risk data as props
2. Transform data using utilities from `lib/data/chart-transformers.ts`
3. Use Recharts primitives (LineChart, BarChart, etc.)
4. Apply theme variables for colors (CSS variables in globals.css)
5. Use shadcn/ui Card wrapper for consistency

### Styling and Theme

- Utility classes: Tailwind CSS (e.g., `className="flex items-center gap-4"`)
- Component styles: shadcn/ui components (pre-styled with CVA)
- Color theming: CSS variables in `/app/globals.css` (supports dark mode)
- Icons: Import from lucide-react (`import { AlertCircle } from 'lucide-react'`)

Theme provider and toggle in `/components/layout/` apply dark mode via `.dark` class.

## Code Patterns and Conventions

### Data Access Pattern

All data accessors follow this structure:

```typescript
export function getModels(lab: 'openai' | 'anthropic' | 'google-deepmind'): Model[] {
  const data = require(`@/data/${lab}/models.json`);
  return data.models;
}
```

Use `require()` for JSON imports (Next.js handles path resolution).

### Component Patterns

- **Server Components** (default): Pages and layout components
- **Client Components**: Interactive features (charts, filters, theme toggle) use `'use client'`
- **Props Structure**: Pass data as props; avoid prop drilling with component composition

### Error Handling

- Validate data at the accessor layer
- Use optional chaining and nullish coalescing for defensive programming
- Provide fallback UI for missing data

## Important Notes

### Data Sourcing

All risk assessments must come from official sources:
- OpenAI Preparedness Framework v2
- Anthropic RSP (Responsible Scaling Policy) v2.2
- Google DeepMind FSF (Frontier Safety Framework) v3.0

Document sources in the JSON data (sources.json) with proper links and section references.

### Configuration Files

- **tsconfig.json**: Strict mode enabled; path alias `@/*` for root imports
- **components.json**: shadcn/ui configuration (New York style, RSC enabled, Tailwind CSS vars)
- **globals.css**: Tailwind v4 with PostCSS; defines theme CSS variables
- **eslint.config.mjs**: Next.js preset with Core Web Vitals checks

### Build and Deployment

- Development: `npm run dev` (hot reload, port 3000)
- Production: `npm run build` then `npm start`
- Linting: `npm lint` (catches TypeScript and ESLint errors before commit)
- No tests configured (Jest/Vitest not set up)

## Related Documentation

- README.md: Feature overview, getting started, data update procedures
- /public/docs/: Official system card PDFs (referenced in sources.json)
