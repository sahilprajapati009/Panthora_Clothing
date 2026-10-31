const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: 2000,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['hoodie', 'tee', 'lower'],
      message: 'Category must be hoodie, tee, or lower',
    },
  },
  sizes: {
    type: [String],
    default: ['S', 'M', 'L', 'XL'],
  },
  colors: {
    type: [String],
    default: ['Black'],
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  images: {
    type: [String], // Array of image URLs
    default: [],
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for common queries
productSchema.index({ category: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);
