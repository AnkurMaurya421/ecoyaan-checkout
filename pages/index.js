import { useRouter } from 'next/router'; // importing useRouter for navigation
import { useContext, useEffect } from 'react';
import { CheckoutContext } from '../context/CheckoutContext';

// createing cart component to display cart items and order summary
export default function Cart({ cartData }) {
  const router = useRouter();
  const { setCart } = useContext(CheckoutContext); // using context to manage cart state across the application


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

  //calculating subtotal and total amounts using reduce for better readability and maintainability
  const subtotal = cartData.cartItems.reduce(
    (total, item) => total + (item.product_price * item.quantity), 
    0
  );
  const total = subtotal + cartData.shipping_fee - cartData.discount_applied;

  const handleCheckout = () => {
  router.push('/shipping'); // navigating to the shipping page when the user clicks the checkout button
     };


  return (
    <div className="container">
      
      <h1>Shopping Cart</h1>
      
      <div className="card">
        <h2>Items</h2>
        {cartData.cartItems.map(item => (
          <div key={item.product_id} className="cart-item">
            <div className="cart-item-content">
              <img 
                src={item.image} 
                alt={item.product_name} 
                className="item-image"
              />
              <div className="item-details">
                <h3>{item.product_name}</h3>
                <p>₹{item.product_price} × {item.quantity}</p>
              </div>
            </div>
            <div className="item-price">
              ₹{item.product_price * item.quantity}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Order Summary</h2>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>₹{cartData.shipping_fee}</span>
        </div>
        {cartData.discount_applied > 0 && (
          <div className="summary-row discount">
            <span>Discount</span>
            <span>-₹{cartData.discount_applied}</span>
          </div>
        )}
        <div className="summary-row total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      <button className="btn" onClick={handleCheckout}>
        Proceed to Checkout
      </button>
      
    </div>
  );
}

// Fetching cart data on the server side to ensure the page is pre-rendered with the necessary information for better performance and SEO
export async function getServerSideProps() {
  //using dummy data for cart items, shipping fee, and discount to simulate a real-world scenario. 
  // In a production application, this data would typically be asynchronously fetched from a database or an API based on the user's session or authentication status.
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
        image: "https://images.unsplash.com/photo-1574365569389-a10d488ca3fb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      }
    ],
    shipping_fee: 50,
    discount_applied: 100
  };
 //automatically generates the props for the page component, allowing it to receive the cart data
 //  as a prop when the page is rendered. This approach ensures that the cart information is available 
 // on the initial page load, improving user experience and performance.
  return { props: { cartData } };
}