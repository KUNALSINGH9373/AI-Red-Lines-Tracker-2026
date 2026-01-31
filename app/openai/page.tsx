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
} from "@/lib/data/openai-data";
import { RiskOverviewCard } from "@/components/features/dashboard/risk-overview-card";
import { ThresholdProximityIndicator } from "@/components/features/dashboard/threshold-proximity-indicator";
import { LatestUpdatesFeed } from "@/components/features/dashboard/latest-updates-feed";
import { AiRndSpotlightCard } from "@/components/features/dashboard/ai-rnd-spotlight-card";
import { getRedLineDefinitionByLab } from "@/lib/data/cross-lab-data";
import { RiskProgressionChart } from "@/components/features/charts/risk-progression-chart";
import { ModelComparisonChart } from "@/components/features/charts/model-comparison-chart";
import { RiskCategoryRadar } from "@/components/features/charts/risk-category-radar";
import { RiskHeatmap } from "@/components/features/charts/risk-heatmap";
import { ExternalLink, AlertTriangle, TrendingUp } from "lucide-react";
import { SourceBadge } from "@/components/shared/source-badge";
import { CHART_COLORS } from "@/lib/constants/thresholds";

export default function OpenAIDashboard() {
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
            <h1 className="text-4xl font-bold mb-2">OpenAI Risk Dashboard</h1>
            <p className="text-muted-foreground">
              Tracking model capabilities against Preparedness Framework{" "}
              {frameworkVersion} thresholds
            </p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-2">
              Last Updated: {lastUpdated}
            </Badge>
            <div>
              <a
                href="https://openai.com/preparedness/"
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
                Compare risk scores across different models and categories
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
            Critical findings from official OpenAI system cards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">High-Risk Models Confirmed</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>o3</strong> (December 2024) was the first OpenAI model to receive a <strong>High</strong> precautionary rating in biological and chemical threats (72% risk score, 90% threshold proximity). <strong>GPT-5</strong> (August 2025) also achieved High capability rating in bio/chem with 82% risk score and 95% threshold proximity.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <SourceBadge sourceId="src-004" section="o3 System Card" />
                    <SourceBadge sourceId="src-007" section="GPT-5 System Card" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Cybersecurity Threshold Nearly Crossed</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The <strong>o3 model</strong> shows <strong>95% threshold proximity</strong> in cybersecurity, indicating it is very close to or may have already crossed the high-risk threshold for cyber capabilities (78% risk score).
                  </p>
                  <div className="mt-2">
                    <SourceBadge sourceId="src-004" section="Section 5.2" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
              <div className="flex items-start gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Progression Across Model Families</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Risk levels have increased from <strong>GPT-4o (medium, 45-52%)</strong> to <strong>o-series models (medium-high, 48-78%)</strong>. The o-series shows significant capability improvements in reasoning-intensive risk categories.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <SourceBadge sourceId="src-001" section="GPT-4o Assessment" />
                    <SourceBadge sourceId="src-004" section="o3 Assessment" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-950/20">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-purple-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Precautionary Medium Ratings Applied</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    OpenAI applied precautionary <strong>medium risk ratings</strong> to o1-pro and o3 for persuasion capabilities, despite lower absolute scores, acknowledging uncertainty in measurement and potential for misuse.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <SourceBadge sourceId="src-003" section="Section 6.3" />
                    <SourceBadge sourceId="src-004" section="Section 5.3" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
              <div className="flex items-start gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Mitigations Deployed</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    All high and medium risk models have <strong>enhanced mitigations</strong> including usage monitoring, content filtering, access controls, rate limiting, and real-time threat detection systems.
                  </p>
                  <div className="mt-2">
                    <SourceBadge sourceId="src-002" section="Preparedness Framework v2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AiRndSpotlightCard
        redLineDefinition={getRedLineDefinitionByLab("openai")}
        proximity={0.5}
        modelName="GPT-5"
        lab="openai"
      />

      <Card>
        <CardHeader>
          <CardTitle>Risk Categories</CardTitle>
          <CardDescription>
            OpenAI Preparedness Framework {frameworkVersion} evaluation domains
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
            All data sourced from official OpenAI documentation
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
              All risk assessments, scores, and threshold proximity values are extracted directly from official OpenAI system cards and the Preparedness Framework. Each data point includes a citation linking to the specific section of the source document.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
