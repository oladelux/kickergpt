import { Observable, from, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { api, FixturePrediction, PredictionsResponse } from "@/lib/api";

class PredictionsService {
  private predictionsCache = new Map<number, FixturePrediction>();
  private lastFetchTime: number | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  getPredictions(): Observable<Map<number, FixturePrediction>> {
    // Return cached data if still valid
    if (
      this.lastFetchTime &&
      Date.now() - this.lastFetchTime < this.CACHE_DURATION &&
      this.predictionsCache.size > 0
    ) {
      return from([this.predictionsCache]);
    }

    return from(api.predictions.get()).pipe(
      map((response: PredictionsResponse) => {
        // Clear existing cache
        this.predictionsCache.clear();

        // Map predictions by fixtureId for O(1) lookup
        response.predictions.forEach((prediction) => {
          this.predictionsCache.set(prediction.fixtureId, prediction);
        });

        this.lastFetchTime = Date.now();
        return this.predictionsCache;
      }),
      catchError((error) =>
        throwError(
          () =>
            new Error(
              error?.message ?? "Failed to load predictions. Please try again."
            )
        )
      )
    );
  }

  getPredictionForFixture(fixtureId: number): FixturePrediction | undefined {
    return this.predictionsCache.get(fixtureId);
  }

  clearCache(): void {
    this.predictionsCache.clear();
    this.lastFetchTime = null;
  }
}

export const predictionsService = new PredictionsService();

