"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import type { RedLineDefinition } from "@/lib/types/risk-data";

interface RedLineComparisonChartProps {
  redLineDefinitions: RedLineDefinition[];
}

const LAB_COLORS: Record<string, string> = {
  openai: "#3b82f6",
  anthropic: "#f97316",
  "google-deepmind": "#a855f7",
};

export function RedLineComparisonChart({
  redLineDefinitions,
}: RedLineComparisonChartProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {redLineDefinitions.map((definition) => {
        const labColor = LAB_COLORS[definition.lab as keyof typeof LAB_COLORS];
        const labLabel =
          definition.lab === "google-deepmind"
            ? "Google DeepMind"
            : definition.lab.charAt(0).toUpperCase() + definition.lab.slice(1);

        return (
          <Card key={definition.id} className="border-l-4" style={{ borderLeftColor: labColor }}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{labLabel}</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {definition.frameworkVersion}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {definition.quantitative ? "Quantitative" : "Qualitative"}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2 text-foreground">
                    Red Line Definition
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {definition.definition}
                  </p>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    <strong>Source:</strong> {definition.sourceSection}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
