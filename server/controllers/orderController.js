const Order = require('../models/Order');
const store = require('../store');
const mongoose = require('mongoose');

const isMongoConnected = () => mongoose.connection.readyState === 1;

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address ||
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode ||
        !shippingAddress.phone) {
      return res.status(400).json({ success: false, message: 'Complete shipping address is required' });
    }

    if (!isMongoConnected()) {
      const order = store.createOrder(req.user._id, { items, shippingAddress, totalAmount });
      return res.status(201).json({ success: true, order });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod: 'COD',
      orderStatus: 'pending',
    });
    res.status(201).json({ success: true, order });
  } catch (error) {
    const order = store.createOrder(req.user._id, req.body);
    res.status(201).json({ success: true, order });
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    if (!isMongoConnected()) {
      const orders = store.getUserOrders(req.user._id);
      return res.json({ success: true, orders });
    }
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    const orders = store.getUserOrders(req.user._id);
    res.json({ success: true, orders });
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    if (!isMongoConnected()) {
      const orders = store.getAllOrders();
      return res.json({ success: true, orders });
    }
    const orders = await Order.find().populate('user', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    const orders = store.getAllOrders();
    res.json({ success: true, orders });
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    if (!isMongoConnected()) {
      const order = store.updateOrderStatus(req.params.id, status);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, order });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: status }, { new: true }).populate('user', 'name email phone');
    if (!order) {
      const fallback = store.updateOrderStatus(req.params.id, status);
      if (fallback) return res.json({ success: true, order: fallback });
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    const order = store.updateOrderStatus(req.params.id, req.body.status);
    if (order) return res.json({ success: true, order });
    res.status(404).json({ success: false, message: 'Order not found' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
