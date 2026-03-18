//import useful react hooks
import { createContext, useState, useEffect } from 'react';


//lets create container for checkout page to hold shared data
export const CheckoutContext = createContext();

// Available coupons data - in a real app this would come from an API
const AVAILABLE_COUPONS = [
  {
    code: 'SHIPFREE2025',
    type: 'free_shipping',
    description: 'FREE Shipping',
    minOrder: 0,
  },
  {
    code: 'ECOYAAN5',
    type: 'percentage',
    discount: 5,
    maxDiscount: 100,
    minOrder: 200,
    description: '5% OFF upto ₹100',
  },
  {
    code: 'SAVE50',
    type: 'flat',
    discount: 50,
    minOrder: 500,
    description: '₹50 OFF on orders above ₹500',
  },
];


// this provider will wrap the checkout page and provide state and functions to manage cart and addresses
export function CheckoutProvider({ children }) {
  //state for cart, addresses and selected address
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Load from localStorage on mount to persist cart and addresses across page reloads
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedAddresses = localStorage.getItem('addresses');
    const savedSelected = localStorage.getItem('selectedAddress');
    const savedCoupon = localStorage.getItem('appliedCoupon');

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedAddresses) setAddresses(JSON.parse(savedAddresses));
    if (savedSelected) setSelectedAddress(JSON.parse(savedSelected));
    if (savedCoupon) setAppliedCoupon(JSON.parse(savedCoupon));
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (cart) localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    if (selectedAddress) localStorage.setItem('selectedAddress', JSON.stringify(selectedAddress));
  }, [selectedAddress]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('appliedCoupon');
    }
  }, [appliedCoupon]);

  // Function to calculate coupon discount based on subtotal
  const getCouponDiscount = (subtotal) => {
    if (!appliedCoupon) return { couponDiscount: 0, freeShipping: false };

    let couponDiscount = 0;
    let freeShipping = false;

    switch (appliedCoupon.type) {
      case 'free_shipping':
        freeShipping = true;
        break;
      case 'percentage':
        couponDiscount = Math.min(
          Math.round((subtotal * appliedCoupon.discount) / 100),
          appliedCoupon.maxDiscount
        );
        break;
      case 'flat':
        couponDiscount = appliedCoupon.discount;
        break;
    }

    return { couponDiscount, freeShipping };
  };

  // Function to apply a coupon code
  const applyCoupon = (code, subtotal) => {
    setCouponError('');
    const coupon = AVAILABLE_COUPONS.find(
      c => c.code.toLowerCase() === code.trim().toLowerCase()
    );

    if (!coupon) {
      setCouponError('Invalid coupon code');
      return false;
    }

    if (subtotal < coupon.minOrder) {
      setCouponError(`Minimum order of ₹${coupon.minOrder} required`);
      return false;
    }

    setAppliedCoupon(coupon);
    setCouponError('');
    return true;
  };

  // Function to remove applied coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

// Function to update quantity of an item in the cart
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId 
          ? { ...item, qty: newQuantity }
          : item
      )
    }));
  };

 // Function to remove an item from the cart
  const removeItem = (itemId) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };
// Provide the state and functions to children components
  return (
    <CheckoutContext.Provider value={{
      cart,
      setCart,
      addresses,
      setAddresses,
      selectedAddress,
      setSelectedAddress,
      updateQuantity,  
      removeItem,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      getCouponDiscount,
      couponError,
      setCouponError,
      availableCoupons: AVAILABLE_COUPONS,
    }}>
      {children}
    </CheckoutContext.Provider>
  );
}