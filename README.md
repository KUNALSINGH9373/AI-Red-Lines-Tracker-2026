# AI Red Lines Tracker

A beautiful, interactive web dashboard tracking how close OpenAI models are to critical AI risk thresholds using official system cards and the Preparedness Framework.

## Overview

This dashboard provides transparency into AI safety by visualizing risk assessments from official OpenAI documentation. It tracks model capabilities across four critical risk categories:

- **Biological and Chemical Threats** - Capability to assist in developing biological/chemical weapons
- **Cybersecurity** - Offensive cyber operations and vulnerability exploitation
- **Persuasion and Manipulation** - Mass influence operations and persuasion
- **AI Self-Improvement** - Autonomous AI research and recursive self-improvement

## Features

- 📊 **Interactive Charts** - Line, bar, radar, and heatmap visualizations
- 🎨 **Dark Mode** - Seamless dark/light theme switching
- 🔍 **Filtering** - Filter by model, category, and risk level
- ⚠️ **Threshold Alerts** - Identify models near critical thresholds
- 📅 **Timeline** - Track model releases and framework updates
- 📱 **Responsive** - Works on mobile, tablet, and desktop
- 🎯 **Official Sources** - All data from OpenAI system cards

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Data**: JSON files (version-controlled)
- **Theme**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Navigate to the project
cd ~/research_projects/ai-red-lines-tracker

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Project Structure

```
ai-red-lines-tracker/
├── app/                        # Next.js app directory
│   ├── layout.tsx              # Root layout with theme provider
│   ├── page.tsx                # Homepage
│   └── openai/
│       └── page.tsx            # OpenAI dashboard
├── components/
│   ├── ui/                     # shadcn UI components
│   ├── layout/                 # Header, footer, theme toggle
│   ├── features/
│   │   ├── dashboard/          # Dashboard cards
│   │   ├── charts/             # Chart components
│   │   ├── filters/            # Filter components
│   │   └── modals/             # Detail modals
│   └── shared/                 # Shared components
├── lib/
│   ├── data/
│   │   ├── openai-data.ts      # Data access layer
│   │   ├── risk-calculations.ts # Risk calculations
│   │   └── chart-transformers.ts # Chart data transformers
│   ├── types/                  # TypeScript types
│   └── constants/              # Thresholds, colors
├── data/
│   └── openai/                 # OpenAI JSON data
│       ├── models.json
│       ├── risk-assessments.json
│       ├── events.json
│       └── sources.json
└── public/
    └── docs/                   # PDF system cards
```

## Updating Data

When new OpenAI system cards are released:

1. **Download the system card PDF** to `/public/docs/openai/`

2. **Read the risk evaluation sections** to extract:
   - Risk levels (Low/Medium/High/Critical)
   - Risk scores (0-1 scale)
   - Threshold proximity (0-1 scale)
   - Mitigations implemented

3. **Update JSON files**:
   - Add model to `data/openai/models.json` if new
   - Add assessment to `data/openai/risk-assessments.json`
   - Add release event to `data/openai/events.json`
   - Add source document to `data/openai/sources.json`

4. **Update timestamps** and commit changes

5. **Verify in dashboard** by running locally

## Official Data Sources

All risk assessments are sourced from:

- [OpenAI Preparedness Framework v2](https://openai.com/preparedness/)
- [GPT-4o System Card](https://openai.com/index/gpt-4o-system-card/)
- [o3 System Card](https://openai.com/index/o3-system-card/)
- [o3-mini System Card](https://openai.com/index/openai-o3-mini-system-card/)
- [o1 System Card](https://openai.com/index/o1-system-card/)
- [OpenAI Safety Hub](https://openai.com/safety/)

## Key Insights (January 2026)

- **o3** is the first model to receive **High** precautionary ratings in bio/chem
- **Cyber capabilities** across o-series models are approaching or crossing thresholds (95% proximity)
- **GPT-4o** and **o3-mini** maintain medium risk levels
- **o1-pro** and **o3** show precautionary medium ratings in persuasion
- **GPT-5** (projected) expected to approach critical thresholds in bio/chem

## Risk Levels Explained

- **Low** (Green) - Minimal capability, standard mitigations sufficient
- **Medium** (Yellow) - Moderate capability, enhanced monitoring required
- **High** (Red) - Significant capability, strict access controls needed
- **Critical** (Dark Red) - Extreme capability, deployment restrictions required

## Future Enhancements

- [ ] Add Anthropic dashboard (Claude models with RSP framework)
- [ ] Add Google DeepMind dashboard (Gemini models)
- [ ] Real-time notifications for threshold crossings
- [ ] Historical trend analysis and predictions
- [ ] Export reports to PDF
- [ ] Multi-lab comparisons
- [ ] API for programmatic access

## License

This project is for educational and research purposes, tracking publicly available AI safety data.

---

**Last Updated**: January 2026
**Data Source**: OpenAI Preparedness Framework v2
