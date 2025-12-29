import { useState } from "react";
import { Plus, Target, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import { LoadingPage } from "@/components/LoadingPage";
import { StrategiesPROGate } from "@/components/StrategiesPROGate";
import { StrategyCard } from "@/components/StrategyCard";
import { StrategyFormDialog } from "@/components/StrategyFormDialog";
import { useStrategies } from "@/hooks/useStrategies";
import { useToast } from "@/hooks/use-toast";
import { Strategy, StrategyCondition } from "@/types/strategy";

export default function Strategies() {
  const { strategies, loading, error, createStrategy, updateStrategy, deleteStrategy } =
    useStrategies();
  const { toast } = useToast();

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);

  const handleCreateClick = () => {
    setEditingStrategy(null);
    setFormDialogOpen(true);
  };

  const handleEditClick = (strategy: Strategy) => {
    setEditingStrategy(strategy);
    setFormDialogOpen(true);
  };

  const handleSave = async (data: {
    name: string;
    description?: string;
    conditions: StrategyCondition[];
    isActive?: boolean;
  }) => {
    if (editingStrategy) {
      await updateStrategy(editingStrategy.id, data);
    } else {
      await createStrategy(data);
    }
  };

  const handleToggle = async (strategy: Strategy): Promise<Strategy> => {
    const updatedStrategy = await updateStrategy(strategy.id, { isActive: !strategy.isActive });
    toast({
      title: strategy.isActive ? "Strategy deactivated" : "Strategy activated",
      description: `Your strategy has been ${strategy.isActive ? "deactivated" : "activated"}.`,
    });
    return updatedStrategy;
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <StrategiesPROGate>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary pb-20 md:pb-4 md:pt-20">
        <TopNav />
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Strategies
                </h1>
                <Badge className="bg-primary/10 text-primary border-primary/20">PRO</Badge>
              </div>
              <p className="text-muted-foreground">
                Create custom strategies and find fixtures that match your criteria.
              </p>
            </div>
            <Button onClick={handleCreateClick} className="self-start md:self-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Strategy
            </Button>
          </div>

          {/* Help Article Banner */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1">New to Strategies?</h3>
                    <p className="text-xs text-muted-foreground">
                      Learn how to create effective strategies with our comprehensive guide.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="self-start sm:self-auto whitespace-nowrap"
                  onClick={() =>
                    window.open(
                      "https://help.kickergpt.com/en/articles/13248747-introducing-strategies-your-personal-match-finding-assistant",
                      "_blank"
                    )
                  }
                >
                  Read Guide
                  <ExternalLink className="h-3 w-3 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error State */}
          {error && (
            <Card className="bg-destructive/10 border-destructive/20">
              <CardContent className="pt-6">
                <p className="text-sm text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!error && strategies.length === 0 && (
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardContent className="py-12 text-center space-y-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Target className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">No strategies yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Create your first strategy with custom conditions to find fixtures that match
                    your criteria. Get started by clicking the "Create Strategy" button above.
                  </p>
                </div>
                <Button onClick={handleCreateClick}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Strategy
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Strategies Grid */}
          {!error && strategies.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {strategies.length} strateg{strategies.length === 1 ? "y" : "ies"}
                </p>
              </div>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                {strategies.map((strategy) => (
                  <StrategyCard
                    key={strategy.id}
                    strategy={strategy}
                    onEdit={handleEditClick}
                    onDelete={deleteStrategy}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Dialog */}
        <StrategyFormDialog
          open={formDialogOpen}
          onOpenChange={setFormDialogOpen}
          onSave={handleSave}
          strategy={editingStrategy}
          mode={editingStrategy ? "edit" : "create"}
        />

        <BottomNav />
      </div>
    </StrategiesPROGate>
  );
}
