import { Observable, from, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { api } from "@/lib/api";
import {
  Strategy,
  CreateStrategyRequest,
  UpdateStrategyRequest,
  FindMatchesResponse,
} from "@/types/strategy";

class StrategiesService {
  getStrategies(): Observable<Strategy[]> {
    return from(api.strategies.getAll()).pipe(
      map((response) => response as Strategy[]),
      catchError((error) =>
        throwError(
          () => new Error(error?.message ?? "Failed to load strategies. Please try again.")
        )
      )
    );
  }

  getStrategy(id: string): Observable<Strategy> {
    return from(api.strategies.getOne(id)).pipe(
      map((response) => response as Strategy),
      catchError((error) =>
        throwError(() => new Error(error?.message ?? "Failed to load strategy. Please try again."))
      )
    );
  }

  createStrategy(data: CreateStrategyRequest): Observable<Strategy> {
    return from(api.strategies.create(data)).pipe(
      map((response) => response as Strategy),
      catchError((error) =>
        throwError(
          () => new Error(error?.message ?? "Failed to create strategy. Please try again.")
        )
      )
    );
  }

  updateStrategy(id: string, data: UpdateStrategyRequest): Observable<Strategy> {
    return from(api.strategies.update(id, data)).pipe(
      map((response) => response as Strategy),
      catchError((error) =>
        throwError(
          () => new Error(error?.message ?? "Failed to update strategy. Please try again.")
        )
      )
    );
  }

  deleteStrategy(id: string): Observable<void> {
    return from(api.strategies.delete(id)).pipe(
      map(() => void 0),
      catchError((error) =>
        throwError(
          () => new Error(error?.message ?? "Failed to delete strategy. Please try again.")
        )
      )
    );
  }

  findMatches(id: string): Observable<FindMatchesResponse> {
    return from(api.strategies.findMatches(id)).pipe(
      map((response) => response as FindMatchesResponse),
      catchError((error) =>
        throwError(() => new Error(error?.message ?? "Failed to find matches. Please try again."))
      )
    );
  }
}

export const strategiesService = new StrategiesService();
