import benchmarksData from "@/data/cross-lab/ai-rnd-benchmarks.json";
import type {
  AiRndBenchmarksData,
  Benchmark,
  BenchmarkResult,
  RedLineDefinition,
  ConvergenceDivergence,
} from "@/lib/types/risk-data";

export function getAiRndBenchmarks(): Benchmark[] {
  return (benchmarksData as AiRndBenchmarksData).benchmarks;
}

export function getBenchmarkById(id: string): Benchmark | undefined {
  return getAiRndBenchmarks().find((benchmark) => benchmark.id === id);
}

export function getBenchmarkResults(): BenchmarkResult[] {
  const allResults: BenchmarkResult[] = [];
  getAiRndBenchmarks().forEach((benchmark) => {
    allResults.push(...benchmark.results);
  });
  return allResults;
}

export function getBenchmarkResultByModelId(
  modelId: string
): BenchmarkResult | undefined {
  return getBenchmarkResults().find((result) => result.modelId === modelId);
}

export function getRedLineDefinitions(): RedLineDefinition[] {
  return (benchmarksData as AiRndBenchmarksData).redLineDefinitions;
}

export function getRedLineDefinitionById(id: string): RedLineDefinition | undefined {
  return getRedLineDefinitions().find((def) => def.id === id);
}

export function getRedLineDefinitionByLab(
  lab: "openai" | "anthropic" | "google-deepmind"
): RedLineDefinition | undefined {
  return getRedLineDefinitions().find((def) => def.lab === lab);
}

export function getRedLineDefinitionsByCategoryId(
  categoryId: string
): RedLineDefinition[] {
  return getRedLineDefinitions().filter((def) => def.categoryId === categoryId);
}

export function getConvergenceDivergence(): ConvergenceDivergence {
  return (benchmarksData as AiRndBenchmarksData).convergenceDivergence;
}

export function getLatestBenchmarkDate(): string {
  const benchmarks = getAiRndBenchmarks();
  if (benchmarks.length === 0) return new Date().toISOString().split("T")[0];
  const dates = benchmarks.map((b) => new Date(b.publishDate));
  const latest = new Date(Math.max(...dates.map((d) => d.getTime())));
  return latest.toISOString().split("T")[0];
}
