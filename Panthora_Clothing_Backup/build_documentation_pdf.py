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

def build_pdf(filename="Panthora_Clothing_Project_Documentation.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
    )

    styles = getSampleStyleSheet()

    # Custom Palette
    PRIMARY = colors.HexColor("#0F172A")    # Deep Navy/Slate
    SECONDARY = colors.HexColor("#2563EB")  # Vivid Blue Accent
    DARK_TEXT = colors.HexColor("#1E293B")  # Dark Charcoal
    LIGHT_BG = colors.HexColor("#F8FAFC")   # Light Grey Accent
    BORDER_COLOR = colors.HexColor("#E2E8F0")

    # Custom Typography Styles
    doc_title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=PRIMARY,
        alignment=TA_CENTER,
        spaceAfter=6
    )

    doc_subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=SECONDARY,
        alignment=TA_CENTER,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=PRIMARY,
        spaceBefore=12,
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

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=DARK_TEXT,
        spaceAfter=6,
        alignment=TA_JUSTIFY
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=DARK_TEXT,
        leftIndent=15,
        spaceAfter=3
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#091E42"),
        spaceAfter=2
    )

    tbl_header_style = ParagraphStyle(
        'TblHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=TA_CENTER
    )

    tbl_cell_style = ParagraphStyle(
        'TblCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=DARK_TEXT
    )

    def code_box(code_text):
        escaped = html.escape(code_text).replace('\n', '<br/>').replace(' ', '&nbsp;')
        t = Table([[Paragraph(escaped, code_style)]], colWidths=[530])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
            ('BOX', (0,0), (-1,-1), 0.5, BORDER_COLOR),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        return t

    story = []

    # --- Title Header ---
    story.append(Paragraph("PANTHORA CLOTHING — E-COMMERCE PROJECT", doc_title_style))
    story.append(Paragraph("Complete Technical Documentation & Beginner's Presentation Guide", doc_subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=SECONDARY, spaceBefore=0, spaceAfter=12))

    # --- Section 1: Overview & Technology Stack ---
    story.append(Paragraph("1. Executive Summary & Technology Stack", h1_style))
    story.append(Paragraph(
        "Panthora Clothing is a full-stack modern streetwear e-commerce web application built using the <b>MERN Stack</b> "
        "(MongoDB, Express.js, React.js, Node.js) with Tailwind CSS for styling and Redux Toolkit for shopping cart state management. "
        "The project provides a fast, sleek shopping experience for streetwear apparel including Hoodies, Oversized Tees, and Trackpants.",
        body_style
    ))

    # Tech Stack Table
    tech_data = [
        [Paragraph("Technology Layer", tbl_header_style), Paragraph("Tool / Library", tbl_header_style), Paragraph("Purpose / Description", tbl_header_style)],
        [Paragraph("Frontend UI", tbl_cell_style), Paragraph("React.js 18 + Vite", tbl_cell_style), Paragraph("Builds interactive single-page user interface with super-fast loading.", tbl_cell_style)],
        [Paragraph("Styling & CSS", tbl_cell_style), Paragraph("Tailwind CSS", tbl_cell_style), Paragraph("Utility-first CSS framework for modern dark-theme streetwear design.", tbl_cell_style)],
        [Paragraph("State Management", tbl_cell_style), Paragraph("Redux Toolkit (@reduxjs/toolkit)", tbl_cell_style), Paragraph("Manages shopping cart state across the entire application globally.", tbl_cell_style)],
        [Paragraph("Backend API", tbl_cell_style), Paragraph("Node.js + Express.js", tbl_cell_style), Paragraph("Handles web server requests, route logic, and API data delivery.", tbl_cell_style)],
        [Paragraph("Database", tbl_cell_style), Paragraph("MongoDB + Mongoose (with Fallback)", tbl_cell_style), Paragraph("Stores products, user profiles, and customer orders permanently.", tbl_cell_style)],
        [Paragraph("Image Assets", tbl_cell_style), Paragraph("Static Express / Vite Public Uploads", tbl_cell_style), Paragraph("Serves actual product photos directly from local uploads folder.", tbl_cell_style)]
    ]
    t1 = Table(tech_data, colWidths=[110, 150, 270])
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t1)
    story.append(Spacer(1, 10))

    # --- Section 2: Architecture & How It Works ---
    story.append(Paragraph("2. System Architecture & Request Flow", h1_style))
    story.append(Paragraph(
        "<b>Beginner Primer: How does the application run?</b><br/>"
        "When a user opens the website in a web browser (at <code>http://localhost:5173</code>), the <b>React Frontend</b> loads. "
        "The React app sends an HTTP API request (using Axios) to the <b>Express Backend Server</b> running at <code>http://localhost:5000/api/products</code>. "
        "The Backend checks the database (MongoDB or In-Memory Store), fetches product details with local image paths (e.g., <code>/uploads/black-hoodie.png</code>), "
        "and sends back JSON data to React, which renders product cards dynamically on screen.",
        body_style
    ))

    # Flow Explanation
    story.append(Paragraph("<b>Step-by-Step Request Flow:</b>", h2_style))
    story.append(Paragraph("1. <b>Browser Request:</b> User visits Home Page or Category Page.", bullet_style))
    story.append(Paragraph("2. <b>React API Call:</b> Frontend executes <code>axios.get('/api/products?category=hoodie')</code>.", bullet_style))
    story.append(Paragraph("3. <b>Express Route:</b> Express matches route <code>GET /api/products</code> in <code>productRoutes.js</code>.", bullet_style))
    story.append(Paragraph("4. <b>Controller Execution:</b> <code>productController.js</code> queries MongoDB / MemoryStore.", bullet_style))
    story.append(Paragraph("5. <b>Image & JSON Response:</b> Backend returns JSON array of products with image paths for React to render.", bullet_style))
    story.append(Spacer(1, 10))

    # --- Section 3: Folder Structure ---
    story.append(Paragraph("3. Complete Project Folder Structure Explained", h1_style))

    folder_data = [
        [Paragraph("Folder / File Path", tbl_header_style), Paragraph("Role & Significance", tbl_header_style)],
        [Paragraph("<code>Clothes photos/</code>", tbl_cell_style), Paragraph("Source directory where user uploads high-quality clothing images.", tbl_cell_style)],
        [Paragraph("<code>client/src/pages/</code>", tbl_cell_style), Paragraph("Contains main pages: <b>Home.jsx</b>, <b>Products.jsx</b>, <b>ProductDetail.jsx</b>, <b>Cart.jsx</b>, <b>Checkout.jsx</b>.", tbl_cell_style)],
        [Paragraph("<code>client/src/components/</code>", tbl_cell_style), Paragraph("Reusable UI components like <b>Navbar.jsx</b>, <b>Footer.jsx</b>, <b>ProductCard.jsx</b>, <b>CartItem.jsx</b>.", tbl_cell_style)],
        [Paragraph("<code>client/src/store/</code>", tbl_cell_style), Paragraph("Redux Toolkit setup (<code>store.js</code>, <code>cartSlice.js</code>, <code>authSlice.js</code>) for state management.", tbl_cell_style)],
        [Paragraph("<code>client/public/uploads/</code>", tbl_cell_style), Paragraph("Static frontend folder containing normalized clothing images served directly by Vite.", tbl_cell_style)],
        [Paragraph("<code>server/server.js</code>", tbl_cell_style), Paragraph("Main entry point for Express server; mounts routes and static upload folder.", tbl_cell_style)],
        [Paragraph("<code>server/store.js</code>", tbl_cell_style), Paragraph("In-memory database store with initial product array fallback.", tbl_cell_style)],
        [Paragraph("<code>server/seed.js</code>", tbl_cell_style), Paragraph("Script to populate database with default admin user and product catalog.", tbl_cell_style)],
        [Paragraph("<code>server/config/db.js</code>", tbl_cell_style), Paragraph("MongoDB connection handler with automatic fallback and auto-seeding.", tbl_cell_style)],
        [Paragraph("<code>server/controllers/</code>", tbl_cell_style), Paragraph("Business logic functions for authentication, product management, and order processing.", tbl_cell_style)]
    ]
    t2 = Table(folder_data, colWidths=[160, 370])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t2)
    story.append(Spacer(1, 10))

    story.append(PageBreak()) # Clean page break for detailed code section

    # --- Section 4: Detailed Code Explanation ---
    story.append(Paragraph("4. Key Backend Code Explanation (Line-by-Line)", h1_style))

    # Backend File 1: server.js
    story.append(Paragraph("File 1: <code>server/server.js</code> (Express Server Entry Point)", h2_style))
    story.append(Paragraph(
        "<b>What it does:</b> Initializes Node.js Express server, enables CORS security headers, mounts static path for uploaded images, and registers API endpoints.",
        body_style
    ))

    code_server = (
        "const express = require('express');\n"
        "const cors = require('cors');\n"
        "const path = require('path');\n"
        "const connectDB = require('./config/db');\n\n"
        "const app = express();\n"
        "app.use(cors({ origin: 'http://localhost:5173', credentials: true }));\n"
        "app.use(express.json());\n"
        "// SERVE CLOTHING PHOTOS STATICALLY:\n"
        "app.use('/uploads', express.static(path.join(__dirname, 'uploads')));\n\n"
        "// MOUNT ROUTES:\n"
        "app.use('/api/products', require('./routes/productRoutes'));\n"
        "app.use('/api/auth', require('./routes/authRoutes'));\n"
        "app.use('/api/orders', require('./routes/orderRoutes'));\n\n"
        "app.listen(5000, () => console.log('Panthora API running on port 5000'));\n"
        "connectDB();"
    )
    story.append(code_box(code_server))
    story.append(Spacer(1, 8))

    # Backend File 2: productController.js
    story.append(Paragraph("File 2: <code>server/controllers/productController.js</code> (Product API Logic)", h2_style))
    story.append(Paragraph(
        "<b>What it does:</b> Contains controller logic to fetch products filtered by category (<code>hoodie</code>, <code>tee</code>, <code>lower</code>), sort by price, and return single product details.",
        body_style
    ))

    code_ctrl = (
        "const getProducts = async (req, res) => {\n"
        "  const { category, sort, featured } = req.query;\n"
        "  const filter = {};\n"
        "  if (category) filter.category = category; // Filter by hoodie, tee, lower\n"
        "  if (featured === 'true') filter.isFeatured = true;\n\n"
        "  let query = Product.find(filter);\n"
        "  if (sort === 'price_asc') query = query.sort({ price: 1 });\n"
        "  else if (sort === 'price_desc') query = query.sort({ price: -1 });\n"
        "  else query = query.sort({ createdAt: -1 });\n\n"
        "  const products = await query;\n"
        "  res.json({ success: true, count: products.length, products });\n"
        "};"
    )
    story.append(code_box(code_ctrl))
    story.append(Spacer(1, 10))

    # --- Section 5: Frontend Code Explanation ---
    story.append(Paragraph("5. Key Frontend Code Explanation (React & Components)", h1_style))

    # Frontend File 1: ProductCard.jsx
    story.append(Paragraph("File 1: <code>client/src/components/ProductCard.jsx</code> (Displaying Clothing Item)", h2_style))
    story.append(Paragraph(
        "<b>What it does:</b> A reusable UI component that renders each clothing product card with image, title, price, category tag, and Quick Add to Cart button.",
        body_style
    ))

    code_card = (
        "export default function ProductCard({ product }) {\n"
        "  const dispatch = useDispatch();\n"
        "  return (\n"
        "    <div className=\"card group relative overflow-hidden\">\n"
        "      {/* Product Image */}\n"
        "      <img src={product.images?.[0]} alt={product.name} className=\"w-full h-80 object-cover\" />\n"
        "      <div className=\"p-4\">\n"
        "        <span className=\"text-xs text-accent uppercase\">{product.category}</span>\n"
        "        <h3 className=\"font-bold text-lg\">{product.name}</h3>\n"
        "        <p className=\"text-accent font-semibold\">Rs. {product.price}</p>\n"
        "        <button onClick={() => dispatch(addToCart(product))} className=\"btn-primary w-full mt-3\">\n"
        "          Add to Cart\n"
        "        </button>\n"
        "      </div>\n"
        "    </div>\n"
        "  );\n"
        "}"
    )
    story.append(code_box(code_card))
    story.append(Spacer(1, 10))

    # --- Section 6: Image Catalog & Samples ---
    story.append(Paragraph("6. Category & Image Mapping Overview", h1_style))
    story.append(Paragraph(
        "All old stock images were removed and replaced with actual uploaded clothing photos. "
        "Images are normalized in <code>client/public/uploads/</code> and <code>server/uploads/</code> as shown below:",
        body_style
    ))

    img1_path = os.path.join(os.getcwd(), 'client', 'public', 'uploads', 'black-hoodie.png')
    img2_path = os.path.join(os.getcwd(), 'client', 'public', 'uploads', 'printed-oversized-tee.png')
    img3_path = os.path.join(os.getcwd(), 'client', 'public', 'uploads', 'black-trackpants.png')

    def make_img(p):
        if os.path.exists(p):
            try:
                return Image(p, width=60, height=75)
            except Exception:
                return Paragraph("Image File", tbl_cell_style)
        return Paragraph("Image File", tbl_cell_style)

    catalog_data = [
        [Paragraph("Category", tbl_header_style), Paragraph("Sample Product Name", tbl_header_style), Paragraph("Image File Name", tbl_header_style), Paragraph("Preview", tbl_header_style)],
        [Paragraph("<b>Hoodies</b>", tbl_cell_style), Paragraph("Black Oversized Hoodie", tbl_cell_style), Paragraph("<code>black-hoodie.png</code>", tbl_cell_style), make_img(img1_path)],
        [Paragraph("<b>Tees</b>", tbl_cell_style), Paragraph("Printed Oversized Tee", tbl_cell_style), Paragraph("<code>printed-oversized-tee.png</code>", tbl_cell_style), make_img(img2_path)],
        [Paragraph("<b>Lowers</b>", tbl_cell_style), Paragraph("Black Trackpants", tbl_cell_style), Paragraph("<code>black-trackpants.png</code>", tbl_cell_style), make_img(img3_path)]
    ]

    t_cat = Table(catalog_data, colWidths=[80, 160, 170, 120])
    t_cat.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_cat)
    story.append(Spacer(1, 10))

    # --- Section 7: Presentation Q&A for Student ---
    story.append(Paragraph("7. Presentation Guide & Common Questions From Teachers", h1_style))
    story.append(Paragraph(
        "<b>When presenting this project to your sir/teacher, use these simple explanations to explain your project confidently:</b>",
        body_style
    ))

    qa_list = [
        ("Q1: What is the main objective of this project?",
         "Ans: Panthora Clothing is a streetwear e-commerce web app allowing users to browse apparel by category (Hoodies, Tees, Trackpants), view product details, add items to a cart, and place orders."),
        
        ("Q2: Why did you choose the MERN Stack?",
         "Ans: React.js provides a single-page application experience with fast page loading. Node.js and Express handle backend APIs, and MongoDB provides flexible data storage for products and orders."),

        ("Q3: How are product images stored and served?",
         "Ans: Images are stored in local upload directories (/uploads). Express serves them statically via app.use('/uploads', express.static(...)) so both frontend and backend load photos directly."),

        ("Q4: How does cart state management work?",
         "Ans: Shopping cart state is managed using Redux Toolkit (@reduxjs/toolkit). Items added to cart are stored in Redux state and synced with browser localStorage.")
    ]

    for q, a in qa_list:
        story.append(Paragraph(f"<b>{q}</b>", h2_style))
        story.append(Paragraph(a, body_style))
        story.append(Spacer(1, 3))

    doc.build(story)
    print("PDF build successful:", filename)

if __name__ == "__main__":
    build_pdf()
