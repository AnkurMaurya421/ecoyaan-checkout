import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CheckoutContext } from '../context/CheckoutContext';

export default function Payment() {
  const router = useRouter();
  const { cart, selectedAddress, addresses, appliedCoupon, getCouponDiscount } = useContext(CheckoutContext);
  const [paying, setPaying] = useState(false);

  // Redirect if no cart, no address, or selected address was deleted
  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      router.push('/');
    } else if (!selectedAddress || !addresses.find(addr => addr.id === selectedAddress.id)) {
      // selectedAddress doesn't exist in addresses array anymore (was deleted)
      router.push('/shipping');
    }
  }, [cart, selectedAddress, addresses, router]);

  if (!cart || !selectedAddress) {
    return <div className="loading">Loading...</div>;
  }

  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const { couponDiscount, freeShipping } = getCouponDiscount(subtotal);
  const shipping = (subtotal > 700 || freeShipping) ? 0 : cart.shipping;
  const total = subtotal + shipping - cart.discount - couponDiscount;
  
  // Function to simulate payment processing and redirect to success page
  const handlePay = () => {
    setPaying(true);
    setTimeout(() => router.push('/success'), 2000);
  };

  return (
    <div className="container">
      <h1>Review Order</h1>

      <div className="card">
        <h2>Items</h2>
        {cart.items.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-content">
              <img src={item.image} alt={item.name} className="item-image" />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>Qty: {item.qty}</p>
              </div>
            </div>
            <div className="item-price">₹{item.price * item.qty}</div>
          </div>
        ))}

        <div style={{ borderTop: '1px solid #eee', marginTop: '16px', paddingTop: '16px' }}>
          <div className="summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>

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
                <span className="free-shipping">FREE</span>
              ) : (
                `₹${shipping}`
              )}
            </span>
          </div>
          {cart.discount > 0 && (
            <div className="summary-row discount"><span>Discount</span><span>-₹{cart.discount}</span></div>
          )}
          <div className="summary-row total"><span>You Pay</span><span>₹{total}</span></div>
        </div>
      </div>

      {/* Applied Coupon Info */}
      {appliedCoupon && (
        <div className="card">
          <div className="applied-coupon-badge" style={{ margin: 0, padding: 0, background: 'none', border: 'none' }}>
            <div className="applied-coupon-info">
              <span className="coupon-icon">🏷️</span>
              <div>
                <span className="applied-code">{appliedCoupon.code}</span>
                <span className="applied-desc">{appliedCoupon.description}</span>
              </div>
            </div>
            {couponDiscount > 0 && <span className="savings-text">You saved ₹{couponDiscount}</span>}
            {freeShipping && <span className="savings-text">Free shipping applied!</span>}
          </div>
        </div>
      )}

      <div className="card">
        <h2>Shipping To</h2>
        <div className="address-info">
          <p><strong>{selectedAddress.name}</strong></p>
          <p>{selectedAddress.email}</p>
          <p>{selectedAddress.phone}</p>
          <p>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pin}</p>
        </div>
      </div>

      <div className="sticky-nav">
        <div className="sticky-nav-container">
          <button
            type="button"
            className="btn-back"
            onClick={() => router.push('/shipping')}
          >
            ← Back
          </button>
          <button
            type="button"
            className="btn-next"
            onClick={handlePay}
            disabled={paying}
          >
            {paying ? 'Processing...' : `Pay ₹${total} →`}
          </button>
        </div>
      </div>
    </div>
  );
}