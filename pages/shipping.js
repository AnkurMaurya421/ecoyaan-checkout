import { useState,useContext } from 'react'; // importing useState for managing form state and validation errors
import { useRouter } from 'next/router';
import { CheckoutContext } from '../context/CheckoutContext';

export default function Shipping() {
  const router = useRouter();
  // set the initial form state
  const { addresses, setAddresses, setSelectedAddress } = useContext(CheckoutContext);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    pin: '',
    city: '',
    state: ''
  });
  //set initial state for form validation errors
  const [errors, setErrors] = useState({});
 
  //handle form submission with validation checks.
  //if all goes right then navigate to payment page
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    const err = {};
    if (!form.name) err.name = 'Required';
    if (!form.email.includes('@')) err.email = 'Invalid email';
    if (form.phone.length !== 10) err.phone = '10 digits required';
    if (!form.pin) err.pin = 'Required';
    if (!form.city) err.city = 'Required';
    if (!form.state) err.state = 'Required';
    
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }
    
    // Add new address to Context
    const newAddress = {
      id: Date.now(),
      ...form,
      isDefault: addresses.length === 0 // First address is default
    };
    
    setAddresses([...addresses, newAddress]);
    setSelectedAddress(newAddress);
    
    router.push('/payment');
  };

  return (
    <div className="container shipping-container">
      <h1>Shipping Address</h1>
      
      <form onSubmit={handleSubmit} className="card">
        
        <div className="form-group">
          <label>Full Name *</label>
          <input 
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input 
            type="email"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label>Phone *</label>
          <input 
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
            maxLength="10"
          />
          {errors.phone && <div className="error">{errors.phone}</div>}
        </div>

        <div className="form-group">
          <label>PIN Code *</label>
          <input 
            value={form.pin}
            onChange={(e) => setForm({...form, pin: e.target.value})}
            maxLength="6"
          />
          {errors.pin && <div className="error">{errors.pin}</div>}
        </div>

        <div className="form-group">
          <label>City *</label>
          <input 
            value={form.city}
            onChange={(e) => setForm({...form, city: e.target.value})}
          />
          {errors.city && <div className="error">{errors.city}</div>}
        </div>

        <div className="form-group">
          <label>State *</label>
          <input 
            value={form.state}
            onChange={(e) => setForm({...form, state: e.target.value})}
          />
          {errors.state && <div className="error">{errors.state}</div>}
        </div>

        <button type="submit" className="btn">
          Continue to Payment
        </button>
        
      </form>
    </div>
  );
}