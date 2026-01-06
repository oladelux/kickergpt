import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";
import { Check, Eye, EyeOff, Mail, Lock, User, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";
import { COUNTRIES } from "@/constants/countries";

const onboardingPillars = [
  {
    title: "Pre-match analysis",
    points: [
      "Form, injuries & squad availability",
      "H2H history & day/time patterns",
      "Weather, referee & venue impact",
    ],
  },
] as const;

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
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    countryCode: "",
    agreeToTerms: false,
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!formData.agreeToTerms) {
      toast({
        variant: "destructive",
        title: "Please accept the terms",
        description: "You need to agree to the terms to create an account.",
      });
      return;
    }
    if (!formData.countryCode) {
      toast({
        variant: "destructive",
        title: "Please select your country",
        description: "Country is required to create an account.",
      });
      return;
    }

    try {
      await signup(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.countryCode
      );
      toast({
        title: "Account created",
        description: "Welcome aboard! Redirecting you to your fixtures.",
      });
      navigate("/fixtures");
    } catch (err) {
      // Check if this is an email not verified error
      if (err instanceof Error && "code" in err && err.code === "emailNotVerified") {
        // Store credentials temporarily for auto-login after verification
        sessionStorage.setItem(
          "pendingVerification",
          JSON.stringify({
            email: formData.email,
            password: formData.password,
          })
        );
        navigate("/verify-email", { state: { email: formData.email }, replace: true });
        return;
      }

      const message = err instanceof Error ? err.message : "Unable to complete sign up.";
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: message,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account - KickerGPT</title>
        <meta
          name="description"
          content="Create a free KickerGPT account to get AI-powered pre-match analysis for European football matches."
        />
        <meta property="og:title" content="Create Account - KickerGPT" />
        <meta
          property="og:description"
          content="Start analyzing football matches for free. No credit card required."
        />
        <link rel="canonical" href="https://kickergpt.com/signup" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-secondary/40">
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
                Free to start
              </Badge>
              <h1 className="text-3xl font-semibold tracking-tight text-balance">
                Start analyzing matches in seconds.
              </h1>
              <p className="text-muted-foreground">
                Get pre-match intelligence powered by historical data patterns. No credit card
                required.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {onboardingPillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-border/60 bg-background/40 p-4"
                >
                  <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                    {pillar.title}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-foreground/90">
                    {pillar.points.map((point) => (
                      <li key={point} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-primary" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="w-full rounded-3xl border border-border/70 bg-card/90 p-6 shadow-2xl shadow-primary/10 backdrop-blur lg:max-w-md">
            <div className="mb-6 space-y-2 text-center lg:text-left">
              <h2 className="text-2xl font-semibold tracking-tight">Create your account</h2>
              <p className="text-sm text-muted-foreground">Start analyzing matches for free.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                <p className="text-xs text-muted-foreground">
                  Please use a valid email address. You'll be asked to verify it before accessing the app.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                  <Select
                    value={formData.countryCode}
                    onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
                  >
                    <SelectTrigger className="pl-10" id="country">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, agreeToTerms: Boolean(checked) })
                    }
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-primary hover:text-accent transition-colors underline"
                    >
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-primary hover:text-accent transition-colors underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  <strong className="text-foreground">Disclaimer:</strong> KickerGPT provides data
                  analysis, statistical insights, and probability estimates based on historical data
                  and algorithms. Our predictions are for informational purposes only and are not
                  betting advice or guarantees. Past performance does not guarantee future results.
                  Any use of our analysis for betting purposes is at your own discretion and risk.
                  We are not responsible for any losses incurred from betting decisions.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>

              {error && <p className="text-sm text-destructive text-center">{error}</p>}
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-accent transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
