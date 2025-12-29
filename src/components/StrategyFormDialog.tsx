import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Strategy,
  StrategyCondition,
  StrategyConditionType,
  StrategyOperator,
  StrategyTarget,
} from "@/types/strategy";
import { StrategyConditionBuilder } from "./StrategyConditionBuilder";

interface StrategyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    name: string;
    description?: string;
    conditions: StrategyCondition[];
    isActive?: boolean;
  }) => Promise<void>;
  strategy?: Strategy | null;
  mode: "create" | "edit";
}

interface ConditionFormData {
  id: string;
  type: StrategyConditionType;
  operator: StrategyOperator;
  value: number;
  lastMatches: number;
  target: StrategyTarget;
}

export function StrategyFormDialog({
  open,
  onOpenChange,
  onSave,
  strategy,
  mode,
}: StrategyFormDialogProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [conditions, setConditions] = useState<ConditionFormData[]>([]);
  const [expandedConditions, setExpandedConditions] = useState<Record<string, boolean>>({});
  const [newConditionIds, setNewConditionIds] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && strategy && mode === "edit") {
      setName(strategy.name);
      setDescription(strategy.description || "");
      const mappedConditions = strategy.conditions.map((c) => ({
        id: c.id,
        type: c.type,
        operator: c.operator,
        value: c.value,
        lastMatches: c.lastMatches,
        target: c.target,
      }));
      setConditions(mappedConditions);
      // Expand all conditions when editing
      const expanded: Record<string, boolean> = {};
      mappedConditions.forEach((c) => {
        expanded[c.id] = false; // Start collapsed
      });
      setExpandedConditions(expanded);
      setNewConditionIds(new Set());
    } else if (open && mode === "create") {
      setName("");
      setDescription("");
      setConditions([]);
      setExpandedConditions({});
      setNewConditionIds(new Set());
    }
  }, [open, strategy, mode]);

  const handleAddCondition = () => {
    if (conditions.length >= 10) {
      toast({
        title: "Maximum conditions reached",
        description: "You can add up to 10 conditions per strategy.",
        variant: "destructive",
      });
      return;
    }

    const newId = crypto.randomUUID();
    const newCondition = {
      id: newId,
      type: "HOME_FORM" as StrategyConditionType,
      operator: ">" as StrategyOperator,
      value: 0,
      lastMatches: 5,
      target: "HOME" as StrategyTarget,
    };

    // Add new condition at the top
    setConditions([newCondition, ...conditions]);

    // Collapse all other conditions and expand the new one
    const newExpanded: Record<string, boolean> = {};
    newExpanded[newId] = true;
    conditions.forEach((c) => {
      newExpanded[c.id] = false;
    });
    setExpandedConditions(newExpanded);

    // Mark as new for animation
    setNewConditionIds(new Set([newId]));

    // Remove animation after 2 seconds
    setTimeout(() => {
      setNewConditionIds((prev) => {
        const next = new Set(prev);
        next.delete(newId);
        return next;
      });
    }, 2000);
  };

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleUpdateCondition = (index: number, condition: ConditionFormData) => {
    setConditions(conditions.map((c, i) => (i === index ? condition : c)));
  };

  const handleToggleCondition = (conditionId: string) => {
    setExpandedConditions((prev) => ({
      ...prev,
      [conditionId]: !prev[conditionId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a strategy name.",
        variant: "destructive",
      });
      return;
    }

    if (conditions.length === 0) {
      toast({
        title: "Conditions required",
        description: "Please add at least one condition.",
        variant: "destructive",
      });
      return;
    }

    // Validate conditions
    for (let i = 0; i < conditions.length; i++) {
      const condition = conditions[i];
      if (!condition.type || !condition.operator || !condition.target) {
        toast({
          title: "Invalid condition",
          description: `Condition ${i + 1} is incomplete. Please fill all fields.`,
          variant: "destructive",
        });
        return;
      }
      if (condition.value === undefined || isNaN(condition.value)) {
        toast({
          title: "Invalid condition value",
          description: `Condition ${i + 1} requires a valid numeric value.`,
          variant: "destructive",
        });
        return;
      }
    }

    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim() || undefined,
        conditions,
        isActive: strategy?.isActive ?? true,
      });

      toast({
        title: mode === "create" ? "Strategy created" : "Strategy updated",
        description: `Your strategy has been ${mode === "create" ? "created" : "updated"} successfully.`,
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save strategy",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[95vw] sm:w-auto sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "95vw",
        }}
      >
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Strategy" : "Edit Strategy"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new strategy with custom conditions to find matching fixtures."
              : "Update your strategy conditions and settings."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="strategy-name">Strategy Name *</Label>
            <Input
              id="strategy-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., High-scoring home teams"
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="strategy-description">Description (Optional)</Label>
            <Textarea
              id="strategy-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description to help remember what this strategy is for..."
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Conditions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Conditions *</Label>
            </div>

            {/* Add Condition Button - More prominent on mobile */}
            <Button
              type="button"
              variant="default"
              className="w-full sm:w-auto shadow-sm"
              onClick={handleAddCondition}
              disabled={conditions.length >= 10}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Condition {conditions.length > 0 && `(${conditions.length}/10)`}
            </Button>

            {conditions.length === 0 && (
              <div className="p-8 border border-dashed border-border rounded-lg text-center text-muted-foreground">
                <p className="text-sm">No conditions added yet.</p>
                <p className="text-xs mt-1">Click "Add Condition" above to get started.</p>
              </div>
            )}

            <div className="space-y-3">
              {conditions.map((condition, index) => (
                <StrategyConditionBuilder
                  key={condition.id}
                  condition={condition}
                  onChange={(updated) => handleUpdateCondition(index, updated)}
                  onRemove={() => handleRemoveCondition(index)}
                  index={index}
                  isExpanded={expandedConditions[condition.id] || false}
                  onToggle={() => handleToggleCondition(condition.id)}
                  isNew={newConditionIds.has(condition.id)}
                />
              ))}
            </div>

            {/* Repeat Add Condition at bottom for easier access */}
            {conditions.length > 0 && conditions.length < 10 && (
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleAddCondition}
                disabled={conditions.length >= 10}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Condition ({conditions.length}/10)
              </Button>
            )}
          </div>

          {/* Extra spacing on mobile before footer to prevent accidental taps */}
          <div className="h-8 sm:h-4" />

          <DialogFooter className="gap-3 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
              className="min-h-[44px] sm:min-h-[36px]"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="min-h-[44px] sm:min-h-[36px]">
              {saving ? "Saving..." : mode === "create" ? "Create Strategy" : "Update Strategy"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
