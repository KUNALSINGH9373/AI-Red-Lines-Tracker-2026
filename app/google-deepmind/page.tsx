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
} from "@/lib/data/google-deepmind-data";
import { RiskOverviewCard } from "@/components/features/dashboard/risk-overview-card";
import { ThresholdProximityIndicator } from "@/components/features/dashboard/threshold-proximity-indicator";
import { LatestUpdatesFeed } from "@/components/features/dashboard/latest-updates-feed";
import { AiRndSpotlightCard } from "@/components/features/dashboard/ai-rnd-spotlight-card";
import { getRedLineDefinitionByLab } from "@/lib/data/cross-lab-data";
import { RiskProgressionChart } from "@/components/features/charts/risk-progression-chart";
import { ModelComparisonChart } from "@/components/features/charts/model-comparison-chart";
import { RiskCategoryRadar } from "@/components/features/charts/risk-category-radar";
import { RiskHeatmap } from "@/components/features/charts/risk-heatmap";
import { ExternalLink, AlertTriangle, TrendingUp, Shield, CheckCircle2 } from "lucide-react";
import { SourceBadge } from "@/components/shared/source-badge";
import { CHART_COLORS } from "@/lib/constants/thresholds";

export default function GoogleDeepMindDashboard() {
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
            <h1 className="text-4xl font-bold mb-2">Google DeepMind Risk Dashboard</h1>
            <p className="text-muted-foreground">
              Tracking model capabilities against Frontier Safety Framework{" "}
              {frameworkVersion} (CCL Framework)
            </p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-2">
              Last Updated: {lastUpdated}
            </Badge>
            <div>
              <a
                href="https://deepmind.google/blog/strengthening-our-frontier-safety-framework/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                View FSF Framework
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
            labName="google-deepmind"
            frameworkVersion={frameworkVersion}
          />
        </div>
        <div>
          <ThresholdProximityIndicator assessments={assessments} threshold={0.75} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>CCL Alert Progression Over Time</CardTitle>
              <CardDescription>
                Track how model capabilities have evolved toward CCL thresholds
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
            Critical findings from official Google DeepMind FSF reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20">
              <div className="flex items-start gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">No CCLs Crossed</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    As of November 2025, <strong>no Gemini models have crossed any Critical Capability Levels</strong>. All models remain below the CCL thresholds defined in FSF v3, though alert thresholds have been triggered in cybersecurity.
                  </p>
                  <div className="mt-2">
                    <SourceBadge sourceId="src-gdm-005" section="Gemini 3 Pro FSF Report" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Cybersecurity Alert Threshold Active</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Gemini 3 Pro</strong> reached the alert threshold for cybersecurity CCL (solved 11/12 key skills v1 challenges, 82% threshold proximity). However, v2 benchmark confirms CCL not crossed (0/13 v2 challenges solved end-to-end). Precautionary mitigations deployed.
                  </p>
                  <div className="mt-2">
                    <SourceBadge sourceId="src-gdm-005" section="Cybersecurity Evaluation" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
              <div className="flex items-start gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">CBRN Improvements Without Alert Crossing</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Gemini 3 Pro shows <strong>clear improvements on CBRN benchmarks</strong>, especially LabBench (practical biology research tasks). Despite improvements, scores remain well below alert thresholds (62% proximity), indicating responsible capability progression.
                  </p>
                  <div className="mt-2">
                    <SourceBadge sourceId="src-gdm-005" section="CBRN Assessment" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-950/20">
              <div className="flex items-start gap-2 mb-2">
                <Shield className="h-5 w-5 text-purple-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">New Harmful Manipulation CCL Added</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    FSF v3 (September 2025) introduced a new CCL for <strong>harmful manipulation</strong> - addressing AI models with powerful manipulative capabilities that could systematically change beliefs and behaviors. All current models remain below alert thresholds (45% proximity).
                  </p>
                  <div className="mt-2">
                    <SourceBadge sourceId="src-gdm-002" section="FSF v3.0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AiRndSpotlightCard
        redLineDefinition={getRedLineDefinitionByLab("google-deepmind")}
        proximity={0.4}
        modelName="Gemini 3 Pro"
        lab="google-deepmind"
      />

      <Tabs defaultValue="comparison" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparison">Model Comparison</TabsTrigger>
          <TabsTrigger value="radar">Risk Profile</TabsTrigger>
          <TabsTrigger value="heatmap">CCL Heatmap</TabsTrigger>
        </TabsList>
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Model CCL Comparison</CardTitle>
              <CardDescription>
                Compare alert thresholds and CCL proximity across Gemini models
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
                Radar view of model capabilities across all CCL categories
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
              <CardTitle>CCL Status Heatmap</CardTitle>
              <CardDescription>
                Grid view showing CCL alert status for all model-category combinations
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
          <CardTitle>CCL Framework Explained</CardTitle>
          <CardDescription>
            Google DeepMind's Critical Capability Levels under {frameworkVersion}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border-l-4 border-l-blue-500">
              <h3 className="font-semibold mb-2">Alert Thresholds</h3>
              <p className="text-sm text-muted-foreground">
                Early warning indicators designed to flag when a CCL may be reached before a full risk assessment. Precautionary mitigations deployed when alert thresholds are triggered.
              </p>
            </div>
            <div className="p-4 rounded-lg border-l-4 border-l-orange-500">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Critical Capability Levels (CCLs)
              </h3>
              <p className="text-sm text-muted-foreground">
                Capability levels at which, absent mitigation measures, frontier AI models may pose heightened risk of severe harm. Comprehensive safeguards required when CCLs are met.
              </p>
            </div>
            <div className="p-4 rounded-lg border-l-4 border-l-green-500">
              <h3 className="font-semibold mb-2">Below Alert Threshold</h3>
              <p className="text-sm text-muted-foreground">
                Models operating substantially below both alert thresholds and CCLs. Standard safety practices and monitoring in place.
              </p>
            </div>
            <div className="p-4 rounded-lg border-l-4 border-l-purple-500">
              <h3 className="font-semibold mb-2">Precautionary Approach</h3>
              <p className="text-sm text-muted-foreground">
                Google DeepMind deploys mitigations when alert thresholds are reached, even if actual CCLs aren't crossed, ensuring proactive safety measures.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>CCL Categories</CardTitle>
          <CardDescription>
            Google DeepMind {frameworkVersion} evaluation domains
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
            All data sourced from official Google DeepMind documentation
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
              All CCL assessments, alert threshold determinations, and capability scores are extracted directly from official Google DeepMind Frontier Safety Framework reports and model cards. Each data point includes a citation linking to the specific section of the source document.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
