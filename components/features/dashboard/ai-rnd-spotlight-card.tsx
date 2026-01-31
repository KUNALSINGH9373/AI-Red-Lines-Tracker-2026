"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThresholdGauge } from "../charts/threshold-gauge";
import { ArrowRight, TrendingUp } from "lucide-react";
import type { RedLineDefinition } from "@/lib/types/risk-data";

interface AiRndSpotlightCardProps {
  redLineDefinition: RedLineDefinition | undefined;
  proximity: number;
  modelName: string;
  lab: string;
}

const LAB_LABELS: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  "google-deepmind": "Google DeepMind",
};

export function AiRndSpotlightCard({
  redLineDefinition,
  proximity,
  modelName,
  lab,
}: AiRndSpotlightCardProps) {
  if (!redLineDefinition) return null;

  return (
    <Card className="border-2 border-dashed">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <Badge variant="secondary">AI R&D Tracker</Badge>
        </div>
        <CardTitle>AI R&D Acceleration Spotlight</CardTitle>
        <CardDescription>
          {LAB_LABELS[lab as keyof typeof LAB_LABELS]}'s red line definition and
          current proximity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold text-sm mb-2">Red Line Definition</h4>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {redLineDefinition.definition}
          </p>
          <Badge variant="outline" className="text-xs">
            {redLineDefinition.quantitative ? "Quantitative" : "Qualitative"}
          </Badge>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-4">
            {modelName} Proximity to Red Line
          </h4>
          <ThresholdGauge thresholdProximity={proximity} />
        </div>

        <Link
          href="/ai-rnd"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline group"
        >
          View Cross-Lab Comparison
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  );
}
