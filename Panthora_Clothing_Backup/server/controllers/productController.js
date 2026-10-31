const Product = require('../models/Product');
const store = require('../store');
const mongoose = require('mongoose');

const isMongoConnected = () => mongoose.connection.readyState === 1;

const getProducts = async (req, res, next) => {
  try {
    if (!isMongoConnected()) {
      const products = store.getProducts(req.query);
      return res.json({ success: true, count: products.length, products });
    }
    const { category, sort, featured } = req.query;
    const filter = {};
    if (category && ['hoodie', 'tee', 'lower'].includes(category)) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;

    let query = Product.find(filter);
    if (sort === 'price_asc') query = query.sort({ price: 1 });
    else if (sort === 'price_desc') query = query.sort({ price: -1 });
    else query = query.sort({ createdAt: -1 });

    let products = await query;
    if (!products || products.length === 0) {
      products = store.getProducts(req.query);
    }
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    const products = store.getProducts(req.query);
    res.json({ success: true, count: products.length, products });
  }
};

const getProductById = async (req, res, next) => {
  try {
    if (!isMongoConnected()) {
      const product = store.getProductById(req.params.id);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      return res.json({ success: true, product });
    }

    let product = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      product = await Product.findById(req.params.id);
    }

    if (!product) {
      const fallback = store.getProductById(req.params.id);
      if (fallback) return res.json({ success: true, product: fallback });
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    const product = store.getProductById(req.params.id);
    if (product) return res.json({ success: true, product });
    res.status(404).json({ success: false, message: 'Product not found' });
  }
};

const createProduct = async (req, res, next) => {
  try {
    if (!isMongoConnected()) {
      const product = store.createProduct(req.body);
      return res.status(201).json({ success: true, product });
    }
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    const product = store.createProduct(req.body);
    res.status(201).json({ success: true, product });
  }
};

const updateProduct = async (req, res, next) => {
  try {
    if (!isMongoConnected()) {
      const product = store.updateProduct(req.params.id, req.body);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      return res.json({ success: true, product });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) {
      const fallback = store.updateProduct(req.params.id, req.body);
      if (fallback) return res.json({ success: true, product: fallback });
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    const product = store.updateProduct(req.params.id, req.body);
    if (product) return res.json({ success: true, product });
    res.status(404).json({ success: false, message: 'Product not found' });
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    if (!isMongoConnected()) {
      const ok = store.deleteProduct(req.params.id);
      if (!ok) return res.status(404).json({ success: false, message: 'Product not found' });
      return res.json({ success: true, message: 'Product deleted' });
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      store.deleteProduct(req.params.id);
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    store.deleteProduct(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
