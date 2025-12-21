import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions - KickerGPT</title>
        <meta
          name="description"
          content="KickerGPT Terms and Conditions - Read our terms of service and user agreement."
        />
        <meta property="og:title" content="Terms and Conditions - KickerGPT" />
        <link rel="canonical" href="https://kickergpt.com/terms" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-secondary/30">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="mb-8">
            <Link
              to="/"
              className="text-lg font-semibold tracking-tight text-foreground hover:text-primary transition-colors"
            >
              kicker<span className="bold text-primary">GPT</span>
            </Link>
          </div>

          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle className="text-3xl">Terms and Conditions</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
              <Alert className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-foreground">
                  <strong className="font-semibold">Important Disclaimer:</strong> KickerGPT provides data analysis and
                  informational content only. We do not provide betting advice, predictions, or guarantees of outcomes.
                  Any use of our analysis for betting purposes is at your sole discretion and risk. Please gamble
                  responsibly and within your means.
                </AlertDescription>
              </Alert>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using KickerGPT ("the Service"), you accept and agree to be bound by the terms and
                  provision of this agreement. If you do not agree to abide by the above, please do not use this
                  service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
                <p>
                  KickerGPT is an AI-powered platform that provides football match analysis, statistical insights, and
                  data-driven information about football matches, teams, players, and competitions. Our Service includes:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Pre-match analysis and statistical insights</li>
                  <li>Historical data and pattern recognition</li>
                  <li>Injury and squad availability information</li>
                  <li>Head-to-head records and form analysis</li>
                  <li>Weather and venue context</li>
                  <li>Conversational AI interface for match-related queries</li>
                </ul>
                <p className="mt-3">
                  <strong className="text-foreground">Important:</strong> Our Service provides informational and analytical
                  content only. We do not provide betting advice, recommendations, or predictions of match outcomes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">3. No Betting Advice Disclaimer</h2>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 my-4">
                  <p className="text-foreground font-medium mb-2">
                    <strong>WE DO NOT PROVIDE BETTING ADVICE</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>
                      KickerGPT is an informational and analytical tool only. We do not provide betting tips,
                      recommendations, or advice.
                    </li>
                    <li>
                      Our analysis, statistics, and insights are provided for informational purposes and should not be
                      construed as betting advice or recommendations.
                    </li>
                    <li>
                      Any decisions to place bets based on information from our Service are made entirely at your own
                      discretion and risk.
                    </li>
                    <li>
                      We do not guarantee the accuracy, completeness, or reliability of any information provided, and
                      we are not responsible for any losses incurred from betting decisions.
                    </li>
                    <li>
                      Past performance and statistical analysis do not guarantee future results. Football matches are
                      inherently unpredictable.
                    </li>
                    <li>
                      If you choose to use our analysis for betting purposes, you acknowledge that you do so at your own
                      risk and that we bear no responsibility for any outcomes or losses.
                    </li>
                  </ul>
                </div>
                <p>
                  <strong className="text-foreground">Responsible Gambling:</strong> If you choose to engage in betting
                  activities, please do so responsibly. Only bet what you can afford to lose. If you feel you may have a
                  gambling problem, please seek help from appropriate support services in your jurisdiction.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">4. User Accounts</h2>
                <h3 className="text-lg font-medium text-foreground mb-2 mt-4">4.1 Account Creation</h3>
                <p>
                  To access certain features of our Service, you must create an account. You agree to provide accurate,
                  current, and complete information during registration and to update such information to keep it
                  accurate, current, and complete.
                </p>

                <h3 className="text-lg font-medium text-foreground mb-2 mt-4">4.2 Account Security</h3>
                <p>
                  You are responsible for maintaining the confidentiality of your account credentials and for all
                  activities that occur under your account. You agree to notify us immediately of any unauthorized use of
                  your account.

                </p>

                <h3 className="text-lg font-medium text-foreground mb-2 mt-4">4.3 Age Requirement</h3>
                <p>
                  You must be at least 18 years old to use our Service. By using our Service, you represent and warrant
                  that you are at least 18 years of age.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">5. Subscription and Payment Terms</h2>
                <h3 className="text-lg font-medium text-foreground mb-2 mt-4">5.1 Subscription Plans</h3>
                <p>
                  We offer various subscription plans and credit packages. Subscription fees are billed in advance on a
                  recurring basis. By purchasing a subscription, you authorize us to charge your payment method for the
                  subscription fee.
                </p>
                <p className="mt-2">
                  <strong className="text-foreground">Payment Processing:</strong> All subscriptions and purchases made
                  through our Service (both web and mobile applications) are processed by Stripe or PayPal. These
                  transactions are subject to Stripe's or PayPal's terms and conditions, as applicable.
                </p>

                <h3 className="text-lg font-medium text-foreground mb-2 mt-4">5.2 Cancellation and Refunds</h3>
                <p>
                  You may cancel your subscription at any time through your account settings. Cancellation will take effect at the end of your current billing period. You will
                  continue to have access to paid features until the end of your billing period.
                </p>
                <p className="mt-2">
                  <strong className="text-foreground">Refund Policy:</strong>
                </p>
                <p className="mt-2">
                  Refunds for subscriptions and purchases are handled through Stripe or PayPal in accordance with their respective refund policies and applicable laws. Refund requests are provided at our discretion and in accordance with applicable laws. To request a refund, please contact us at{" "}
                  <a href="mailto:admin@kickergpt.com" className="text-primary hover:underline">
                    admin@kickergpt.com
                  </a>
                  .
                </p>
                <p className="mt-2">
                  <strong className="text-foreground">Free Trial:</strong> If you sign up for a free trial, your
                  subscription will automatically convert to a paid subscription at the end of the trial period unless
                  you cancel before the trial ends.
                </p>

                <h3 className="text-lg font-medium text-foreground mb-2 mt-4">5.3 Price Changes</h3>
                <p>
                  We reserve the right to modify subscription prices at any time. Price changes will be communicated to
                  you in advance (at least 30 days for existing subscribers) and will apply to subsequent billing
                  periods. If you do not agree to the price change, you may cancel your subscription before the change
                  takes effect.
                </p>

                <h3 className="text-lg font-medium text-foreground mb-2 mt-4">5.4 Auto-Renewal</h3>
                <p>
                  Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current
                  billing period. You will be charged the subscription fee for the renewal period. You can manage
                  auto-renewal settings through your account settings or your device's app store settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">6. Acceptable Use</h2>
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Use the Service for any illegal purpose or in violation of any laws</li>
                  <li>Attempt to gain unauthorized access to our systems or networks</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Use automated systems to access the Service without permission</li>
                  <li>Reproduce, duplicate, copy, or resell any portion of the Service</li>
                  <li>Use the Service to transmit any harmful code or malicious software</li>
                  <li>Impersonate any person or entity or misrepresent your affiliation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">7. Intellectual Property</h2>
                <p>
                  The Service and its original content, features, and functionality are owned by KickerGPT and are
                  protected by international copyright, trademark, patent, trade secret, and other intellectual property
                  laws. You may not modify, reproduce, distribute, or create derivative works based on our Service
                  without our express written permission.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">8. Data Accuracy and Limitations</h2>
                <p>
                  While we strive to provide accurate and up-to-date information, we do not warrant or guarantee the
                  accuracy, completeness, or reliability of any information provided through our Service. Data may be
                  subject to delays, errors, or omissions. We are not liable for any decisions made based on
                  information from our Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">9. Limitation of Liability</h2>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, KICKERGPT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                  SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED
                  DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING
                  FROM:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Your use or inability to use the Service</li>
                  <li>Any decisions made based on information from our Service</li>
                  <li>Any betting losses or financial consequences resulting from use of our Service</li>
                  <li>Unauthorized access to or alteration of your transmissions or data</li>
                  <li>Statements or conduct of any third party on the Service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">10. Indemnification</h2>
                <p>
                  You agree to indemnify, defend, and hold harmless KickerGPT and its officers, directors, employees,
                  and agents from and against any claims, liabilities, damages, losses, and expenses, including
                  reasonable attorneys' fees, arising out of or in any way connected with your use of the Service or
                  violation of these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">11. Termination</h2>
                <p>
                  We may terminate or suspend your account and access to the Service immediately, without prior notice
                  or liability, for any reason, including if you breach these Terms. Upon termination, your right to use
                  the Service will immediately cease.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">12. Changes to Terms</h2>
                <p>
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
                  provide at least 30 days' notice prior to any new terms taking effect. Your continued use of the
                  Service after any changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">13. App Store Terms</h2>
                <p>
                  If you download our mobile application from the Apple App Store or Google Play Store, the following
                  additional terms apply:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>
                    <strong className="text-foreground">Apple App Store:</strong> These Terms are between you and
                    KickerGPT, not Apple. Apple is not responsible for the App or its content. Your use of the App must
                    comply with Apple's App Store Terms of Service. If the App fails to conform to any applicable
                    warranty, you may notify Apple, and Apple will refund the purchase price (if applicable). Apple has no
                    obligation to furnish any maintenance or support services for the App.
                  </li>
                  <li>
                    <strong className="text-foreground">Google Play Store:</strong> These Terms are between you and
                    KickerGPT. Google is not a party to these Terms. Your use of the App must comply with Google Play's
                    Terms of Service.
                  </li>
                  <li>
                    <strong className="text-foreground">Third-Party Beneficiaries:</strong> Apple and Google (and their
                    subsidiaries) are third-party beneficiaries of these Terms and have the right to enforce these Terms
                    against you.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">14. Governing Law and Dispute Resolution</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with applicable laws, without regard to
                  its conflict of law provisions.
                </p>
                <p className="mt-2">
                  <strong className="text-foreground">Dispute Resolution:</strong> Any disputes arising from these
                  Terms or your use of the Service shall be resolved through good faith negotiation. If a dispute cannot
                  be resolved through negotiation, it shall be resolved through binding arbitration in accordance with
                  applicable arbitration rules, except where prohibited by law.
                </p>
                <p className="mt-2">
                  <strong className="text-foreground">Class Action Waiver:</strong> You agree that any disputes will be
                  resolved individually and not as part of a class action, except where prohibited by law.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">15. Contact Information</h2>
                <p>
                  If you have any questions about these Terms, please contact us at:{" "}
                  <a href="mailto:admin@kickergpt.com" className="text-primary hover:underline">
                    admin@kickergpt.com
                  </a>
                </p>
              </section>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

