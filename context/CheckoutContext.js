//import useful react hooks
import { createContext, useState, useEffect } from 'react';


//lets create container for checkout page to hold shared data
export const CheckoutContext = createContext();


// this provider will wrap the checkout page and provide state and functions to manage cart and addresses
export function CheckoutProvider({ children }) {
  //state for cart, addresses and selected address
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Load from localStorage on mount to persist cart and addresses across page reloads
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedAddresses = localStorage.getItem('addresses');
    const savedSelected = localStorage.getItem('selectedAddress');

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedAddresses) setAddresses(JSON.parse(savedAddresses));
    if (savedSelected) setSelectedAddress(JSON.parse(savedSelected));
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
      removeItem       
    }}>
      {children}
    </CheckoutContext.Provider>
  );
}