"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  getModels,
  getRiskAssessments,
  getRiskCategories,
  getEvents,
  getLastUpdated,
  getFrameworkVersion,
  getSources,
  getModelById,
  getRiskLevels,
  getRiskLevelColor,
} from "@/lib/data/xai-data";
import { RiskOverviewCard } from "@/components/features/dashboard/risk-overview-card";
import { ThresholdProximityIndicator } from "@/components/features/dashboard/threshold-proximity-indicator";
import { LatestUpdatesFeed } from "@/components/features/dashboard/latest-updates-feed";
import { RiskProgressionChart } from "@/components/features/charts/risk-progression-chart";
import { ModelComparisonChart } from "@/components/features/charts/model-comparison-chart";
import { RiskCategoryRadar } from "@/components/features/charts/risk-category-radar";
import { RiskHeatmap } from "@/components/features/charts/risk-heatmap";
import { ExternalLink, AlertTriangle, TrendingUp, Zap } from "lucide-react";
import { SourceBadge } from "@/components/shared/source-badge";
import { CHART_COLORS } from "@/lib/constants/thresholds";

export default function XAIDashboard() {
  const models = getModels();
  const assessments = getRiskAssessments();
  const categories = getRiskCategories();
  const events = getEvents();
  const lastUpdated = getLastUpdated();
  const frameworkVersion = getFrameworkVersion();
  const sources = getSources();
  const riskLevels = getRiskLevels();

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">xAI Risk Dashboard</h1>
            <p className="text-muted-foreground">
              Tracking Grok model capabilities against {frameworkVersion} thresholds
            </p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-2">
              Last Updated: {lastUpdated}
            </Badge>
            <div>
              <a
                href="https://data.x.ai/2025-12-31-xai-frontier-artificial-intelligence-framework.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                View Framework
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <RiskOverviewCard assessments={assessments} getModelById={getModelById} riskLevels={riskLevels} />
        </div>
        <div>
          <ThresholdProximityIndicator assessments={assessments} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Risk Progression Over Time</CardTitle>
              <CardDescription>
                {selectedCategory
                  ? `Risk progression for the selected category`
                  : `Combined risk (average across all categories) for each model`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex gap-2 flex-wrap">
                  <Badge
                    variant={selectedCategory === undefined ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(undefined)}
                  >
                    All Categories
                  </Badge>
                  {categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={
                        selectedCategory === category.id ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <RiskProgressionChart
                assessments={assessments}
                categoryId={selectedCategory}
                getModelColor={(modelId) => CHART_COLORS[modelId as keyof typeof CHART_COLORS] || "#6b7280"}
              />
            </CardContent>
          </Card>
        </div>
        <div>
          <LatestUpdatesFeed events={events} />
        </div>
      </div>

      <Tabs defaultValue="comparison" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparison">Model Comparison</TabsTrigger>
          <TabsTrigger value="radar">Risk Profile</TabsTrigger>
          <TabsTrigger value="heatmap">Risk Heatmap</TabsTrigger>
        </TabsList>
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Model Risk Comparison</CardTitle>
              <CardDescription>
                Compare risk scores across different Grok models and categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ModelComparisonChart
                assessments={assessments}
                categoryId={selectedCategory}
                getRiskLevelColor={getRiskLevelColor}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="radar">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Dimensional Risk Profile</CardTitle>
              <CardDescription>
                Radar view of Grok model capabilities across all risk categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RiskCategoryRadar
                assessments={assessments}
                getModelColor={(modelId) => CHART_COLORS[modelId as keyof typeof CHART_COLORS] || "#6b7280"}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="heatmap">
          <Card>
            <CardHeader>
              <CardTitle>Risk Heatmap</CardTitle>
              <CardDescription>
                Grid view showing risk levels for all model-category combinations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RiskHeatmap
                assessments={assessments}
                models={models}
                categories={categories}
                getRiskLevelColor={getRiskLevelColor}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Key Insights
          </CardTitle>
          <CardDescription>
            Critical findings from official xAI model cards and framework
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
              <div className="flex items-start gap-2 mb-2">
                <Zap className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Superhuman Biology Capabilities</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Grok 4</strong> and <strong>Grok 4.1</strong> demonstrate expert-level and superhuman performance on biological threat benchmarks (WMDP Bio accuracy of 87% for Grok 4.1), exceeding human baselines. xAI has implemented comprehensive input filters for bioweapons knowledge to mitigate misuse risks.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <SourceBadge sourceId="src-003" section="Dual-Use Capabilities" />
                    <SourceBadge sourceId="src-004" section="Dual-Use Capabilities" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20">
              <div className="flex items-start gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Strong Abuse Mitigations in Place</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    All Grok models maintain near-zero response rates (0.00-0.02) for harmful requests through system prompt refusal policies and input filtering. Refusals remain robust against jailbreak attempts and adversarial attacks.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <SourceBadge sourceId="src-003" section="Abuse Potential" />
                    <SourceBadge sourceId="src-004" section="Abuse Potential" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Specialized Model Trade-offs</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Grok Code Fast 1</strong>, a specialized model for agentic coding, shows elevated dishonesty rates (71.9% on MASK benchmark). This trade-off was accepted due to the narrow use-case focus and limited general-purpose exposure as a specialized tool.
                  </p>
                  <div className="mt-2">
                    <SourceBadge sourceId="src-006" section="Concerning Propensities" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Agentic Security Risks</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Grok Code Fast 1</strong> shows elevated vulnerability to agentic abuse (17% completion rate on AgentHarm benchmark) and hijacking attacks (26.9% success rate), reflecting challenges in securing specialized agent models.
                  </p>
                  <div className="mt-2">
                    <SourceBadge sourceId="src-006" section="Abuse Potential" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-950/20">
              <div className="flex items-start gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-purple-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Quantitative Benchmark-Based Framework</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    xAI uses rigorous quantitative benchmarks (WMDP, VCT, BioLP-Bench, CyBench, MASK) for risk assessment rather than qualitative ratings. All models maintain low overall risk through enforced safety measures and continuous monitoring.
                  </p>
                  <div className="mt-2">
                    <SourceBadge sourceId="src-001" section="Framework Overview" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Risk Categories</CardTitle>
          <CardDescription>
            xAI {frameworkVersion} evaluation domains
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Official Sources</CardTitle>
          <CardDescription>
            All data sourced from official xAI documentation
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
                      Published: {source.publishDate}
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
          <div className="mt-6 p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              All risk assessments, scores, and threshold proximity values are extracted directly from official xAI model cards and the Frontier Artificial Intelligence Framework. Each data point is grounded in quantitative benchmark results and includes citations to source documents.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
