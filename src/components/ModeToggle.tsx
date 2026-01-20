import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, Search } from "lucide-react";

export type ViewMode = "fixtures" | "search";

interface ModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <Tabs value={mode} onValueChange={(value) => onChange(value as ViewMode)}>
      <TabsList className="grid w-full max-w-[280px] grid-cols-2">
        <TabsTrigger value="fixtures" className="gap-2">
          <List className="h-4 w-4" />
          <span>Fixtures</span>
        </TabsTrigger>
        <TabsTrigger value="search" className="gap-2">
          <Search className="h-4 w-4" />
          <span>Search</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
