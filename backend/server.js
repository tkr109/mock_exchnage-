require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');
const cors = require('cors');
const Order = require('./models/Order'); // Import the Order model

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);

// Simulate order execution
const simulateOrderExecution = async () => {
  try {
    const orders = await Order.find({ status: { $in: ['pending', 'partial'] } });

    for (let order of orders) {
      const randomQtyToExecute = Math.min(
        Math.ceil(Math.random() * 10), // Random execution qty
        order.qty - order.executedQty // Remaining qty to execute
      );

      order.executedQty += randomQtyToExecute;

      if (order.executedQty >= order.qty) {
        order.status = 'executed'; // Fully executed
        order.executedQty = order.qty; // Ensure no over-executio       n
      } else {
        order.status = 'partial'; // Partial execution
      }

      await order.save();
    }
  } catch (err) {
    console.error('Error simulating order execution:', err.message);
  }
};

// Run simulation every 10 seconds
setInterval(simulateOrderExecution, 1000);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
