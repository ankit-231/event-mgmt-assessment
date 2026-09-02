"use client"

import { ActivityIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useEventAnalytics } from "@/hooks/api/use-events"
import { EVENT_FEED_POLL_INTERVAL_MS } from "@/lib/constants"

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export function EventAnalyticsCard() {
  const { data, isPending, isError } = useEventAnalytics({
    refetchInterval: EVENT_FEED_POLL_INTERVAL_MS,
  })

  const counts = data
    ? Object.entries(data.counts_by_type).sort((a, b) => b[1] - a[1])
    : []
  const max = counts.length > 0 ? counts[0][1] : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <ActivityIcon className="size-4 text-muted-foreground" />
          Top event types (last 24h)
        </CardTitle>
        <CardDescription>
          Event needs to start in less than 24 hours to be shown here <br />
          <br />
          {isPending
            ? "Loading analytics..."
            : `${data?.total ?? 0} events total`}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {isPending && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            Couldn&apos;t load analytics.
          </p>
        )}

        {!isPending && !isError && counts.length === 0 && (
          <p className="text-sm text-muted-foreground">No events yet.</p>
        )}

        {!isPending &&
          !isError &&
          counts.map(([type, count], i) => (
            <div key={type} className="flex items-center gap-3">
              <span className="w-20 shrink-0 truncate text-sm capitalize">
                {type}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{
                    width: max > 0 ? `${(count / max) * 100}%` : "0%",
                    backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                  }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-sm text-muted-foreground tabular-nums">
                {count}
              </span>
            </div>
          ))}
      </CardContent>
    </Card>
  )
}
