const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  qty: { type: Number, required: true }, // Total quantity of the order
  status: {
    type: String,
    enum: ['pending', 'executed', 'partial', 'canceled'], // Include 'canceled' as a valid status
    default: 'pending',
  },
  executedQty: { type: Number, default: 0 }, // Quantity executed so far
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);