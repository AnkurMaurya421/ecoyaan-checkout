# Ecoyaan Checkout Flow

Server-side rendered checkout flow with Next.js and plain CSS.

**Live Demo:** [https://ecoyaan-checkout-fawn.vercel.app/]

---

## Setup
```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Tech Stack

- Next.js 14 (Pages Router)
- Plain CSS
- sessionStorage for state

---

## Structure
```
pages/
  index.js       # Cart (SSR)
  shipping.js    # Form with validation
  payment.js     # Review
  success.js     # Confirmation
styles/
  checkout.css   # All styles
```

---

## Features

- Server-side rendering on cart
- Form validation
- State persistence via sessionStorage
- Mobile responsive

---

## Architecture Choices

**SSR on cart page:** Product data from server, better SEO

**Plain CSS:** Simple, no dependencies, full control

**sessionStorage:** Standard for checkout flows, persists data between pages

**Pages Router:** Simpler SSR than App Router

---

## Flow
```
Cart → saves data → Shipping → saves data → Payment → Success
```



