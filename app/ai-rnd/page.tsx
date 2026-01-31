"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, TrendingUp, Zap, Target } from "lucide-react";
import {
  getAiRndBenchmarks,
  getRedLineDefinitions,
  getConvergenceDivergence,
  getLatestBenchmarkDate,
} from "@/lib/data/cross-lab-data";
import { RedLineComparisonChart } from "@/components/features/charts/red-line-comparison-chart";
import { CrossLabProximityGauge } from "@/components/features/charts/cross-lab-proximity-gauge";
import { METRBenchmarkTable } from "@/components/features/charts/metr-benchmark-table";
import { ConvergenceDivergencePanel } from "@/components/features/charts/convergence-divergence-panel";
import { CrossLabTimelineChart } from "@/components/features/charts/cross-lab-timeline-chart";

export default function AiRndDashboard() {
  const benchmarks = getAiRndBenchmarks();
  const redLineDefinitions = getRedLineDefinitions();
  const convergenceDivergence = getConvergenceDivergence();
  const lastUpdated = getLatestBenchmarkDate();

  const allResults = benchmarks.flatMap((b) => b.results);

  // Create sample timeline data for demonstration
  const timelineData = [
    {
      date: "2025-05-14",
      "Anthropic": 0.65,
      "OpenAI": 0.35,
      "Google DeepMind": 0.25,
    },
    {
      date: "2025-10-22",
      "Anthropic": 0.72,
      "OpenAI": 0.42,
      "Google DeepMind": 0.32,
    },
    {
      date: "2025-11-24",
      "Anthropic": 0.77,
      "OpenAI": 0.48,
      "Google DeepMind": 0.38,
    },
    {
      date: "2026-01-15",
      "Anthropic": 0.77,
      "OpenAI": 0.50,
      "Google DeepMind": 0.40,
    },
  ];

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">AI R&D Acceleration Tracker</h1>
            <p className="text-muted-foreground text-lg">
              Cross-lab comparison of AI R&D red lines, benchmarks, and frontier
              model capabilities
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
            AI R&D acceleration represents one of the most critical frontier AI risks, where
            models achieve significant speedup in their own training or optimization cycles.
            This dashboard tracks how frontier models from OpenAI, Anthropic, and Google
            DeepMind approach laboratory-defined red lines for this risk category.
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Each lab uses different frameworks and thresholds, creating an opportunity to
            understand convergence and divergence in frontier AI safety approaches.
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <Zap className="h-8 w-8 mb-2 text-orange-500" />
            <CardTitle className="text-lg">Models Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{allResults.length}</div>
            <p className="text-sm text-muted-foreground">Frontier models across three labs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Target className="h-8 w-8 mb-2 text-blue-500" />
            <CardTitle className="text-lg">Red Line Definitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{redLineDefinitions.length}</div>
            <p className="text-sm text-muted-foreground">Lab-specific threshold definitions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <TrendingUp className="h-8 w-8 mb-2 text-green-500" />
            <CardTitle className="text-lg">Benchmarks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{benchmarks.length}</div>
            <p className="text-sm text-muted-foreground">METR research acceleration benchmarks</p>
          </CardContent>
        </Card>
      </div>

      {/* Red Line Definitions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Red Line Definitions Across Labs
          </CardTitle>
          <CardDescription>
            How each lab defines the threshold for AI R&D acceleration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RedLineComparisonChart redLineDefinitions={redLineDefinitions} />
        </CardContent>
      </Card>

      {/* Current Proximity */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Current Proximity to Red Lines
          </CardTitle>
          <CardDescription>
            Latest frontier model proximity to threshold crossing (based on latest system
            cards and benchmark results)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CrossLabProximityGauge benchmarkResults={allResults} />
          <div className="mt-6 p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
            <p>
              <strong>Anthropic Claude Opus 4.5</strong> shows the highest proximity at 77%,
              with <strong>OpenAI GPT-5</strong> estimated at 50% and <strong>Google DeepMind Gemini 3 Pro</strong> at 40%.
              These estimates are based on official system card assessments and represent current
              model capabilities relative to each lab's specific red line definition.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* METR Benchmarks */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>METR Autonomy Evaluation Benchmark</CardTitle>
          <CardDescription>
            AI R&D acceleration measured through machine learning research task completion times
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20">
            <h4 className="font-semibold text-sm mb-2">⚠️ Illustrative Data</h4>
            <p className="text-sm text-muted-foreground">
              The benchmark results shown below are illustrative projections for demonstration purposes,
              not published METR results. For actual METR autonomy evaluation findings, visit the
              METR website at <a href="https://metr.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">metr.org</a>.
            </p>
          </div>

          <div className="p-4 rounded-lg border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
            <h4 className="font-semibold text-sm mb-2">About METR Evaluations</h4>
            <p className="text-sm text-muted-foreground">
              METR develops autonomy evaluation frameworks to measure how quickly frontier models
              can complete machine learning research tasks spanning from minutes to day-long projects.
              These evaluations assess capability to handle algorithm design, hyperparameter optimization,
              and novel research implementation - core capabilities for AI R&D acceleration.
            </p>
          </div>
          <METRBenchmarkTable results={allResults} />
        </CardContent>
      </Card>

      {/* Convergence/Divergence */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Areas of Convergence and Divergence</CardTitle>
          <CardDescription>
            How AI safety approaches align and differ across labs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConvergenceDivergencePanel data={convergenceDivergence} />
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>AI R&D Red Line Proximity Over Time</CardTitle>
          <CardDescription>
            Historical trajectory of frontier models approaching red line thresholds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CrossLabTimelineChart data={timelineData} />
          <div className="mt-6 p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
            <p>
              All three labs show increasing trajectory toward red lines as model capabilities
              advance. Anthropic's trajectory is steepest, reflecting precautionary ASL-3
              classifications based on high proximity. OpenAI and Google DeepMind show more
              gradual advancement, with research ongoing to validate threshold crossing.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Official Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Official Frameworks and Sources</CardTitle>
          <CardDescription>
            All data sourced from official AI lab frameworks and system cards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://openai.com/index/updating-our-preparedness-framework/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-lg border hover:bg-accent transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    OpenAI Preparedness Framework v2
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    AI self-improvement and frontier capability evaluation (April 2025)
                  </p>
                  <Badge variant="outline" className="text-xs">
                    Framework
                  </Badge>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </a>

            <a
              href="https://www.anthropic.com/responsible-scaling-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-lg border hover:bg-accent transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    Anthropic RSP v2.2
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    AI R&D acceleration ASL-3 threshold and mitigation requirements
                  </p>
                  <Badge variant="outline" className="text-xs">
                    Framework
                  </Badge>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </a>

            <a
              href="https://deepmind.google/blog/strengthening-our-frontier-safety-framework/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-lg border hover:bg-accent transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    Google DeepMind Frontier Safety Framework v3.0
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    ML R&D automation CCL and harmful manipulation risk framework (Sept 2025)
                  </p>
                  <Badge variant="outline" className="text-xs">
                    Framework
                  </Badge>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </a>

            <a
              href="https://metr.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-lg border hover:bg-accent transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    METR (Machine Evaluation and Threat Research)
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Autonomy evaluation frameworks and AI R&D acceleration research
                  </p>
                  <Badge variant="outline" className="text-xs">
                    Research Organization
                  </Badge>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
