import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();

  return (
    <div className="container">
      <div className="card success-card">
        <div className="success-icon">✓</div>
        <h1>Order Placed!</h1>
        <p style={{ marginBottom: '5%' }}>Thank you for your order.</p>
        <button className="btn" onClick={() => router.push('/')}>
          Back to Home
        </button>
      </div>
    </div>
  );
}