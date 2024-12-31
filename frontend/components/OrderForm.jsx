import { useState } from 'react';
import axios from 'axios';

const OrderForm = ({ fetchOrders }) => {
  const [qty, setQty] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/order/place',
        { qty },
        { headers: { 'x-auth-token': token } }
      );
      fetchOrders(); // Refresh the order list
      setQty('');
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="order-form">
      <h3>Place an Order</h3>
      {error && <p className="error-message">{error}</p>}
      <input
        type="number"
        placeholder="Quantity"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        required
      />
      <button type="submit">Place Order</button>
    </form>
  );
};

export default OrderForm;
