import { useState, useEffect } from "react";
import { predictionsService } from "@/services/predictions.service";
import { FixturePrediction } from "@/lib/api";

export const usePredictions = () => {
  const [predictions, setPredictions] = useState<Map<number, FixturePrediction>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPredictions = () => {
    setLoading(true);
    setError(null);

    predictionsService.getPredictions().subscribe({
      next: (data) => {
        setPredictions(data);
        setLoading(false);
      },
      error: (err) => {
        setError(err.message);
        setLoading(false);
        // Don't throw error - predictions are optional
        console.warn("Failed to load predictions:", err.message);
      },
    });
  };

  useEffect(() => {
    loadPredictions();
  }, []);

  const getPredictionForFixture = (fixtureId: string | number): FixturePrediction | undefined => {
    const numericId = typeof fixtureId === "string" ? parseInt(fixtureId, 10) : fixtureId;
    return predictions.get(numericId);
  };

  return {
    predictions,
    loading,
    error,
    getPredictionForFixture,
    reload: loadPredictions,
  };
};

