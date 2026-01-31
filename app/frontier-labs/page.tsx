"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  getModels as getOpenAIModels,
  getRiskAssessments as getOpenAIAssessments,
  getRiskCategories as getOpenAICategories,
  getEvents as getOpenAIEvents,
  getLastUpdated as getOpenAILastUpdated,
  getFrameworkVersion as getOpenAIFrameworkVersion,
  getSources as getOpenAISources,
  getModelById as getOpenAIModelById,
  getRiskLevels as getOpenAIRiskLevels,
  getRiskLevelColor as getOpenAIRiskLevelColor,
} from "@/lib/data/openai-data";
import {
  getModels as getAnthropicModels,
  getRiskAssessments as getAnthropicAssessments,
  getRiskCategories as getAnthropicCategories,
  getEvents as getAnthropicEvents,
  getLastUpdated as getAnthropicLastUpdated,
  getFrameworkVersion as getAnthropicFrameworkVersion,
  getSources as getAnthropicSources,
  getModelById as getAnthropicModelById,
  getRiskLevels as getAnthropicRiskLevels,
  getRiskLevelColor as getAnthropicRiskLevelColor,
} from "@/lib/data/anthropic-data";
import {
  getModels as getGoogleModels,
  getRiskAssessments as getGoogleAssessments,
  getRiskCategories as getGoogleCategories,
  getEvents as getGoogleEvents,
  getLastUpdated as getGoogleLastUpdated,
  getFrameworkVersion as getGoogleFrameworkVersion,
  getSources as getGoogleSources,
  getModelById as getGoogleModelById,
  getRiskLevels as getGoogleRiskLevels,
  getRiskLevelColor as getGoogleRiskLevelColor,
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
import { ExternalLink, AlertTriangle, TrendingUp, Shield } from "lucide-react";
import { SourceBadge } from "@/components/shared/source-badge";
import { CHART_COLORS } from "@/lib/constants/thresholds";

const LAB_CONFIG = {
  openai: {
    name: "OpenAI",
    title: "OpenAI Risk Dashboard",
    frameworkUrl: "https://openai.com/preparedness/",
    spotlightModel: "GPT-5",
    getModels: getOpenAIModels,
    getAssessments: getOpenAIAssessments,
    getCategories: getOpenAICategories,
    getEvents: getOpenAIEvents,
    getLastUpdated: getOpenAILastUpdated,
    getFrameworkVersion: getOpenAIFrameworkVersion,
    getSources: getOpenAISources,
    getModelById: getOpenAIModelById,
    getRiskLevels: getOpenAIRiskLevels,
    getRiskLevelColor: getOpenAIRiskLevelColor,
  },
  anthropic: {
    name: "Anthropic",
    title: "Anthropic Risk Dashboard",
    frameworkUrl: "https://www.anthropic.com/responsible-scaling-policy",
    spotlightModel: "Claude Opus 4.5",
    getModels: getAnthropicModels,
    getAssessments: getAnthropicAssessments,
    getCategories: getAnthropicCategories,
    getEvents: getAnthropicEvents,
    getLastUpdated: getAnthropicLastUpdated,
    getFrameworkVersion: getAnthropicFrameworkVersion,
    getSources: getAnthropicSources,
    getModelById: getAnthropicModelById,
    getRiskLevels: getAnthropicRiskLevels,
    getRiskLevelColor: getAnthropicRiskLevelColor,
  },
  google: {
    name: "Google DeepMind",
    title: "Google DeepMind Risk Dashboard",
    frameworkUrl: "https://deepmind.google/blog/strengthening-our-frontier-safety-framework/",
    spotlightModel: "Gemini 3 Pro",
    getModels: getGoogleModels,
    getAssessments: getGoogleAssessments,
    getCategories: getGoogleCategories,
    getEvents: getGoogleEvents,
    getLastUpdated: getGoogleLastUpdated,
    getFrameworkVersion: getGoogleFrameworkVersion,
    getSources: getGoogleSources,
    getModelById: getGoogleModelById,
    getRiskLevels: getGoogleRiskLevels,
    getRiskLevelColor: getGoogleRiskLevelColor,
  },
};

type LabKey = keyof typeof LAB_CONFIG;

function LabContent({ lab }: { lab: LabKey }) {
  const config = LAB_CONFIG[lab];
  const models = config.getModels();
  const assessments = config.getAssessments();
  const categories = config.getCategories();
  const events = config.getEvents();
  const lastUpdated = config.getLastUpdated();
  const frameworkVersion = config.getFrameworkVersion();
  const sources = config.getSources();
  const riskLevels = config.getRiskLevels();

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const getRedLineProximity = () => {
    switch (lab) {
      case "openai":
        return 0.5;
      case "anthropic":
        return 0.77;
      case "google":
        return 0.4;
    }
  };

  const getInsights = () => {
    switch (lab) {
      case "openai":
        return (
          <>
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
          </>
        );
      case "anthropic":
        return (
          <>
            <div className="p-4 rounded-lg border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20">
              <div className="flex items-start gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">ASL-3 Classification</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Claude Opus 4.5</strong> has been classified at <strong>ASL-3</strong> under Anthropic's Responsible Scaling Policy v2.2, indicating significantly increased capabilities in AI R&D acceleration and autonomous research.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
              <div className="flex items-start gap-2 mb-2">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Enhanced Safety Measures</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    ASL-3 models require enhanced monitoring, access controls, and risk assessments before deployment, with regular red-teaming and adversarial testing.
                  </p>
                </div>
              </div>
            </div>
          </>
        );
      case "google":
        return (
          <>
            <div className="p-4 rounded-lg border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20">
              <div className="flex items-start gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Frontier Safety Framework FSF v3.0</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Google DeepMind's Frontier Safety Framework v3.0 (September 2025) uses CCL (Capability Confidence Level) classifications to track model advancement and safety measures.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-950/20">
              <div className="flex items-start gap-2 mb-2">
                <Shield className="h-5 w-5 text-purple-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">CCL Framework Approach</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The CCL (Capability Confidence Level) framework provides different thresholds for different risk categories, allowing more granular assessment of model capabilities and safety.
                  </p>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{config.title}</h1>
            <p className="text-muted-foreground">
              Tracking model capabilities against {config.name} framework thresholds
            </p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-2">
              Last Updated: {lastUpdated}
            </Badge>
            <div>
              <a
                href={config.frameworkUrl}
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
          <RiskOverviewCard assessments={assessments} getModelById={config.getModelById} riskLevels={riskLevels} />
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
                getRiskLevelColor={config.getRiskLevelColor}
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
                getRiskLevelColor={config.getRiskLevelColor}
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
            Critical findings from official {config.name} system cards and frameworks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {getInsights()}
        </CardContent>
      </Card>

      <AiRndSpotlightCard
        redLineDefinition={getRedLineDefinitionByLab(lab as "openai" | "anthropic" | "google-deepmind")}
        proximity={getRedLineProximity()}
        modelName={config.spotlightModel}
        lab={lab as "openai" | "anthropic" | "google-deepmind"}
      />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Risk Categories</CardTitle>
          <CardDescription>
            {config.name} framework evaluation domains
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
            All data sourced from official {config.name} documentation
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
              All risk assessments, scores, and threshold proximity values are extracted directly from official {config.name} system cards and frameworks. Each data point includes a citation linking to the specific section of the source document.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function FrontierLabsRiskAnalysisDashboard() {
  const [activeTab, setActiveTab] = useState<LabKey>("openai");

  return (
    <>
      <div className="container py-8 pb-0">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4">Frontier Labs Risk Analysis</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Compare risk assessments across OpenAI, Anthropic, and Google DeepMind using their respective frameworks and evaluation methodologies
          </p>
        </div>
      </div>

      <Tabs defaultValue="openai" value={activeTab} onValueChange={(value) => setActiveTab(value as LabKey)} className="w-full">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="container">
            <TabsList className="grid w-full grid-cols-3 bg-transparent border-0">
              <TabsTrigger value="openai" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                OpenAI
              </TabsTrigger>
              <TabsTrigger value="anthropic" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                Anthropic
              </TabsTrigger>
              <TabsTrigger value="google" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                Google DeepMind
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="openai">
          <LabContent lab="openai" />
        </TabsContent>
        <TabsContent value="anthropic">
          <LabContent lab="anthropic" />
        </TabsContent>
        <TabsContent value="google">
          <LabContent lab="google" />
        </TabsContent>
      </Tabs>
    </>
  );
}
