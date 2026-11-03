# KickerGPT

**AI-powered football match intelligence.** KickerGPT gives you probability-based match predictions plus the context behind them: form, head-to-head, injuries, officiating and weather. You can ask questions in plain English, chat with an AI analyst about a fixture, and build your own rule-based strategies that pick out matching games automatically.

> KickerGPT gives probability-based forecasts to support match analysis. It does not guarantee results.

This repository holds the **web and Android client** (React + Capacitor). It talks to a separate KickerGPT backend API over HTTP.

---

## Who it's for

- **Match analysts and football enthusiasts** who want to study fixtures with data instead of gut feeling.
- **Fans** who want a quick, readable breakdown of upcoming fixtures.
- **Data-minded followers of the game** who want to write their own filters (for example "home side scored 2+ in each of its last 5 games") and see which fixtures match them.

## Features

| Area | What it does |
| --- | --- |
| **Fixtures & predictions** | Browse matches for the next three days, with AI predictions and confidence badges. |
| **Natural-language search** | Type queries like *"Premier League games where both teams score often"*. They are turned into structured fixture searches, with suggestions and filters for country and league. |
| **AI match chat** | Chat about a specific fixture. Answers are rendered as Markdown, and past conversations are saved in History. |
| **Strategies** | Build rule-based strategies from conditions (form, win rate, H2H, goals scored or conceded, clean sheets, BTTS, injuries) and find the fixtures that match. A PRO feature. |
| **Control Room** | Track how past predictions turned out. |
| **Favorites & history** | Save fixtures and revisit earlier analyses. |
| **Accounts** | Email sign-up and login, email verification, and password reset. |
| **Plans & credits** | Free tier with a monthly prompt allowance, and a PRO subscription (Stripe on the web, Google Play on Android). On Android, users can watch rewarded ads (AdMob) to earn extra prompts. |
| **Mobile app** | A native Android app built with Capacitor, with a splash screen, status-bar theming, the hardware back button and dark/light mode. |

## Tech stack

- **Frontend:** [React 18](https://react.dev), [TypeScript](https://www.typescriptlang.org), [Vite](https://vitejs.dev)
- **UI:** [Tailwind CSS](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com) (Radix UI), lucide-react icons, Recharts
- **Data & state:** TanStack Query, React Hook Form + Zod, RxJS
- **Routing & SEO:** React Router, react-helmet-async
- **Mobile:** [Capacitor](https://capacitorjs.com) (Android), AdMob via `@capacitor-community/admob`
- **Analytics & support:** Vercel Analytics, LiveSession, Intercom (currently disabled)
- **Hosting:** Vercel (web). The project started with [Lovable](https://lovable.dev) and is now developed by hand.

## Project structure

```
.
├── src/
│   ├── pages/        # Route-level screens (Index, Chat/Fixtures, Strategies, Plans, Profile, ...)
│   ├── components/   # Feature components + ui/ (shadcn primitives)
│   ├── hooks/        # React hooks wrapping services (useAuth, useMatches, useNaturalQuery, ...)
│   ├── services/     # API clients for each backend area (auth, chat, strategies, ads, ...)
│   ├── lib/          # API wrapper, config, platform detection, SEO helpers
│   └── types/        # Shared TypeScript types
├── android/          # Capacitor Android project
├── public/           # Static assets
└── capacitor.config.ts
```


## Getting started

### Prerequisites

- Node.js 18+ and npm
- A running KickerGPT backend API. This repo is the client only.
- For Android: Java 21 and Android Studio

### Run the web app

```bash
git clone https://github.com/oladelux/boot-room-bot.git
cd boot-room-bot
npm install
cp .env.example .env      # then set VITE_API_URL to your backend URL
npm run dev               # opens on the local URL Vite prints (default http://localhost:5173)
```

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | yes | Base URL of the KickerGPT backend API |
| `VITE_APP_VERSION` | no | App version shown in the UI (default `1.0.0`) |

Never commit `.env`. It is listed in `.gitignore`, and `.env.example` is the template.

### Other scripts

```bash
npm run build             # production build to dist/
npm run preview           # serve the production build locally
npm run lint              # ESLint
```

### Run the Android app

```bash
npm run cap:build         # build the web app and sync it into android/
npm run cap:open:android  # open in Android Studio, or:
npm run cap:run:android   # run on a connected device or emulator
```

Release signing reads from `android/key.properties`, which is git-ignored.

## Roadmap

The plans for what comes next are in **[ROADMAP.md](ROADMAP.md)**.

## License

[MIT](LICENSE) © Oladele Olorunsola
