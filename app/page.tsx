'use client';

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Activity, Shield, AlertTriangle, TrendingUp, Cpu, Server, Zap, Globe } from "lucide-react";
import { WorldMap } from "@/components/features/maps/world-map";
import { MapFilters } from "@/components/features/maps/map-filters";
import {
  getModels as getOpenAIModels,
  getRiskAssessments as getOpenAIAssessments,
} from "@/lib/data/openai-data";
import {
  getModels as getAnthropicModels,
  getRiskAssessments as getAnthropicAssessments,
} from "@/lib/data/anthropic-data";
import {
  getModels as getGoogleModels,
  getRiskAssessments as getGoogleAssessments,
} from "@/lib/data/google-deepmind-data";
import {
  getModels as getXAIModels,
  getRiskAssessments as getXAIAssessments,
} from "@/lib/data/xai-data";
import {
  getTrainingComputeData,
  getDataCenterExpansions,
  getEUActCompliance,
  calculateTotalDataCenterCapacity,
} from "@/lib/data/compute-infrastructure-data";

function FrontierLabsPreview() {
  const openAIModels = getOpenAIModels();
  const openAIAssessments = getOpenAIAssessments();
  const anthropicModels = getAnthropicModels();
  const anthropicAssessments = getAnthropicAssessments();
  const googleModels = getGoogleModels();
  const googleAssessments = getGoogleAssessments();
  const xaiModels = getXAIModels();
  const xaiAssessments = getXAIAssessments();

  const calculateRiskStats = (assessments: any) => {
    const riskCounts = { critical: 0, high: 0, medium: 0, low: 0 };
    assessments?.forEach((assessment: any) => {
      assessment.categoryRisks?.forEach((risk: any) => {
        riskCounts[risk.riskLevel as keyof typeof riskCounts]++;
      });
    });
    return riskCounts;
  };

  const openAIRisks = calculateRiskStats(openAIAssessments);
  const anthropicRisks = calculateRiskStats(anthropicAssessments);
  const googleRisks = calculateRiskStats(googleAssessments);
  const xaiRisks = calculateRiskStats(xaiAssessments);

  return (
    <>
      {/* OpenAI */}
      <Card className="col-span-1 md:col-span-4 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base">OpenAI</CardTitle>
          <CardDescription>Preparedness Framework v2</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Models Tracked</p>
            <p className="text-2xl font-bold">{openAIModels.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Risk Distribution</p>
            <div className="space-y-1 text-xs">
              {openAIRisks.critical > 0 && <div>🔴 Critical: {openAIRisks.critical}</div>}
              {openAIRisks.high > 0 && <div>🟠 High: {openAIRisks.high}</div>}
              {openAIRisks.medium > 0 && <div>🟡 Medium: {openAIRisks.medium}</div>}
              {openAIRisks.low > 0 && <div>🟢 Low: {openAIRisks.low}</div>}
            </div>
          </div>
          <Link href="/frontier-labs" className="inline-block mt-4">
            <Button variant="outline" size="sm" className="w-full">
              View Details <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Anthropic */}
      <Card className="col-span-1 md:col-span-4 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Anthropic</CardTitle>
          <CardDescription>Responsible Scaling Policy (RSP) v2.2</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Models Tracked</p>
            <p className="text-2xl font-bold">{anthropicModels.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Risk Distribution</p>
            <div className="space-y-1 text-xs">
              {anthropicRisks.critical > 0 && <div>🔴 Critical: {anthropicRisks.critical}</div>}
              {anthropicRisks.high > 0 && <div>🟠 High: {anthropicRisks.high}</div>}
              {anthropicRisks.medium > 0 && <div>🟡 Medium: {anthropicRisks.medium}</div>}
              {anthropicRisks.low > 0 && <div>🟢 Low: {anthropicRisks.low}</div>}
            </div>
          </div>
          <Link href="/frontier-labs" className="inline-block mt-4">
            <Button variant="outline" size="sm" className="w-full">
              View Details <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Google DeepMind */}
      <Card className="col-span-1 md:col-span-4 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Google DeepMind</CardTitle>
          <CardDescription>Frontier Safety Framework v3.0</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Models Tracked</p>
            <p className="text-2xl font-bold">{googleModels.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Risk Distribution</p>
            <div className="space-y-1 text-xs">
              {googleRisks.critical > 0 && <div>🔴 Critical: {googleRisks.critical}</div>}
              {googleRisks.high > 0 && <div>🟠 High: {googleRisks.high}</div>}
              {googleRisks.medium > 0 && <div>🟡 Medium: {googleRisks.medium}</div>}
              {googleRisks.low > 0 && <div>🟢 Low: {googleRisks.low}</div>}
            </div>
          </div>
          <Link href="/frontier-labs" className="inline-block mt-4">
            <Button variant="outline" size="sm" className="w-full">
              View Details <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* xAI */}
      <Card className="col-span-1 md:col-span-4 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base">xAI</CardTitle>
          <CardDescription>Frontier AI Framework</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Models Tracked</p>
            <p className="text-2xl font-bold">{xaiModels.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Risk Distribution</p>
            <div className="space-y-1 text-xs">
              {xaiRisks.critical > 0 && <div>🔴 Critical: {xaiRisks.critical}</div>}
              {xaiRisks.high > 0 && <div>🟠 High: {xaiRisks.high}</div>}
              {xaiRisks.medium > 0 && <div>🟡 Medium: {xaiRisks.medium}</div>}
              {xaiRisks.low > 0 && <div>🟢 Low: {xaiRisks.low}</div>}
            </div>
          </div>
          <Link href="/frontier-labs" className="inline-block mt-4">
            <Button variant="outline" size="sm" className="w-full">
              View Details <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </>
  );
}

function ComputeInfrastructurePreview() {
  const trainComputeData = getTrainingComputeData();
  const dataCenters = getDataCenterExpansions();
  const compliance = getEUActCompliance();
  const totalCapacity = calculateTotalDataCenterCapacity();

  const sortedByCompute = [...trainComputeData].sort(
    (a, b) => b.trainingCompute - a.trainingCompute
  );
  const topModel = sortedByCompute[0];

  return (
    <>
      {/* Training Compute */}
      <Card className="col-span-1">
        <CardHeader>
          <Cpu className="h-5 w-5 mb-2 text-blue-500" />
          <CardTitle className="text-base">Training Compute</CardTitle>
          <CardDescription>Frontier models ranked by FLOP</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Peak Model</p>
            <p className="text-sm font-semibold">{topModel?.modelName}</p>
            <p className="text-xs text-muted-foreground">{topModel?.organization}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Models Tracked</p>
            <p className="text-2xl font-bold">{trainComputeData.length}</p>
          </div>
          <Link href="/compute-infrastructure" className="inline-block mt-4">
            <Button variant="outline" size="sm" className="w-full">
              Explore <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Data Centers */}
      <Card className="col-span-1">
        <CardHeader>
          <Server className="h-5 w-5 mb-2 text-green-500" />
          <CardTitle className="text-base">Data Centers</CardTitle>
          <CardDescription>Global AI infrastructure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Capacity</p>
            <p className="text-2xl font-bold">{totalCapacity.toFixed(0)} GW</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Projects</p>
            <p className="text-xl font-semibold">{dataCenters.length}</p>
          </div>
          <Link href="/compute-infrastructure" className="inline-block mt-4">
            <Button variant="outline" size="sm" className="w-full">
              Explore <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* EU Act Compliance */}
      <Card className="col-span-1">
        <CardHeader>
          <AlertTriangle className="h-5 w-5 mb-2 text-orange-500" />
          <CardTitle className="text-base">EU AI Act</CardTitle>
          <CardDescription>10^25 FLOP threshold</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Compliant</p>
            <p className="text-2xl font-bold text-green-600">{compliance.compliant}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Non-Compliant</p>
            <p className="text-2xl font-bold text-red-600">{compliance.nonCompliant}</p>
          </div>
          <Link href="/compute-infrastructure" className="inline-block mt-4">
            <Button variant="outline" size="sm" className="w-full">
              Explore <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Concentration */}
      <Card className="col-span-1">
        <CardHeader>
          <TrendingUp className="h-5 w-5 mb-2 text-purple-500" />
          <CardTitle className="text-base">Market Share</CardTitle>
          <CardDescription>Compute resource concentration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Top Entity</p>
            <p className="text-sm font-semibold">Alphabet (Google)</p>
            <p className="text-xs text-muted-foreground">25-30% market share</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Investment 2024-2026</p>
            <p className="text-lg font-bold">$900B+</p>
          </div>
          <Link href="/compute-infrastructure" className="inline-block mt-4">
            <Button variant="outline" size="sm" className="w-full">
              Explore <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </>
  );
}

export default function Home() {
  const [mapFilters, setMapFilters] = useState({
    showLabs: true,
    showDataCenters: true,
    showManufacturers: true,
  });

  return (
    <div>
      {/* World Map Section */}
      <div className="mb-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 bg-muted/30 border-y">
        <div className="container">
          <div className="text-center mb-8">
            <Globe className="h-10 w-10 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl font-bold mb-2">Global AI Infrastructure & Risk Landscape</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Track frontier AI labs, data centers, and chip manufacturing across the globe
            </p>
          </div>

          {/* Map Filters */}
          <MapFilters onFiltersChange={setMapFilters} />

          <div style={{ height: "600px" }} className="rounded-lg overflow-hidden">
            <WorldMap
              showLabs={mapFilters.showLabs}
              showDataCenters={mapFilters.showDataCenters}
              showManufacturers={mapFilters.showManufacturers}
              height={600}
            />
          </div>
        </div>
      </div>

      <div className="container py-16">
        {/* Hero Section - Simplified */}
        <div className="text-center mb-16">
          <Activity className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-5xl font-bold mb-4">AI Red Lines Tracker</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Track how close frontier AI models are to critical risk thresholds using official
            system cards and preparedness frameworks. Compare risk assessments across OpenAI,
            Anthropic, Google DeepMind, and xAI, monitor training compute and infrastructure, and
            stay informed on regulatory compliance.
          </p>
        </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 mb-2 text-green-500" />
            <CardTitle>Official Data Sources</CardTitle>
            <CardDescription>
              All risk assessments sourced directly from published system cards and
              preparedness frameworks
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Activity className="h-8 w-8 mb-2 text-blue-500" />
            <CardTitle>Real-Time Tracking</CardTitle>
            <CardDescription>
              Monitor threshold proximity and risk levels as new models are released and
              evaluated
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <AlertTriangle className="h-8 w-8 mb-2 text-orange-500" />
            <CardTitle>Threshold Alerts</CardTitle>
            <CardDescription>
              Identify when models approach or cross critical risk thresholds across multiple
              domains
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* What We Track */}
      <Card className="mb-16">
        <CardHeader>
          <CardTitle>What We Track</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Risk Categories</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Biological and Chemical Threats</li>
                <li>• Cybersecurity</li>
                <li>• Persuasion and Manipulation</li>
                <li>• AI Self-Improvement</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Risk Levels</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Low - Minimal capability</li>
                <li>• Medium - Moderate capability with mitigations</li>
                <li>• High - Significant capability requiring controls</li>
                <li>• Critical - Extreme capability requiring intervention</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Frontier Labs Preview */}
      <div className="mb-16">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Frontier Labs Risk Analysis</h2>
          <p className="text-muted-foreground">
            Compare risk assessments across OpenAI, Anthropic, and Google DeepMind using their
            respective frameworks and evaluation methodologies
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FrontierLabsPreview />
        </div>
        <div className="mt-4">
          <Link href="/frontier-labs">
            <Button className="w-full">
              View Complete Frontier Labs Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Compute Infrastructure Preview */}
      <div className="mb-16">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Compute Resources & Infrastructure</h2>
          <p className="text-muted-foreground">
            Track training compute, data center expansion, market concentration, and AI chip
            shipments across frontier labs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ComputeInfrastructurePreview />
        </div>
        <div className="mt-4">
          <Link href="/compute-infrastructure">
            <Button className="w-full">
              View Complete Compute Infrastructure Dashboard{" "}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* AI R&D Tracker */}
      <Card>
        <CardHeader>
          <CardTitle>AI R&D Acceleration Tracker</CardTitle>
          <CardDescription>
            Cross-lab comparison of AI R&D red lines, benchmarks, and frontier model
            capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-muted-foreground mb-6">
              Explore how OpenAI, Anthropic, and Google DeepMind define and measure AI
              capabilities for accelerated research cycles. Compare red line definitions, METR
              benchmark results, and areas of convergence and divergence in frontier AI safety
              approaches.
            </p>
            <Link href="/ai-rnd">
              <Button>
                View AI R&D Tracker <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div>
              <p className="text-sm font-semibold mb-1">Red Line Definitions</p>
              <p className="text-xs text-muted-foreground">
                Lab-specific threshold definitions for R&D acceleration
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">METR Benchmarks</p>
              <p className="text-xs text-muted-foreground">
                Autonomy evaluation frameworks measuring research capability
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Convergence Analysis</p>
              <p className="text-xs text-muted-foreground">
                Areas of alignment and divergence across labs
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
