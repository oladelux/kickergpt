import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle, RefreshCw, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { api, ClientError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";

type VerificationState = "loading" | "success" | "error" | "missing-reference";

export default function VerifyAddonPurchase() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [state, setState] = useState<VerificationState>("loading");
  const [verificationAttempted, setVerificationAttempted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reference = searchParams.get("reference");
  const isNative = searchParams.get("isNative") === "true";

  useEffect(() => {
    // Check if reference is missing
    if (!reference) {
      setState("missing-reference");
      return;
    }

    // Only attempt verification once
    if (verificationAttempted) {
      return;
    }

    setVerificationAttempted(true);
    setState("loading");

    const verifyPayment = async () => {
      try {
        await api.subscriptions.addonPurchaseVerify({ reference });
        setState("success");
        toast({
          title: "Addon purchase verified",
          description: "Your addon credits have been successfully added!",
        });

        // Only redirect if not native app (native apps should close tab and return to app)
        if (!isNative) {
          // Redirect to plans page after 2 seconds
          setTimeout(() => {
            navigate("/plans", { replace: true });
          }, 2000);
        }
      } catch (err) {
        const message =
          err instanceof ClientError
            ? (typeof err.responseBody?.message === "string" && err.responseBody.message) ||
              "Addon purchase verification failed"
            : err instanceof Error
              ? "Addon purchase verification failed. Please try again."
              : "Addon purchase verification failed. Please try again.";

        setErrorMessage(message);
        setState("error");
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: message,
        });
      }
    };

    verifyPayment();
  }, [reference, navigate, toast, verificationAttempted, isNative]);

  const handleRetry = () => {
    setVerificationAttempted(false);
    setState("loading");
  };

  const handleOpenIntercom = () => {
    if (typeof window !== "undefined") {
      const win = window as unknown as {
        Intercom?: (command: string, ...args: unknown[]) => void;
      };
      if (win.Intercom) {
        win.Intercom("show");
      }
    }
  };

  const handleEmailSupport = () => {
    window.location.href = "mailto:admin@kickergpt.com?subject=Addon Purchase Verification Issue";
  };

  // Loading state
  if (state === "loading") {
    return (
      <>
        <Helmet>
          <title>Verifying Addon Purchase - KickerGPT</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-secondary/40 flex items-center justify-center">
          <div className="max-w-md w-full mx-4">
            <div className="rounded-3xl border border-border/70 bg-card/90 p-8 shadow-2xl shadow-primary/10 backdrop-blur text-center">
              <div className="mb-6 flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                </div>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight mb-2">
                Verifying your addon purchase
              </h1>
              <p className="text-muted-foreground">
                Please wait while we verify your addon purchase...
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Success state
  if (state === "success") {
    return (
      <>
        <Helmet>
          <title>Addon Purchase Verified - KickerGPT</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-secondary/40 flex items-center justify-center">
          <div className="max-w-md w-full mx-4">
            <div className="rounded-3xl border border-border/70 bg-card/90 p-8 shadow-2xl shadow-primary/10 backdrop-blur text-center">
              <div className="mb-6 flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
              </div>
              <Badge
                variant="outline"
                className="border-primary/40 text-xs uppercase tracking-[0.4em] text-muted-foreground mb-4"
              >
                Purchase Verified
              </Badge>
              <h1 className="text-2xl font-semibold tracking-tight mb-2">
                Addon credits added successfully!
              </h1>
              {isNative ? (
                <p className="text-muted-foreground mb-6">
                  Addon credits added successfully, close this tab and return to the app.
                </p>
              ) : (
                <>
                  <p className="text-muted-foreground mb-6">
                    Your addon credits have been confirmed and are now available. Redirecting you to
                    your plans page...
                  </p>
                  <Button asChild className="w-full">
                    <Link to="/plans">Go to Plans</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Missing reference state
  if (state === "missing-reference") {
    return (
      <>
        <Helmet>
          <title>Addon Purchase Verification Error - KickerGPT</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-secondary/40 flex items-center justify-center">
          <div className="max-w-md w-full mx-4">
            <div className="rounded-3xl border border-border/70 bg-card/90 p-8 shadow-2xl shadow-primary/10 backdrop-blur text-center">
              <div className="mb-6 flex justify-center">
                <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
              </div>
              <Badge
                variant="outline"
                className="border-destructive/40 text-xs uppercase tracking-[0.4em] text-muted-foreground mb-4"
              >
                Invalid Request
              </Badge>
              <h1 className="text-2xl font-semibold tracking-tight mb-2">
                Missing payment reference
              </h1>
              <p className="text-muted-foreground mb-6">
                The payment reference is missing from the URL. Please ensure you're using the
                correct verification link. If you need help, contact our support team.
              </p>
              <div className="flex flex-col gap-3">
                <Button onClick={handleOpenIntercom} variant="outline" className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Support (Chat)
                </Button>
                <Button onClick={handleEmailSupport} variant="outline" className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Support
                </Button>
                <Button asChild className="w-full">
                  <Link to="/plans">Go to Plans</Link>
                </Button>
                <Button asChild variant="ghost" className="w-full">
                  <Link to="/">Go to Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  return (
    <>
      <Helmet>
        <title>Addon Purchase Verification Error - KickerGPT</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-secondary/40 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="rounded-3xl border border-border/70 bg-card/90 p-8 shadow-2xl shadow-primary/10 backdrop-blur text-center">
            <div className="mb-6 flex justify-center">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <Badge
              variant="outline"
              className="border-destructive/40 text-xs uppercase tracking-[0.4em] text-muted-foreground mb-4"
            >
              Verification Failed
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight mb-2">
              Addon purchase verification failed
            </h1>
            <p className="text-muted-foreground mb-6">
              {errorMessage ||
                "An error occurred while verifying your addon purchase. Please contact our support team for assistance."}
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={handleRetry} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={handleOpenIntercom} variant="outline" className="w-full">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Support (Chat)
              </Button>
              <Button onClick={handleEmailSupport} variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Email Support
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link to="/plans">Go to Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
