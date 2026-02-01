"use client";

import { EUAIAnalysis } from "@/components/features/dashboard/eu-ai-analysis";

export default function AIRedLineAnalysisPage() {
  return (
    <div>
      <div className="container py-8 pb-0">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4">AI Red Line Analysis</h1>
          <p className="text-xl text-muted-foreground mb-8">
            30 Universal AI Red Line Indicators - Verified Comparison Across 16 Frontier Models
          </p>
        </div>
      </div>

      <div className="container py-8">
        <EUAIAnalysis />
      </div>
    </div>
  );
}
