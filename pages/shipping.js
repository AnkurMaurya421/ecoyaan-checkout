import { useState, useContext,useEffect } from 'react';
import { useRouter } from 'next/router';
import { CheckoutContext } from '../context/CheckoutContext';

export default function Shipping() {
  const router = useRouter();
  const { addresses, setAddresses, selectedAddress, setSelectedAddress } = useContext(CheckoutContext);
  
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', pin: '', city: '', state: '' });
  const [errors, setErrors] = useState({});


  const handleSubmit = (e) => {
    e.preventDefault();
    
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
    
    const newAddress = {
      id: Date.now(),
      ...form,
      isDefault: addresses.length === 0
    };
    
    setAddresses([...addresses, newAddress]);
    setSelectedAddress(newAddress);
    setShowForm(false);
    setForm({ name: '', email: '', phone: '', pin: '', city: '', state: '' });
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
    if (selectedAddress?.id === id) {
      setSelectedAddress(addresses[0] || null);
    }
  };

  const handleContinue = () => {
    if (!selectedAddress) {
      alert('Please select or add an address');
      return;
    }
    router.push('/payment');
  };

  return (
    <div className="container">
      <h1>Shipping Address</h1>

      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <div className="card">
          <h2>Saved Addresses</h2>
          {addresses.map(addr => (
            <div 
              key={addr.id} 
              className={`address-item ${selectedAddress?.id === addr.id ? 'selected' : ''}`}
              onClick={() => setSelectedAddress(addr)}
            >
              <div className="address-content">
                <p><strong>{addr.name}</strong></p>
                <p>{addr.email} | {addr.phone}</p>
                <p>{addr.city}, {addr.state} - {addr.pin}</p>
              </div>
              <button 
                className="btn-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(addr.id);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Address Button */}
      {!showForm && (
        <button className="btn" onClick={() => setShowForm(true)}>
          + Add New Address
        </button>
      )}

      {/* Address Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card">
          <h2>Add New Address</h2>
          
          {[
            { key: 'name', label: 'Full Name', type: 'text' },
            { key: 'email', label: 'Email', type: 'email' },
            { key: 'phone', label: 'Phone', type: 'tel', maxLength: '10' },
            { key: 'pin', label: 'PIN Code', type: 'text', maxLength: '6' },
            { key: 'city', label: 'City', type: 'text' },
            { key: 'state', label: 'State', type: 'text' }
          ].map(field => (
            <div key={field.key} className="form-group">
              <label>{field.label} *</label>
              <input
                type={field.type}
                value={form[field.key]}
                onChange={(e) => setForm({...form, [field.key]: e.target.value})}
                maxLength={field.maxLength}
              />
              {errors[field.key] && <div className="error">{errors[field.key]}</div>}
            </div>
          ))}

          <div style={{ display: 'flex', gap: '12px' }}>
            {addresses.length > 0 && (
              <button 
                type="button" 
                className="btn" 
                style={{ background: '#999' }}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            )}
            <button type="submit" className="btn">Save Address</button>
          </div>
        </form>
      )}

      {/* Sticky Navigation */}
      <div className="sticky-nav">
        <div className="sticky-nav-container">
          <button 
            type="button" 
            className="btn-back"
            onClick={() => router.push('/')}
          >
            ← Back
          </button>
          <button 
            type="button" 
            className="btn-next"
            onClick={handleContinue}
          >
            Continue to Payment →
          </button>
        </div>
      </div>
    </div>
  );
}