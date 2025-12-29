import { useState, useEffect, useCallback } from "react";
import { strategiesService } from "@/services/strategies.service";
import {
  Strategy,
  CreateStrategyRequest,
  UpdateStrategyRequest,
  FindMatchesResponse,
} from "@/types/strategy";

export const useStrategies = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStrategies = useCallback(async () => {
    setLoading(true);
    setError(null);

    strategiesService.getStrategies().subscribe({
      next: (data) => {
        setStrategies(data);
        setLoading(false);
      },
      error: (err) => {
        setError(err.message || "Failed to load strategies");
        setLoading(false);
      },
    });
  }, []);

  useEffect(() => {
    loadStrategies();
  }, [loadStrategies]);

  const createStrategy = useCallback((data: CreateStrategyRequest): Promise<Strategy> => {
    return new Promise((resolve, reject) => {
      strategiesService.createStrategy(data).subscribe({
        next: (newStrategy) => {
          setStrategies((prev) => [...prev, newStrategy]);
          resolve(newStrategy);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }, []);

  const updateStrategy = useCallback(
    (id: string, data: UpdateStrategyRequest): Promise<Strategy> => {
      return new Promise((resolve, reject) => {
        strategiesService.updateStrategy(id, data).subscribe({
          next: (updatedStrategy) => {
            setStrategies((prev) => prev.map((s) => (s.id === id ? updatedStrategy : s)));
            resolve(updatedStrategy);
          },
          error: (err) => {
            reject(err);
          },
        });
      });
    },
    []
  );

  const deleteStrategy = useCallback((id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      strategiesService.deleteStrategy(id).subscribe({
        next: () => {
          setStrategies((prev) => prev.filter((s) => s.id !== id));
          resolve();
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }, []);

  const findMatches = useCallback((id: string): Promise<FindMatchesResponse> => {
    return new Promise((resolve, reject) => {
      strategiesService.findMatches(id).subscribe({
        next: (response) => {
          resolve(response);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }, []);

  return {
    strategies,
    loading,
    error,
    loadStrategies,
    createStrategy,
    updateStrategy,
    deleteStrategy,
    findMatches,
  };
};
