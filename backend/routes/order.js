const express = require('express');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Place an order
router.post('/place', authMiddleware, async (req, res) => {
  const { qty } = req.body;
  try {
    const order = new Order({ user: req.user, qty });
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Amend an order
router.put('/amend/:id', async (req, res) => {
  const { qty } = req.body; // New quantity
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    if (order.status === 'executed') {
      return res.status(400).json({ msg: 'Cannot amend an executed order' });
    }

    if (order.status === 'pending' || order.status==='pending') {
      return res.status(400).json({ msg: 'Can only amend partial orders' });
    }

    if (qty < order.executedQty) {
      return res
        .status(400)
        .json({ msg: 'New quantity cannot be less than executed quantity' });
    }

    // Update the quantity
    order.qty = qty;

    // If qty == executedQty, mark the order as fully executed
    if (qty === order.executedQty) {
      order.status = 'executed';
    }

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Cancel an order
router.delete('/cancel/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.user.toString() !== req.user) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    if (order.status === 'executed') {
      return res.status(400).json({ msg: 'Cannot cancel executed order' });
    }

    // Update the status to 'canceled' while retaining the executed quantity
    order.status = 'canceled';
    await order.save();

    res.json({ msg: 'Order canceled', order });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// View all orders
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/execute/:id', async (req, res) => {
    const { qtyToExecute } = req.body; // How much to execute
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ msg: 'Order not found' });
  
      if (order.status === 'executed') {
        return res.status(400).json({ msg: 'Order is already fully executed' });
      }
  
      // Update executed quantity
      order.executedQty += qtyToExecute;
  
      // Check if the order is now fully executed or still partial
      if (order.executedQty >= order.qty) {
        order.status = 'executed'; // Fully executed
        order.executedQty = order.qty; // Ensure no over-execution
      } else {
        order.status = 'partial'; // Partial execution
      }
  
      await order.save();
      res.json(order);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;
