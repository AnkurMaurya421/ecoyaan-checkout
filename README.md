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

- Next.js 14 (Pages Router with SSR)
- Context API for state management
- localStorage for data persistence
- Plain CSS

---

## Features

- Server-side rendering on cart page
- Context API + localStorage (data persists on reload)
- Multiple address management (add/select/delete)
- Form validation with error messages
- Sticky bottom navigation (Back/Next buttons)
- Mobile responsive design

---

## Architecture

**State Management:**
- Context API provides global state
- localStorage syncs automatically via useEffect
- Data persists across page reloads

**Flow:**
```
Cart (SSR) → Shipping (multiple addresses) → Payment (review) → Success
```

**Why Context API + localStorage:**
- Context API manages state across components
- localStorage provides persistence on reload
- Automatic sync between Context and storage
- Meets requirement: "context is maintained even after page reload"

---

## Structure
```
pages/
  index.js       # Cart (SSR)
  shipping.js    # Address management
  payment.js     # Order review
  success.js     # Confirmation
context/
  CheckoutContext.js  # Global state + localStorage sync
styles/
  checkout.css   # All styles
```

---
