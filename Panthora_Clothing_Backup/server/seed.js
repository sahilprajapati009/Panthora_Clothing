/**
 * Seed script — populates the database with sample Panthora Clothing products
 * and an admin user. Run with: node seed.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const sampleProducts = [
  // ── Hoodies ──
  {
    name: 'Black Oversized Hoodie',
    description: 'Heavyweight 400gsm premium cotton blend oversized hoodie with dropped shoulders and deep double-layered hood. Built for maximum comfort and structure.',
    price: 3499,
    category: 'hoodie',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    stock: 45,
    images: ['/uploads/black-hoodie.png'],
    isFeatured: true,
  },
  {
    name: 'Zipper Hoodie',
    description: 'Premium zip-up hoodie in sleek black finish. YKK zipper, fleece-lined interior, custom hardware, and clean Panthora styling.',
    price: 3999,
    category: 'hoodie',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Grey'],
    stock: 30,
    images: ['/uploads/zipper-hoodie.png'],
    isFeatured: true,
  },
  {
    name: 'Grey Pullover Hoodie',
    description: 'Minimalist grey pullover crafted from 350gsm French terry. Garment-dyed finish with ribbed cuffs and relaxed unisex silhouette.',
    price: 2999,
    category: 'hoodie',
    sizes: ['M', 'L', 'XL'],
    colors: ['Grey'],
    stock: 55,
    images: ['/uploads/grey-hoodie.png'],
    isFeatured: false,
  },
  {
    name: 'Brown Heavyweight Hoodie',
    description: 'Rich earth-tone brown heavyweight hoodie. 450gsm double-stitched cotton fleece with boxy streetwear drape.',
    price: 3799,
    category: 'hoodie',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Brown'],
    stock: 20,
    images: ['/uploads/brown-hoodie.png'],
    isFeatured: true,
  },

  // ── Tees ──
  {
    name: 'Black Oversized Tee',
    description: 'Essential heavyweight black oversized tee. 240gsm 100% comb cotton, pre-shrunk with boxy drop-shoulder fit.',
    price: 1499,
    category: 'tee',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    stock: 100,
    images: ['/uploads/black-oversized-tee.png'],
    isFeatured: true,
  },
  {
    name: 'Printed Oversized Tee',
    description: 'High-density graphic print tee on ultra-soft 220gsm cotton. Designed for a bold street statement.',
    price: 1799,
    category: 'tee',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White'],
    stock: 75,
    images: ['/uploads/printed-oversized-tee.png'],
    isFeatured: true,
  },
  {
    name: 'Acid Wash Oversized Tee',
    description: 'Custom acid-washed drop-shoulder tee. Vintage texture, heavyweight 250gsm feel with unique dye finish on every piece.',
    price: 2199,
    category: 'tee',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Acid Wash Black'],
    stock: 35,
    images: ['/uploads/acid-wash-oversized-tee.png'],
    isFeatured: true,
  },
  {
    name: 'Full Sleeve Printed Tee',
    description: 'Long sleeve streetwear tee with custom sleeve graphics. 230gsm premium jersey cotton with ribbed cuffs.',
    price: 1999,
    category: 'tee',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    stock: 40,
    images: ['/uploads/full-sleeve-printed-tee.png'],
    isFeatured: false,
  },

  // ── Lowers (Joggers & Trackpants) ──
  {
    name: 'Black Joggers',
    description: 'Tapered black jogger in 350gsm French terry. Elastic waistband with internal drawcord, deep side pockets, and durable ankle cuffs.',
    price: 2499,
    category: 'lower',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    stock: 50,
    images: ['/uploads/black-joggers.png'],
    isFeatured: true,
  },
  {
    name: 'Black Trackpants',
    description: 'Relaxed fit black trackpant with clean side paneling. Breathable cotton blend built for everyday comfort and athletic style.',
    price: 2299,
    category: 'lower',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    stock: 30,
    images: ['/uploads/black-trackpants.png'],
    isFeatured: false,
  },
  {
    name: 'Green Trackpants',
    description: 'Vibrant green trackpant with adjustable drawstrings and zippered side pockets. Modern streetwear utility cut.',
    price: 2299,
    category: 'lower',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Green'],
    stock: 40,
    images: ['/uploads/green-trackpants.png'],
    isFeatured: true,
  },
  {
    name: 'White Trackpants',
    description: 'Clean white streetwear trackpant made with heavy cotton-twill blend. Relaxed fit with stretch waistband.',
    price: 2399,
    category: 'lower',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White'],
    stock: 25,
    images: ['/uploads/white-trackpants.png'],
    isFeatured: false,
  },
];

const adminUser = {
  name: 'Panthora Admin',
  email: 'admin@panthora.com',
  password: 'admin123',
  role: 'admin',
  phone: '9999999999',
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing products and users');

    // Seed products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Seeded ${products.length} products`);

    // Seed admin user (password will be hashed by the pre-save hook)
    const admin = await User.create(adminUser);
    console.log(`Created admin user: ${admin.email} (password: admin123)`);

    console.log('\n✅ Database seeded successfully!');
    console.log('Admin login: admin@panthora.com / admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
