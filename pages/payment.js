import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { CheckoutContext } from '../context/CheckoutContext';

export default function Payment() {
  const router = useRouter();
  const { cart, selectedAddress } = useContext(CheckoutContext);
  const [paying, setPaying] = useState(false);

  if (!cart || !selectedAddress) {
    return <div className="loading">Loading...</div>;
  }

  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal + cart.shipping - cart.discount;

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
          <div className="summary-row"><span>Shipping</span><span>₹{cart.shipping}</span></div>
          {cart.discount > 0 && (
            <div className="summary-row discount"><span>Discount</span><span>-₹{cart.discount}</span></div>
          )}
          <div className="summary-row total"><span>Total</span><span>₹{total}</span></div>
        </div>
      </div>

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