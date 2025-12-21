import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - KickerGPT</title>
        <meta
          name="description"
          content="KickerGPT Privacy Policy - Learn how we collect, use, and protect your personal information."
        />
        <meta property="og:title" content="Privacy Policy - KickerGPT" />
        <link rel="canonical" href="https://kickergpt.com/privacy" />
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
              <CardTitle className="text-3xl">Privacy Policy</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
                <p>
                  Welcome to KickerGPT ("we," "our," or "us"). We are committed to protecting your
                  privacy and ensuring you have a positive experience while using our service. This
                  Privacy Policy explains how we collect, use, disclose, and safeguard your
                  information when you use our website and mobile application (collectively, the
                  "Service").
                </p>
                <p>
                  By using our Service, you agree to the collection and use of information in
                  accordance with this policy. If you do not agree with our policies and practices,
                  please do not use our Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  2. Information We Collect
                </h2>
                <h3 className="text-lg font-medium text-foreground mb-2 mt-4">
                  2.1 Information You Provide
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-foreground">Account Information:</strong> When you
                    create an account, we collect your name, email address, and password.
                  </li>
                  <li>
                    <strong className="text-foreground">Payment Information:</strong> If you
                    purchase a subscription or credits, we collect payment information through our
                    third-party payment processors (Stripe or PayPal). We do not store your full
                    payment card details on our servers.
                  </li>
                  <li>
                    <strong className="text-foreground">Profile Information:</strong> Any additional
                    information you choose to provide in your profile.
                  </li>
                  <li>
                    <strong className="text-foreground">Communications:</strong> Information you
                    provide when you contact us for support or feedback.
                  </li>
                </ul>

                <h3 className="text-lg font-medium text-foreground mb-2 mt-4">
                  2.2 Automatically Collected Information
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-foreground">Usage Data:</strong> Information about how
                    you use our Service, including pages visited, features used, and time spent on
                    the Service.
                  </li>
                  <li>
                    <strong className="text-foreground">Device Information:</strong> Device type,
                    operating system, unique device identifiers (such as Android ID or iOS
                    Identifier for Advertisers), device model, mobile network information, and app
                    version.
                  </li>
                  <li>
                    <strong className="text-foreground">Log Data:</strong> IP address, browser type,
                    access times, and referring website addresses.
                  </li>
                  <li>
                    <strong className="text-foreground">Cookies and Tracking Technologies:</strong>{" "}
                    We use cookies and similar tracking technologies to track activity on our
                    Service and hold certain information.
                  </li>
                  <li>
                    <strong className="text-foreground">Advertising Identifiers:</strong> On mobile
                    devices, we may collect advertising identifiers (such as Google Advertising ID
                    or Apple's Identifier for Advertisers) for advertising purposes, in accordance
                    with your device settings.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  3. How We Use Your Information
                </h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Provide, maintain, and improve our Service</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices, updates, and support messages</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Monitor and analyze usage patterns and trends</li>
                  <li>Detect, prevent, and address technical issues</li>
                  <li>Personalize your experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  4. Information Sharing and Disclosure
                </h2>
                <p>
                  We do not sell your personal information. We may share your information in the
                  following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>
                    <strong className="text-foreground">Service Providers:</strong> We may share
                    information with third-party service providers who perform services on our
                    behalf, such as payment processing, data analysis, email delivery, and hosting
                    services.
                  </li>
                  <li>
                    <strong className="text-foreground">Third-Party SDKs and Services:</strong> Our
                    mobile applications use third-party SDKs and services that may collect
                    information:
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>
                        <strong>Google AdMob:</strong> For displaying advertisements. AdMob may
                        collect device identifiers and usage data. See Google's Privacy Policy:{" "}
                        <a
                          href="https://policies.google.com/privacy"
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          https://policies.google.com/privacy
                        </a>
                      </li>
                      <li>
                        <strong>Stripe / PayPal:</strong> For processing subscriptions and
                        purchases. See Stripe's Privacy Policy:{" "}
                        <a
                          href="https://stripe.com/privacy"
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          https://stripe.com/privacy
                        </a>{" "}
                        and PayPal's Privacy Policy:{" "}
                        <a
                          href="https://www.paypal.com/us/webapps/mpp/ua/privacy-full"
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          https://www.paypal.com/us/webapps/mpp/ua/privacy-full
                        </a>
                        .
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong className="text-foreground">Legal Requirements:</strong> We may disclose
                    your information if required to do so by law or in response to valid requests by
                    public authorities.
                  </li>
                  <li>
                    <strong className="text-foreground">Business Transfers:</strong> In the event of
                    a merger, acquisition, or sale of assets, your information may be transferred.
                  </li>
                  <li>
                    <strong className="text-foreground">With Your Consent:</strong> We may share
                    your information with your consent or at your direction.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational security measures to protect
                  your personal information. However, no method of transmission over the Internet or
                  electronic storage is 100% secure. While we strive to use commercially acceptable
                  means to protect your information, we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  6. Your Rights and Choices
                </h2>
                <p>
                  Depending on your location, you may have certain rights regarding your personal
                  information:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>
                    <strong className="text-foreground">Access:</strong> You can request access to
                    your personal information.
                  </li>
                  <li>
                    <strong className="text-foreground">Correction:</strong> You can request
                    correction of inaccurate information.
                  </li>
                  <li>
                    <strong className="text-foreground">Deletion:</strong> You can request deletion
                    of your personal information.
                  </li>
                  <li>
                    <strong className="text-foreground">Opt-Out:</strong> You can opt-out of certain
                    communications from us.
                  </li>
                  <li>
                    <strong className="text-foreground">Account Deletion:</strong> You can delete
                    your account at any time through your account settings.
                  </li>
                </ul>
                <p className="mt-3">
                  To exercise these rights, please contact us at{" "}
                  <a href="mailto:admin@kickergpt.com" className="text-primary hover:underline">
                    admin@kickergpt.com
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  7. Cookies and Tracking Technologies
                </h2>
                <p>
                  We use cookies and similar tracking technologies to track activity on our Service
                  and store certain information. You can instruct your browser to refuse all cookies
                  or to indicate when a cookie is being sent. However, if you do not accept cookies,
                  you may not be able to use some portions of our Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  8. Third-Party Services
                </h2>
                <p>
                  Our Service may contain links to third-party websites or services. We are not
                  responsible for the privacy practices of these third parties. We encourage you to
                  read the privacy policies of any third-party service you access.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  9. Children's Privacy
                </h2>
                <p>
                  Our Service is not intended for individuals under the age of 18. We do not
                  knowingly collect personal information from children under 18. If you are a parent
                  or guardian and believe your child has provided us with personal information,
                  please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  10. International Data Transfers
                </h2>
                <p>
                  Your information may be transferred to and maintained on computers located outside
                  of your state, province, country, or other governmental jurisdiction where data
                  protection laws may differ. By using our Service, you consent to the transfer of
                  your information to these facilities.
                </p>
                <p className="mt-2">
                  If you are located in the European Economic Area (EEA) or United Kingdom, we
                  ensure that appropriate safeguards are in place for such transfers in accordance
                  with applicable data protection laws, including the General Data Protection
                  Regulation (GDPR).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">11. Data Retention</h2>
                <p>
                  We retain your personal information for as long as necessary to provide our
                  Service and fulfill the purposes outlined in this Privacy Policy, unless a longer
                  retention period is required or permitted by law. When you delete your account, we
                  will delete or anonymize your personal information, except where we are required
                  to retain it for legal, regulatory, or business purposes.
                </p>
                <p className="mt-2">
                  <strong className="text-foreground">Account Data:</strong> Retained while your
                  account is active and for a reasonable period after account deletion to comply
                  with legal obligations.
                </p>
                <p className="mt-2">
                  <strong className="text-foreground">Usage Data:</strong> Retained for analytical
                  purposes, typically for up to 2 years, unless you request deletion.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  12. Your Rights Under GDPR (European Users)
                </h2>
                <p>
                  If you are located in the EEA or UK, you have the following rights under GDPR:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>
                    <strong className="text-foreground">Right of Access:</strong> You can request a
                    copy of your personal data.
                  </li>
                  <li>
                    <strong className="text-foreground">Right to Rectification:</strong> You can
                    request correction of inaccurate data.
                  </li>
                  <li>
                    <strong className="text-foreground">Right to Erasure:</strong> You can request
                    deletion of your personal data.
                  </li>
                  <li>
                    <strong className="text-foreground">Right to Restrict Processing:</strong> You
                    can request restriction of processing of your data.
                  </li>
                  <li>
                    <strong className="text-foreground">Right to Data Portability:</strong> You can
                    request transfer of your data to another service.
                  </li>
                  <li>
                    <strong className="text-foreground">Right to Object:</strong> You can object to
                    processing of your data for certain purposes.
                  </li>
                  <li>
                    <strong className="text-foreground">Right to Withdraw Consent:</strong> Where
                    processing is based on consent, you can withdraw it at any time.
                  </li>
                </ul>
                <p className="mt-3">
                  To exercise these rights, please contact us at{" "}
                  <a href="mailto:admin@kickergpt.com" className="text-primary hover:underline">
                    admin@kickergpt.com
                  </a>
                  . You also have the right to lodge a complaint with your local data protection
                  authority.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  13. Your Rights Under CCPA (California Users)
                </h2>
                <p>
                  If you are a California resident, you have the following rights under the
                  California Consumer Privacy Act (CCPA):
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>
                    <strong className="text-foreground">Right to Know:</strong> You can request
                    information about what personal information we collect, use, and disclose.
                  </li>
                  <li>
                    <strong className="text-foreground">Right to Delete:</strong> You can request
                    deletion of your personal information.
                  </li>
                  <li>
                    <strong className="text-foreground">Right to Opt-Out:</strong> You can opt-out
                    of the sale of personal information (we do not sell personal information).
                  </li>
                  <li>
                    <strong className="text-foreground">Right to Non-Discrimination:</strong> We
                    will not discriminate against you for exercising your CCPA rights.
                  </li>
                </ul>
                <p className="mt-3">
                  To exercise these rights, please contact us at{" "}
                  <a href="mailto:admin@kickergpt.com" className="text-primary hover:underline">
                    admin@kickergpt.com
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  14. Changes to This Privacy Policy
                </h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any
                  changes by posting the new Privacy Policy on this page and updating the "Last
                  updated" date. For material changes, we will notify you via email or through a
                  prominent notice in our Service. You are advised to review this Privacy Policy
                  periodically for any changes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">15. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:{" "}
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
