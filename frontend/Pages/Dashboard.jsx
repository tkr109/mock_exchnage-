import { useEffect, useState } from 'react';
import axios from 'axios';
import OrderForm from '../components/OrderForm';
import OrderList from '../components/OrderList';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/order/all', {
        headers: { 'x-auth-token': token },
      });
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred');
    }
  };

  useEffect(() => {
    fetchOrders();

    // Poll the orders every 5 seconds
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      {error && <p className="error-message">{error}</p>}
      <OrderForm fetchOrders={fetchOrders} />
      <OrderList orders={orders} fetchOrders={fetchOrders} />
    </div>
  );
};

export default Dashboard;
