# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI Red Lines Tracker** is an interactive web dashboard tracking frontier AI model capabilities against critical AI risk thresholds. It visualizes official risk assessments from major AI labs (OpenAI, Anthropic, Google DeepMind, xAI) across their respective risk frameworks, plus cross-lab AI R&D benchmarking and compute infrastructure analysis.

Currently tracking:
- **OpenAI**: 5 models across Preparedness Framework v2 categories (bio-chem, cyber, persuasion, ai-self-improvement)
- **Anthropic**: 5 models across RSP v2.2 levels (ASL-1 to ASL-4)
- **Google DeepMind**: 3 models across FSF v3.0 (Capability Confidence Levels)
- **xAI**: 4 Grok models across Frontier AI Framework (Abuse Potential, Concerning Propensities, Dual-Use Capabilities)
- **Cross-Lab AI R&D**: METR benchmark results and red line definitions across 3 major labs
- **Compute Infrastructure**: Training compute analysis, data center expansions, chip shipments, compute concentration
- **AI Incidents**: Documented incidents from the AI Incident Database, tracking harmed parties and system involvement

All data sourced from official system cards, published frameworks, and public research datasets.

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

# Run linter (ESLint + TypeScript)
npm lint

# Run linter with auto-fix
npm lint -- --fix
```

**Requirements**: Node.js 18+, npm 9+

**Note**: React 19 + react-simple-maps v3 require `legacy-peer-deps=true` in `.npmrc` (already configured) to avoid ERESOLVE warnings during install.

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
  ├── page.tsx               # Home/landing page (world map with infrastructure)
  ├── frontier-labs/page.tsx # Unified multi-lab dashboard with tab switching
  ├── ai-rnd/page.tsx        # AI R&D benchmarks and red lines comparison
  ├── compute-infrastructure/page.tsx # Compute analysis dashboard
  ├── ai-incidents/page.tsx  # AI incidents tracking dashboard
  └── [lab]/page.tsx         # Lab-specific dashboards (openai/, anthropic/, google-deepmind/, xai/)

/components                   # React components
  ├── /ui                    # shadcn/ui pre-built components (Card, Badge, Tabs, etc.)
  ├── /layout                # Header, footer, theme provider/toggle
  ├── /features
  │   ├── /dashboard         # Risk overview, threshold indicator, updates feed, incident metrics
  │   ├── /charts            # Recharts visualizations (Line, Bar, Radar, Heatmap, Incidents Bar Chart, etc.)
  │   ├── /maps              # Interactive world map with filters, tooltips, legend
  │   ├── /filters           # Filter UI components
  │   └── /modals            # Detail and information modals
  └── /shared                # Source badges with lab citations

/lib                         # Business logic and utilities
  ├── /data                  # Data accessors and transformations
  │   ├── [lab]-data.ts      # Lab-specific functions (getModels, getRiskAssessments, etc.)
  │   ├── cross-lab-data.ts  # Cross-lab utilities (METR benchmarks, red line definitions)
  │   ├── frontier-labs-data.ts # Frontier lab accessor functions
  │   ├── chip-manufacturers-data.ts # Chip manufacturer accessor functions
  │   ├── compute-infrastructure-data.ts # Compute infrastructure accessor functions
  │   ├── risk-calculations.ts # Risk aggregation and counting
  │   ├── chart-transformers.ts # Time series, radar, heatmap data formatting
  │   └── compute-infrastructure-transformers.ts # Compute bar chart and visualization formatting
  ├── /types                 # risk-data.ts with core interfaces
  └── /constants             # Thresholds, CHART_COLORS, CATEGORY_COLORS

/data                        # JSON data files (version-controlled)
  ├── /openai/              # OpenAI models and assessments
  ├── /anthropic/           # Anthropic models and assessments
  ├── /google-deepmind/     # Google DeepMind models and assessments
  ├── /xai/                 # xAI Grok models and assessments
  │   ├── models.json
  │   ├── risk-assessments.json
  │   ├── events.json
  │   └── sources.json
  └── /cross-lab/           # Cross-lab data
      ├── frontier-labs.json # 4 lab HQs with coordinates
      ├── chip-manufacturers.json # 3 chip manufacturers with shipment zones
      ├── compute-infrastructure.json # Data centers, training compute, chip shipments, compute concentration
      ├── ai-rnd-benchmarks.json # METR benchmarks and red line definitions
      └── ai-incidents.json # Incident data from AI Incident Database (10 organizations)
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

**Adding a New Lab (Complete Workflow)**:

1. **Create data files**:
   - Create `/data/[newlab]/` directory
   - Create `models.json` with model metadata (id, name, family, releaseDate, systemCardUrl)
   - Create `risk-assessments.json` with framework definition (riskLevels, riskCategories, assessments array)
   - Create `events.json` with timeline events (model releases, framework updates)
   - Create `sources.json` with document citations and PDF paths

2. **Create data accessor**:
   - Create `/lib/data/[newlab]-data.ts` with 18 functions (getModels, getRiskAssessments, getRiskCategories, etc.)
   - Use `require()` for JSON imports: `const data = require('@/data/[newlab]/models.json')`

3. **Create lab dashboard**:
   - Create `/app/[newlab]/page.tsx` (copy template from `/app/openai/page.tsx`)
   - Update imports to use `[newlab]-data.ts` accessor
   - Ensure page uses correct risk category and level terminology

4. **Add to unified dashboard**:
   - Update `/app/frontier-labs/page.tsx` LAB_CONFIG object with new lab
   - Include lab name, accessor function reference, tab icon, color scheme

5. **Add to homepage**:
   - Update `/app/page.tsx` FrontierLabsPreview component to show new lab

6. **Add colors**:
   - Add all model colors to CHART_COLORS in `/lib/constants/thresholds.ts`
   - Format: `'[modelId]': '#HexColor'`

7. **Test**:
   - Run `npm run dev`
   - Navigate to `/[newlab]` to verify dashboard renders
   - Check `/frontier-labs` tab switching works
   - Verify `/` homepage shows preview card

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

**AI R&D Benchmark Types:**
- **Benchmark**: `{ id, name, description, publishDate, sourceUrl, results[] }`
- **BenchmarkResult**: `{ modelId, lab, timeToComplete, successRate, notes }`
- **RedLineDefinition**: `{ id, lab, categoryId, definition, frameworkVersion, sourceSection, quantitative }`
- **ConvergenceDivergence**: `{ convergence: string[], divergence: string[] }`

**Compute Infrastructure Types:**
- **TrainingComputeData**: `{ modelId, modelName, organization, releaseDate, trainingCompute (FLOP), euActCompliant, source }`
- **DataCenterExpansion**: `{ id, projectName, company, location: { city, state?, country, coordinates? }, capacity, announcementDate, status, source }`
- **ComputeConcentration**: `{ entity, capex2024, capex2025_2026, marketShare, source }`
- **ChipShipment**: `{ id, year, chipModel, shipmentsToUS, shipmentsToChina, totalGlobal, source }`

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

## AI R&D Benchmarks Feature (/ai-rnd)

Cross-lab AI R&D capability tracking using METR benchmarks and red line definitions:

### Data Structure
- **ai-rnd-benchmarks.json**: Contains benchmarks, benchmark results, and red line definitions
  - **Benchmarks**: METR benchmark tests with publication dates and source URLs
  - **BenchmarkResults**: Per-model performance data (timeToComplete, successRate by lab)
  - **RedLineDefinitions**: Lab-specific red line thresholds for AI R&D capabilities
  - **ConvergenceDivergence**: Areas where labs converge vs. diverge on capabilities

### Key Components
- **RedLineComparisonChart**: Visualizes red line definitions across labs
- **CrossLabProximityGauge**: Shows how close models are to crossing red lines
- **METRBenchmarkTable**: Displays benchmark results in tabular format
- **ConvergenceDivergencePanel**: Highlights areas of capability convergence/divergence
- **CrossLabTimelineChart**: Timeline of benchmark performance over time

### Data Accessor Functions (cross-lab-data.ts)
- `getAiRndBenchmarks()` - Returns all benchmarks
- `getBenchmarkById(id)` - Fetch specific benchmark
- `getBenchmarkResults()` - Aggregate results across all benchmarks
- `getRedLineDefinitions()` - Return all red line definitions
- `getRedLineDefinitionByLab(lab)` - Filter by lab
- `getConvergenceDivergence()` - Convergence/divergence analysis
- `getLatestBenchmarkDate()` - Get most recent benchmark publication date

## Compute Infrastructure Feature (/compute-infrastructure)

Global compute infrastructure analysis for frontier AI development:

### Data Structure (compute-infrastructure.json)
1. **TrainingComputeData**: Model-level training compute (FLOP scale)
   - Organization, release date, EU AI Act compliance status
   - Used for training compute bar chart showing scale trends

2. **DataCenterExpansions**: Major data center projects (10+ facilities)
   - Coordinates for world map visualization
   - Status: announced, in-progress, operational
   - Capacity in MW or GW

3. **ComputeConcentration**: Market share and capex trends
   - CAPEX 2024 and 2025-2026 projections
   - Market share percentages by organization

4. **ChipShipments**: Semiconductor supply tracking
   - Annual shipments by region (US, China, Global)
   - Linked to chip manufacturer data

### Key Components
- **ComputeBarChart**: Training compute by model (log scale)
- **DataCenterMap**: Geographic visualization on world map
- **ComputeConcentrationChart**: Market share trends
- **ChipShipmentChart**: Semiconductor supply analysis

### Data Accessor Functions (compute-infrastructure-data.ts)
- `getTrainingComputeData()` - All training compute records
- `getDataCenterExpansions()` - All data center projects
- `getComputeConcentration()` - Market share data
- `getChipShipments()` - Semiconductor supply data
- `getDataCentersByCountry(country)` - Filter by location
- `getDataCentersByStatus(status)` - Filter by project status

## AI Incidents Feature (/ai-incidents)

Tracking reported AI incidents and harmful outcomes from deployed systems:

### Data Structure (ai-incidents.json)
- **Organization**: Name of company/entity
- **Type**: Role in incidents (Deployer and Developer)
- **Incidents Metrics**:
  - **totalIncidents**: Cumulative incidents involving this organization
  - **incidentsAsDeployer**: Incidents where organization deployed the AI system
  - **incidentsAsDeveloper**: Incidents where organization developed the AI system
  - **harmedBy**: Number of parties harmed by incidents
  - **implicatedSystem**: Number of AI systems implicated
  - **relatedEntities**: Other organizations/systems involved
  - **incidentResponses**: Number of documented responses

### Key Components
- **IncidentsMetricsCard**: Overview metrics (total, deployer, developer, harmed)
- **IncidentsBarChart**: Bar chart showing incidents by organization and role
- **IncidentsDetailedTable**: Comprehensive table with all metrics
- **Data Source Link**: Direct link to AI Incident Database at https://incidentdatabase.ai/entities/

### Data Accessor Functions (ai-incidents-data.ts)
- `getIncidents()` - Return all incident records
- `getIncidentById(id)` - Fetch specific incident
- `getIncidentByName(name)` - Find by organization name
- `getIncidentsSource()` - Get source metadata
- `getIncidentsSortedByTotal()` - Sort by total incidents
- `getIncidentsSortedByDeployer()` - Sort by deployer incidents
- `getIncidentsSortedByDeveloper()` - Sort by developer incidents
- `getTotalIncidentsAcrossOrgs()` - Aggregate total
- `getTotalDeployerIncidents()` - Sum deployer incidents
- `getTotalDeveloperIncidents()` - Sum developer incidents
- `getHarmedByTotal()` - Sum harmed parties
- `getIncidentResponsesTotal()` - Sum responses

### Integration Notes
- Data sourced from AI Incident Database (https://incidentdatabase.ai/entities/)
- Accessible via navigation link: `/ai-incidents`
- Includes 10 major AI organizations (OpenAI, Google, Facebook, Tesla, Meta, Microsoft, Amazon, Unknown, xAI, Apple)
- Visualizations help track incident patterns across deployer vs developer roles

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

**System Card Link Verification**: Each model must link to its own system card. Verify:
- **OpenAI**: Each model has distinct system card (no cross-contamination with other models)
- **Anthropic**: Claude Opus 4 & Claude Sonnet 4 share one official system card (correct per Anthropic)
- **Google DeepMind**: Each model has its own model card
- **xAI**: Each Grok model has its own model card

Always validate that `systemCardUrl` in models.json matches the corresponding URL in sources.json for that specific model.

**Quick Data Validation Checklist**:
- [ ] All model IDs in risk-assessments.json exist in models.json
- [ ] All categoryIds in assessments match riskCategories in same file
- [ ] Risk scores are 0.0–1.0 (decimal format, displayed as percentage)
- [ ] Threshold proximity is 0.0–1.0 scale
- [ ] systemCardUrl points to correct model's card (no cross-lab contamination)
- [ ] All source sections referenced in assessments exist in sources.json
- [ ] All new models have colors defined in CHART_COLORS
- [ ] Assessment dates are in YYYY-MM-DD format
- [ ] No trailing commas in JSON files

**Validation Workflow**:
1. Edit data files in `/data/[lab]/`
2. Run `npm run dev` and navigate to the lab dashboard
3. Open browser DevTools (F12) → Console tab to check for errors
4. Verify charts render and show expected data
5. Test filtering and category selection
6. Run `npm lint` to catch any TypeScript errors

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

- **Server Components** (default): Pages and layout components render on the server
- **Client Components**: Interactive features (charts, filters, theme toggle) use `'use client'` directive
- **Props Structure**: Pass data as props; avoid prop drilling with component composition
- **React 19 Note**: Use standard React patterns. Server-side rendering is handled by Next.js automatically

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

### State Management

The dashboard uses minimal state management (no Redux/Zustand):

1. **Component-level state** (`useState`) for UI interactivity:
   - Map filters (show/hide entity types)
   - Tab selection in multi-lab dashboard
   - Modal open/close states

2. **Data flows unidirectionally**:
   - Pages (server) fetch data and pass as props to components
   - Components use `useState` for UI state only
   - No data mutations; all data flows read-only from JSON files

3. **Theme state** (persisted via `next-themes`):
   - Dark/light mode preference stored in localStorage
   - Applied globally via CSS variables in `globals.css`

**Adding New State**: If new stateful UI is needed, use `useState` in the component. Avoid lifting state to page level unless multiple components share it.

## Important Notes

### Data Sourcing Requirements

All risk assessments must come from official published frameworks:

| Lab | Framework | Version | Categories |
|-----|-----------|---------|-----------|
| OpenAI | Preparedness Framework | v2 | bio-chem, cyber, persuasion, ai-self-improvement |
| Anthropic | Responsible Scaling Policy | v2.2 | cbrn, ai-rnd, autonomy, cyber (mapped to ASL levels) |
| Google DeepMind | Frontier Safety Framework | v3.0 | cyber-uplift, cbrn, ml-rnd-automation, etc. (CCL levels) |
| xAI | Frontier AI Framework | Dec 2025 (v1) | abuse-potential, concerning-propensities, dual-use-capabilities |

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
- `/lib/data/frontier-labs-data.ts`: Accessor functions for lab data
- `/lib/data/chip-manufacturers-data.ts`: Accessor functions for manufacturer data
- `/lib/data/compute-infrastructure-data.ts`: Accessor for data centers, training compute, chip shipments
- `/data/cross-lab/frontier-labs.json`: Lab HQs with coordinates and metadata
- `/data/cross-lab/chip-manufacturers.json`: Chip manufacturers with shipment zones
- `/public/maps/world-110m.json`: TopoJSON world map (105KB)

**AI R&D & Compute:**
- `/app/ai-rnd/page.tsx`: METR benchmarks and red line comparison dashboard
- `/app/compute-infrastructure/page.tsx`: Compute analysis dashboard (training scale, data centers, market concentration)
- `/lib/data/cross-lab-data.ts`: AI R&D benchmark and red line definition accessors
- `/lib/data/compute-infrastructure-transformers.ts`: Compute chart data formatters
- `/data/cross-lab/ai-rnd-benchmarks.json`: METR benchmark results and red line definitions
- `/data/cross-lab/compute-infrastructure.json`: Training compute, data centers, chip shipments, compute concentration

**AI Incidents:**
- `/app/ai-incidents/page.tsx`: Incident tracking dashboard with visualizations
- `/lib/data/ai-incidents-data.ts`: Incident data accessor functions
- `/components/features/dashboard/incidents-metrics-card.tsx`: Overview metrics component
- `/components/features/charts/incidents-bar-chart.tsx`: Incidents visualization by organization
- `/components/features/charts/incidents-detailed-table.tsx`: Comprehensive incident breakdown table
- `/data/cross-lab/ai-incidents.json`: Incident data from AI Incident Database
- **Source**: https://incidentdatabase.ai/entities/

### Build and Deployment

- **Development**: `npm run dev` (hot reload, port 3000, watch mode, file watching enabled)
- **Build**: `npm run build` (Next.js Turbopack, pre-renders all static routes, optimizes bundles)
- **Production**: `npm start` (serves built files from `.next/`, requires `npm run build` first)
- **Linting**: `npm lint` (ESLint + TypeScript checking on all files in `/app` and `/lib`)
- **Vercel**: Automatically detects Next.js, uses default Node.js 18+ runtime, commits `.npmrc` with legacy-peer-deps

### Configuration Reference

- **tsconfig.json**: Strict mode, baseUrl "@/*" for imports
- **components.json**: shadcn/ui (New York style, Tailwind CSS vars, RSC)
- **next.config.ts**: Minimal config (default Next.js 16)
- **globals.css**: Tailwind v4 + PostCSS, defines CSS variable theme
- **eslint.config.mjs**: Next.js preset with Core Web Vitals

### Common Issues and Debugging

**Data Validation:**
- **Build fails with type errors**: Run `npm lint` first to check TypeScript errors
- **Data not appearing in charts**: Verify JSON files in `/data/[lab]/` have correct format and IDs match across files
- **Risk scores showing as 0 or NaN**: Ensure scores in risk-assessments.json are decimals (0.0–1.0), not strings

**Charts:**
- **Chart not rendering**: Check that categoryIds in assessments match riskCategories defined in same file
- **Model colors missing**: Add entry to CHART_COLORS in `/lib/constants/thresholds.ts` (e.g., `grok-3: '#8B5CF6'`)
- **Risk Progression showing wrong data**: Verify assessmentDate format is YYYY-MM-DD in risk-assessments.json
- **Heatmap cells empty**: Ensure transformToHeatmapData can find matching model-category pairs

**World Map (Client-Side Rendering):**
- **Map not rendering**: Verify `/public/maps/world-110m.json` exists (TopoJSON file, 105KB)
- **Hydration mismatch error**: WorldMap must render client-side only (useEffect + useState check prevents server rendering)
- **Markers not appearing**: Check that coordinates exist in data files; data centers may have null coordinates
- **Vercel deployment fails with ERESOLVE**: Ensure `.npmrc` with `legacy-peer-deps=true` is committed to git
- **Map tooltips showing wrong data**: Verify data accessor functions return correct lab/manufacturer/data-center objects
- **Loading skeleton shows indefinitely**: Check browser console for errors; common cause is missing or malformed TopoJSON data

**Styling and Theme:**
- **Dark mode not applying**: Verify next-themes is initialized in `layout.tsx` and theme provider wraps page content
- **Tailwind classes not working**: Rebuild dev server (`npm run dev` again) after modifying tailwind config

## Related Documentation

- **README.md**: Project overview, features, tech stack, getting started
- **/public/docs/**: Official system card PDFs (organized by lab, linked in sources.json)
