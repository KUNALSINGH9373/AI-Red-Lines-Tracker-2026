import { ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getSourceById } from "@/lib/data/openai-data";

interface SourceBadgeProps {
  sourceId: string;
  section?: string;
  variant?: "default" | "outline" | "secondary";
}

export function SourceBadge({ sourceId, section, variant = "outline" }: SourceBadgeProps) {
  const source = getSourceById(sourceId);

  if (!source) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
            onClick={(e) => e.stopPropagation()}
          >
            <Badge variant={variant} className="gap-1 cursor-pointer hover:bg-accent">
              <FileText className="h-3 w-3" />
              <span className="text-xs">
                {source.type === "system-card" ? "System Card" : "Framework"}
                {section && `: ${section}`}
              </span>
              <ExternalLink className="h-2.5 w-2.5" />
            </Badge>
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <p className="font-semibold">{source.title}</p>
            <p className="text-muted-foreground mt-1">
              Published: {source.publishDate}
            </p>
            {section && <p className="mt-1">Reference: {section}</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface SourceLinkProps {
  sourceId: string;
  section?: string;
  children?: React.ReactNode;
}

export function SourceLink({ sourceId, section, children }: SourceLinkProps) {
  const source = getSourceById(sourceId);

  if (!source) return null;

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      onClick={(e) => e.stopPropagation()}
    >
      {children || (
        <>
          {source.title}
          {section && ` (${section})`}
        </>
      )}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}
