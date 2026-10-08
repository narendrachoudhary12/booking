# Stay9ja Hotels

Web app for [stay9jahotels.com](https://stay9jahotels.com): hotel search and booking across Nigeria, plus the admin and host dashboards.

Built with React 19, Vite and React Router. Payments go through Flutterwave. The backend is a separate REST API and is not part of this repo.

## Getting started

Requires Node.js 20 or later.

```bash
npm install
cp .env.example .env   # then fill in the Flutterwave key
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE` | Backend API base URL, no trailing slash. All API calls use this. |
| `VITE_ASSET_BASE` | Host that serves uploaded hotel and city images. |
| `VITE_FLW_PUBLIC_KEY` | Flutterwave public key. |

Put the value alone on its line; comments go on their own `#` lines.

## Project layout

```
src/
  App.tsx              All routes
  config/api.js        API_BASE and ASSET_BASE (read from .env)
  utils/auth.js        Session helpers (token, user type, logout)
  context/             HotelDataContext: the cities list, fetched once
  styles/tokens.css    Design tokens: brand colours and fonts
  pages/               Route-level pages
  components/          Page sections, one folder each (JSX + CSS)
    admin/             Admin panel (/admin-dashboard)
    host/              Host dashboard (/host)
    auth/              ProtectedRoute
```

## Routes

| Path | Page | Access |
| --- | --- | --- |
| `/` | Home | Public |
| `/hotels/:slug` | Hotels in a city | Public |
| `/hotel-details/:slug` | Hotel detail | Public |
| `/hotel-booking` | Booking and payment | Public |
| `/booking-confirmation/:bookingId` | Confirmation | Public |
| `/login`, `/signup` | Sign in, register | Public |
| `/admin-dashboard` | Admin panel | Admin only |
| `/host` | Host dashboard | Logged in |

The route guard is a convenience for the UI. The API must check the token on every request.

## Styling

Brand colours and fonts live in `src/styles/tokens.css` as `--s9-*` CSS variables. Use those in component CSS instead of hex values. The public fonts (DM Sans, Playfair Display) are loaded once in `index.html`.

## Deployment

`npm run build` outputs a static site in `dist/`. `public/.htaccess` is copied into it and rewrites all paths to `index.html`, which Apache hosting needs for client-side routes.


## Next MOdule 

* [] User Login Page - Ui
* [] Login With Google 
* [] Need to Create forgot passowrd 
* [] Tokens save and User login and userlogout