import { useRouter } from 'next/router';

export default function Cart({ cartData }) {
  //router object for navigation
  const router = useRouter(); 
  

  // Calculating totals using reduce for cleaner code
  const subtotal = cartData.cartItems.reduce(
    (total, item) => total + (item.product_price * item.quantity), 
    0
  );

  const grandTotal = subtotal + cartData.shipping_fee;

  // set shipping page as next step in checkout process
  const goToShipping = () => {
    router.push('/shipping');
  };

  // main content of the cart page
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {/* Cart Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Items</h2>
          
          {cartData.cartItems.map(item => (
            <div key={item.product_id} className="flex gap-4 mb-4 pb-4 border-b last:border-0">
              <img 
                src={item.image} 
                alt={item.product_name} 
                className="w-20 h-20 rounded object-cover" 
              />
              
              <div className="flex-1">
                <h3 className="font-medium">{item.product_name}</h3>
                <p className="text-gray-600 text-sm">₹{item.product_price} × {item.quantity}</p>
              </div>
              
              <div className="font-semibold">
                ₹{item.product_price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{cartData.shipping_fee}</span>
            </div>
            
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button 
          onClick={goToShipping}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Proceed to Checkout
        </button>
        
      </div>
    </div>
  );
}

// Get data before page loads
export async function getServerSideProps() {
  const cartData = {
    cartItems: [
      {
        product_id: 101,
        product_name: "Bamboo Toothbrush (Pack of 4)",
        product_price: 299,
        quantity: 2,
        image: "https://via.placeholder.com/150"
      },
      {
        product_id: 102,
        product_name: "Reusable Cotton Produce Bags",
        product_price: 450,
        quantity: 1,
        image: "https://via.placeholder.com/150"
      }
    ],
    shipping_fee: 50,
    discount_applied: 100
  };

  return { props: { cartData } };
}