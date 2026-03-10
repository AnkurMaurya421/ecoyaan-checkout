//import necessary hooks and context
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { CheckoutContext } from '../context/CheckoutContext';

// This is the main cart page component that displays cart items and order summary
export default function Cart({ cartData }) {
  // Get router for navigation and context for cart state and functions
  const router = useRouter();
  // Destructure cart state and functions from context
  const { cart, setCart, updateQuantity, removeItem } = useContext(CheckoutContext);

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
  
  // Free shipping for orders above ₹700, otherwise use cart's shipping fee
  const shipping = subtotal > 700 ? 0 : cart.shipping;
  const total = subtotal + shipping - cart.discount;

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

      <div className="card">
        <h2>Order Summary</h2>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
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
        
        {subtotal > 0 && subtotal <= 700 && (
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
          <span>Total</span>
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