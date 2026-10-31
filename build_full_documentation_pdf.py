import os
import sys
import html
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether, HRFlowable, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

def build_pdf(filename="Panthora_Clothing_Full_Project_Documentation.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Color Palette
    PRIMARY = colors.HexColor("#0F172A")      # Slate 900
    SECONDARY = colors.HexColor("#2563EB")    # Blue 600
    ACCENT_DARK = colors.HexColor("#1E293B")  # Slate 800
    DARK_TEXT = colors.HexColor("#334155")    # Slate 700
    LIGHT_BG = colors.HexColor("#F8FAFC")     # Slate 50
    CODE_BG = colors.HexColor("#F1F5F9")      # Slate 100
    BORDER_COLOR = colors.HexColor("#CBD5E1") # Slate 300

    # Typography Styles
    doc_title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY,
        alignment=TA_CENTER,
        spaceAfter=4
    )

    doc_subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=SECONDARY,
        alignment=TA_CENTER,
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=SECONDARY,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'Heading3_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=ACCENT_DARK,
        spaceBefore=8,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=DARK_TEXT,
        spaceAfter=5,
        alignment=TA_JUSTIFY
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=DARK_TEXT,
        leftIndent=12,
        spaceAfter=3
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=2
    )

    tbl_header_style = ParagraphStyle(
        'TblHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=TA_CENTER
    )

    tbl_cell_style = ParagraphStyle(
        'TblCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        textColor=DARK_TEXT
    )

    def code_box(code_text):
        escaped = html.escape(code_text).replace('\n', '<br/>').replace(' ', '&nbsp;')
        t = Table([[Paragraph(escaped, code_style)]], colWidths=[540])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), CODE_BG),
            ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        return t

    story = []

    # --- COVER HEADER ---
    story.append(Paragraph("PANTHORA CLOTHING — E-COMMERCE SYSTEM", doc_title_style))
    story.append(Paragraph("Full Technical Architecture & Code Reference Manual | Comprehensive Presentation Guide", doc_subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=SECONDARY, spaceBefore=0, spaceAfter=10))

    # --- SECTION 1: PROJECT OVERVIEW & TECH STACK ---
    story.append(Paragraph("1. Executive Summary & Full Technology Breakdown", h1_style))
    story.append(Paragraph(
        "<b>Panthora Clothing</b> is a full-stack e-commerce application engineered for a modern streetwear brand. "
        "Built on the <b>MERN Stack</b> (MongoDB, Express.js, React.js, Node.js), it integrates a responsive dark-themed user interface, "
        "global state management via Redux Toolkit, RESTful backend APIs, dual-mode database operations (MongoDB + In-Memory Fallback Store), "
        "and static local image serving for high-resolution clothing assets.",
        body_style
    ))

    # Full Tech Table
    tech_data = [
        [Paragraph("Layer / Subsystem", tbl_header_style), Paragraph("Framework / Package", tbl_header_style), Paragraph("Detailed Function & Usage", tbl_header_style)],
        [Paragraph("<b>Frontend Core</b>", tbl_cell_style), Paragraph("React 18 + Vite 5", tbl_cell_style), Paragraph("Single Page Application (SPA) container with high-performance hot module replacement.", tbl_cell_style)],
        [Paragraph("<b>UI Design System</b>", tbl_cell_style), Paragraph("Tailwind CSS 3", tbl_cell_style), Paragraph("Utility-first styling for dark glassmorphism, responsive grid system, and custom typography.", tbl_cell_style)],
        [Paragraph("<b>Icons & Notifications</b>", tbl_cell_style), Paragraph("React Icons + React Hot Toast", tbl_cell_style), Paragraph("Renders streetwear UI icons (HiOutlineShoppingBag, etc.) and toast notifications.", tbl_cell_style)],
        [Paragraph("<b>Client State</b>", tbl_cell_style), Paragraph("Redux Toolkit (@reduxjs/toolkit)", tbl_cell_style), Paragraph("Centralized state management for shopping cart and user authentication with localStorage persistence.", tbl_cell_style)],
        [Paragraph("<b>Client Routing</b>", tbl_cell_style), Paragraph("React Router DOM 6", tbl_cell_style), Paragraph("Declarative route handling for pages (/products, /product/:id, /cart, /checkout, /admin).", tbl_cell_style)],
        [Paragraph("<b>HTTP Client</b>", tbl_cell_style), Paragraph("Axios", tbl_cell_style), Paragraph("Asynchronous HTTP requests with pre-configured base URL and credentials handling.", tbl_cell_style)],
        [Paragraph("<b>Backend Runtime</b>", tbl_cell_style), Paragraph("Node.js + Express.js 4", tbl_cell_style), Paragraph("Asynchronous event-driven web server hosting REST API endpoints and static assets.", tbl_cell_style)],
        [Paragraph("<b>Database ORM</b>", tbl_cell_style), Paragraph("Mongoose 8", tbl_cell_style), Paragraph("Object Data Modeling (ODM) layer for schema validation and MongoDB interaction.", tbl_cell_style)],
        [Paragraph("<b>Database Engine</b>", tbl_cell_style), Paragraph("MongoDB + MongoMemoryServer", tbl_cell_style), Paragraph("Dual-mode setup: connects to local/cloud MongoDB with automatic in-memory MongoDB fallback.", tbl_cell_style)],
        [Paragraph("<b>Security & Auth</b>", tbl_cell_style), Paragraph("JSON Web Tokens (JWT) + bcryptjs", tbl_cell_style), Paragraph("Password hashing pre-save hooks and signed JWT bearer tokens for secure user authentication.", tbl_cell_style)],
        [Paragraph("<b>Asset Delivery</b>", tbl_cell_style), Paragraph("Express Static Middleware", tbl_cell_style), Paragraph("Direct file streaming of uploaded clothing photos via <code>app.use('/uploads', ...)</code>.", tbl_cell_style)]
    ]
    t_tech = Table(tech_data, colWidths=[100, 140, 300])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
    ]))
    story.append(t_tech)
    story.append(Spacer(1, 10))

    # --- SECTION 2: SYSTEM ARCHITECTURE & DATA FLOW ---
    story.append(Paragraph("2. System Architecture & Component Interaction Flow", h1_style))
    story.append(Paragraph(
        "The application follows a clean <b>Client-Server Architecture</b>. The React frontend operates independently on port 5173, "
        "while the Express server runs on port 5000. Communication occurs via JSON REST APIs over HTTP.",
        body_style
    ))

    story.append(Paragraph("<b>End-to-End Data Execution Lifecycle:</b>", h2_style))
    story.append(Paragraph("1. <b>User Action:</b> Customer opens category <i>Hoodies</i> on the frontend UI.", bullet_style))
    story.append(Paragraph("2. <b>React State Trigger:</b> <code>Products.jsx</code> triggers an asynchronous Axios call: <code>api.get('/products?category=hoodie')</code>.", bullet_style))
    story.append(Paragraph("3. <b>Express Middleware Chain:</b> Request arrives at Express on port 5000. CORS middleware validates origin, body-parser parses query parameters.", bullet_style))
    story.append(Paragraph("4. <b>Router Dispatch:</b> Request hits <code>productRoutes.js</code>, invoking <code>productController.getProducts</code>.", bullet_style))
    story.append(Paragraph("5. <b>Database Execution:</b> Controller checks database connection status. If MongoDB is active, it runs <code>Product.find({ category: 'hoodie' })</code>. If offline, it queries <code>store.getProducts()</code>.", bullet_style))
    story.append(Paragraph("6. <b>JSON Response:</b> Controller returns HTTP 200 with JSON payload containing array of products, prices, stock, and local image paths (e.g. <code>/uploads/black-hoodie.png</code>).", bullet_style))
    story.append(Paragraph("7. <b>React Render:</b> Component receives data, maps items, and renders <code>ProductCard</code> components. Image elements fetch photos directly from Vite/Express static upload endpoint.", bullet_style))
    story.append(Spacer(1, 10))

    # --- SECTION 3: COMPREHENSIVE FILE MAP ---
    story.append(Paragraph("3. Complete Codebase Directory & File Inventory", h1_style))
    
    file_map_data = [
        [Paragraph("File Path", tbl_header_style), Paragraph("Module Type", tbl_header_style), Paragraph("Core Responsibilities & Implementation Details", tbl_header_style)],
        [Paragraph("<code>server/server.js</code>", tbl_cell_style), Paragraph("Backend Bootstrap", tbl_cell_style), Paragraph("Initializes Express server, sets up CORS, registers middleware, mounts static <code>/uploads</code> route, starts listener.", tbl_cell_style)],
        [Paragraph("<code>server/config/db.js</code>", tbl_cell_style), Paragraph("Database Config", tbl_cell_style), Paragraph("Connects to MongoDB, manages auto-failover to in-memory Mongo, purges obsolete images, seeds updated product dataset.", tbl_cell_style)],
        [Paragraph("<code>server/models/Product.js</code>", tbl_cell_style), Paragraph("Mongoose Schema", tbl_cell_style), Paragraph("Defines data schema for clothing products: name, description, price, category, sizes, colors, stock, images array.", tbl_cell_style)],
        [Paragraph("<code>server/models/User.js</code>", tbl_cell_style), Paragraph("Mongoose Schema", tbl_cell_style), Paragraph("User account schema with pre-save bcrypt password hashing hook and instance method for password comparison.", tbl_cell_style)],
        [Paragraph("<code>server/models/Order.js</code>", tbl_cell_style), Paragraph("Mongoose Schema", tbl_cell_style), Paragraph("Order schema storing customer ID, ordered items array, shipping address, total price, order status, payment method.", tbl_cell_style)],
        [Paragraph("<code>server/controllers/productController.js</code>", tbl_cell_style), Paragraph("Controller Logic", tbl_cell_style), Paragraph("Functions for listing products with filtering/sorting, fetching product by ID, creating, updating, and deleting products.", tbl_cell_style)],
        [Paragraph("<code>server/controllers/authController.js</code>", tbl_cell_style), Paragraph("Controller Logic", tbl_cell_style), Paragraph("Handles user registration, login verification, token generation, profile retrieval, and logout.", tbl_cell_style)],
        [Paragraph("<code>server/controllers/orderController.js</code>", tbl_cell_style), Paragraph("Controller Logic", tbl_cell_style), Paragraph("Handles order creation, fetching user-specific order history, admin listing of all orders, and order status updates.", tbl_cell_style)],
        [Paragraph("<code>server/middleware/authMiddleware.js</code>", tbl_cell_style), Paragraph("Security Middleware", tbl_cell_style), Paragraph("Extracts JWT bearer token from cookies/headers, verifies signature, populates req.user, checks admin role permissions.", tbl_cell_style)],
        [Paragraph("<code>server/middleware/errorHandler.js</code>", tbl_cell_style), Paragraph("Error Handler", tbl_cell_style), Paragraph("Centralized error handling middleware formatting error JSON responses with appropriate HTTP status codes.", tbl_cell_style)],
        [Paragraph("<code>server/store.js</code>", tbl_cell_style), Paragraph("In-Memory Store", tbl_cell_style), Paragraph("Class-based memory store (<code>MemoryStore</code>) holding fallback arrays for products, users, and orders.", tbl_cell_style)],
        [Paragraph("<code>server/seed.js</code>", tbl_cell_style), Paragraph("CLI Seed Script", tbl_cell_style), Paragraph("Standalone command-line script to wipe MongoDB collections and insert sample clothing products and admin account.", tbl_cell_style)],
        [Paragraph("<code>client/src/App.jsx</code>", tbl_cell_style), Paragraph("Frontend Container", tbl_cell_style), Paragraph("Main React Router container mounting Navbar, Footer, Toast notifications, and defining all page routes.", tbl_cell_style)],
        [Paragraph("<code>client/src/api/axios.js</code>", tbl_cell_style), Paragraph("HTTP Client Config", tbl_cell_style), Paragraph("Configures Axios instance with base URL <code>http://localhost:5000/api</code> and <code>withCredentials: true</code>.", tbl_cell_style)],
        [Paragraph("<code>client/src/store/index.js</code>", tbl_cell_style), Paragraph("Redux Config", tbl_cell_style), Paragraph("Configures global Redux store combining <code>cartSlice</code> and <code>authSlice</code> reducers.", tbl_cell_style)],
        [Paragraph("<code>client/src/store/slices/cartSlice.js</code>", tbl_cell_style), Paragraph("Redux Cart Slice", tbl_cell_style), Paragraph("Redux state for shopping cart items, quantity modification, price calculations, and localStorage sync.", tbl_cell_style)],
        [Paragraph("<code>client/src/components/ProductCard.jsx</code>", tbl_cell_style), Paragraph("React Component", tbl_cell_style), Paragraph("Product UI card with image preview, category badge, title, price, and Quick Add button.", tbl_cell_style)],
        [Paragraph("<code>client/src/pages/Home.jsx</code>", tbl_cell_style), Paragraph("React Page", tbl_cell_style), Paragraph("Landing Page displaying hero banner, brand ethos, category spotlight, and featured clothing drop grid.", tbl_cell_style)],
        [Paragraph("<code>client/src/pages/Products.jsx</code>", tbl_cell_style), Paragraph("React Page", tbl_cell_style), Paragraph("Catalog search & filter page with category sidebar, price sorting dropdown, and product grid.", tbl_cell_style)],
        [Paragraph("<code>client/src/pages/ProductDetail.jsx</code>", tbl_cell_style), Paragraph("React Page", tbl_cell_style), Paragraph("Individual product showcase with image gallery, size selector, quantity counter, and Add to Cart action.", tbl_cell_style)],
        [Paragraph("<code>client/src/pages/Cart.jsx</code>", tbl_cell_style), Paragraph("React Page", tbl_cell_style), Paragraph("Full shopping cart overview showing item list, price breakdown, promo code input, and proceed to checkout button.", tbl_cell_style)],
        [Paragraph("<code>client/src/pages/Checkout.jsx</code>", tbl_cell_style), Paragraph("React Page", tbl_cell_style), Paragraph("Checkout page collecting customer shipping address, order summary, COD payment, and order submission.", tbl_cell_style)]
    ]
    t_map = Table(file_map_data, colWidths=[150, 110, 280])
    t_map.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_map)
    story.append(Spacer(1, 10))

    story.append(PageBreak())

    # --- SECTION 4: DEEP-DIVE BACKEND CODE EXPLANATIONS ---
    story.append(Paragraph("4. Backend Code Deep-Dive & Line-by-Line Breakdown", h1_style))

    # 4.1 server.js
    story.append(Paragraph("4.1 Server Bootstrapper (<code>server/server.js</code>)", h2_style))
    story.append(Paragraph("This file starts the Node.js process, binds middleware, configures static file serving, and connects routes.", body_style))
    code_s1 = (
        "const express = require('express');\n"
        "const cors = require('cors');\n"
        "const cookieParser = require('cookie-parser');\n"
        "const path = require('path');\n"
        "const connectDB = require('./config/db');\n"
        "const errorHandler = require('./middleware/errorHandler');\n\n"
        "const app = express();\n"
        "const PORT = process.env.PORT || 5000;\n\n"
        "// Middleware setup\n"
        "app.use(cors({ origin: 'http://localhost:5173', credentials: true }));\n"
        "app.use(express.json());\n"
        "app.use(cookieParser());\n\n"
        "// Serve local uploaded images statically at /uploads URL path\n"
        "app.use('/uploads', express.static(path.join(__dirname, 'uploads')));\n\n"
        "// API Route Mounting\n"
        "app.use('/api/auth', require('./routes/authRoutes'));\n"
        "app.use('/api/products', require('./routes/productRoutes'));\n"
        "app.use('/api/orders', require('./routes/orderRoutes'));\n\n"
        "app.use(errorHandler);\n\n"
        "app.listen(PORT, () => console.log(`Panthora API server running on port ${PORT}`));\n"
        "connectDB();"
    )
    story.append(code_box(code_s1))
    story.append(Spacer(1, 8))

    # 4.2 db.js
    story.append(Paragraph("4.2 Resilient Database Connection & Auto-Seeding (<code>server/config/db.js</code>)", h2_style))
    story.append(Paragraph("Connects to MongoDB; if local MongoDB is not running, seamlessly launches an in-memory MongoDB instance and auto-seeds local clothing products.", body_style))
    code_s2 = (
        "const mongoose = require('mongoose');\n"
        "const Product = require('../models/Product');\n\n"
        "const autoSeed = async () => {\n"
        "  // Purge any old products with external unsplash URLs\n"
        "  await Product.deleteMany({ 'images.0': { $regex: 'unsplash' } });\n\n"
        "  const count = await Product.countDocuments();\n"
        "  if (count === 0) {\n"
        "    console.log('Seeding updated Panthora clothing products...');\n"
        "    await Product.insertMany([\n"
        "      { name: 'Black Oversized Hoodie', price: 3499, category: 'hoodie', images: ['/uploads/black-hoodie.png'] },\n"
        "      { name: 'Printed Oversized Tee', price: 1799, category: 'tee', images: ['/uploads/printed-oversized-tee.png'] },\n"
        "      { name: 'Black Trackpants', price: 2299, category: 'lower', images: ['/uploads/black-trackpants.png'] }\n"
        "    ]);\n"
        "  }\n"
        "};"
    )
    story.append(code_box(code_s2))
    story.append(Spacer(1, 8))

    # 4.3 productController.js
    story.append(Paragraph("4.3 Product Controller API Logic (<code>server/controllers/productController.js</code>)", h2_style))
    story.append(Paragraph("Processes incoming product catalog requests, applies category filters (<code>hoodie</code>, <code>tee</code>, <code>lower</code>), and handles price sorting.", body_style))
    code_s3 = (
        "const getProducts = async (req, res) => {\n"
        "  try {\n"
        "    const { category, sort, featured } = req.query;\n"
        "    const filter = {};\n"
        "    if (category && ['hoodie', 'tee', 'lower'].includes(category)) {\n"
        "      filter.category = category;\n"
        "    }\n"
        "    if (featured === 'true') filter.isFeatured = true;\n\n"
        "    let query = Product.find(filter);\n"
        "    if (sort === 'price_asc') query = query.sort({ price: 1 });\n"
        "    else if (sort === 'price_desc') query = query.sort({ price: -1 });\n"
        "    else query = query.sort({ createdAt: -1 });\n\n"
        "    const products = await query;\n"
        "    res.json({ success: true, count: products.length, products });\n"
        "  } catch (error) {\n"
        "    res.status(500).json({ success: false, message: error.message });\n"
        "  }\n"
        "};"
    )
    story.append(code_box(code_s3))
    story.append(Spacer(1, 10))

    # --- SECTION 5: DEEP-DIVE FRONTEND CODE EXPLANATIONS ---
    story.append(Paragraph("5. Frontend React & Redux Implementation Breakdown", h1_style))

    # 5.1 cartSlice.js
    story.append(Paragraph("5.1 Global Cart State Management (<code>client/src/store/slices/cartSlice.js</code>)", h2_style))
    story.append(Paragraph("Manages adding items, calculating subtotal, increasing/decreasing quantities, and persisting to browser localStorage.", body_style))
    code_c1 = (
        "import { createSlice } from '@reduxjs/toolkit';\n\n"
        "const savedCart = JSON.parse(localStorage.getItem('panthora_cart') || '[]');\n\n"
        "const cartSlice = createSlice({\n"
        "  name: 'cart',\n"
        "  initialState: { items: savedCart },\n"
        "  reducers: {\n"
        "    addToCart: (state, action) => {\n"
        "      const item = action.payload;\n"
        "      const existing = state.items.find(i => i._id === item._id && i.selectedSize === item.selectedSize);\n"
        "      if (existing) {\n"
        "        existing.quantity += item.quantity || 1;\n"
        "      } else {\n"
        "        state.items.push({ ...item, quantity: item.quantity || 1 });\n"
        "      }\n"
        "      localStorage.setItem('panthora_cart', JSON.stringify(state.items));\n"
        "    },\n"
        "    removeFromCart: (state, action) => {\n"
        "      state.items = state.items.filter(i => i._id !== action.payload);\n"
        "      localStorage.setItem('panthora_cart', JSON.stringify(state.items));\n"
        "    }\n"
        "  }\n"
        "});\n"
        "export const { addToCart, removeFromCart } = cartSlice.actions;\n"
        "export default cartSlice.reducer;"
    )
    story.append(code_box(code_c1))
    story.append(Spacer(1, 8))

    # 5.2 ProductCard.jsx
    story.append(Paragraph("5.2 Product Card Component (<code>client/src/components/ProductCard.jsx</code>)", h2_style))
    story.append(Paragraph("Reusable UI card rendering product image, category pill, name, formatted price, and dispatching Add to Cart.", body_style))
    code_c2 = (
        "import { useDispatch } from 'react-redux';\n"
        "import { addToCart } from '../store/slices/cartSlice';\n"
        "import { toast } from 'react-hot-toast';\n\n"
        "export default function ProductCard({ product }) {\n"
        "  const dispatch = useDispatch();\n"
        "  const handleAdd = (e) => {\n"
        "    e.preventDefault();\n"
        "    dispatch(addToCart(product));\n"
        "    toast.success(`${product.name} added to cart!`);\n"
        "  };\n"
        "  return (\n"
        "    <div className=\"card group relative overflow-hidden rounded-xl bg-bg-surface border border-border\">\n"
        "      <img src={product.images?.[0]} alt={product.name} className=\"w-full h-80 object-cover\" />\n"
        "      <div className=\"p-4\">\n"
        "        <span className=\"text-xs text-accent uppercase font-bold\">{product.category}</span>\n"
        "        <h3 className=\"font-bold text-lg text-text-primary\">{product.name}</h3>\n"
        "        <p className=\"text-accent font-semibold\">Rs. {product.price}</p>\n"
        "        <button onClick={handleAdd} className=\"btn-primary w-full mt-2\">\n"
        "          Add to Cart\n"
        "        </button>\n"
        "      </div>\n"
        "    </div>\n"
        "  );\n"
        "}"
    )
    story.append(code_box(code_c2))
    story.append(Spacer(1, 10))

    # --- SECTION 6: PRODUCT & IMAGE CATALOG ---
    story.append(Paragraph("6. Category & Image Mapping Table", h1_style))
    story.append(Paragraph("All products are classified into 3 major categories. Each product points to an actual file in <code>/uploads/</code>:", body_style))

    img1_path = os.path.join(os.getcwd(), 'client', 'public', 'uploads', 'black-hoodie.png')
    img2_path = os.path.join(os.getcwd(), 'client', 'public', 'uploads', 'printed-oversized-tee.png')
    img3_path = os.path.join(os.getcwd(), 'client', 'public', 'uploads', 'black-trackpants.png')

    def make_img(p):
        if os.path.exists(p):
            try:
                return Image(p, width=50, height=65)
            except Exception:
                return Paragraph("Image", tbl_cell_style)
        return Paragraph("Image", tbl_cell_style)

    catalog_data = [
        [Paragraph("Category", tbl_header_style), Paragraph("Product Title", tbl_header_style), Paragraph("Price", tbl_header_style), Paragraph("Image Filename", tbl_header_style), Paragraph("Preview", tbl_header_style)],
        [Paragraph("<b>Hoodies</b>", tbl_cell_style), Paragraph("Black Oversized Hoodie", tbl_cell_style), Paragraph("Rs. 3,499", tbl_cell_style), Paragraph("<code>black-hoodie.png</code>", tbl_cell_style), make_img(img1_path)],
        [Paragraph("<b>Hoodies</b>", tbl_cell_style), Paragraph("Zipper Hoodie", tbl_cell_style), Paragraph("Rs. 3,999", tbl_cell_style), Paragraph("<code>zipper-hoodie.png</code>", tbl_cell_style), Paragraph("Yes", tbl_cell_style)],
        [Paragraph("<b>Hoodies</b>", tbl_cell_style), Paragraph("Grey Pullover Hoodie", tbl_cell_style), Paragraph("Rs. 2,999", tbl_cell_style), Paragraph("<code>grey-hoodie.png</code>", tbl_cell_style), Paragraph("Yes", tbl_cell_style)],
        [Paragraph("<b>Hoodies</b>", tbl_cell_style), Paragraph("Brown Heavyweight Hoodie", tbl_cell_style), Paragraph("Rs. 3,799", tbl_cell_style), Paragraph("<code>brown-hoodie.png</code>", tbl_cell_style), Paragraph("Yes", tbl_cell_style)],
        [Paragraph("<b>Tees</b>", tbl_cell_style), Paragraph("Black Oversized Tee", tbl_cell_style), Paragraph("Rs. 1,499", tbl_cell_style), Paragraph("<code>black-oversized-tee.png</code>", tbl_cell_style), Paragraph("Yes", tbl_cell_style)],
        [Paragraph("<b>Tees</b>", tbl_cell_style), Paragraph("Printed Oversized Tee", tbl_cell_style), Paragraph("Rs. 1,799", tbl_cell_style), Paragraph("<code>printed-oversized-tee.png</code>", tbl_cell_style), make_img(img2_path)],
        [Paragraph("<b>Tees</b>", tbl_cell_style), Paragraph("Acid Wash Oversized Tee", tbl_cell_style), Paragraph("Rs. 2,199", tbl_cell_style), Paragraph("<code>acid-wash-oversized-tee.png</code>", tbl_cell_style), Paragraph("Yes", tbl_cell_style)],
        [Paragraph("<b>Tees</b>", tbl_cell_style), Paragraph("Full Sleeve Printed Tee", tbl_cell_style), Paragraph("Rs. 1,999", tbl_cell_style), Paragraph("<code>full-sleeve-printed-tee.png</code>", tbl_cell_style), Paragraph("Yes", tbl_cell_style)],
        [Paragraph("<b>Lowers</b>", tbl_cell_style), Paragraph("Black Joggers", tbl_cell_style), Paragraph("Rs. 2,499", tbl_cell_style), Paragraph("<code>black-joggers.png</code>", tbl_cell_style), Paragraph("Yes", tbl_cell_style)],
        [Paragraph("<b>Lowers</b>", tbl_cell_style), Paragraph("Black Trackpants", tbl_cell_style), Paragraph("Rs. 2,299", tbl_cell_style), Paragraph("<code>black-trackpants.png</code>", tbl_cell_style), make_img(img3_path)],
        [Paragraph("<b>Lowers</b>", tbl_cell_style), Paragraph("Green Trackpants", tbl_cell_style), Paragraph("Rs. 2,299", tbl_cell_style), Paragraph("<code>green-trackpants.png</code>", tbl_cell_style), Paragraph("Yes", tbl_cell_style)],
        [Paragraph("<b>Lowers</b>", tbl_cell_style), Paragraph("White Trackpants", tbl_cell_style), Paragraph("Rs. 2,399", tbl_cell_style), Paragraph("<code>white-trackpants.png</code>", tbl_cell_style), Paragraph("Yes", tbl_cell_style)]
    ]

    t_cat = Table(catalog_data, colWidths=[80, 150, 70, 160, 80])
    t_cat.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_cat)
    story.append(Spacer(1, 10))

    # --- SECTION 7: PRESENTATION Q&A FOR TEACHER ---
    story.append(Paragraph("7. Mentor / Presentation Viva Q&A Reference Guide", h1_style))
    story.append(Paragraph("Use these answers when presenting this project to your teacher or evaluator:", body_style))

    qa = [
        ("Q1. What architecture does Panthora Clothing use?",
         "Ans: Panthora Clothing uses a MERN (MongoDB, Express, React, Node) Client-Server Architecture. React handles the SPA frontend on port 5173, Express handles REST APIs on port 5000, and MongoDB manages product/order data."),

        ("Q2. How is offline or database fallback handled?",
         "Ans: In server/config/db.js, if local MongoDB connection fails, the server automatically spawns an in-memory MongoDB database (MongoMemoryServer) and populates initial clothing products so the site always functions seamlessly."),

        ("Q3. How are images uploaded and served to users?",
         "Ans: Images uploaded in 'Clothes photos' are synced into /public/uploads/ and server/uploads/. Express serves them via app.use('/uploads', express.static(...)), and React displays them via standard image paths."),

        ("Q4. How does cart state persist on page reload?",
         "Ans: Redux Toolkit (cartSlice.js) maintains cart state in Redux memory and synchronizes every state change to browser localStorage. On page load, Redux initializes state from localStorage.")
    ]

    for question, answer in qa:
        story.append(Paragraph(f"<b>{question}</b>", h2_style))
        story.append(Paragraph(answer, body_style))
        story.append(Spacer(1, 3))

    doc.build(story)
    print("Full PDF build successful:", filename)

if __name__ == "__main__":
    build_pdf()
