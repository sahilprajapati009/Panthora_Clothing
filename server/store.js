const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const initialProducts = [
  // ── Hoodies ──
  {
    _id: 'p1',
    name: 'Black Oversized Hoodie',
    description: 'Heavyweight 400gsm premium cotton blend oversized hoodie with dropped shoulders and deep double-layered hood. Built for maximum comfort and structure.',
    price: 3499,
    category: 'hoodie',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    stock: 45,
    images: ['/uploads/black-hoodie.png'],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'p2',
    name: 'Zipper Hoodie',
    description: 'Premium zip-up hoodie in sleek black finish. YKK zipper, fleece-lined interior, custom hardware, and clean Panthora styling.',
    price: 3999,
    category: 'hoodie',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Grey'],
    stock: 30,
    images: ['/uploads/zipper-hoodie.png'],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'p3',
    name: 'Grey Pullover Hoodie',
    description: 'Minimalist grey pullover crafted from 350gsm French terry. Garment-dyed finish with ribbed cuffs and relaxed unisex silhouette.',
    price: 2999,
    category: 'hoodie',
    sizes: ['M', 'L', 'XL'],
    colors: ['Grey'],
    stock: 55,
    images: ['/uploads/grey-hoodie.png'],
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'p4',
    name: 'Brown Heavyweight Hoodie',
    description: 'Rich earth-tone brown heavyweight hoodie. 450gsm double-stitched cotton fleece with boxy streetwear drape.',
    price: 3799,
    category: 'hoodie',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Brown'],
    stock: 20,
    images: ['/uploads/brown-hoodie.png'],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },

  // ── Tees ──
  {
    _id: 'p5',
    name: 'Black Oversized Tee',
    description: 'Essential heavyweight black oversized tee. 240gsm 100% comb cotton, pre-shrunk with boxy drop-shoulder fit.',
    price: 1499,
    category: 'tee',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    stock: 100,
    images: ['/uploads/black-oversized-tee.png'],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'p6',
    name: 'Printed Oversized Tee',
    description: 'High-density graphic print tee on ultra-soft 220gsm cotton. Designed for a bold street statement.',
    price: 1799,
    category: 'tee',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White'],
    stock: 75,
    images: ['/uploads/printed-oversized-tee.png'],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'p7',
    name: 'Acid Wash Oversized Tee',
    description: 'Custom acid-washed drop-shoulder tee. Vintage texture, heavyweight 250gsm feel with unique dye finish on every piece.',
    price: 2199,
    category: 'tee',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Acid Wash Black'],
    stock: 35,
    images: ['/uploads/acid-wash-oversized-tee.png'],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'p8',
    name: 'Full Sleeve Printed Tee',
    description: 'Long sleeve streetwear tee with custom sleeve graphics. 230gsm premium jersey cotton with ribbed cuffs.',
    price: 1999,
    category: 'tee',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    stock: 40,
    images: ['/uploads/full-sleeve-printed-tee.png'],
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },

  // ── Lowers (Joggers & Trackpants) ──
  {
    _id: 'p9',
    name: 'Black Joggers',
    description: 'Tapered black jogger in 350gsm French terry. Elastic waistband with internal drawcord, deep side pockets, and durable ankle cuffs.',
    price: 2499,
    category: 'lower',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    stock: 50,
    images: ['/uploads/black-joggers.png'],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'p10',
    name: 'Black Trackpants',
    description: 'Relaxed fit black trackpant with clean side paneling. Breathable cotton blend built for everyday comfort and athletic style.',
    price: 2299,
    category: 'lower',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    stock: 30,
    images: ['/uploads/black-trackpants.png'],
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'p11',
    name: 'Green Trackpants',
    description: 'Vibrant green trackpant with adjustable drawstrings and zippered side pockets. Modern streetwear utility cut.',
    price: 2299,
    category: 'lower',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Green'],
    stock: 40,
    images: ['/uploads/green-trackpants.png'],
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'p12',
    name: 'White Trackpants',
    description: 'Clean white streetwear trackpant made with heavy cotton-twill blend. Relaxed fit with stretch waistband.',
    price: 2399,
    category: 'lower',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White'],
    stock: 25,
    images: ['/uploads/white-trackpants.png'],
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
];

const initialAdminPasswordHash = bcrypt.hashSync('admin123', 10);

const initialUsers = [
  {
    _id: 'u_admin',
    name: 'Panthora Admin',
    email: 'admin@panthora.com',
    password: initialAdminPasswordHash,
    role: 'admin',
    phone: '9999999999',
    address: 'Panthora HQ, Mumbai, MH',
    createdAt: new Date().toISOString(),
  },
];

class MemoryStore {
  constructor() {
    this.products = [...initialProducts];
    this.users = [...initialUsers];
    this.orders = [];
  }

  // Products
  getProducts({ category, sort, featured }) {
    let result = [...this.products];
    if (category && ['hoodie', 'tee', 'lower'].includes(category)) {
      result = result.filter((p) => p.category === category);
    }
    if (featured === 'true') {
      result = result.filter((p) => p.isFeatured);
    }
    if (sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return result;
  }

  getProductById(id) {
    return this.products.find((p) => p._id === id);
  }

  createProduct(data) {
    const newProduct = {
      _id: 'p_' + Date.now(),
      createdAt: new Date().toISOString(),
      ...data,
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  updateProduct(id, data) {
    const idx = this.products.findIndex((p) => p._id === id);
    if (idx === -1) return null;
    this.products[idx] = { ...this.products[idx], ...data };
    return this.products[idx];
  }

  deleteProduct(id) {
    const idx = this.products.findIndex((p) => p._id === id);
    if (idx === -1) return false;
    this.products.splice(idx, 1);
    return true;
  }

  // Users
  findUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find((u) => u._id === id);
  }

  createUser(userData) {
    const hash = bcrypt.hashSync(userData.password, 10);
    const newUser = {
      _id: 'u_' + Date.now(),
      name: userData.name,
      email: userData.email,
      password: hash,
      role: 'user',
      phone: userData.phone || '',
      address: '',
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  // Orders
  createOrder(userId, { items, shippingAddress, totalAmount }) {
    const newOrder = {
      _id: 'ord_' + Date.now(),
      user: userId,
      items,
      shippingAddress,
      totalAmount,
      orderStatus: 'pending',
      paymentMethod: 'COD',
      createdAt: new Date().toISOString(),
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  getUserOrders(userId) {
    return this.orders.filter((o) => o.user === userId || o.user?._id === userId);
  }

  getAllOrders() {
    return this.orders.map((o) => {
      const u = this.findUserById(typeof o.user === 'string' ? o.user : o.user?._id);
      return {
        ...o,
        user: u ? { _id: u._id, name: u.name, email: u.email, phone: u.phone } : o.user,
      };
    });
  }

  updateOrderStatus(orderId, status) {
    const order = this.orders.find((o) => o._id === orderId);
    if (!order) return null;
    order.orderStatus = status;
    const u = this.findUserById(typeof order.user === 'string' ? order.user : order.user?._id);
    return {
      ...order,
      user: u ? { _id: u._id, name: u.name, email: u.email, phone: u.phone } : order.user,
    };
  }
}

const store = new MemoryStore();
module.exports = store;
