
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
} from "@/lib/data/anthropic-data";
import { RiskOverviewCard } from "@/components/features/dashboard/risk-overview-card";
import { ThresholdProximityIndicator } from "@/components/features/dashboard/threshold-proximity-indicator";
import { LatestUpdatesFeed } from "@/components/features/dashboard/latest-updates-feed";
import { AiRndSpotlightCard } from "@/components/features/dashboard/ai-rnd-spotlight-card";
import { getRedLineDefinitionByLab } from "@/lib/data/cross-lab-data";
import { RiskProgressionChart } from "@/components/features/charts/risk-progression-chart";
import { ModelComparisonChart } from "@/components/features/charts/model-comparison-chart";
import { RiskCategoryRadar } from "@/components/features/charts/risk-category-radar";
import { RiskHeatmap } from "@/components/features/charts/risk-heatmap";
import { ExternalLink, AlertTriangle, TrendingUp, Shield } from "lucide-react";
import { SourceBadge } from "@/components/shared/source-badge";
import { CHART_COLORS } from "@/lib/constants/thresholds";

export default function AnthropicDashboard() {
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
            <h1 className="text-4xl font-bold mb-2">Anthropic Risk Dashboard</h1>
            <p className="text-muted-foreground">
              Tracking model capabilities against Responsible Scaling Policy{" "}
              {frameworkVersion} (ASL Levels)
            </p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-2">
              Last Updated: {lastUpdated}
            </Badge>
            <div>
              <a
                href="https://www.anthropic.com/responsible-scaling-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                View RSP Framework
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <RiskOverviewCard
            assessments={assessments}
            getModelById={getModelById}
            riskLevels={riskLevels}
            labName="anthropic"
            frameworkVersion={frameworkVersion}
          />
        </div>
        <div>
          <ThresholdProximityIndicator assessments={assessments} threshold={0.85} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>ASL Progression Over Time</CardTitle>
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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Key Insights
          </CardTitle>
          <CardDescription>
            Critical findings from official Anthropic system cards and RSP reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">First ASL-3 Deployment</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Claude Opus 4</strong> (May 2025) was the first Anthropic model deployed under <strong>ASL-3 protections</strong>, marking a significant milestone in AI safety implementation with enhanced security standards and deployment safeguards.
                  </p>
                  <div className="mt-2">
                    <SourceBadge sourceId="src-ant-002" section="ASL-3 Activation Report" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Approaching ASL-4 Thresholds</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Claude Opus 4.5</strong> shows <strong>high rule-out scores</strong> in CBRN uplift (95% proximity), AI R&D acceleration (92% proximity), and autonomy (93% proximity). Next frontier model could be expected to trigger full ASL-4 evaluation and potential pause/mitigation requirements.
                  </p>
                  <div className="mt-2">
                    <SourceBadge sourceId="src-ant-006" section="Claude Opus 4.5 System Card" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
              <div className="flex items-start gap-2 mb-2">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Precautionary and Provisional Classifications</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    All Claude 4 Opus and Sonnet models carry <strong>precautionary ASL-3</strong> classifications, meaning they are deployed under ASL-3 protections even though definitive threshold crossing has not been confirmed. This represents a cautious approach to frontier AI safety.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <SourceBadge sourceId="src-ant-002" section="ASL-3 Report" />
                    <SourceBadge sourceId="src-ant-006" section="Opus 4.5 Card" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-950/20">
              <div className="flex items-start gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-purple-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Enhanced Safeguards Deployed</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    ASL-3 models implement comprehensive safeguards including: enhanced internal security to prevent model weight theft, CBRN-specific deployment restrictions, continuous monitoring systems, and expert uplift testing to assess real-world risk potential.
                  </p>
                  <div className="mt-2">
                    <SourceBadge sourceId="src-ant-009" section="ASL-3 Deployment Safeguards" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AiRndSpotlightCard
        redLineDefinition={getRedLineDefinitionByLab("anthropic")}
        proximity={0.77}
        modelName="Claude Opus 4.5"
        lab="anthropic"
      />

      <Tabs defaultValue="comparison" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparison">Model Comparison</TabsTrigger>
          <TabsTrigger value="radar">Risk Profile</TabsTrigger>
          <TabsTrigger value="heatmap">Risk Heatmap</TabsTrigger>
        </TabsList>
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Model ASL Comparison</CardTitle>
              <CardDescription>
                Compare ASL levels and risk scores across different Claude models
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
                Radar view of model capabilities across all risk categories
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
              <CardTitle>ASL Heatmap</CardTitle>
              <CardDescription>
                Grid view showing ASL levels for all model-category combinations
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
          <CardTitle>ASL Levels Explained</CardTitle>
          <CardDescription>
            Anthropic's AI Safety Level (ASL) framework under {frameworkVersion}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border-l-4 border-l-green-500">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                ASL-1 & ASL-2
              </h3>
              <p className="text-sm text-muted-foreground">
                Models with limited catastrophic risk potential. ASL-2 models like Claude Haiku 4.5 have standard deployment safeguards and usage monitoring.
              </p>
            </div>
            <div className="p-4 rounded-lg border-l-4 border-l-orange-500">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                ASL-3
              </h3>
              <p className="text-sm text-muted-foreground">
                Models with significant capabilities requiring enhanced security and deployment measures. Includes protections against model weight theft and CBRN-specific restrictions.
              </p>
            </div>
            <div className="p-4 rounded-lg border-l-4 border-l-red-500">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                ASL-4
              </h3>
              <p className="text-sm text-muted-foreground">
                Future threshold for models with extreme capabilities. Would trigger comprehensive evaluation and potential development pause until adequate safeguards are developed.
              </p>
            </div>
            <div className="p-4 rounded-lg border-l-4 border-l-blue-500">
              <h3 className="font-semibold mb-2">Precautionary Classification</h3>
              <p className="text-sm text-muted-foreground">
                Anthropic applies higher ASL protections as a precautionary measure when threshold determination is uncertain, erring on the side of safety.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Risk Categories</CardTitle>
          <CardDescription>
            Anthropic {frameworkVersion} evaluation domains
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
            All data sourced from official Anthropic documentation
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
              All ASL classifications, risk scores, and threshold proximity values are extracted directly from official Anthropic system cards and the Responsible Scaling Policy. Each data point includes a citation linking to the specific section of the source document.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
