# AI Red Lines Tracker

An interactive web dashboard tracking frontier AI model capabilities against critical AI risk thresholds from major AI labs. Visualizes official risk assessments from OpenAI, Anthropic, Google DeepMind, and xAI using their respective frameworks plus cross-lab benchmarking and global compute infrastructure analysis.

## Overview

This dashboard provides transparency into AI safety by visualizing risk assessments from official system cards and published frameworks. It tracks:

- **Multi-Lab Risk Frameworks**: OpenAI Preparedness Framework, Anthropic RSP, Google DeepMind FSF, xAI Frontier AI Framework
- **Model Capabilities**: 17+ frontier AI models across all major labs
- **Cross-Lab Benchmarks**: METR red line definitions and AI R&D capability convergence/divergence
- **Global Infrastructure**: Data centers, training compute scale, chip shipments, compute concentration
- **AI Incidents**: Documented incidents from the AI Incident Database

## Features

### Core Dashboards
- 📊 **Multi-Lab Dashboards** - Separate views for OpenAI, Anthropic, Google DeepMind, xAI with framework-specific terminology
- 🌐 **Unified Dashboard** - Tab-based comparison across all four labs
- 🗺️ **World Map** - Interactive visualization of frontier lab HQs, data center expansions, and chip manufacturer locations
- 📈 **AI R&D Tracking** - METR benchmarks and red line definitions across labs
- 💾 **Compute Infrastructure** - Training compute scale, data center analysis, chip shipment tracking

### Interactive Features
- 📊 **Multi-Chart Types** - Line charts (progression), bar charts (comparison), radar charts (risk profiles), heatmaps (model-category matrix)
- 🎨 **Dark Mode** - Seamless dark/light theme switching with persistence
- 🔍 **Filtering** - Filter by model, category, risk level, entity type on maps
- ⚠️ **Threshold Alerts** - Identify models and categories approaching critical thresholds
- 📅 **Timeline** - Track model releases and framework updates
- 📱 **Responsive** - Works on mobile, tablet, and desktop
- 🔗 **Official Sources** - Direct links to system cards and framework documents

## Supported Labs & Models

### OpenAI (5 models)
- **Framework**: Preparedness Framework v2
- **Categories**: Bio/Chem, Cybersecurity, Persuasion, AI Self-Improvement
- **Models**: GPT-4o, o1, o1-pro, o3, o3-mini, GPT-5 (projected)

### Anthropic (5 models)
- **Framework**: Responsible Scaling Policy (RSP) v2.2
- **Levels**: ASL-1 to ASL-4
- **Models**: Claude Haiku 4.5, Claude Sonnet 4, Claude Sonnet 4.5, Claude Opus 4, Claude Opus 4.5

### Google DeepMind (3 models)
- **Framework**: Frontier Safety Framework (FSF) v3.0
- **Levels**: Capability Confidence Levels (CCL)
- **Models**: Gemini 2.5 Pro, Gemini 3 Flash, Gemini 3 Pro

### xAI (4 models)
- **Framework**: Frontier AI Framework (Dec 2025)
- **Categories**: Abuse Potential, Concerning Propensities, Dual-Use Capabilities
- **Models**: Grok 4, Grok 4.1, Grok 4 Fast, Grok Code Fast 1

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router, React 19)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4 + CSS variables for theming
- **Components**: shadcn/ui (Radix UI based)
- **Visualization**: Recharts 3.7.0, react-simple-maps 3.0.0
- **Maps**: TopoJSON world map with SVG rendering
- **Icons**: Lucide React
- **Theming**: next-themes (dark/light mode with persistence)
- **Utilities**: date-fns, class-variance-authority, clsx, tailwind-merge

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Git

### Installation

```bash
# Clone repository (if not already done)
cd ~/research_projects/ai-red-lines-tracker

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm lint

# Run linter with auto-fix
npm lint -- --fix
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

**Note**: React 19 + react-simple-maps v3 require `legacy-peer-deps=true` in `.npmrc` (already configured).

## Project Structure

```
ai-red-lines-tracker/
├── app/                                # Next.js App Router pages
│   ├── layout.tsx                      # Root layout with theme provider
│   ├── page.tsx                        # Home page (world map)
│   ├── frontier-labs/page.tsx          # Multi-lab unified dashboard
│   ├── ai-rnd/page.tsx                 # AI R&D benchmarks & red lines
│   ├── compute-infrastructure/page.tsx # Compute analysis
│   ├── ai-incidents/page.tsx           # AI incidents tracking
│   ├── [lab]/
│   │   ├── openai/page.tsx             # OpenAI dashboard
│   │   ├── anthropic/page.tsx          # Anthropic dashboard
│   │   ├── google-deepmind/page.tsx    # Google DeepMind dashboard
│   │   └── xai/page.tsx                # xAI dashboard
│
├── components/
│   ├── ui/                             # shadcn/ui components
│   ├── layout/                         # Header, footer, theme provider
│   ├── features/
│   │   ├── dashboard/                  # Risk overview, threshold alerts, updates feed
│   │   ├── charts/                     # Risk progression, comparison, radar, heatmap
│   │   ├── maps/                       # World map, filters, legend, tooltips
│   │   ├── filters/                    # Filter UI components
│   │   └── modals/                     # Detail modals
│   └── shared/                         # Source badges, lab logos
│
├── lib/
│   ├── data/
│   │   ├── [lab]-data.ts               # Lab-specific accessors (18 functions each)
│   │   ├── cross-lab-data.ts           # METR benchmarks, red lines, convergence
│   │   ├── frontier-labs-data.ts       # Frontier lab HQ locations
│   │   ├── chip-manufacturers-data.ts  # Chip maker locations & shipments
│   │   ├── compute-infrastructure-data.ts # Data centers & training compute
│   │   ├── ai-incidents-data.ts        # AI incident accessors
│   │   ├── risk-calculations.ts        # Risk aggregation & counting
│   │   ├── chart-transformers.ts       # Time series, radar, heatmap formatting
│   │   └── compute-infrastructure-transformers.ts # Compute chart formatting
│   ├── types/
│   │   └── risk-data.ts                # Core TypeScript types
│   └── constants/
│       └── thresholds.ts               # Risk thresholds, colors, category mappings
│
├── data/                               # Version-controlled JSON data
│   ├── openai/                         # OpenAI models & assessments
│   ├── anthropic/                      # Anthropic models & assessments
│   ├── google-deepmind/                # Google DeepMind models & assessments
│   ├── xai/                            # xAI models & assessments
│   └── cross-lab/
│       ├── frontier-labs.json          # Lab HQs with coordinates
│       ├── chip-manufacturers.json     # Chip makers with shipments
│       ├── compute-infrastructure.json # Data centers, training compute
│       ├── ai-rnd-benchmarks.json      # METR benchmarks & red lines
│       └── ai-incidents.json           # AI incidents from incident database
│
├── public/
│   ├── maps/
│   │   └── world-110m.json             # TopoJSON world map (105KB)
│   └── docs/                           # Official system card PDFs
│
└── CLAUDE.md                           # Detailed development guide
```

## Updating Data

### For a Single Lab (e.g., Anthropic)

When new system cards are released:

1. **Extract data from the system card**:
   - Risk scores (0.0–1.0 scale, stored as decimal)
   - Risk levels using the lab's framework (ASL-1/2/3/4 for Anthropic)
   - Threshold proximity values (0.0–1.0)
   - Mitigations and findings
   - Source section references

2. **Update `/data/[lab]/` JSON files**:
   - **models.json**: Add model entry if new
   - **risk-assessments.json**: Add/update assessment with all categoryRisks
   - **events.json**: Add model-release or framework-update event
   - **sources.json**: Add source document with system card URL

3. **Verify and test**:
   ```bash
   npm run dev
   # Navigate to /anthropic and verify charts render correctly
   npm lint  # Check for TypeScript errors
   ```

### Data Validation Checklist

- [ ] All model IDs in risk-assessments.json exist in models.json
- [ ] All categoryIds in assessments match riskCategories in same file
- [ ] Risk scores are 0.0–1.0 (decimal format)
- [ ] Threshold proximity is 0.0–1.0 scale
- [ ] systemCardUrl points to correct model's card (no cross-lab contamination)
- [ ] All source sections referenced in assessments exist in sources.json
- [ ] All new models have colors defined in CHART_COLORS
- [ ] Assessment dates are in YYYY-MM-DD format
- [ ] No trailing commas in JSON files

### Adding a New Lab (Complete Workflow)

See **CLAUDE.md** section "Adding a New Lab (Complete Workflow)" for detailed instructions.

## Official Data Sources

All assessments are sourced from official published frameworks and system cards:

### OpenAI
- [Preparedness Framework v2](https://openai.com/preparedness/)
- [System Cards Hub](https://openai.com/index/system-cards/)
- [OpenAI Safety](https://openai.com/safety/)

### Anthropic
- [Responsible Scaling Policy v2.2](https://www.anthropic.com/responsible-scaling-policy)
- [Claude System Cards](https://www.anthropic.com/research)

### Google DeepMind
- [Frontier Safety Framework v3.0](https://deepmind.google/blog/strengthening-our-frontier-safety-framework/)
- [Gemini Model Cards](https://deepmind.google/technologies/gemini/)

### xAI
- [Frontier AI Framework (Dec 2025)](https://x.ai)
- [Grok Model Cards](https://x.ai/research)

### Cross-Lab
- [AI Incident Database](https://incidentdatabase.ai/entities/)
- METR Benchmarks (published framework)

## Key Features Explained

### Risk Progression Chart
- **Type**: Line chart with multiple lines (one per model)
- **Data**: Aggregated scores across all categories per assessment date
- **Reference Lines**: Show Low→Medium (0.4), Medium→High (0.7), High→Critical (0.9)
- **Filtering**: Category badges to show progression for specific risks

### World Map
- **Interactive SVG map** with hover tooltips
- **Frontier Labs**: Major AI lab HQs color-coded by framework
- **Data Centers**: Announced/in-progress/operational status
- **Chip Manufacturers**: Shipment zones with 2025 projections
- **Filters**: Toggle entity types to show/hide (Labs, Data Centers, Manufacturers)

### Cross-Lab AI R&D
- **METR Benchmarks**: Shared benchmark results across labs
- **Red Line Definitions**: Lab-specific thresholds for AI R&D capabilities
- **Convergence/Divergence**: Areas where labs' capabilities align or diverge

### Compute Infrastructure
- **Training Compute**: Log-scale bar chart showing model training scales (FLOP)
- **Data Centers**: Geographic distribution and status
- **Market Concentration**: CAPEX and market share trends
- **Chip Shipments**: Regional distribution (US, China, Global)

## Risk Frameworks Overview

### OpenAI Preparedness Framework v2
- **Categories**: Biological/Chemical, Cybersecurity, Persuasion, AI Self-Improvement
- **Levels**: Low, Medium, High, Critical
- **Threshold**: 0.4 (Low→Med), 0.7 (Med→High), 0.9 (High→Crit)

### Anthropic Responsible Scaling Policy v2.2
- **Levels**: ASL-1, ASL-2, ASL-3, ASL-4
- **Categories**: CBRN, AI R&D, Autonomy, Cyber
- **Approach**: Precautionary classification when uncertain

### Google DeepMind Frontier Safety Framework v3.0
- **Levels**: Below Alert, Alert Threshold, CCL Met, CCL Exceeded
- **Coverage**: Cyber-uplift, CBRN, ML R&D automation, and more
- **Approach**: Capability Confidence Level framework

### xAI Frontier AI Framework (Dec 2025)
- **Dimensions**: Abuse Potential, Concerning Propensities, Dual-Use Capabilities
- **Metrics**: Quantitative benchmarks (WMDP, VCT, BioLP-Bench, CyBench, MASK)
- **Approach**: Rigorous quantitative evaluation

## Recent Updates

### January 2026 - Multi-Lab & Infrastructure Features
- ✅ Added Anthropic (5 models, RSP v2.2)
- ✅ Added Google DeepMind (3 models, FSF v3.0)
- ✅ Added xAI (4 models, Frontier AI Framework)
- ✅ Unified multi-lab dashboard with tab switching
- ✅ Interactive world map with frontier labs, data centers, chip manufacturers
- ✅ AI R&D benchmarks and red line definitions
- ✅ Compute infrastructure analysis dashboard
- ✅ AI incidents tracking from incident database
- ✅ Fixed system card link cross-contamination (each lab now correctly links to its own system cards)

## Common Tasks

### Understanding Risk Scores
- **0.0–0.4**: Low risk, minimal capability
- **0.4–0.7**: Medium risk, moderate capability requiring monitoring
- **0.7–0.9**: High risk, significant capability requiring strict controls
- **0.9–1.0**: Critical risk, extreme capability requiring deployment restrictions

### Threshold Proximity Warning
- **< 0.75**: Normal operations
- **0.75–0.85**: Elevated monitoring
- **0.85–0.95**: Warning state (⚠️)
- **≥ 0.95**: Critical state (🔴)

### Adding a New Chart
1. Create component in `/components/features/charts/`
2. Accept assessments and optional filtering params as props
3. Use `chart-transformers.ts` to format data
4. Apply CHART_COLORS for model coloring
5. Wrap in Card with proper metadata

## Future Enhancements

- [ ] Real-time notifications for threshold crossings
- [ ] Historical trend analysis and predictive models
- [ ] Export reports to PDF
- [ ] Advanced comparison tools (model-to-model, lab-to-lab)
- [ ] API for programmatic data access
- [ ] Automated system card scraping and updates
- [ ] Incident prediction models

## Troubleshooting

### Build Issues
- **ERESOLVE warnings**: Already fixed with `legacy-peer-deps=true` in `.npmrc`
- **TypeScript errors**: Run `npm lint` to check for issues
- **Map not rendering**: Check that `/public/maps/world-110m.json` exists

### Data Issues
- **Charts empty**: Verify JSON structure matches expected format
- **Wrong system card link**: Check that `systemCardUrl` in models.json matches the model
- **Missing model colors**: Add entry to CHART_COLORS in `/lib/constants/thresholds.ts`

### Performance
- All static routes pre-render at build time
- Client-side rendering for interactive features (maps, filters)
- Typical page load: < 200ms

## Development Guidelines

For detailed architectural information, development patterns, and contribution guidelines, see **CLAUDE.md** in the project root.

## License

This project is for educational and research purposes, tracking publicly available AI safety data from official sources.

---

**Last Updated**: February 2026
**Data Sources**: OpenAI, Anthropic, Google DeepMind, xAI official frameworks and system cards
**Maintain Accuracy**: All data is version-controlled and sourced from official published documents
