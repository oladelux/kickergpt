import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Mail, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";
import { useGeoCountry } from "@/hooks/useGeoCountry";
import { track } from "@vercel/analytics";

export default function EmailVerification() {
  const { resendVerificationEmail, confirmEmail, login, loading, user, isAuthenticated } =
    useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationAttempted, setVerificationAttempted] = useState(false);
  const { resolvedCountryCode: geoCountryCode } = useGeoCountry();

  // Get email from location state or search params
  const email = (location.state as { email?: string })?.email ?? searchParams.get("email") ?? "";

  // Get hash from search params for email confirmation
  const hash = searchParams.get("hash");

  // If already authenticated, always redirect to fixtures (whether hash exists or not)
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/fixtures", { replace: true });
    }
  }, [isAuthenticated, navigate, user]);

  // Handle email confirmation from link
  useEffect(() => {
    if (hash && !verifying && !isAuthenticated && !verificationAttempted) {
      setVerificationAttempted(true);
      setVerifying(true);
      confirmEmail(hash)
        .then(() => {
          // Check if we have pending credentials from signup/login
          const pendingData = sessionStorage.getItem("pendingVerification");

          if (pendingData) {
            try {
              const { email: userEmail, password } = JSON.parse(pendingData);
              // Clear the stored credentials
              sessionStorage.removeItem("pendingVerification");

              toast({
                title: "Email verified",
                description: "Your email has been verified successfully! Signing you in...",
              });

              // Auto-login the user
              login(userEmail, password, geoCountryCode)
                .then(() => {
                  // Track verified registration with UTM source
                  const utmSource = localStorage.getItem("utm_source");
                  track("registration", { source: utmSource || "direct" });
                  if (utmSource) {
                    localStorage.removeItem("utm_source");
                  }

                  // Set flag to show promo banner on first page load after login
                  sessionStorage.setItem("just-logged-in", "true");
                  toast({
                    title: "Welcome!",
                    description: "You're all set. Redirecting to your fixtures...",
                  });
                  navigate("/fixtures", { replace: true });
                })
                .catch(() => {
                  // If auto-login fails, redirect to login
                  navigate("/login", { replace: true });
                });
            } catch {
              // If parsing fails, just redirect to login
              toast({
                title: "Email verified",
                description: "Your email has been verified successfully! Please sign in.",
              });
              navigate("/login", { replace: true });
            }
          } else {
            // No pending credentials, just redirect to login
            toast({
              title: "Email verified",
              description: "Your email has been verified successfully! Please sign in.",
            });
            setTimeout(() => {
              navigate("/login", { replace: true });
            }, 1500);
          }
        })
        .catch((err) => {
          const message = err instanceof Error ? err.message : "Verification failed.";
          toast({
            variant: "destructive",
            title: "Verification failed",
            description: message,
          });
          setVerifying(false);
        });
    }
  }, [
    hash,
    confirmEmail,
    navigate,
    toast,
    verifying,
    verificationAttempted,
    login,
    geoCountryCode,
    isAuthenticated,
    user,
  ]);

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Email address not found. Please try logging in again.",
      });
      navigate("/login");
      return;
    }

    setResending(true);
    try {
      await resendVerificationEmail(email);
      toast({
        title: "Email sent",
        description: "Email sent if the account exists/unverified.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to resend email.";
      toast({
        variant: "destructive",
        title: "Failed to resend",
        description: message,
      });
    } finally {
      setResending(false);
    }
  };

  // If verifying from hash, show loading state
  if (hash && verifying) {
    return (
      <>
        <Helmet>
          <title>Verifying Email - KickerGPT</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-secondary/40 flex items-center justify-center">
          <div className="max-w-md w-full mx-4">
            <div className="rounded-3xl border border-border/70 bg-card/90 p-8 shadow-2xl shadow-primary/10 backdrop-blur text-center">
              <div className="mb-6 flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                </div>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight mb-2">Verifying your email</h1>
              <p className="text-muted-foreground">Please wait...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Verify Your Email - KickerGPT</title>
        <meta
          name="description"
          content="Verify your email address to access your KickerGPT account."
        />
        <meta property="og:title" content="Verify Your Email - KickerGPT" />
        <meta
          property="og:description"
          content="Verify your email address to start analyzing football matches."
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-secondary/40">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-8 px-4 py-12 md:py-16">
          <div className="w-full max-w-md rounded-3xl border border-border/70 bg-card/90 p-8 shadow-2xl shadow-primary/10 backdrop-blur">
            <div className="mb-6 flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>

            <div className="space-y-4 text-center">
              <Badge
                variant="outline"
                className="border-primary/40 text-xs uppercase tracking-[0.4em] text-muted-foreground"
              >
                Email Verification
              </Badge>
              <h1 className="text-3xl font-semibold tracking-tight">Check your email</h1>
              <p className="text-muted-foreground">
                We've sent a verification link to{" "}
                <span className="font-medium text-foreground">{email || "your email"}</span>
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">What to do next:</p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Check your email inbox (and spam folder)</li>
                      <li>Click the verification link in the email</li>
                      <li>Return here to sign in</li>
                    </ol>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleResendEmail}
                disabled={resending || loading}
                variant="outline"
                className="w-full"
              >
                {resending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend verification email
                  </>
                )}
              </Button>

              <div className="pt-4 text-center">
                <Link
                  to="/login"
                  className="text-sm text-primary hover:text-accent transition-colors font-medium"
                >
                  Back to sign in
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground max-w-md">
            <p>
              Didn't receive the email? Check your spam folder or click the resend button above.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
