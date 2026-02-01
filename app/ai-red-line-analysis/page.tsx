"use client";

import { EUAIAnalysis } from "@/components/features/dashboard/eu-ai-analysis";

export default function AIRedLineAnalysisPage() {
  return (
    <div>
      <div className="container py-8 pb-0">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4">AI Red Line Analysis</h1>
          <p className="text-xl text-muted-foreground mb-8">
            EU AI Act Category A Compliance Assessment - Frontier AI Models vs. Prohibited Practices
          </p>
        </div>
      </div>

      <div className="container py-8">
        <EUAIAnalysis />
      </div>
    </div>
  );
}
