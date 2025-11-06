import { Observable, from, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { api } from "@/lib/api";

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  planName: string;
  creditsUsed: number;
  creditsTotal: number;
  isActive: boolean;
}

class ProfileService {
  getProfile(): Observable<ProfileData> {
    return from(api.profile.get()).pipe(
      map((response) => this.normalizeProfile(response)),
      catchError((error) =>
        throwError(
          () => new Error(error?.message ?? "Failed to load your profile. Please try again.")
        )
      )
    );
  }

  updateProfile(data: { name?: string; email?: string }): Observable<ProfileData> {
    return from(api.profile.update(data)).pipe(
      map((response) => this.normalizeProfile(response)),
      catchError((error) =>
        throwError(
          () => new Error(error?.message ?? "Failed to update your profile. Please try again.")
        )
      )
    );
  }

  getUsage(): Observable<{ used: number; total: number; percentage: number }> {
    return from(api.profile.getUsage()).pipe(
      map((response) => ({
        used: Number(response?.used ?? response?.consumed ?? 0),
        total: Number(response?.total ?? response?.limit ?? 0),
        percentage: Number(response?.percentage ?? response?.progress ?? 0),
      })),
      catchError((error) =>
        throwError(
          () => new Error(error?.message ?? "Failed to load usage information. Please try again.")
        )
      )
    );
  }

  private normalizeProfile(data: any): ProfileData {
    if (!data) {
      return {
        id: "",
        name: "",
        email: "",
        planName: "",
        creditsUsed: 0,
        creditsTotal: 0,
        isActive: false,
      };
    }

    const subscription = data.subscription ?? data.plan ?? data.subscriptionPlan ?? {};
    const usage = data.usage ?? data.subscriptionUsage ?? {};
    const subscriptionPlan = subscription.plan ?? {};
    const status = (subscription.status ?? data.subscriptionStatus ?? data.status ?? "")
      .toString()
      .toLowerCase();

    const planName =
      subscriptionPlan.name ??
      subscription.name ??
      subscription.planName ??
      data.planName ??
      data.plan?.name ??
      data.subscriptionPlanName ??
      "";

    const creditsUsed = Number(
      usage.used ??
        usage.consumed ??
        subscription.creditsUsed ??
        subscription.usedCredits ??
        data.creditsUsed ??
        data.usedCredits ??
        0
    );

    const creditsTotalRaw = Number(
      usage.total ??
        usage.limit ??
        subscription.creditsTotal ??
        subscription.totalCredits ??
        subscription.limit ??
        data.creditsTotal ??
        data.totalCredits ??
        data.creditLimit ??
        0
    );

    const creditsRemaining = Number(
      usage.remaining ??
        usage.available ??
        subscription.creditsRemaining ??
        subscription.remainingCredits ??
        data.creditsRemaining ??
        data.remainingCredits ??
        creditsTotalRaw - creditsUsed
    );

    const creditsTotal =
      creditsTotalRaw === 0 && creditsRemaining > 0 ? creditsRemaining : creditsTotalRaw;

    const isUnlimited = creditsTotal === -1;

    const isActive =
      status === "active" ||
      status === "trialing" ||
      Boolean(subscription.isActive ?? subscription.active ?? data.isSubscriptionActive) ||
      isUnlimited ||
      creditsRemaining > 0 ||
      Boolean(planName);

    return {
      id: String(data.id ?? data.userId ?? ""),
      name: (data.name ?? `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim()).trim(),
      email: data.email ?? "",
      planName,
      creditsUsed,
      creditsTotal,
      isActive,
    };
  }
}

export const profileService = new ProfileService();
