# KickerGPT Roadmap

What's planned for the KickerGPT client, roughly in priority order. Tick items off as they ship. The backend roadmap is in [oladelux/kickergpt-api](https://github.com/oladelux/kickergpt-api/blob/main/ROADMAP.md).

## Now: hardening and cleanup

- [ ] **Automated tests.** Add Vitest + React Testing Library for hooks and services (`useAuth`, `useNaturalQuery`, `strategies.service`), plus a few Playwright smoke tests for login → fixtures → chat.
- [ ] **CI pipeline.** Run GitHub Actions on every PR: `npm ci`, `lint`, type-check, test, build.
- [ ] **Remove leftover add-on purchase flow.** The backend dropped one-off credit packs, but `VerifyAddonPurchase` and the `addon-purchase` service calls are still in the client.
- [ ] **Move third-party IDs to env vars.** Read the AdMob, LiveSession and Intercom IDs from `VITE_*` variables instead of hard-coding them.
- [ ] **Secure Android transport.** Switch Capacitor `androidScheme` to `https` and turn off `cleartext`.
- [ ] **Geo lookup over HTTPS only.** Drop the plain-HTTP `ip-api.com` fallback in `useGeoCountry`.
- [ ] **Stop using the test endpoint.** Move the fixtures search off `/fixtures/test` onto the production endpoint.
- [ ] **Remove the old name.** Rename the `boot-room:favorites` storage key to a KickerGPT key, migrating saved favorites.

## Next: tech stack

- [ ] **Move to a monorepo.** Bring the web app, the mobile apps and the API into one repository, using npm workspaces with Turborepo:
  - `apps/web`: the React + Vite web client
  - `apps/mobile`: the Capacitor Android (and later iOS) apps
  - `apps/api`: the NestJS backend
  - `packages/shared`: shared TypeScript types and API contracts (fixtures, strategies, subscriptions), so the client and server stay in sync
- [ ] **One pipeline.** Run lint, type-check, tests and builds for every app from a single CI workflow, and only rebuild the apps that changed.

## Next: product

- [ ] **iOS app.** Add the Capacitor iOS platform, real AdMob iOS unit IDs (the current ones are Google test IDs) and App Store in-app purchases.
- [ ] **Strategy alerts.** Push or email notifications when a fixture matches an active strategy.
- [ ] **Strategy back-testing.** Show how a strategy would have performed on past fixtures, using Control Room outcomes.
- [ ] **Re-enable in-app support.** Bring the Intercom messenger (currently commented out) back for logged-in users.
- [ ] **Shareable match cards.** Export a fixture analysis as an image or link.

## Later: ideas

- [ ] Live in-play updates for matches that are underway
- [ ] More leagues and lower divisions
- [ ] Localisation (French, Portuguese and Spanish first)
- [ ] Public prediction accuracy page built from Control Room data
