export const RISK_THRESHOLDS = {
  LOW_TO_MEDIUM: 0.4,
  MEDIUM_TO_HIGH: 0.7,
  HIGH_TO_CRITICAL: 0.9,
};

export const THRESHOLD_PROXIMITY_WARNING = 0.85;
export const THRESHOLD_PROXIMITY_CRITICAL = 0.95;

export const CHART_COLORS = {
  // OpenAI models
  "gpt-4o": "#10a37f",
  o3: "#6366f1",
  "o3-mini": "#8b5cf6",
  "o1-pro": "#ec4899",
  "gpt-5": "#f59e0b",
  // Anthropic models - 3 distinct colors cycling
  "claude-haiku-4.5": "#ef4444", // Red
  "claude-sonnet-4": "#3b82f6", // Blue
  "claude-sonnet-4.5": "#10b981", // Green
  "claude-opus-4": "#ef4444", // Red
  "claude-opus-4.5": "#3b82f6", // Blue
  // Google DeepMind models - 3 distinct colors cycling
  "gemini-2.5-pro": "#ec4899", // Pink
  "gemini-2.5-flash": "#06b6d4", // Cyan
  "gemini-3-pro": "#eab308", // Yellow
  "gemini-3-flash": "#ec4899", // Pink
  // xAI models
  "grok-4": "#8B5CF6", // Purple
  "grok-4.1": "#7C3AED", // Dark Purple
  "grok-4-fast": "#A78BFA", // Light Purple
  "grok-code-fast-1": "#C4B5FD", // Very Light Purple
};

export const CATEGORY_COLORS = {
  "bio-chem": "#ef4444",
  cyber: "#3b82f6",
  persuasion: "#8b5cf6",
  "ai-self-improvement": "#f59e0b",
};
