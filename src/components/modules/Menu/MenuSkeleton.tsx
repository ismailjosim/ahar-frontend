import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const MenuSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: 9 }).map((_, idx) => (
        <Card
          key={idx}
          className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between shadow-sm relative h-97.5 overflow-hidden"
        >
          <div>
            {/* 1. Media Wrapper Placeholder */}
            <div className="h-40 w-full bg-muted rounded-lg mb-3 relative">
              {/* Optional: Tiny badge placeholder inside media container */}
              <div className="absolute top-2 left-2 flex gap-1">
                <div className="h-5 w-16 bg-background/50 rounded-md" />
              </div>
            </div>

            {/* 2. Info Header Alignment Placeholder */}
            <div className="flex justify-between items-start gap-4 mb-2">
              <div className="h-5 bg-muted rounded w-2/3" />
              <div className="h-5 bg-muted rounded w-16 shrink-0" />
            </div>

            {/* 3. Tag Rows Placeholder */}
            <div className="flex gap-1 mb-3">
              <div className="h-4 bg-muted/70 rounded w-12" />
              <div className="h-4 bg-muted/70 rounded w-14" />
            </div>

            {/* 4. Meta Info Indicators Placeholder */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-3.5 bg-muted/80 rounded w-10" />
              <div className="h-3.5 bg-muted/80 rounded w-16" />
            </div>

            {/* 5. Description Line Clamps Placeholder */}
            <div className="space-y-2">
              <div className="h-3 bg-muted/60 rounded w-full" />
              <div className="h-3 bg-muted/60 rounded w-5/6" />
            </div>
          </div>

          {/* 6. Action Footer Section Placeholder */}
          <div className="w-full">
            <Separator className="my-3 bg-border/60" />
            <div className="flex items-center justify-between">
              <div className="h-3 bg-muted/60 rounded w-16" />
              <div className="h-8 bg-muted rounded-lg w-24 shrink-0" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default MenuSkeleton
