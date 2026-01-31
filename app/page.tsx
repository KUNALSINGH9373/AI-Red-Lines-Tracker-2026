import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Activity, Shield, AlertTriangle } from "lucide-react";

export default function Home() {
  return (
    <div className="container py-16">
      <div className="text-center mb-16">
        <Activity className="h-16 w-16 mx-auto mb-6 text-primary" />
        <h1 className="text-5xl font-bold mb-4">AI Red Lines Tracker</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Track how close frontier AI models are to critical risk thresholds using
          official system cards and preparedness frameworks.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/openai">
              View OpenAI Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 mb-2 text-green-500" />
            <CardTitle>Official Data Sources</CardTitle>
            <CardDescription>
              All risk assessments sourced directly from published system cards
              and preparedness frameworks
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Activity className="h-8 w-8 mb-2 text-blue-500" />
            <CardTitle>Real-Time Tracking</CardTitle>
            <CardDescription>
              Monitor threshold proximity and risk levels as new models are
              released and evaluated
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <AlertTriangle className="h-8 w-8 mb-2 text-orange-500" />
            <CardTitle>Threshold Alerts</CardTitle>
            <CardDescription>
              Identify when models approach or cross critical risk thresholds
              across multiple domains
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>Available Dashboards</CardTitle>
          <CardDescription>
            View risk assessments by AI laboratory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/openai" className="group">
              <div className="p-6 rounded-lg border bg-card hover:bg-accent transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">OpenAI</h3>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-sm text-muted-foreground">
                  GPT-4o, GPT-5, o3 and other OpenAI models evaluated against
                  Preparedness Framework v2
                </p>
              </div>
            </Link>

            <Link href="/anthropic" className="group">
              <div className="p-6 rounded-lg border bg-card hover:bg-accent transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">Anthropic</h3>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Claude Opus 4.5, Sonnet 4.5, and other Claude models evaluated against RSP v2.2 (ASL Levels)
                </p>
              </div>
            </Link>

            <Link href="/google-deepmind" className="group">
              <div className="p-6 rounded-lg border bg-card hover:bg-accent transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">Google DeepMind</h3>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Gemini 3 Pro, 3 Flash and other Gemini models evaluated against FSF v3.0 (CCL Framework)
                </p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
