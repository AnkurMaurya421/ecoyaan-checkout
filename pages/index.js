//import necessary hooks and context
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { CheckoutContext } from '../context/CheckoutContext';

// This is the main cart page component that displays cart items and order summary
export default function Cart({ cartData }) {
  // Get router for navigation and context for cart state and functions
  const router = useRouter();
  // Destructure cart state and functions from context
  const { 
    cart, setCart, updateQuantity, removeItem,
    appliedCoupon, applyCoupon, removeCoupon, getCouponDiscount,
    couponError, setCouponError, availableCoupons 
  } = useContext(CheckoutContext);

  const [couponInput, setCouponInput] = useState('');
  const [showCouponModal, setShowCouponModal] = useState(false);

// On mount, initialize cart state with data from server (or localStorage if available)
  useEffect(() => {
    const cartToSave = {
      items: cartData.cartItems.map(item => ({
        id: item.product_id,
        name: item.product_name,
        price: item.product_price,
        qty: item.quantity,
        image: item.image
      })),
      shipping: cartData.shipping_fee,
      discount: cartData.discount_applied
    };
    setCart(cartToSave);
  }, [cartData, setCart]);

  // Function to reset cart to original items (for testing purposes)
  const handleResetCart = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (!cart) return null;

  // Calculate subtotal, shipping, and total based on cart items and rules
  const subtotal = cart.items.reduce(
    (total, item) => total + (item.price * item.qty), 
    0
  );
  
  // Get coupon discount values
  const { couponDiscount, freeShipping } = getCouponDiscount(subtotal);

  // Free shipping for orders above ₹700 OR if free shipping coupon is applied
  const shipping = (subtotal > 700 || freeShipping) ? 0 : cart.shipping;
  const total = subtotal + shipping - cart.discount - couponDiscount;

  // Handle coupon apply from input field
  const handleApplyCoupon = () => {
    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    const success = applyCoupon(couponInput, subtotal);
    if (success) {
      setCouponInput('');
      setShowCouponModal(false);
    }
  };

  // Handle coupon apply from available coupons list
  const handleApplyFromList = (code) => {
    const success = applyCoupon(code, subtotal);
    if (success) {
      setCouponInput('');
      setShowCouponModal(false);
    }
  };

  // Function to navigate to shipping page when user clicks checkout
  const handleCheckout = () => {
    router.push('/shipping');
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ margin: 0 }}>Shopping Cart</h1>
        <button 
          className="btn-reset-cart"
          onClick={handleResetCart}
          title="Reset cart to original items"
        >
          🔄 Reset Cart (testing purpose only)
        </button>
      </div>
      
      <div className="card">
        <h2>Items</h2>
        {cart.items.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            Your cart is empty. Click "Reset Cart" to reload items.
          </p>
        ) : (
          cart.items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-content">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="item-image"
                />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>₹{item.price} each</p>
                  
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.qty - 1)}
                      disabled={item.qty <= 1}
                      className="qty-btn"
                    >
                      −
                    </button>
                    <span className="qty-display">{item.qty}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.qty + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                    <button 
                      className="btn-remove-item"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              <div className="item-price">
                ₹{item.price * item.qty}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Offers & Coupons Section */}
      <div className="card">
        <div 
          className="coupon-header"
          onClick={() => setShowCouponModal(true)}
        >
          <div className="coupon-header-left">
            <span className="coupon-icon">🏷️</span>
            <span className="coupon-header-text">Offers & Coupons</span>
          </div>
          <span className="coupon-arrow">›</span>
        </div>

        {/* Applied Coupon Badge */}
        {appliedCoupon && (
          <div className="applied-coupon-badge">
            <div className="applied-coupon-info">
              <span className="coupon-icon">🏷️</span>
              <div>
                <span className="applied-code">{appliedCoupon.code}</span>
                <span className="applied-desc">{appliedCoupon.description}</span>
              </div>
            </div>
            <div className="applied-coupon-right">
              {couponDiscount > 0 && (
                <span className="savings-text">You saved ₹{couponDiscount}</span>
              )}
              {freeShipping && (
                <span className="savings-text">Free shipping applied!</span>
              )}
              <button 
                className="coupon-remove-x"
                onClick={removeCoupon}
                title="Remove coupon"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="coupon-modal-overlay" onClick={() => { setShowCouponModal(false); setCouponError(''); }}>
          <div className="coupon-modal" onClick={(e) => e.stopPropagation()}>
            <div className="coupon-modal-header">
              <h2>Available Coupons</h2>
              <button 
                className="coupon-modal-close" 
                onClick={() => { setShowCouponModal(false); setCouponError(''); }}
              >
                ✕
              </button>
            </div>

            {/* Manual coupon input */}
            <div className="coupon-input-row">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponInput}
                onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                className="coupon-input"
              />
              <button 
                className="coupon-check-btn"
                onClick={handleApplyCoupon}
              >
                Check
              </button>
            </div>
            {couponError && <p className="coupon-error">{couponError}</p>}

            {/* Available coupons list */}
            <div className="coupon-list">
              {availableCoupons.map(coupon => {
                const isApplied = appliedCoupon?.code === coupon.code;
                const meetsMinOrder = subtotal >= coupon.minOrder;

                return (
                  <div key={coupon.code} className={`coupon-list-item ${!meetsMinOrder ? 'coupon-disabled' : ''}`}>
                    <div className="coupon-list-info">
                      <div className="coupon-code-badge">{coupon.code}</div>
                      <span className="coupon-offer-text">{coupon.description}</span>
                      {coupon.minOrder > 0 && (
                        <p className="coupon-min-order">Min order: ₹{coupon.minOrder}</p>
                      )}
                    </div>
                    <button
                      className={`coupon-action-btn ${isApplied ? 'coupon-remove-btn' : ''}`}
                      onClick={() => isApplied ? removeCoupon() : handleApplyFromList(coupon.code)}
                      disabled={!meetsMinOrder && !isApplied}
                    >
                      {isApplied ? 'Remove' : 'Apply'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="card">
        <h2>Order Summary</h2>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        {couponDiscount > 0 && (
          <div className="summary-row coupon-discount-row">
            <span>Coupon Discount ({appliedCoupon.code})</span>
            <span>- ₹{couponDiscount}</span>
          </div>
        )}

        <div className="summary-row">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? (
              <span className="free-shipping">
                FREE 
                {freeShipping && !appliedCoupon?.type !== 'free_shipping' && subtotal <= 700 
                  ? '' : ''}
              </span>
            ) : (
              `₹${shipping}`
            )}
          </span>
        </div>
        
        {subtotal > 0 && subtotal <= 700 && !freeShipping && (
          <p className="shipping-message">
            Add ₹{700 - subtotal} more for free shipping! 🎉
          </p>
        )}
        
        {cart.discount > 0 && (
          <div className="summary-row discount">
            <span>Discount</span>
            <span>-₹{cart.discount}</span>
          </div>
        )}
        <div className="summary-row total">
          <span>You Pay</span>
          <span>₹{total}</span>
        </div>
      </div>

      
      <div className="sticky-nav">
        <div className="sticky-nav-container">
          <button 
            type="button" 
            className="btn-checkout"
            onClick={handleCheckout} 
            disabled={cart.items.length === 0}
          >
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}


// This function runs on the server before rendering the page and provides cart data as props
export async function getServerSideProps() {
  const cartData = {
    cartItems: [
      {
        product_id: 101,
        product_name: "Bamboo Toothbrush (Pack of 4)",
        product_price: 299,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=150&h=150&fit=crop"
      },
      {
        product_id: 102,
        product_name: "Reusable Cotton Produce Bags",
        product_price: 450,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1574365569389-a10d488ca3fb?q=80&w=1170&auto=format&fit=crop"
      }
    ],
    shipping_fee: 50,
    discount_applied: 100
  };

  return { props: { cartData } };
}