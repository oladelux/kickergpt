import { Card, CardContent } from "@/components/ui/card";

export default function FixturesRightSidebar() {
  return (
    <div className="h-full w-64 border-l border-border bg-card flex flex-col">
      <div className="flex-1 p-4">
        <Card className="border-dashed border-2 border-border/50 bg-card/30 h-full">
          <CardContent className="flex items-center justify-center min-h-[400px] p-6 h-full">
            {/* Reserved for future advertisements */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
