"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

const EU_INDICATORS = [
  {
    id: 1,
    name: "Subliminal Manipulation",
    description: "Manipulating people below consciousness level",
    details:
      "None of the frameworks (RSP/PF/FSF/FAIF) test for subliminal manipulation. System cards don't evaluate it.",
    result: "INSUFFICIENT DATA",
    resultColor: "text-gray-600",
    evidence: [
      "No capability documented",
      "All have policies against manipulation",
    ],
  },
  {
    id: 2,
    name: "Child Harm",
    description: "Targeting children to exploit age vulnerabilities",
    details:
      "These are general chat models, not child-targeting systems. All prohibit harmful content about children.",
    result: "DOES NOT APPLY",
    resultColor: "text-red-600",
    evidence: [
      "All have CSAM prohibitions in usage policies",
      "GDPR Art. 8 compliance claimed",
      "No child-targeting design documented",
    ],
  },
  {
    id: 3,
    name: "Social Scoring",
    description: "Rating people's social behavior like China's social credit",
    details:
      "Wrong type of system entirely. Social scoring needs systematic evaluation/classification with use of scores for access decisions.",
    result: "DOES NOT APPLY",
    resultColor: "text-red-600",
    evidence: [
      "Deployed as chat interfaces/APIs",
      "No social scoring functionality documented",
    ],
  },
  {
    id: 4,
    name: "Biometric Scraping",
    description: "Scraping faces from internet to build recognition database",
    details:
      "Training data sources are opaque. Training on images is different from creating face recognition database.",
    result: "INSUFFICIENT DATA",
    resultColor: "text-gray-600",
    evidence: [
      "Training data sources opaque",
      "Not deployed for facial recognition",
      "Can't confirm/deny scraped faces in training",
    ],
  },
  {
    id: 5,
    name: "Workplace Emotion Inference",
    description: "Detecting employee emotions to make work decisions",
    details:
      "EU AI Act prohibits the USE of AI for emotion inference, not just capabilities. Violation happens at deployment, not model level.",
    result: "NOT DESIGNED FOR THIS",
    resultColor: "text-orange-600",
    evidence: [
      "Not designed for workplace emotion monitoring",
      "Not deployed for this purpose",
      "Capability exists but not the application",
    ],
  },
  {
    id: 6,
    name: "Predictive Crime Profiling",
    description: "Predicting who will commit crimes based on profiling",
    details:
      "Wrong type of system. Predictive policing requires criminal databases, risk scoring, and law enforcement integration.",
    result: "DOES NOT APPLY",
    resultColor: "text-red-600",
    evidence: [
      "No predictive policing design documented",
      "Usage policies prohibit harmful discrimination",
    ],
  },
  {
    id: 7,
    name: "Sensitive Biometric Categorization",
    description:
      "Using biometrics to infer race, religion, sexual orientation",
    details:
      "OpenAI tests and mitigates this. Others have refusal training but haven't explicitly tested.",
    result: "CAPABILITY EXISTS BUT MITIGATED",
    resultColor: "text-orange-600",
    evidence: [
      "OpenAI has refusal training (GPT-4o system card)",
      "Not designed/deployed for demographic profiling",
    ],
  },
];

const RESULTS_MATRIX = [
  {
    indicator: "Subliminal Manipulation",
    claude: "INSUFFICIENT",
    gpt5: "INSUFFICIENT",
    gemini: "INSUFFICIENT",
    grok: "INSUFFICIENT",
  },
  {
    indicator: "Child Harm",
    claude: "NO",
    gpt5: "NO",
    gemini: "NO",
    grok: "NO",
  },
  {
    indicator: "Social Scoring",
    claude: "NO",
    gpt5: "NO",
    gemini: "NO",
    grok: "NO",
  },
  {
    indicator: "Biometric Scraping",
    claude: "UNCLEAR",
    gpt5: "UNCLEAR",
    gemini: "UNCLEAR",
    grok: "UNCLEAR",
  },
  {
    indicator: "Workplace Emotion Inference",
    claude: "UNCLEAR",
    gpt5: "UNCLEAR",
    gemini: "UNCLEAR",
    grok: "UNCLEAR",
  },
  {
    indicator: "Predictive Crime Profiling",
    claude: "NO",
    gpt5: "NO",
    gemini: "NO",
    grok: "NO",
  },
  {
    indicator: "Biometric Categorization",
    claude: "UNCLEAR",
    gpt5: "TESTED",
    gemini: "UNCLEAR",
    grok: "UNCLEAR",
  },
];

const MODELS_ANALYZED = {
  anthropic: [
    "Claude Opus 4.5",
    "Claude Sonnet 4.5",
    "Claude Opus 4",
    "Claude Sonnet 4",
    "Claude Haiku 4.5",
  ],
  openai: ["GPT-5", "gpt-5-thinking", "o3", "o1-pro"],
  deepmind: ["Gemini 3 Pro", "Gemini 3 Flash", "Gemini 2.5 Pro"],
  xai: ["Grok 4.1", "Grok 4", "Grok 4 Fast", "Grok Code Fast 1"],
};

function ResultBadge({ result }: { result: string }) {
  switch (result) {
    case "INSUFFICIENT DATA":
    case "INSUFFICIENT":
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-700">
          <HelpCircle className="h-3 w-3 mr-1" /> Insufficient Data
        </Badge>
      );
    case "DOES NOT APPLY":
    case "NO":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-700">
          <AlertCircle className="h-3 w-3 mr-1" /> Does Not Apply
        </Badge>
      );
    case "NOT DESIGNED FOR THIS":
    case "CAPABILITY EXISTS BUT MITIGATED":
    case "UNCLEAR":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
          <AlertTriangle className="h-3 w-3 mr-1" /> Needs Clarification
        </Badge>
      );
    case "TESTED":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-700">
          <CheckCircle2 className="h-3 w-3 mr-1" /> Tested & Mitigated
        </Badge>
      );
    default:
      return <Badge variant="outline">{result}</Badge>;
  }
}

export function EUAIAnalysis() {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]
    );
  };

  const violationsFound = 0;
  const insufficientData = 2;
  const doesNotApply = 5;

  return (
    <div className="space-y-8">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Category A Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600">
              {violationsFound}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              out of 7 indicators
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Insufficient Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-600">
              {insufficientData}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              indicators not evaluated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Not Applicable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-600">
              {doesNotApply}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              wrong system type
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Models Analyzed */}
      <Card>
        <CardHeader>
          <CardTitle>Models Analyzed</CardTitle>
          <CardDescription>16 frontier AI models across 4 labs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold text-sm mb-3">Anthropic (5)</h4>
              <ul className="space-y-2">
                {MODELS_ANALYZED.anthropic.map((model) => (
                  <li key={model} className="text-sm text-muted-foreground">
                    {model}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">OpenAI (4)</h4>
              <ul className="space-y-2">
                {MODELS_ANALYZED.openai.map((model) => (
                  <li key={model} className="text-sm text-muted-foreground">
                    {model}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">
                Google DeepMind (3)
              </h4>
              <ul className="space-y-2">
                {MODELS_ANALYZED.deepmind.map((model) => (
                  <li key={model} className="text-sm text-muted-foreground">
                    {model}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">xAI (4)</h4>
              <ul className="space-y-2">
                {MODELS_ANALYZED.xai.map((model) => (
                  <li key={model} className="text-sm text-muted-foreground">
                    {model}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indicators Matrix */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Category A Prohibited Practices Matrix
          </h2>
          <p className="text-muted-foreground">
            EU AI Act Article 5 - Absolutely Forbidden
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>7 Category A Indicators Assessment</CardTitle>
            <CardDescription>Click on any row to expand and view detailed assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-0 border rounded-lg overflow-hidden">
              {EU_INDICATORS.map((indicator, index) => (
                <div key={indicator.id}>
                  <button
                    onClick={() => toggleRow(indicator.id)}
                    className="w-full text-left border-b hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 py-4 px-3">
                      <ChevronDown
                        className={`h-5 w-5 transition-transform flex-shrink-0 ${
                          expandedRows.includes(indicator.id) ? "rotate-180" : ""
                        }`}
                      />
                      <div className="font-bold text-center w-8 flex-shrink-0">
                        {indicator.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground truncate">
                          {indicator.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {indicator.description}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <ResultBadge result={indicator.result} />
                        {indicator.result === "DOES NOT APPLY" && (
                          <Badge variant="outline" className="bg-red-100 text-red-700">
                            None
                          </Badge>
                        )}
                        {indicator.result === "INSUFFICIENT DATA" && (
                          <Badge variant="outline" className="bg-gray-100 text-gray-700">
                            Unknown
                          </Badge>
                        )}
                        {(indicator.result === "NOT DESIGNED FOR THIS" ||
                          indicator.result === "CAPABILITY EXISTS BUT MITIGATED") && (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                            Low Risk
                          </Badge>
                        )}
                        {indicator.result === "TESTED" && (
                          <Badge variant="outline" className="bg-green-100 text-green-700">
                            Mitigated
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Detail Row */}
                  {expandedRows.includes(indicator.id) && (
                    <div className="bg-muted/30 border-b px-3 py-4 space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Assessment</h4>
                        <p className="text-sm text-muted-foreground">
                          {indicator.details}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Evidence</h4>
                        <ul className="space-y-2">
                          {indicator.evidence.map((item, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <span className="text-muted-foreground/50 flex-shrink-0">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Matrix</CardTitle>
          <CardDescription>
            Assessment across all models and indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-semibold py-2 px-2">
                    Indicator
                  </th>
                  <th className="text-center font-semibold py-2 px-2">Claude</th>
                  <th className="text-center font-semibold py-2 px-2">GPT-5</th>
                  <th className="text-center font-semibold py-2 px-2">Gemini</th>
                  <th className="text-center font-semibold py-2 px-2">Grok</th>
                </tr>
              </thead>
              <tbody>
                {RESULTS_MATRIX.map((row, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-3 px-2 text-muted-foreground">
                      {row.indicator}
                    </td>
                    <td className="py-3 px-2 text-center text-xs">
                      <Badge variant="outline">{row.claude}</Badge>
                    </td>
                    <td className="py-3 px-2 text-center text-xs">
                      <Badge variant="outline">{row.gpt5}</Badge>
                    </td>
                    <td className="py-3 px-2 text-center text-xs">
                      <Badge variant="outline">{row.gemini}</Badge>
                    </td>
                    <td className="py-3 px-2 text-center text-xs">
                      <Badge variant="outline">{row.grok}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Distinction */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="text-base">Critical Distinction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            EU AI Act prohibits the USE of AI for specific purposes, not just
            having capabilities.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                General-Purpose Foundation Models
              </h4>
              <ul className="space-y-1 text-xs">
                <li>Claude, GPT-5, Gemini, Grok</li>
                <li>Can do many things</li>
                <li>Including harmful uses if misused</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Specific Prohibited Applications
              </h4>
              <ul className="space-y-1 text-xs">
                <li>Social Scoring Systems</li>
                <li>Face Recognition Databases</li>
                <li>Predictive Policing Systems</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 pt-4 border-t">
            Category A targets the right column, not the left. These models are
            general-purpose tools, not specialized prohibited systems.
          </p>
        </CardContent>
      </Card>

      {/* Traffic Light Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-red-700">
              Red - Definitive Violations
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="font-semibold text-red-700 mb-2">NONE</p>
            <p>Zero models definitively violate Category A prohibited practices</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-yellow-700">
              Yellow - Potential Concerns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="font-semibold text-yellow-700">Indicators 4, 5, 7</p>
            <p>Could be misused for prohibited purposes but mitigations exist</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-green-700">
              Green - Not Applicable
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="font-semibold text-green-700 mb-2">Indicators 2, 3, 6</p>
            <p>Wrong type of system entirely</p>
          </CardContent>
        </Card>
      </div>

      {/* Key Takeaway */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="text-base">Final Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Category A of the EU AI Act targets specific prohibited AI
            applications, not general-purpose foundation models. These frontier
            AI models are general-purpose tools that could potentially be
            misused, but their design and deployment do not violate Category A
            prohibitions.
          </p>
          <p className="font-semibold text-foreground">
            Status: COMPLIANT with Category A (EU AI Act Article 5)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
