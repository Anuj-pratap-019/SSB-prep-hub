# SSB Prep Hub

## Gemini AI configuration

The AI assessments call Google's Gemini REST API directly from the browser. Set the
following environment variable before building the app:

```env
VITE_GEMINI_API_KEY=your-gemini-api-key
```

For a Render deployment:

1. Open the service in Render and add `VITE_GEMINI_API_KEY` under **Environment**.
2. Paste the Gemini API key created in Google AI Studio (not a Supabase key).
3. Save the environment change and trigger a new deploy. Vite embeds `VITE_*` values
   during the build, so changing the variable without rebuilding will not update the
   deployed app.

Do not use `GEMINI_API_KEY` alone: Vite will not expose that variable to this browser
build. Restrict the key in Google AI Studio/Google Cloud where possible, and monitor
quota and billing limits.

The app uses `gemini-2.5-flash` with `gemini-2.5-flash-lite` as a fallback. If both
requests fail, the assessment screen now reports whether the cause is an invalid key,
quota/rate limiting, an invalid request, or connectivity.

## Accounts and private progress

The app requires a Supabase Auth account. Each candidate sees their own dashboard and
evaluation history; row-level security prevents one account from reading another
account's history. Run `supabase/schema.sql` in the Supabase SQL Editor after enabling
email authentication. Configure the site URL and redirect URLs in Supabase Auth for
the deployed app before sharing its link.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
