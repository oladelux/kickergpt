import { Card, CardContent } from "@/components/ui/card";

export default function FixturesRightSidebar() {
  return (
    <div className="h-full w-64 border-l border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Advertisements
        </h2>
      </div>
      <div className="flex-1 p-4">
        <Card className="border-dashed border-2 border-border/50 bg-card/30">
          <CardContent className="flex items-center justify-center min-h-[400px] p-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Ad Space</p>
              <p className="text-xs text-muted-foreground/70">
                Reserved for future advertisements
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

