import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type Plan = {
  id: string;
  name: string;
  credits: number;
  price: number;
  features: string[];
};

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 50,
    price: 9.99,
    features: ["50 AI queries/month", "Basic match analysis", "Email support"],
  },
  {
    id: "premium",
    name: "Premium",
    credits: 100,
    price: 19.99,
    features: ["100 AI queries/month", "Advanced predictions", "Priority support", "Save insights"],
  },
  {
    id: "pro",
    name: "Pro",
    credits: 250,
    price: 39.99,
    features: ["250 AI queries/month", "All Premium features", "API access", "Custom reports"],
  },
];

export default function SignUp() {
  const { signup, loading, error, user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = useMemo(() => {
    const state = location.state as { from?: Location } | null;
    return state?.from?.pathname ?? "/fixtures";
  }, [location.state]);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"account" | "plan">("account");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agreeToTerms: false,
    selectedPlan: "premium",
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo, user]);

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("plan");
  };

  const handlePlanSubmit = async () => {
    if (loading) return;

    try {
      await signup(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.selectedPlan
      );
      toast({
        title: "Account created",
        description: "Welcome aboard! Redirecting you to the dashboard.",
      });
      navigate("/fixtures");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to complete sign up.";
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent mb-4 shadow-[0_0_30px_hsl(var(--primary)/0.4)]">
            <svg
              className="h-8 w-8 text-primary-foreground"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {step === "account" ? "Create Account" : "Choose Your Plan"}
          </h1>
          <p className="text-muted-foreground">
            {step === "account"
              ? "Get started with AI football insights"
              : "Select the plan that fits your needs"}
          </p>
        </div>

        {step === "account" ? (
          <form
            onSubmit={handleAccountSubmit}
            className="space-y-6 bg-card p-8 rounded-xl border border-border shadow-lg"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    className="pl-10"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    className="pl-10"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, agreeToTerms: checked as boolean })
                }
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{" "}
                <a href="#" className="text-primary hover:text-accent transition-colors">
                  Terms & Conditions
                </a>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              disabled={!formData.agreeToTerms}
            >
              Continue to Plan Selection
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-accent transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={cn(
                    "bg-card/50 backdrop-blur-sm cursor-pointer transition-all hover:border-primary/50",
                    formData.selectedPlan === plan.id
                      ? "border-primary shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                      : "border-border"
                  )}
                  onClick={() => setFormData({ ...formData, selectedPlan: plan.id })}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-3xl font-bold text-primary">${plan.price}</span>
                          <span className="text-muted-foreground text-sm">/month</span>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
                          formData.selectedPlan === plan.id
                            ? "border-primary bg-primary"
                            : "border-muted"
                        )}
                      >
                        {formData.selectedPlan === plan.id && (
                          <Check className="h-4 w-4 text-primary-foreground" />
                        )}
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("account")} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handlePlanSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              >
                {loading ? "Creating account..." : "Complete Sign Up"}
              </Button>
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
