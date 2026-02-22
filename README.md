# Dead Gravel Website

React + Vite site configured for GitHub Pages deployment with a custom domain.

## Deploy Setup

1. Push to the `main` branch.
2. In GitHub repository settings:
   - Go to `Settings -> Pages`.
   - Set `Source` to `GitHub Actions`.
3. Ensure DNS is configured for your custom domain.

## Custom Domain

- Current domain is defined in `public/CNAME`:
  - `deadgravel.com`
- If your domain changes, update `public/CNAME` and push again.

## DNS Notes (Apex Domain)

For an apex/root domain (like `deadgravel.com`), create A records to GitHub Pages IPs:

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

For `www`, add a CNAME pointing to `<your-github-username>.github.io`.

## SPA Routing on GitHub Pages

This repo includes:

- `public/404.html` for client-side route fallback.
- an `index.html` redirect restoration script.

This allows direct visits to routes like `/bio` and `/merch` on GitHub Pages.

## Local Commands

- `npm install`
- `npm run dev`
- `npm run build`
