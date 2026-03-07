import { createContext, useState, useEffect } from 'react';

export const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Load from localStorage on mount 
  // data persistence for cart, addresses, and selected address across page reloads and sessions
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
  // return the context provider with the state and setters for cart, addresses, and selected address
  
  return (
    <CheckoutContext.Provider value={{
      cart,
      setCart,
      addresses,
      setAddresses,
      selectedAddress,
      setSelectedAddress
    }}>
      {children}
    </CheckoutContext.Provider>
  );
}