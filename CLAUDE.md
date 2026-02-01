# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI Red Lines Tracker** is an interactive web dashboard tracking frontier AI model capabilities against critical AI risk thresholds. It visualizes official risk assessments from major AI labs (OpenAI, Anthropic, Google DeepMind, xAI) across their respective risk frameworks.

Currently tracking:
- **OpenAI**: 5 models across Preparedness Framework v2 categories (bio-chem, cyber, persuasion, ai-self-improvement)
- **Anthropic**: 5 models across RSP v2.2 levels (ASL-1 to ASL-4)
- **Google DeepMind**: 4 models across FSF v3.0 (Capability Confidence Levels)
- **xAI**: 4 Grok models across Frontier AI Framework (Abuse Potential, Concerning Propensities, Dual-Use Capabilities)

All data sourced from official system cards and published frameworks.

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
  ├── frontier-labs/page.tsx # Unified multi-lab dashboard with tab switching
  └── [lab]/page.tsx         # Lab-specific dashboards (openai/, anthropic/, google-deepmind/, xai/)

/components                   # React components
  ├── /ui                    # shadcn/ui pre-built components (Card, Badge, Tabs, etc.)
  ├── /layout                # Header, footer, theme provider/toggle
  ├── /features
  │   ├── /dashboard         # Risk overview, threshold indicator, updates feed, spotlight cards
  │   ├── /charts            # Line, bar, radar, heatmap visualizations (Recharts)
  │   └── /maps              # Interactive world map with filters, tooltips, legend
  └── /shared                # Source badges with lab citations

/lib                         # Business logic and utilities
  ├── /data                  # Data accessors and transformations
  │   ├── [lab]-data.ts      # Lab-specific functions (getModels, getRiskAssessments, etc.)
  │   ├── cross-lab-data.ts  # Cross-lab utilities (red line definitions)
  │   ├── risk-calculations.ts # Risk aggregation and counting
  │   └── chart-transformers.ts # Time series, radar, heatmap data formatting
  ├── /types                 # risk-data.ts with core interfaces
  └── /constants             # Thresholds, CHART_COLORS, CATEGORY_COLORS

/data                        # JSON data files (version-controlled)
  ├── /openai/              # OpenAI models and assessments
  ├── /anthropic/           # Anthropic models and assessments
  ├── /google-deepmind/     # Google DeepMind models and assessments
  ├── /xai/                 # xAI Grok models and assessments
  │   ├── models.json       # 4 Grok models
  │   ├── risk-assessments.json  # 3-category framework
  │   ├── events.json       # Model releases and framework updates
  │   └── sources.json      # Links to 6 xAI documents
  └── /cross-lab/           # Cross-lab data (compute infrastructure, world map)
      ├── frontier-labs.json # 4 lab HQs with coordinates
      ├── chip-manufacturers.json # 3 manufacturers, shipment zones
      └── compute-infrastructure.json # Data centers with coordinates, training compute
```

### Multi-Lab Architecture

Each lab follows a modular, reusable pattern supporting framework-specific terminology:

1. **Route**: `/app/[lab]/page.tsx` - Lab-specific dashboard (individual page view)
2. **Data Layer**: `/data/[lab]/` - Four JSON files per lab:
   - `models.json`: Model metadata (name, family, release date)
   - `risk-assessments.json`: Framework definition (categories, risk levels) + per-model assessments
   - `events.json`: Timeline entries (model releases, framework updates)
   - `sources.json`: Document citations with publication dates
3. **Accessor**: `/lib/data/[lab]-data.ts` - 18 standardized functions (getModels, getRiskAssessments, etc.)
4. **Components**: Shared components reused across all labs (RiskProgressionChart, RiskHeatmap, RiskCategoryRadar, etc.)
5. **Integration**: Unified dashboard at `/frontier-labs` with tab switching for multi-lab comparison

**Key Design**: Each lab defines its own risk categories and levels in `risk-assessments.json`, allowing framework-specific terminology (e.g., ASL-1/2/3/4 for Anthropic, CCL for Google, Abuse Potential/Concerning Propensities for xAI).

**Adding a New Lab**:
1. Create `/app/[newlab]/page.tsx` (template: copy from `/app/openai/page.tsx`)
2. Create `/data/[newlab]/` with four JSON files matching your framework
3. Create `/lib/data/[newlab]-data.ts` implementing 18 accessor functions
4. Add lab config to `/app/frontier-labs/page.tsx` LAB_CONFIG object
5. Update `/app/page.tsx` to include new lab in FrontierLabsPreview component
6. Add model colors to `CHART_COLORS` in `/lib/constants/thresholds.ts`

### Key Type System

Core types in `/lib/types/risk-data.ts`:

**Risk Assessment Types:**
- **Model**: `{ id, name, family, releaseDate, systemCardUrl }`
- **RiskAssessment**: `{ modelId, assessmentDate, overallRisk, categoryRisks: CategoryRisk[] }`
- **CategoryRisk**: `{ categoryId, riskLevel, score, thresholdProximity, notes, mitigations, sourceSection }`
- **RiskCategory**: `{ id, name, description }`
- **RiskLevelConfig**: `{ level, color, label }` (framework-specific)
- **TimelineEvent**: `{ id, date, type, title, description, modelIds, categoryIds, sourceId }`
- **Source**: `{ id, title, url, type, publishDate, pdfPath }`

**World Map Types:**
- **FrontierLab**: `{ id, name, city, state?, country, coordinates, framework, modelCount, primaryColor, latestModel, latestReleaseDate, dataCenterCount }`
- **ChipManufacturer**: `{ id, name, city, state?, country, coordinates, primaryColor, chipModels[], totalShipments2025, topShipmentRegion }`
- **ShipmentZone**: `{ id, region, coordinates.polygon, totalShipments2025, percentage, color }`
- **MapMarker**: Union type `{ type: 'lab'|'data-center'|'manufacturer', data: FrontierLab|DataCenterExpansion|ChipManufacturer }`
- **DataCenterExpansion**: `{ id, projectName, company, location: { city, state?, country, coordinates? }, capacity, announcementDate, status: 'announced'|'in-progress'|'operational', source, sourceUrl? }`

**Risk Scoring**: 0.0–1.0 scale (stored as decimal, displayed as percentage)
- Each lab can define custom risk levels in `risk-assessments.json`
- xAI uses: low/moderate/high/critical
- Anthropic uses: asl-1/asl-2/asl-3/asl-4
- Google DeepMind uses: below-alert/alert/ccl-met/ccl-exceeded
- OpenAI uses: low/medium/high/critical

**Threshold Proximity**: 0.0–1.0 scale indicating how close to next threshold (0.85+ = warning, 0.95+ = critical)

## Technology Stack

- **Framework**: Next.js 16.1.6 (App Router, React Server Components)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4 with CSS variables for theming
- **Components**: shadcn/ui (Radix UI based)
- **Visualization**: Recharts 3.7.0 for dashboards, react-simple-maps for world map
- **Maps**: react-simple-maps 3.0.0 + topojson for SVG-based world map
- **Icons**: Lucide React
- **Theming**: next-themes (dark/light mode with persistence)
- **Utilities**: date-fns, class-variance-authority, clsx, tailwind-merge

**Note**: react-simple-maps v3 doesn't officially support React 19, but works via `legacy-peer-deps=true` in `.npmrc`. Server hydration handled via client-side rendering check.

## World Map Feature (Home Page)

The home page features an interactive SVG-based world map showing global AI infrastructure:

### Map Components Structure
- **world-map.tsx**: Main map component using react-simple-maps + TopoJSON
- **map-filters.tsx**: Toggle buttons for Frontier Labs, Data Centers, Manufacturers, Shipment Zones
- **map-tooltip.tsx**: Context-aware hover tooltips
- **map-legend.tsx**: Color-coded legend for entity types and statuses
- **map-marker.tsx**: Reusable marker component (unused in current version, kept for extensibility)

### Map Data
- **frontier-labs.json**: 4 lab HQs (OpenAI/Anthropic SF, Google London, xAI Palo Alto)
  - Contains: coordinates, framework version, model count, latest model date
- **chip-manufacturers.json**: 3 chip makers (NVIDIA/AMD/Intel Santa Clara)
  - Contains: coordinates, chip models, 2025 shipment counts, shipment zones
- **compute-infrastructure.json**: Updated with lat/lng for 10 data centers
  - Color-coded by status: announced (amber), in-progress (blue), operational (green)

### Map Data Accessors
- **frontier-labs-data.ts**: 8 functions (getFrontierLabs, getLabById, getLabsByCountry, etc.)
- **chip-manufacturers-data.ts**: 9 functions (getChipManufacturers, getShipmentZones, etc.)
- Existing **compute-infrastructure-data.ts**: Already has getDataCenterExpansions()

### Integration Details
- Map is rendered client-side only (useEffect check prevents hydration mismatch)
- SVG rendering (no external map APIs)
- Dark/light theme support via CSS variables
- Responsive design (600px default height, adjustable)
- Performance: All routes < 200ms render time

### Hydration Note
react-simple-maps calculates SVG transform attributes on client, causing server/client mismatches. Solution: Render only on client using useState + useEffect. Shows loading skeleton during server render.

### Deployment
- **.npmrc**: `legacy-peer-deps=true` enables Vercel deployment with react-simple-maps v3 + React 19
- No ERESOLVE errors during `npm install` on Vercel

## Common Development Tasks

### Updating Risk Data for Existing Lab

When new system cards are released:

1. Extract from the system card PDF:
   - Risk scores per category (0.0–1.0 scale)
   - Risk levels using lab's framework
   - Threshold proximity values
   - Mitigations and findings
   - Source section references

2. Update `/data/[lab]/`:
   - **models.json**: Add model entry if new (id must match assessments)
   - **risk-assessments.json**: Add/update assessment with all categoryRisks populated
   - **events.json**: Add model-release or framework-update event
   - **sources.json**: Add source document with PDF link

3. Test locally: `npm run dev` → Navigate to `/[lab]` → Verify charts render with new data

**Data Validation**: Ensure all categoryIds in categoryRisks array match riskCategories defined in the same file. Ensure riskLevels match those in riskLevels array.

### Understanding Risk Progression Chart

- **Type**: Line chart with multiple lines (one per model)
- **Data**: Aggregated from all categoryRisks for each model
- **X-axis**: Assessment dates (formatted as "MMM yyyy")
- **Y-axis**: Risk score 0-1 (displayed as 0-100%)
- **Reference Lines**: Show Low→Medium (0.4), Medium→High (0.7), High→Critical (0.9)
- **Category Filtering**: Badges at top to show progression for specific risk category
- **Used in**: All lab dashboards + `/frontier-labs` tab switching

### Creating/Modifying Chart Components

Chart components in `/components/features/charts/`:

1. Accept assessments and optional filtering params as props
2. Use `chart-transformers.ts` to format data (transformToTimeSeriesData, transformToRadarData, etc.)
3. Use Recharts for rendering (LineChart, BarChart, RadarChart, custom grid)
4. Apply CHART_COLORS for model coloring: `getModelColor(modelId) → CHART_COLORS[modelId] || default`
5. Wrap in Card with CardHeader/CardTitle/CardDescription for dashboard context

**Color Assignment**: Model colors defined in `/lib/constants/thresholds.ts` CHART_COLORS object. Add new model colors there (e.g., xAI models use purple shades: #8B5CF6, #7C3AED, etc.)

### Styling and Theme

- **Utility classes**: Tailwind CSS (e.g., `className="flex items-center gap-4"`)
- **Component library**: shadcn/ui (pre-styled Radix-based components, CVA-powered variants)
- **Dark mode**: CSS variables in `/app/globals.css`, applied via `.dark` class
- **Icons**: lucide-react (`import { AlertCircle } from 'lucide-react'`)
- **Theme provider**: `/components/layout/theme-provider.tsx` with toggle in header

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

### Filter Pattern (Map Filters Example)

Map filters use a controlled component pattern:

1. Parent component (`page.tsx`) maintains filter state with `useState`
2. Filter component (`map-filters.tsx`) accepts callback `onFiltersChange`
3. Child map component (`world-map.tsx`) receives filter props and updates rendering
4. Filter updates are synchronous and immediate (no debouncing needed)

Example:
```typescript
// Parent
const [filters, setFilters] = useState({ showLabs: true, ... });
<MapFilters onFiltersChange={setFilters} />
<WorldMap showLabs={filters.showLabs} ... />

// Filter Component
<button onClick={() => {
  const newState = !showLabs;
  onFiltersChange({ showLabs: newState, ... });
}} />
```

This pattern is reusable for other filter components (risk level, data center status, etc.).

### Error Handling

- Validate data at the accessor layer
- Use optional chaining and nullish coalescing for defensive programming
- Provide fallback UI for missing data

## Important Notes

### Data Sourcing Requirements

All risk assessments must come from official published frameworks:

| Lab | Framework | Version | Categories |
|-----|-----------|---------|-----------|
| OpenAI | Preparedness Framework | v2 | bio-chem, cyber, persuasion, ai-self-improvement |
| Anthropic | Responsible Scaling Policy | v2.2 | cbrn, ai-rnd, autonomy, cyber (mapped to ASL levels) |
| Google DeepMind | Frontier Safety Framework | v3.0 | cyber-uplift, cbrn, ml-rnd-automation, etc. (CCL levels) |
| xAI | Frontier AI Framework | Dec 2025 | abuse-potential, concerning-propensities, dual-use-capabilities |

Each assessment must cite specific sections and link to official system cards in `sources.json`.

### Key Data Files to Know

**Risk Assessment:**
- `/lib/constants/thresholds.ts`: RISK_THRESHOLDS (0.4, 0.7, 0.9), THRESHOLD_PROXIMITY_WARNING (0.85), CHART_COLORS object
- `/lib/types/risk-data.ts`: All core type definitions (risk, map, compute types)
- `/lib/data/chart-transformers.ts`: `transformToTimeSeriesData()`, `transformToRadarData()`, `transformToHeatmapData()` (used by all charts)
- `/lib/data/risk-calculations.ts`: `countByRiskLevel()`, risk score aggregation functions
- `/app/frontier-labs/page.tsx`: LAB_CONFIG object defines tab switching behavior and data access for unified dashboard

**World Map & Infrastructure:**
- `/app/page.tsx`: Home page with MapFilters component, stateful filter management
- `/components/features/maps/world-map.tsx`: Main map component (client-side rendered only)
- `/lib/data/frontier-labs-data.ts`: Accessor functions for lab data (8 functions)
- `/lib/data/chip-manufacturers-data.ts`: Accessor functions for manufacturer data (9 functions)
- `/lib/data/compute-infrastructure-data.ts`: Existing accessor for data centers (includes geocoding)
- `/data/cross-lab/frontier-labs.json`: Lab HQs data
- `/data/cross-lab/chip-manufacturers.json`: Manufacturer data + shipment zones
- `/public/maps/world-110m.json`: TopoJSON world map (105KB)

### Build and Deployment

- **Development**: `npm run dev` (hot reload, port 3000, watch mode)
- **Build**: `npm run build` (Next.js Turbopack, pre-renders all routes)
- **Production**: `npm start` (built files from `.next/`)
- **Linting**: `npm lint` (ESLint + TypeScript on all files)

### Configuration Reference

- **tsconfig.json**: Strict mode, baseUrl "@/*" for imports
- **components.json**: shadcn/ui (New York style, Tailwind CSS vars, RSC)
- **next.config.ts**: Minimal config (default Next.js 16)
- **globals.css**: Tailwind v4 + PostCSS, defines CSS variable theme
- **eslint.config.mjs**: Next.js preset with Core Web Vitals

### Common Issues

**Charts:**
- **Chart not rendering**: Check that categoryIds in assessments match riskCategories defined in same file
- **Model colors missing**: Add entry to CHART_COLORS in `/lib/constants/thresholds.ts`
- **Risk Progression showing wrong data**: Verify assessmentDate format is YYYY-MM-DD in risk-assessments.json
- **Heatmap cells empty**: Ensure transformToHeatmapData can find matching model-category pairs

**World Map:**
- **Map not rendering**: Verify `/public/maps/world-110m.json` exists (TopoJSON file)
- **Hydration mismatch error**: WorldMap must render client-side only (useEffect + useState check is in place)
- **Markers not appearing**: Check that coordinates exist in data files (especially data centers which are optional)
- **Vercel deployment fails with ERESOLVE**: Ensure `.npmrc` with `legacy-peer-deps=true` is committed
- **Map tooltips showing wrong data**: Verify data accessor functions return correct lab/manufacturer/data-center objects

## Related Documentation

- **README.md**: Project overview, features, tech stack, getting started
- **/public/docs/**: Official system card PDFs (organized by lab, linked in sources.json)
