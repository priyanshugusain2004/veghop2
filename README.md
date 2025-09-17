# VegHop — Vegetable Ordering and Billing (Demo)

This is a small accessible vegetable ordering web app (English + Hindi). It's built using plain React imported from CDN and styled with TailwindCSS via CDN so you can run it locally without installing dependencies.

Features
- Multiple users with independent carts (managed in-memory via Context API).
- Vegetable list with images, English + Hindi names, price per kg (from JSON).
- Enter quantities (e.g., 100g, 0.5kg, 1kg). Price calculated automatically.
- Cart, Add More, Checkout with a clear bill and total.
- Senior-friendly UI: large text, high contrast, simple layout.

Run locally

1. Start a simple static server from the project root (recommended: Python 3):

```bash
python3 -m http.server 8000
```

2. Open http://localhost:8000 in your browser.

Notes
- This demo keeps data in browser memory; there's no backend or persistence. For production, add a server and persistent storage, authentication, and input validation.
- Tailwind & React are used via CDN for simplicity. For production, use a proper bundler and build pipeline.

Files of interest
- `index.html` — application entry
- `src/` — React app source
- `src/data/vegetables.json` — initial veg data and prices

Accessibility & UI
- Large buttons and text for senior users.
- Bilingual labels throughout.
