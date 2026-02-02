"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RedLineDefinition, BenchmarkResult } from "@/lib/types/risk-data";

interface EvidenceMatrixProps {
  redLineDefinitions: RedLineDefinition[];
  benchmarkResults: BenchmarkResult[];
}

type EvidenceLevel = "strong" | "partial" | "none" | "na";

interface EvidenceCell {
  level: EvidenceLevel;
  label: string;
  icon: string;
  description: string;
}

const EVIDENCE_MAP: Record<EvidenceLevel, EvidenceCell> = {
  strong: {
    level: "strong",
    label: "[X] Strong Evidence",
    icon: "✓",
    description: "Tested & documented with quantitative benchmarks",
  },
  partial: {
    level: "partial",
    label: "[~] Partial Evidence",
    icon: "~",
    description: "Policy exists with testing, or qualitative evidence",
  },
  none: {
    level: "none",
    label: "[ ] No Evidence",
    icon: "○",
    description: "Not tested/documented",
  },
  na: {
    level: "na",
    label: "[N/A] Not Applicable",
    icon: "—",
    description: "Not applicable to lab's framework",
  },
};

const LAB_NAMES: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  "google-deepmind": "Google DeepMind",
  xai: "xAI",
};

const LAB_COLORS: Record<string, string> = {
  openai: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
  anthropic:
    "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800",
  "google-deepmind":
    "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800",
  xai: "bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800",
};

const LAB_TEXT_COLORS: Record<string, string> = {
  openai: "text-blue-900 dark:text-blue-100",
  anthropic: "text-orange-900 dark:text-orange-100",
  "google-deepmind": "text-purple-900 dark:text-purple-100",
  xai: "text-violet-900 dark:text-violet-100",
};

export function EvidenceMatrix({
  redLineDefinitions,
  benchmarkResults,
}: EvidenceMatrixProps) {
  // Determine evidence level for each lab
  const determineEvidenceLevel = (
    lab: string,
    definition: RedLineDefinition | null
  ): EvidenceLevel => {
    if (!definition) {
      return "na";
    }

    // Check if benchmark results exist for this lab
    const hasBenchmark = benchmarkResults.some((r) => r.lab === lab);

    // Strong evidence: has red line definition + quantitative measurement
    if (definition.quantitative && hasBenchmark) {
      return "strong";
    }

    // Partial evidence: has red line definition + testing (benchmark)
    if (hasBenchmark) {
      return "partial";
    }

    // Partial evidence: has red line definition but no active testing
    if (!hasBenchmark) {
      return "partial";
    }

    return "none";
  };

  // Map labs to their definitions
  const labsByKey = new Map<string, RedLineDefinition>();
  redLineDefinitions.forEach((def) => {
    labsByKey.set(def.lab, def);
  });

  const labs = ["openai", "anthropic", "google-deepmind", "xai"];

  // Get unique categories from red line definitions
  const uniqueCategories = Array.from(
    new Set(redLineDefinitions.map((def) => def.categoryId))
  );

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(EVIDENCE_MAP).map(([key, evidence]) => (
          <div key={key} className="p-4 rounded-lg border bg-card">
            <div className="flex items-start gap-3">
              <div className="text-lg font-bold text-muted-foreground flex-shrink-0">
                {evidence.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{evidence.label}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {evidence.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Evidence Matrix Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-4 text-left font-semibold text-sm border-r">
                Risk Category
              </th>
              {labs.map((lab) => (
                <th
                  key={lab}
                  className="p-4 text-center font-semibold text-sm border-r last:border-r-0"
                >
                  {LAB_NAMES[lab]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {uniqueCategories.map((categoryId) => {
              const categoryDefinition = redLineDefinitions.find(
                (def) => def.categoryId === categoryId
              );

              return (
                <tr
                  key={categoryId}
                  className="border-b hover:bg-muted/25 transition-colors last:border-b-0"
                >
                  <td className="p-4 font-medium text-sm bg-muted/30 border-r">
                    <div className="flex flex-col gap-1">
                      <span>{categoryId}</span>
                      <span className="text-xs text-muted-foreground">
                        ({LAB_NAMES[categoryDefinition?.lab || ""]})
                      </span>
                    </div>
                  </td>

                  {labs.map((lab) => {
                    const labDef = labsByKey.get(lab);
                    const evidence = determineEvidenceLevel(lab, labDef);
                    const evidenceCell = EVIDENCE_MAP[evidence];

                    // Highlight the lab that defined this category
                    const isDefiningLab = categoryDefinition?.lab === lab;

                    return (
                      <td
                        key={`${categoryId}-${lab}`}
                        className={`p-4 text-center border-r last:border-r-0 ${
                          isDefiningLab ? LAB_COLORS[lab] || "" : ""
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className={`text-2xl font-bold ${
                              LAB_TEXT_COLORS[lab] ||
                              "text-gray-900 dark:text-gray-100"
                            }`}
                          >
                            {evidenceCell.icon}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {evidenceCell.level === "strong"
                              ? "Strong"
                              : evidenceCell.level === "partial"
                                ? "Partial"
                                : evidenceCell.level === "none"
                                  ? "None"
                                  : "N/A"}
                          </Badge>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/20">
          <h4 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">
            What This Matrix Shows
          </h4>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-2">
            <li>
              <strong>[X] Strong Evidence:</strong> Lab has quantitative red line
              definition + active benchmark testing
            </li>
            <li>
              <strong>[~] Partial Evidence:</strong> Lab has policy/framework but
              testing is qualitative or early-stage
            </li>
            <li>
              <strong>[ ] No Evidence:</strong> No formal red line or documented
              testing for this category
            </li>
            <li>
              <strong>[N/A] Not Applicable:</strong> Category outside the lab's
              specific framework
            </li>
          </ul>
        </div>

        <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950/20">
          <h4 className="font-semibold text-sm mb-2 text-green-900 dark:text-green-100">
            Key Insight
          </h4>
          <p className="text-xs text-green-800 dark:text-green-200 mb-2">
            All four labs have defined red lines for AI R&D acceleration and
            conduct active testing via benchmarks. The variation shows different
            measurement philosophies:
          </p>
          <ul className="text-xs text-green-800 dark:text-green-200 space-y-1">
            <li>
              • <strong>OpenAI & Anthropic:</strong> Quantitative metrics (time
              reduction, compute scaling)
            </li>
            <li>
              • <strong>Google DeepMind & xAI:</strong> Capability-based
              assessments with qualitative factors
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
