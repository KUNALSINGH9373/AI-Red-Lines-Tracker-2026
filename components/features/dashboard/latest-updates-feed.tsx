import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle, FileText, TrendingUp } from "lucide-react";
import type { TimelineEvent, Source } from "@/lib/types/risk-data";
import { format } from "date-fns";
import { SourceBadge } from "@/components/shared/source-badge";

interface LatestUpdatesFeedProps {
  events: TimelineEvent[];
  limit?: number;
  onEventClick?: (event: TimelineEvent) => void;
  sources?: Source[];
}

export function LatestUpdatesFeed({
  events,
  limit = 5,
  onEventClick,
  sources,
}: LatestUpdatesFeedProps) {
  const recentEvents = events.slice(0, limit);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "model-release":
        return FileText;
      case "threshold-crossing":
        return AlertCircle;
      case "framework-update":
        return TrendingUp;
      default:
        return Calendar;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "threshold-crossing":
        return "text-red-500";
      case "model-release":
        return "text-blue-500";
      case "framework-update":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentEvents.map((event) => {
            const Icon = getEventIcon(event.type);
            const colorClass = getEventColor(event.type);

            return (
              <div
                key={event.id}
                className="flex gap-4 p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                onClick={() => onEventClick?.(event)}
              >
                <div className={`mt-1 ${colorClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <Badge variant="outline" className="text-xs whitespace-nowrap">
                      {format(new Date(event.date), "MMM d, yyyy")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex gap-2 mt-2 flex-wrap items-center">
                    {event.modelIds && event.modelIds.length > 0 && (
                      <>
                        {event.modelIds.map((modelId) => (
                          <Badge key={modelId} variant="secondary" className="text-xs">
                            {modelId}
                          </Badge>
                        ))}
                      </>
                    )}
                    {event.sourceId && sources && (
                      <>
                        {sources.find(s => s.id === event.sourceId) && (
                          <SourceBadge source={sources.find(s => s.id === event.sourceId)!} variant="secondary" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
