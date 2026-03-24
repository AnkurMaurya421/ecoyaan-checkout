

Complete e-commerce checkout system with cart management, multiple addresses, and dynamic shipping calculation.

**Live Demo:** https://ecoyaan-checkout-fawn.vercel.app

---

## Features

### Cart Management
- **Quantity Controls** - Add/remove items with +/- buttons
- **Item Removal** - Delete items from cart
- **Dynamic Totals** - Real-time subtotal and shipping calculation
- **Free Shipping** - Automatic free shipping when order > ₹700
- **Shipping Progress** - Shows "Add ₹X more for free shipping!"
- **Empty Cart Handling** - Clear messaging when cart is empty
- **Reset Cart** - One-click cart reset functionality

### Address Management
- **Multiple Addresses** - Add, select, and delete shipping addresses
- **Form Validation** - Error messages for invalid inputs
- **Visual Selection** - Selected address highlighted
- **Persistence** - Addresses saved across sessions
- **Delete Protection** - Validates selected address exists

### UI/UX
- **Server-Side Rendering** - Fast initial cart page load
- **Sticky Navigation** - Back/Next buttons always accessible
- **Responsive Design** - Works on desktop, tablet, mobile
- **Loading States** - Smooth transitions and feedback
- **Clean Interface** - Card-based design with modern styling

### Data Persistence
- **Context API** - Global state management
- **localStorage Sync** - Automatic data persistence
- **Session Recovery** - Cart and addresses survive page reload
- **Edge Case Handling** - Validates data integrity

---

## Tech Stack

- **Framework:** Next.js 14 (Pages Router)
- **State Management:** React Context API
- **Data Persistence:** localStorage
- **Styling:** Plain CSS (no frameworks)
- **Deployment:** Vercel

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# http://localhost:3000
```

---

## Project Structure

```
pages/
  ├── index.js          # Cart page (SSR)
  ├── shipping.js       # Address management
  ├── payment.js        # Order review
  └── success.js        # Order confirmation

context/
  └── CheckoutContext.js  # Global state + localStorage

styles/
  ├── globals.css       # Base styles
  └── checkout.css      # Component styles

public/
  └── images/          # Product images
```

---

## Architecture

### State Management Flow

```
CheckoutContext (Global State)
    ├── cart (items, shipping, discount)
    ├── addresses (array of shipping addresses)
    ├── selectedAddress (currently chosen address)
    ├── updateQuantity() (modify item quantities)
    └── removeItem() (delete items from cart)
         ↓
    localStorage (Automatic Sync)
         ↓
    Persists across page reloads
```

### Checkout Flow

```
Cart Page (index.js)
  - View items
  - Update quantities
  - Remove items
  - See shipping calculation
         ↓
Shipping Page (shipping.js)
  - Add new address
  - Select from saved addresses
  - Delete addresses
         ↓
Payment Page (payment.js)
  - Review order
  - Confirm address
  - See final total
         ↓
Success Page (success.js)
  - Order confirmation
  - Return to home
```

---



---

## Implementation Highlights

### Why Context API?
- **Global Access:** All pages access cart/addresses without prop drilling
- **Clean Code:** Centralized state management logic
- **React Native:** Built-in React feature, no external dependencies
- **Suitable Scale:** Perfect for medium-complexity apps

### Why localStorage?
- **Persistence:** Data survives page reloads and browser sessions
- **Client-Side:** No backend needed for demo project
- **Synchronous:** Simple key-value storage
- **Browser Support:** Works in all modern browsers

### Why SSR on Cart Page?
- **Performance:** Faster initial load
- **SEO:** Cart page indexed by search engines
- **User Experience:** Content visible immediately
- **Next.js Benefit:** Built-in SSR support





## Future Enhancements

- [ ] Payment gateway integration
- [ ] Order history tracking
- [ ] Promo code functionality
- [ ] Guest checkout option
- [ ] Address validation API
- [ ] Email notifications
- [ ] Backend integration

---


