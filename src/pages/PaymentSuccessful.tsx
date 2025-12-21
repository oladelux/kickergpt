import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";

export default function PaymentSuccessful() {
  return (
    <>
      <Helmet>
        <title>Payment Successful - KickerGPT</title>
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
              Payment Successful
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight mb-2">Payment successful</h1>
            <p className="text-muted-foreground">Close this tab and return to the app.</p>
          </div>
        </div>
      </div>
    </>
  );
}
