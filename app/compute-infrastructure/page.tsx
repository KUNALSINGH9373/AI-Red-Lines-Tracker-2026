"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Server, Zap, TrendingUp, Cpu } from "lucide-react";
import {
  getTrainingComputeData,
  getDataCenterExpansions,
  getComputeConcentration,
  getChipShipments,
  getSources,
  getLastUpdated,
  getEUActCompliance,
  calculateTotalDataCenterCapacity,
  calculateTotalCapex,
} from "@/lib/data/compute-infrastructure-data";
import { TrainingComputeChart } from "@/components/features/charts/training-compute-chart";
import { EUActComplianceIndicator } from "@/components/features/charts/eu-act-compliance-indicator";
import { DataCenterExpansionChart } from "@/components/features/charts/data-center-expansion-chart";
import { ComputeConcentrationHeatmap } from "@/components/features/charts/compute-concentration-heatmap";
import { ChipShipmentsFlowChart } from "@/components/features/charts/chip-shipments-flow-chart";

export default function ComputeInfrastructureDashboard() {
  const trainingComputeData = getTrainingComputeData();
  const dataCenterExpansions = getDataCenterExpansions();
  const concentration = getComputeConcentration();
  const chipShipments = getChipShipments();
  const sources = getSources();
  const lastUpdated = getLastUpdated();
  const compliance = getEUActCompliance();
  const totalCapacity = calculateTotalDataCenterCapacity();
  const totalCapex = calculateTotalCapex();

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Compute Resources & Infrastructure</h1>
            <p className="text-muted-foreground text-lg">
              Track training compute, data centers, and AI chip shipments across frontier AI labs
            </p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-2">
              Last Updated: {lastUpdated}
            </Badge>
          </div>
        </div>

        <div className="p-6 rounded-lg border bg-blue-50 dark:bg-blue-950/20 mb-8">
          <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
            About This Dashboard
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
            Compute infrastructure represents a critical bottleneck and control point for frontier AI
            development. This dashboard tracks training compute (measured in FLOPs), data center expansion
            capacity, market concentration of compute resources, and semiconductor shipment flows to major AI labs.
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            All data sourced from official announcements, investor relations disclosures, regulatory filings,
            and research institutions including Epoch AI, company earnings reports, and news analysis from
            Bloomberg, Reuters, and Financial Times.
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <Zap className="h-8 w-8 mb-2 text-blue-500" />
            <CardTitle className="text-lg">Models Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{trainingComputeData.length}</div>
            <p className="text-sm text-muted-foreground">Frontier models 2023-2026</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Server className="h-8 w-8 mb-2 text-green-500" />
            <CardTitle className="text-lg">Data Center Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCapacity.toFixed(0)} GW</div>
            <p className="text-sm text-muted-foreground">Announced global capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <TrendingUp className="h-8 w-8 mb-2 text-orange-500" />
            <CardTitle className="text-lg">Total CapEx (2024-2026)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalCapex.toFixed(0)}B</div>
            <p className="text-sm text-muted-foreground">Infrastructure investment</p>
          </CardContent>
        </Card>
      </div>

      {/* Training Compute */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Estimated Training Compute per Model
          </CardTitle>
          <CardDescription>
            Log-scale comparison of training compute (in FLOPs) across frontier models, with EU AI Act
            10^25 FLOP threshold highlighted. Models above this threshold require conformity assessments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrainingComputeChart data={trainingComputeData} />
          <div className="mt-6 p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Data Source:</strong> Epoch AI Notable Models Database, with cross-validation from
              company announcements and system cards. Training compute estimates are derived from model size,
              training duration, and published training FLOPs where available.
            </p>
            <p>
              <strong>EU AI Act Context:</strong> The EU AI Act high-capability system provisions (effective
              August 2, 2025) require conformity assessments for models requiring 10^25 FLOPs or more to train.
              As of January 2026, 80% of tracked frontier models exceed this threshold.
            </p>
            <p>
              <strong>Growth Trajectory:</strong> Frontier models show 2.1x-4.4x annual growth in training compute,
              with GPT-5 (3.5×10^25) and Grok-4 (1.6×10^25) representing the current frontier.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* EU Act Compliance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline" className="ml-auto">
              Regulatory
            </Badge>
            EU AI Act 10^25 FLOP Threshold Compliance
          </CardTitle>
          <CardDescription>
            Proportion of frontier models compliant with EU AI Act high-capability system provisions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EUActComplianceIndicator
            compliant={compliance.compliant}
            nonCompliant={compliance.nonCompliant}
          />
        </CardContent>
      </Card>

      {/* Data Center Expansions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Data Center Expansions (2024-2026)
          </CardTitle>
          <CardDescription>
            Global AI infrastructure buildout: capacity additions, timeline, and operational status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataCenterExpansionChart data={dataCenterExpansions} />
          <div className="mt-6 p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Current Capacity:</strong> {totalCapacity.toFixed(0)} GW announced across 10 major projects,
              with an estimated {(totalCapacity * 1.5).toFixed(0)} GW additional capacity expected through 2030.
            </p>
            <p>
              <strong>Investment Leaders:</strong> OpenAI Stargate consortium ($500B for 500 GW), Google Rainier
              ($200+ GW), and Microsoft infrastructure expansion represent the largest commitments.
            </p>
            <p>
              <strong>Bottleneck Factors:</strong> Power availability, real estate, cooling infrastructure, and
              semiconductor supply chain constraints are limiting factors for buildout speed. Energy costs in
              Northern Virginia, Texas, and Midwest locations vary 2-3x, affecting site selection.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Compute Concentration */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Concentration of Compute Resources
          </CardTitle>
          <CardDescription>
            Market share and capital expenditure by entity, showing concentration trends 2024-2026
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ComputeConcentrationHeatmap data={concentration} />
          <div className="mt-6 p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Hyperscaler Dominance:</strong> Google, Microsoft, and Amazon control 62-73% of announced
              compute capacity, with continued consolidation expected as only hyperscalers can finance multi-hundred
              billion dollar infrastructure programs.
            </p>
            <p>
              <strong>OpenAI Consortium Effect:</strong> SoftBank-backed Stargate initiative aims to break hyperscaler
              dominance through public-private partnership, projecting 15-22% market share by 2026.
            </p>
            <p>
              <strong>Declining Diversity:</strong> Smaller players (Anthropic, xAI, DeepSeek) command only 8-12%
              of announced capacity, limiting their independent training infrastructure.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Chip Shipments */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            AI Chip Shipments to Labs (2023-2026)
          </CardTitle>
          <CardDescription>
            NVIDIA H100/H200 and Blackwell GPU distribution across US labs and China, reflecting export
            controls and supply chain constraints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChipShipmentsFlowChart data={chipShipments} />
          <div className="mt-6 p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Export Control Impact:</strong> US Commerce Department restrictions (effective 2022-2023)
              cap China shipments to commodity AI chips. Approved shipments to US labs now account for 99%+ of
              NVIDIA advanced GPU allocations.
            </p>
            <p>
              <strong>Supply Constraints:</strong> NVIDIA can produce ~15-20M advanced GPUs annually. Current demand
              from hyperscalers exceeds supply 2-3x, with waiting times of 6-12 months for new orders.
            </p>
            <p>
              <strong>Strategic Importance:</strong> Control of semiconductor supply chains has become a critical
              geopolitical lever, with US export controls designed to limit frontier AI capability development in
              China while maintaining supply to allied nations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Official Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Official Data Sources</CardTitle>
          <CardDescription>
            All data sourced from official announcements, regulatory filings, and research institutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((source) => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg border hover:bg-accent transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {source.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      Updated: {new Date(source.publishDate).toLocaleDateString()}
                    </p>
                    <Badge variant="outline" className="text-xs capitalize">
                      {source.type.replace("-", " ")}
                    </Badge>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
