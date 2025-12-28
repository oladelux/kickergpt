import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";
import { Check, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";
import { useGeoCountry } from "@/hooks/useGeoCountry";

const loginFeatures = [
  "Access pre-match analysis for today's fixtures.",
  "Continue conversations with follow-up questions.",
  "Save favorite matches and review your analysis history.",
] as const;

export default function Login() {
  const { login, loading, error, user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = useMemo(() => {
    const state = location.state as { from?: Location } | null;
    return state?.from?.pathname ?? "/fixtures";
  }, [location.state]);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { resolvedCountryCode: geoCountryCode } = useGeoCountry();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      await login(email, password, geoCountryCode);
      // Set flag to show promo banner on first page load after login
      sessionStorage.setItem("just-logged-in", "true");
      toast({
        title: "Signed in",
        description: "Welcome back!",
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      // Check if this is an email not verified error
      if (err instanceof Error && "code" in err && err.code === "emailNotVerified") {
        // Store credentials temporarily for auto-login after verification
        sessionStorage.setItem(
          "pendingVerification",
          JSON.stringify({
            email,
            password,
          })
        );
        navigate("/verify-email", { state: { email }, replace: true });
        return;
      }

      const message = err instanceof Error ? err.message : "Unable to sign in.";
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: message,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign In - KickerGPT</title>
        <meta
          name="description"
          content="Sign in to your KickerGPT account to access pre-match analysis, and continue your match conversations."
        />
        <meta property="og:title" content="Sign In - KickerGPT" />
        <meta
          property="og:description"
          content="Sign in to continue analyzing football matches with AI-powered insights."
        />
        <link rel="canonical" href="https://kickergpt.com/login" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-secondary/40">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 md:py-16 lg:flex-row">
          <section className="rounded-3xl border border-border/70 bg-card/70 p-8 backdrop-blur">
            <Link to="/" className="text-xl font-semibold tracking-tight">
              kicker<span className="bold text-primary">GPT</span>
            </Link>
            <div className="mt-6 space-y-4">
              <Badge
                variant="outline"
                className="border-primary/40 text-xs uppercase tracking-[0.4em] text-muted-foreground"
              >
                Match analysis
              </Badge>
              <h1 className="text-3xl font-semibold tracking-tight text-balance">
                Sign in to continue analyzing matches.
              </h1>
              <p className="text-muted-foreground">
                Pick up where you left off with your match analysis and conversations.
              </p>
            </div>
            <div className="mt-8 space-y-3">
              {loginFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm text-foreground/90">
                  <Check className="h-4 w-4 text-primary" />
                  <p>{feature}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="w-full rounded-3xl border border-border/70 bg-card/90 p-6 shadow-2xl shadow-primary/10 backdrop-blur lg:max-w-md">
            <div className="mb-6 space-y-2 text-center lg:text-left">
              <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
              <p className="text-sm text-muted-foreground">Sign in with your KickerGPT account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-accent transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              {error && <p className="text-sm text-destructive text-center">{error}</p>}

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary hover:text-accent transition-colors font-medium"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
