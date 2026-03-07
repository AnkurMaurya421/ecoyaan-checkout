import "@/styles/globals.css";
import '../styles/checkout.css';
import { CheckoutProvider } from '../context/CheckoutContext';

export default function App({ Component, pageProps }) {
  return (
    <CheckoutProvider>
      <Component {...pageProps} />
    </CheckoutProvider>
  );
}