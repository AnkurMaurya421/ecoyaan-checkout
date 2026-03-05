import { useRouter } from 'next/router';

export default function Cart({ cartData }) {
  const router = useRouter();
  
  const subtotal = cartData.cartItems.reduce(
    (total, item) => total + (item.product_price * item.quantity), 
    0
  );
  const total = subtotal + cartData.shipping_fee - cartData.discount_applied;

  const handleCheckout = () => {
  // Save cart data to sessionStorage
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
  
  sessionStorage.setItem('cart', JSON.stringify(cartToSave));
  router.push('/shipping');
};

// Update button



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
        image: "https://images.unsplash.com/photo-1574365569389-a10d488ca3fb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      }
    ],
    shipping_fee: 50,
    discount_applied: 100
  };

  return { props: { cartData } };
}