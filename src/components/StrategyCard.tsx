import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Strategy } from "@/types/strategy";
import { useToast } from "@/hooks/use-toast";

interface StrategyCardProps {
  strategy: Strategy;
  onEdit: (strategy: Strategy) => void;
  onDelete: (id: string) => Promise<void>;
  onToggle: (strategy: Strategy) => Promise<Strategy>;
}

const conditionTypeLabels: Record<string, string> = {
  HOME_FORM: "Home Form",
  AWAY_FORM: "Away Form",
  WIN_RATE: "Win Rate",
  HEAD_TO_HEAD: "Head to Head",
  INJURIES: "Injuries",
  GOALS_SCORED: "Goals Scored",
  GOALS_CONCEDED: "Goals Conceded",
  RECENT_GOALS_TOTAL: "Recent Goals Total",
  CLEAN_SHEETS: "Clean Sheets",
  BTTS: "Both Teams To Score",
  H2H_GOALS_SCORED: "Head to Head Goals Scored",
};

export function StrategyCard({ strategy, onEdit, onDelete, onToggle }: StrategyCardProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      await onToggle(strategy);
      toast({
        title: strategy.isActive ? "Strategy deactivated" : "Strategy activated",
        description: `Your strategy has been ${strategy.isActive ? "deactivated" : "activated"}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to toggle strategy",
        variant: "destructive",
      });
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(strategy.id);
      toast({
        title: "Strategy deleted",
        description: "Your strategy has been deleted successfully.",
      });
      setDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete strategy",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card className="border border-border/60 bg-card/60 backdrop-blur hover:border-primary/50 transition-colors">
        <CardHeader className="pb-3">
          {/* Header with responsive layout */}
          <div className="flex flex-col gap-3">
            {/* Title and toggle row */}
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base truncate flex-1 min-w-0">{strategy.name}</CardTitle>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Switch
                  id={`active-${strategy.id}`}
                  checked={strategy.isActive}
                  onCheckedChange={handleToggle}
                  disabled={toggling}
                  className="scale-75"
                />
                <Label
                  htmlFor={`active-${strategy.id}`}
                  className="text-xs font-normal cursor-pointer whitespace-nowrap"
                >
                  {strategy.isActive ? "Active" : "Inactive"}
                </Label>
              </div>
            </div>

            {/* Action buttons row - responsive */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate(`/strategies/${strategy.id}/matches`)}
                className="h-8 flex-1 sm:flex-none"
                disabled={!strategy.isActive}
              >
                <Target className="h-3 w-3 mr-1" />
                <span className="hidden xs:inline">Find Matches</span>
                <span className="xs:hidden">Find</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(strategy)}
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
                className="text-destructive hover:text-destructive h-8 w-8 p-0 flex-shrink-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          {/* Description */}
          {strategy.description && (
            <p className="text-sm text-muted-foreground">{strategy.description}</p>
          )}

          {/* Conditions as badges */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Conditions ({strategy.conditions.length})
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {strategy.conditions.slice(0, 4).map((condition) => (
                <Badge key={condition.id} variant="outline" className="text-xs">
                  {conditionTypeLabels[condition.type] || condition.type}: {condition.operator}{" "}
                  {condition.value}
                </Badge>
              ))}
              {strategy.conditions.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{strategy.conditions.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Strategy</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{strategy.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
