import { useState, useEffect } from 'react';
import { insightsService, Insight } from '@/services/insights.service';

export const useInsights = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInsights = () => {
    setLoading(true);
    setError(null);

    insightsService.getInsights().subscribe({
      next: (data) => {
        setInsights(data);
        setLoading(false);
      },
      error: (err) => {
        setError(err.message);
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    loadInsights();
  }, []);

  const saveInsight = (data: {
    title: string;
    content: string;
    tags: string[];
  }) => {
    setLoading(true);
    setError(null);

    return new Promise<Insight>((resolve, reject) => {
      insightsService.saveInsight(data).subscribe({
        next: (newInsight) => {
          setInsights((prev) => [newInsight, ...prev]);
          setLoading(false);
          resolve(newInsight);
        },
        error: (err) => {
          setError(err.message);
          setLoading(false);
          reject(err);
        },
      });
    });
  };

  const deleteInsight = (id: string) => {
    setLoading(true);
    setError(null);

    return new Promise<void>((resolve, reject) => {
      insightsService.deleteInsight(id).subscribe({
        next: () => {
          setInsights((prev) => prev.filter((i) => i.id !== id));
          setLoading(false);
          resolve();
        },
        error: (err) => {
          setError(err.message);
          setLoading(false);
          reject(err);
        },
      });
    });
  };

  return {
    insights,
    loading,
    error,
    saveInsight,
    deleteInsight,
    reload: loadInsights,
  };
};
