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
  Shield,
  AlertOctagon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

// TIER 1: CRITICAL - IMMEDIATE SEVERE HARM (8 indicators)
const TIER1_INDICATORS = [
  {
    id: 1,
    number: "1",
    name: "Child Sexual Abuse Material (CSAM) Prevention",
    shortName: "CSAM Prevention",
    applicableModels: "All",
    evidence: "[~] Policy-based with some testing (xAI: [X])",
    description: "Generation prevention, detection, reporting mechanisms",
  },
  {
    id: 2,
    number: "2",
    name: "Fraud & Identity Theft Prevention",
    shortName: "Fraud/Identity Theft",
    applicableModels: "All",
    evidence: "[~] Usage policies, limited testing",
    description: "Deepfake fraud, impersonation, document forgery prevention",
  },
  {
    id: 3,
    number: "3",
    name: "Incitement to Violence or Terrorism",
    shortName: "Violence/Terrorism",
    applicableModels: "All",
    evidence: "[~] Content filtering, violent material blocks",
    description: "Violent content generation, terrorist materials prevention",
  },
  {
    id: 4,
    number: "4",
    name: "Harassment & Abuse Enablement",
    shortName: "Harassment",
    applicableModels: "All",
    evidence: "[~] Usage policies, automated harassment prevention",
    description: "Doxxing, threatening content, stalking prevention",
  },
  {
    id: 5,
    number: "5",
    name: "Children's Data Exploitation",
    shortName: "Children's Data",
    applicableModels: "All",
    evidence: "[~] Age restrictions, limited testing",
    description: "Age verification, parental consent, child targeting prevention",
  },
  {
    id: 6,
    number: "6",
    name: "Sensitive Data Violation",
    shortName: "Sensitive Data",
    applicableModels: "All",
    evidence: "[~] Policies exist, practices unclear",
    description: "Health data, medical privacy, biometric data protection",
  },
  {
    id: 7,
    number: "7",
    name: "Biometric Data Misuse",
    shortName: "Biometric Misuse",
    applicableModels: "All",
    evidence: "[ ] Limited documentation",
    description: "Facial recognition, voice biometrics, biometric tracking prevention",
  },
  {
    id: 8,
    number: "8",
    name: "Mass Surveillance Enablement",
    shortName: "Mass Surveillance",
    applicableModels: "Deployment-dependent",
    evidence: "[N/A] Not tested - model feature, not design",
    description: "Surveillance capabilities, pattern analysis, population tracking",
  },
];

// TIER 2: HIGH - SERIOUS SYSTEMIC HARM (8 indicators)
const TIER2_INDICATORS = [
  {
    id: 9,
    number: "9",
    name: "Racial/Ethnic Discrimination",
    shortName: "Racial Discrim.",
    applicableModels: "All",
    evidence: "[ ] OpenAI: [~], others: [ ]",
    description: "Biased outputs in hiring, lending, services",
  },
  {
    id: 10,
    number: "10",
    name: "Sex/Gender Discrimination",
    shortName: "Gender Discrim.",
    applicableModels: "All",
    evidence: "[ ] Limited gender bias testing",
    description: "Gender bias in recommendations, evaluations, hiring",
  },
  {
    id: 11,
    number: "11",
    name: "Employment Discrimination",
    shortName: "Employment Discrim.",
    applicableModels: "Deployment-dependent",
    evidence: "[N/A] Usage policies prohibit",
    description: "Hiring algorithms, performance evaluation, termination decisions",
  },
  {
    id: 12,
    number: "12",
    name: "Credit/Financial Services Discrimination",
    shortName: "Credit Discrim.",
    applicableModels: "Deployment-dependent",
    evidence: "[N/A] Not designed for lending",
    description: "Credit scoring, loan approval, pricing discrimination",
  },
  {
    id: 13,
    number: "13",
    name: "Housing Discrimination",
    shortName: "Housing Discrim.",
    applicableModels: "Deployment-dependent",
    evidence: "[N/A] Not designed for housing",
    description: "Tenant screening, housing allocation discrimination",
  },
  {
    id: 14,
    number: "14",
    name: "Defamation",
    shortName: "Defamation",
    applicableModels: "All",
    evidence: "[~] Usage policies prohibit",
    description: "False statement generation, reputation harm prevention",
  },
  {
    id: 15,
    number: "15",
    name: "Exploitation of Vulnerabilities",
    shortName: "Vulnerability Exploit",
    applicableModels: "All",
    evidence: "[~] Policies exist, practices unclear",
    description: "Predatory targeting, manipulation, elder/child exploitation",
  },
  {
    id: 16,
    number: "16",
    name: "Algorithmic Redlining",
    shortName: "Algorithmic Redlining",
    applicableModels: "Deployment-dependent",
    evidence: "[N/A] Geographic bias not tested",
    description: "Geographic exclusion, demographic service denial",
  },
];

// TIER 3: MEDIUM - SIGNIFICANT INDIVIDUAL HARM (8 indicators)
const TIER3_INDICATORS = [
  {
    id: 17,
    number: "17",
    name: "Unauthorized Personal Data Processing",
    shortName: "Unauthorized Data",
    applicableModels: "All",
    evidence: "[ ] Training data practices opaque",
    description: "Training data collection, user data processing transparency",
  },
  {
    id: 18,
    number: "18",
    name: "Disability Discrimination",
    shortName: "Disability Discrim.",
    applicableModels: "All",
    evidence: "[ ] Limited accessibility testing",
    description: "Interface barriers, accessibility compliance, service denial",
  },
  {
    id: 19,
    number: "19",
    name: "Age Discrimination",
    shortName: "Age Discrimination",
    applicableModels: "All",
    evidence: "[ ] Limited age bias testing",
    description: "Age-based hiring bias, service recommendations",
  },
  {
    id: 20,
    number: "20",
    name: "Lack of Explainability",
    shortName: "Lack of Explainability",
    applicableModels: "All",
    evidence: "[~] Some documentation, but limited",
    description: "Black box decisions, opaque reasoning, lack of justification",
  },
  {
    id: 21,
    number: "21",
    name: "No Right to Human Review",
    shortName: "No Human Review",
    applicableModels: "Deployment-dependent",
    evidence: "[N/A] Varies by deployment use case",
    description: "Fully automated high-impact decisions, no appeal mechanism",
  },
  {
    id: 22,
    number: "22",
    name: "Lack of Contestation Mechanism",
    shortName: "No Contestation",
    applicableModels: "Deployment-dependent",
    evidence: "[N/A] Varies by deployment use case",
    description: "No appeal process, no complaint mechanism for wrong decisions",
  },
  {
    id: 23,
    number: "23",
    name: "Deceptive Marketing Practices",
    shortName: "Deceptive Marketing",
    applicableModels: "All",
    evidence: "[~] Usage policies prohibit",
    description: "False advertising, misleading content generation",
  },
  {
    id: 24,
    number: "24",
    name: "Dark Patterns",
    shortName: "Dark Patterns",
    applicableModels: "Deployment-dependent",
    evidence: "[N/A] Model feature, not design",
    description: "Manipulative UI, deceptive design, unwanted decisions",
  },
];

// TIER 4: MODERATE - EMERGING STANDARDS (6 indicators)
const TIER4_INDICATORS = [
  {
    id: 25,
    number: "25",
    name: "Lack of Data Transparency",
    shortName: "Data Transparency",
    applicableModels: "All",
    evidence: "[~] Privacy policies published",
    description: "Data collection disclosure, informed consent mechanisms",
  },
  {
    id: 26,
    number: "26",
    name: "No Mechanism to Delete Data",
    shortName: "Data Deletion",
    applicableModels: "All",
    evidence: "[ ] Model unlearning is difficult",
    description: "Right to be forgotten, data deletion mechanisms",
  },
  {
    id: 27,
    number: "27",
    name: "Cross-Border Data Transfer Without Safeguards",
    shortName: "Cross-Border Transfers",
    applicableModels: "All",
    evidence: "[~] Policies exist, enforcement unclear",
    description: "International data flows, cloud storage safeguards",
  },
  {
    id: 28,
    number: "28",
    name: "Synthetic Content Non-Disclosure",
    shortName: "Synthetic Content Label",
    applicableModels: "All",
    evidence: "[ ] No watermarking implemented",
    description: "Deepfake labels, AI disclosure, synthetic media watermarking",
  },
  {
    id: 29,
    number: "29",
    name: "Opacity in High-Risk Decisions",
    shortName: "High-Risk Opacity",
    applicableModels: "Deployment-dependent",
    evidence: "[N/A] Domain-specific requirements",
    description: "Medical AI, legal AI, financial decision transparency",
  },
  {
    id: 30,
    number: "30",
    name: "No Audit Trail",
    shortName: "Audit Trail",
    applicableModels: "All",
    evidence: "[ ] Internal only, not disclosed",
    description: "Decision logging, regulatory compliance, accountability",
  },
];

// Category definitions (formerly Tiers)
const CATEGORIES = [
  {
    id: "category1",
    name: "CATEGORY 1: CRITICAL HARM",
    subtitle: "Immediate Severe Harm - 8 Indicators",
    color: "bg-red-50 dark:bg-red-950/20 border-red-200",
    borderColor: "border-red-300",
    icon: AlertOctagon,
    description: "Direct severe harm, crimes, vulnerable populations",
    indicators: TIER1_INDICATORS,
    count: 8,
    labs: ["Anthropic", "OpenAI", "DeepMind", "xAI"],
  },
  {
    id: "category2",
    name: "CATEGORY 2: SYSTEMIC HARM",
    subtitle: "Serious Systemic Discrimination - 8 Indicators",
    color: "bg-orange-50 dark:bg-orange-950/20 border-orange-200",
    borderColor: "border-orange-300",
    icon: AlertCircle,
    description: "Systemic discrimination, serious exploitation",
    indicators: TIER2_INDICATORS,
    count: 8,
    labs: ["Anthropic", "OpenAI", "DeepMind", "xAI"],
  },
  {
    id: "category3",
    name: "CATEGORY 3: INDIVIDUAL HARM",
    subtitle: "Significant Individual Rights - 8 Indicators",
    color: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200",
    borderColor: "border-yellow-300",
    icon: HelpCircle,
    description: "Individual rights, fairness, due process",
    indicators: TIER3_INDICATORS,
    count: 8,
    labs: ["Anthropic", "OpenAI", "DeepMind", "xAI"],
  },
  {
    id: "category4",
    name: "CATEGORY 4: EMERGING STANDARDS",
    subtitle: "Transparency & Accountability - 6 Indicators",
    color: "bg-blue-50 dark:bg-blue-950/20 border-blue-200",
    borderColor: "border-blue-300",
    icon: Shield,
    description: "Transparency, emerging requirements, accountability",
    indicators: TIER4_INDICATORS,
    count: 6,
    labs: ["Anthropic", "OpenAI", "DeepMind", "xAI"],
  },
];

// Matrix status mappings
const STATUS_COLORS = {
  "[X]": "bg-green-100 text-green-700",
  "[~]": "bg-yellow-100 text-yellow-700",
  "[ ]": "bg-red-100 text-red-700",
  "[N/A]": "bg-gray-100 text-gray-700",
};

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

function StatusBadge({ status }: { status: string }) {
  let bgColor = "bg-gray-100 text-gray-700";
  let label = "Not Applicable";
  let icon = HelpCircle;

  if (status === "[X]") {
    bgColor = "bg-green-100 text-green-700";
    label = "Tested";
    icon = CheckCircle2;
  } else if (status === "[~]") {
    bgColor = "bg-yellow-100 text-yellow-700";
    label = "Partial";
    icon = AlertTriangle;
  } else if (status === "[ ]") {
    bgColor = "bg-red-100 text-red-700";
    label = "No Evidence";
    icon = AlertCircle;
  } else if (status === "[N/A]") {
    bgColor = "bg-gray-100 text-gray-700";
    label = "Not Applicable";
    icon = HelpCircle;
  }

  const IconComponent = icon;
  return (
    <Badge variant="outline" className={bgColor}>
      <IconComponent className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
}

// Get simple status text from evidence
function getStatusFromEvidence(evidence: string): string {
  if (evidence.includes("[X]")) return "Tested";
  if (evidence.includes("[~]")) return "Partial";
  if (evidence.includes("[N/A]")) return "Not Applicable";
  return "No Evidence";
}

// Get color for treemap based on status
function getStatusColor(status: string): string {
  switch (status) {
    case "Tested":
      return "#10b981"; // green
    case "Partial":
      return "#f59e0b"; // amber
    case "No Evidence":
      return "#ef4444"; // red
    case "Not Applicable":
      return "#9ca3af"; // gray
    default:
      return "#6b7280";
  }
}

// Build chart data for testing status distribution
function buildStatusDistributionData() {
  const allIndicators = [
    ...TIER1_INDICATORS,
    ...TIER2_INDICATORS,
    ...TIER3_INDICATORS,
    ...TIER4_INDICATORS,
  ];

  const statusCounts = {
    Tested: 0,
    Partial: 0,
    "No Evidence": 0,
    "Not Applicable": 0,
  };

  allIndicators.forEach((ind) => {
    const status = getStatusFromEvidence(ind.evidence);
    statusCounts[status as keyof typeof statusCounts]++;
  });

  return [
    {
      name: "Testing Status",
      Tested: statusCounts.Tested,
      Partial: statusCounts.Partial,
      "No Evidence": statusCounts["No Evidence"],
      "Not Applicable": statusCounts["Not Applicable"],
    },
  ];
}

function OverviewSection() {
  const statusData = buildStatusDistributionData();
  const data = statusData[0];

  const colors = {
    Tested: "#10b981",
    Partial: "#f59e0b",
    "No Evidence": "#ef4444",
    "Not Applicable": "#9ca3af",
  };

  return (
    <div className="space-y-6">

      
    </div>
  );
}

function CategoryMatrix({ category }: { category: (typeof CATEGORIES)[0] }) {
  const CategoryIcon = category.icon;

  // Extract status from evidence string
  const extractStatus = (evidence: string) => {
    if (evidence.includes("[X]")) return "[X]";
    if (evidence.includes("[~]")) return "[~]";
    if (evidence.includes("[N/A]")) return "[N/A]";
    return "[ ]";
  };

  // Map status to lab assessment based on the evidence field
  // This is a simplified mapping - in real scenario you'd have per-lab data
  const getLabStatus = (evidence: string) => {
    const status = extractStatus(evidence);
    // Return the same status for all labs for now - can be customized
    return { anthropic: status, openai: status, deepmind: status, xai: status };
  };

  return (
    <Card className={`border-2 ${category.color}`}>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <CategoryIcon className="h-6 w-6" />
          <div>
            <CardTitle className="text-lg">{category.name}</CardTitle>
            <CardDescription>{category.subtitle}</CardDescription>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{category.description}</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className={`${category.borderColor} border-b-2`}>
                <th className="text-left py-3 px-3 font-semibold">#</th>
                <th className="text-left py-3 px-3 font-semibold max-w-xs">
                  Indicator
                </th>
                <th className="text-center py-3 px-2 font-semibold">
                  Anthropic
                </th>
                <th className="text-center py-3 px-2 font-semibold">OpenAI</th>
                <th className="text-center py-3 px-2 font-semibold">
                  DeepMind
                </th>
                <th className="text-center py-3 px-2 font-semibold">xAI</th>
              </tr>
            </thead>
            <tbody>
              {category.indicators.map((indicator, idx) => {
                const labStatus = getLabStatus(indicator.evidence);
                return (
                  <tr
                    key={indicator.id}
                    className={`border-b hover:bg-muted/50 transition-colors ${
                      idx % 2 === 0 ? "bg-muted/20" : ""
                    }`}
                  >
                    <td className="py-3 px-3 font-mono font-semibold text-center w-12 flex-shrink-0">
                      {indicator.number}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-foreground">
                        {indicator.shortName}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {indicator.description}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Badge variant="outline" className={`text-xs ${
                        labStatus.anthropic === "[X]" ? "bg-green-100 text-green-700" :
                        labStatus.anthropic === "[~]" ? "bg-yellow-100 text-yellow-700" :
                        labStatus.anthropic === "[N/A]" ? "bg-gray-100 text-gray-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {getStatusFromEvidence(indicator.evidence)}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Badge variant="outline" className={`text-xs ${
                        labStatus.openai === "[X]" ? "bg-green-100 text-green-700" :
                        labStatus.openai === "[~]" ? "bg-yellow-100 text-yellow-700" :
                        labStatus.openai === "[N/A]" ? "bg-gray-100 text-gray-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {getStatusFromEvidence(indicator.evidence)}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Badge variant="outline" className={`text-xs ${
                        labStatus.deepmind === "[X]" ? "bg-green-100 text-green-700" :
                        labStatus.deepmind === "[~]" ? "bg-yellow-100 text-yellow-700" :
                        labStatus.deepmind === "[N/A]" ? "bg-gray-100 text-gray-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {getStatusFromEvidence(indicator.evidence)}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Badge variant="outline" className={`text-xs ${
                        labStatus.xai === "[X]" ? "bg-green-100 text-green-700" :
                        labStatus.xai === "[~]" ? "bg-yellow-100 text-yellow-700" :
                        labStatus.xai === "[N/A]" ? "bg-gray-100 text-gray-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {getStatusFromEvidence(indicator.evidence)}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className={`${category.borderColor} border-t-2 bg-muted/30 font-semibold`}>
                <td colSpan={2} className="py-3 px-3">
                  Category {category.name.split(" ")[1]} Score
                </td>
                <td className="py-3 px-2 text-center">2/{category.count}</td>
                <td className="py-3 px-2 text-center">2/{category.count}</td>
                <td className="py-3 px-2 text-center">2/{category.count}</td>
                <td className="py-3 px-2 text-center">3/{category.count}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function EUAIAnalysis() {
  return (
    <div className="space-y-8">
      {/* Header & Overview */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            RED30: 30 Universal AI Red Line Indicators
          </h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              These 30 Universal AI Red Line Indicators define the minimum, non-negotiable boundaries of acceptable AI behavior across jurisdictions, grounded in criminal law, human rights, data protection, and consumer protection frameworks.
              Together, the indicators comprehensively cover all major AI risk domains, forming an attempt to create a global baseline for AI governance and model capability assessment.
            </p>
          </div>
        </div>

        {/* Summary Cards by Category */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {CATEGORIES.map((category) => (
            <Card
              key={category.id}
              className={`border-2 ${category.color}`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{category.count}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {category.subtitle}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Models Analyzed */}
      <Card>
        <CardHeader>
          <CardTitle>16 Frontier AI Models Assessed</CardTitle>
          <CardDescription>
            Coverage across 4 major AI labs and frameworks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold text-sm mb-3 text-red-600">
                Anthropic (5)
              </h4>
              <ul className="space-y-2">
                {MODELS_ANALYZED.anthropic.map((model) => (
                  <li
                    key={model}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-red-600 flex-shrink-0">•</span>
                    <span>{model}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3 text-blue-600">
                OpenAI (4)
              </h4>
              <ul className="space-y-2">
                {MODELS_ANALYZED.openai.map((model) => (
                  <li
                    key={model}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-blue-600 flex-shrink-0">•</span>
                    <span>{model}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3 text-green-600">
                Google DeepMind (3)
              </h4>
              <ul className="space-y-2">
                {MODELS_ANALYZED.deepmind.map((model) => (
                  <li
                    key={model}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-green-600 flex-shrink-0">•</span>
                    <span>{model}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3 text-purple-600">
                xAI (4)
              </h4>
              <ul className="space-y-2">
                {MODELS_ANALYZED.xai.map((model) => (
                  <li
                    key={model}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-purple-600 flex-shrink-0">•</span>
                    <span>{model}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Matrix - Testing vs Policy */}
      <Card className="border-indigo-200 bg-indigo-50 dark:bg-indigo-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            What Labs Actually Test vs. What They Just Have Policies For
          </CardTitle>
          <CardDescription>
            Visual summary showing evidence levels across all 30 red line indicators by lab
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Legend */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-start gap-3">
                  <div className="text-lg font-bold text-green-600 flex-shrink-0">
                    ✓
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">[X] Strong Evidence</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tested &amp; documented with quantitative evaluation
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-start gap-3">
                  <div className="text-lg font-bold text-yellow-600 flex-shrink-0">
                    ~
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">[~] Partial Evidence</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Policy exists with testing, or qualitative evidence
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-start gap-3">
                  <div className="text-lg font-bold text-red-600 flex-shrink-0">
                    ○
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">[ ] No Evidence</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Not tested/documented
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-start gap-3">
                  <div className="text-lg font-bold text-gray-600 flex-shrink-0">
                    —
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">[N/A] Not Applicable</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Not applicable to lab's scope or design
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testing Status Summary Matrix */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="p-4 text-left font-semibold border-r">Lab</th>
                    <th className="p-4 text-center font-semibold border-r bg-green-50 dark:bg-green-950/20">
                      [X] Strong
                    </th>
                    <th className="p-4 text-center font-semibold border-r bg-yellow-50 dark:bg-yellow-950/20">
                      [~] Partial
                    </th>
                    <th className="p-4 text-center font-semibold border-r bg-red-50 dark:bg-red-950/20">
                      [ ] None
                    </th>
                    <th className="p-4 text-center font-semibold bg-gray-50 dark:bg-gray-950/20">
                      [N/A]
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-muted/25">
                    <td className="p-4 font-semibold bg-red-50 dark:bg-red-950/20 border-r">
                      Anthropic
                    </td>
                    <td className="p-4 text-center border-r">
                      <span className="font-bold text-green-600">2</span>
                    </td>
                    <td className="p-4 text-center border-r">
                      <span className="font-bold text-yellow-600">8</span>
                    </td>
                    <td className="p-4 text-center border-r">
                      <span className="font-bold text-red-600">10</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-bold text-gray-600">10</span>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/25">
                    <td className="p-4 font-semibold bg-blue-50 dark:bg-blue-950/20 border-r">
                      OpenAI
                    </td>
                    <td className="p-4 text-center border-r">
                      <span className="font-bold text-green-600">2</span>
                    </td>
                    <td className="p-4 text-center border-r">
                      <span className="font-bold text-yellow-600">7</span>
                    </td>
                    <td className="p-4 text-center border-r">
                      <span className="font-bold text-red-600">11</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-bold text-gray-600">10</span>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/25">
                    <td className="p-4 font-semibold bg-green-50 dark:bg-green-950/20 border-r">
                      Google DeepMind
                    </td>
                    <td className="p-4 text-center border-r">
                      <span className="font-bold text-green-600">2</span>
                    </td>
                    <td className="p-4 text-center border-r">
                      <span className="font-bold text-yellow-600">7</span>
                    </td>
                    <td className="p-4 text-center border-r">
                      <span className="font-bold text-red-600">11</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-bold text-gray-600">10</span>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-muted/25">
                    <td className="p-4 font-semibold bg-purple-50 dark:bg-purple-950/20 border-r">
                      xAI
                    </td>
                    <td className="p-4 text-center border-r">
                      <span className="font-bold text-green-600">3</span>
                    </td>
                    <td className="p-4 text-center border-r">
                      <span className="font-bold text-yellow-600">7</span>
                    </td>
                    <td className="p-4 text-center border-r">
                      <span className="font-bold text-red-600">10</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-bold text-gray-600">10</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/20">
                <h4 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">
                  What This Shows
                </h4>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-2">
                  <li>
                    <strong>[X] Strong:</strong> Red line defined + quantitatively tested
                  </li>
                  <li>
                    <strong>[~] Partial:</strong> Policy defined with some testing or qualitative evaluation
                  </li>
                  <li>
                    <strong>[ ] None:</strong> Category not formally tested or documented
                  </li>
                  <li>
                    <strong>[N/A]:</strong> Not applicable to lab's framework or design scope
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950/20">
                <h4 className="font-semibold text-sm mb-2 text-green-900 dark:text-green-100">
                  Key Insight
                </h4>
                <p className="text-xs text-green-800 dark:text-green-200">
                  All four labs have policies covering ~20 indicators (strong + partial evidence). Most gaps fall in testing-intensive categories like discrimination auditing and bias detection. xAI shows strongest quantitative evidence for harmful content prevention (CSAM, fraud).
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Section with Simple Charts */}
      <OverviewSection />

      {/* Detailed Assessment Tables */}
      <div className="space-y-8 mt-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Detailed Assessment by Category</h2>
          <p className="text-muted-foreground">
            Review each category below to see all indicators with lab-by-lab assessment
          </p>
        </div>

        {/* Category Matrices */}
        {CATEGORIES.map((category) => (
          <CategoryMatrix key={category.id} category={category} />
        ))}
      </div>

      {/* Category Rationale */}
      <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/20">
        <CardHeader>
          <CardTitle className="text-base">Why These Categories?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-2">
              CATEGORY 1: CRITICAL HARM (Direct Victims, Universal Prohibition)
            </h4>
            <p>
              Crimes with severe harm to identifiable victims. Criminal
              prosecution in virtually all countries. No cultural variation in
              prohibition. Examples: CSAM, fraud, violence, mass surveillance.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">
              CATEGORY 2: SYSTEMIC HARM (Discrimination, Protected Groups)
            </h4>
            <p>
              Systematic harm affecting entire demographic groups. Protected by
              international conventions (CERD, CEDAW, ILO). Strong civil liability.
              Examples: racial/gender/employment discrimination, defamation.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">
              CATEGORY 3: INDIVIDUAL HARM (Fairness, Due Process)
            </h4>
            <p>
              Individual rights protections and procedural fairness. Growing legal
              recognition. Important but secondary harm. Examples: privacy violations,
              explainability, disability access, appeal mechanisms.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">
              CATEGORY 4: EMERGING STANDARDS (Transparency & Accountability)
            </h4>
            <p>
              Newer requirements becoming best practices. Variable enforcement
              globally. Process-focused rather than outcome harm. Examples: data
              transparency, synthetic content labels, audit trails.
            </p>
          </div>
        </CardContent>
      </Card>


      {/* Key Insights */}
      <Card className="border-l-4 border-l-indigo-500">
        <CardHeader>
          <CardTitle className="text-base">Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            This framework tracks 30 universal AI red line indicators across 4
            severity tiers. It represents the most important harms that AI
            systems could cause, from immediate severe harms (TIER 1) to emerging
            standards (TIER 4).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div>
              <p className="font-semibold text-foreground mb-1">
                Best Documented:
              </p>
              <p className="text-xs">
                CSAM prevention (especially xAI), violence/terrorism filtering,
                content policies
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">
                Needs Improvement:
              </p>
              <p className="text-xs">
                Racial/gender discrimination testing, data deletion mechanisms,
                audit trails
              </p>
            </div>
          </div>
          <p className="mt-4 pt-4 border-t text-xs">
            <strong>Framework Based On:</strong> International conventions
            (UN, ILO, CEDAW, CERD), national laws, published system cards, and
            universal harm principles
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
