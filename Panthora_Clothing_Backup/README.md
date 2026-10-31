# Panthora Clothing — Premium Streetwear MERN App

A full-stack e-commerce web application for **Panthora Clothing**, a streetwear brand specializing in hoodies, tees, and lowers. Built with MongoDB, Express.js, React (Vite), and Node.js. Designed with a sleek dark mode aesthetic.

---

## 🌟 Key Features

- **Dark & Minimal Aesthetic**: Custom color palette (near-black background `#0a0a0a`, off-white text, and warm muted gold accents `#d4c5a9`), glassmorphism navigation, and responsive typography (Outfit + Inter).
- **Authentication**: JWT authentication with bcrypt password hashing. Dual roles (`user` and `admin`).
- **Product Catalog**: Filter by category (`hoodie`, `tee`, `lower`), sort by price/newest, and view detailed product specs (size/color selectors).
- **Cart & Checkout**: Persistent cart (localStorage) supporting item size/color combinations, quantity updates, and Cash on Delivery (COD) checkout.
- **Customer Portal**: Order history with live order status indicators (`pending`, `confirmed`, `shipped`, `delivered`, `cancelled`).
- **Admin Management**: Dedicated portal to create, update, delete products, and update customer order fulfillment statuses.

---

## 📁 Repository Structure

```text
Panthora clothing/
├── client/                # React (Vite) Frontend
│   ├── src/
│   │   ├── api/           # Axios configuration with JWT interceptors
│   │   ├── components/    # Navbar, Footer, ProductCard, CartItem, Route Guards
│   │   ├── pages/         # Home, Products, ProductDetail, Cart, Checkout, Account, Auth
│   │   │   └── admin/     # Dashboard, ManageProducts, ManageOrders
│   │   ├── store/         # Redux store and slices (authSlice, cartSlice)
│   │   ├── App.jsx        # Routing configuration
│   │   └── index.css      # Tailwind directives & design system
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                # Node.js + Express REST API
│   ├── config/            # MongoDB Mongoose connection
│   ├── controllers/       # Auth, Product, and Order controllers
│   ├── middleware/        # Auth verification, Admin guard, Centralized Error Handler
│   ├── models/            # User, Product, and Order schemas
│   ├── routes/            # Auth, Product, and Order API endpoints
│   ├── seed.js            # Database seeding script (~13 Panthora products + Admin account)
│   └── server.js          # API Server entry point
├── package.json           # Root package (runs client + server concurrently)
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB server)

---

### Step 1: Environment Setup

Create a `.env` file inside the `server/` directory:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and add your database URI and secrets:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/panthora?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

---

### Step 2: Install Dependencies

From the project root directory, install dependencies for root, server, and client:

```bash
npm run install-all
```

*Or install them manually:*
```bash
npm install                     # Root concurrently dependency
cd server && npm install        # Server dependencies
cd ../client && npm install     # Client dependencies
```

---

### Step 3: Seed Database

Populate MongoDB with sample streetwear products (hoodies, tees, lowers) and default admin credentials:

```bash
npm run seed
```

> **Default Admin Credentials Created:**
> - **Email**: `admin@panthora.com`
> - **Password**: `admin123`

---

### Step 4: Run Development Servers

Start both backend server (`http://localhost:5000`) and frontend dev server (`http://localhost:5173`) concurrently:

```bash
npm run dev
```

Now open `http://localhost:5173` in your browser to explore **Panthora Clothing**!

---

## 📡 API Endpoints Summary

### Auth (`/api/auth`)
- `POST /register` — Create new user account
- `POST /login` — Log in user & receive JWT token
- `GET /me` — Get authenticated user details (`protect`)

### Products (`/api/products`)
- `GET /` — List products (query params: `category`, `sort`, `featured`)
- `GET /:id` — Get single product details
- `POST /` — Create product (`protect`, `adminOnly`)
- `PUT /:id` — Update product (`protect`, `adminOnly`)
- `DELETE /:id` — Delete product (`protect`, `adminOnly`)

### Orders (`/api/orders`)
- `POST /` — Place new COD order (`protect`)
- `GET /myorders` — Get current user's order history (`protect`)
- `GET /` — List all customer orders (`protect`, `adminOnly`)
- `PUT /:id/status` — Update order status (`protect`, `adminOnly`)

---

## 🌐 Production Deployment Guide

### 1. Backend Deployment (Render / Railway)
1. Push your repository to GitHub.
2. Log in to [Render.com](https://render.com) and create a **New Web Service**.
3. Connect your GitHub repository.
4. Set **Root Directory** to `server`.
5. Set **Build Command** to `npm install`.
6. Set **Start Command** to `node server.js`.
7. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas Connection String
   - `JWT_SECRET`: A secure random string
   - `CLIENT_URL`: Your Vercel frontend URL (e.g. `https://panthora-clothing.vercel.app`)

### 2. Frontend Deployment (Vercel)
1. Log in to [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository.
3. Set **Root Directory** to `client`.
4. Add Environment Variable:
   - `VITE_API_URL`: Your Render backend URL + `/api` (e.g. `https://panthora-api.onrender.com/api`)
5. Click **Deploy**. Vercel will automatically build and deploy your Panthora website!

