import axios from 'axios';
import { useState } from 'react';

const OrderList = ({ orders, fetchOrders }) => {
  const [amendQty, setAmendQty] = useState('');
  const [error, setError] = useState('');

  // Function to amend the order quantity
  const amendOrder = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/order/amend/${id}`,
        { qty: amendQty },
        { headers: { 'x-auth-token': token },
      });
      setAmendQty(''); // Clear the input
      fetchOrders(); // Refresh the order list
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred');
    }
  };

  // Function to cancel an order
  const cancelOrder = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/order/cancel/${id}`, {
        headers: { 'x-auth-token': token },
      });
      fetchOrders(); // Refresh the order list
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred');
    }
  };

  return (
    <div className="order-list">
      <h3>Orders</h3>
      {error && <p className="error-message">{error}</p>}
      <ul>
        {orders.map((order) => (
          <li
            key={order._id}
            style={{
              border: '1px solid gray',
              marginBottom: '10px',
              padding: '10px',
            }}
          >
            <p>Qty: {order.qty}</p>
            <p>Executed Qty: {order.executedQty}</p>
            <p>Status: {order.status}</p>

            {/* Show Amend Input and Button for Partial Orders */}
            {order.status === 'partial' && (
              <div>
                <input
                  type="number"
                  placeholder="New Qty"
                  value={amendQty}
                  onChange={(e) => setAmendQty(e.target.value)}
                />
                <button onClick={() => amendOrder(order._id)}>Amend</button>
              </div>
            )}

            {/* Show Cancel Button for Pending and Partial Orders */}
            {(order.status === 'pending' || order.status === 'partial') && (
              <div>
                <button
                  onClick={() => cancelOrder(order._id)}
                  style={{
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    borderRadius: '5px',
                    marginTop: '10px',
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Display a Canceled Message for Canceled Orders */}
            {order.status === 'canceled' && (
              <p style={{ color: 'red', fontWeight: 'bold' }}>Order Canceled</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
