# 🍽️ CraveCart - Premium MERN Stack Food Delivery Platform

CraveCart is a state-of-the-art, full-stack food delivery application built using the MERN stack (MongoDB, Express, React, Node.js). Engineered to move away from generic tutorial clones, CraveCart has been completely overhauled with **premium UI/UX design** and **advanced original functionalities** including a loyalty system, live countdown ETAs, visual order timelines, admin analytics dashboard, and dietary tagging filters.

---

## 🚀 Live Demo
- **User Frontend:** [https://food-delivery-frontend-s2l9.onrender.com/](https://food-delivery-frontend-s2l9.onrender.com/)
- **Admin Dashboard:** [https://food-delivery-admin-wrme.onrender.com/](https://food-delivery-admin-wrme.onrender.com/)

---

## ✨ Key Advanced Features

### 🏆 1. Dynamic Loyalty Points System
- **Earn points:** Customers automatically earn **1 loyalty point for every $1 spent** on successful checkout payments.
- **Redeem rewards:** Integrated directly into checkout. When eligible (100+ points), users can select a checkbox to redeem 100 points for a **$5 discount** on their order.
- **Deduction and refunds:** Points are deducted upon order placement and automatically refunded to the user's balance if the payment verification fails or is cancelled.
- **Visuals:** Earn-previews are displayed dynamically in both the cart and checkout screens, and user points balances are highlighted inside the navbar dropdown.

### 🏷️ 2. Smart Dietary Tag Filters
- **Dietary Categories:** Admins can tag food items with dietary labels such as **Vegan 🌱**, **Spicy 🌶️**, **Gluten-Free 🌾**, **Best Seller ⭐**, and **New 🆕**.
- **Intuitive UI:** Filter pill buttons allow customers to combine category filters with dietary preferences on the fly. Badges overlay beautifully on the top-left of each food card.

### 📦 3. Visual Order Timeline & ETA Countdown
- **Interactive Timeline:** A 4-step interactive order tracking timeline component (Order Placed ➜ Preparing ➜ Out for Delivery ➜ Delivered) pulses active status and highlights completed steps with green checks.
- **Live Countdown Timer:** An active countdown timer tracks order arrivals in real-time, estimating minutes based on status, with an animated visual progress bar.

### 🔁 4. One-Click Quick Reorder
- Past orders in the user profile feature an **"Order Again"** button.
- Clicking the button instantly processes previous orders, maps quantities, skips items no longer on the menu gracefully, and adds active dishes straight to the cart with single-tap ease.

### 📊 5. Admin Analytics Dashboard
- Built with `react-chartjs-2` and `chart.js` to showcase business metrics.
- Provides real-time stats including **Total Revenue**, **Completed Paid Orders**, **Pending Payments**, and **Total Registered Users**.
- Includes three interactive charts:
  - **Bar Chart:** Daily revenue & order counts over the last 7 days.
  - **Horizontal Bar Chart:** Top 5 best-selling food items.
  - **Doughnut Chart:** Order status breakdown (Processing, Out for Delivery, Delivered).

---

## 🎨 Design System & UI/UX Overhaul
The application has been completely redesigned using a modern **warm-orange palette** (#ff6b35) to replace the basic tutorial styling:
- **Sticky Glass Navbar:** Implements frosted glass overlay (`backdrop-filter`) with hover underline effects and animated status dots.
- **Modern Typography:** Set in **Inter** to ensure top readability and clean modern visuals.
- **Smooth Micro-interactions:** Hover lift and zoom states on food cards, transition scale effects on active menu items, and custom loading animations.
- **Refined Forms & Modals:** Glassmorphic Login/Register card with blur background and styled focus input indicators.

---

## 🔒 Security & Code Hardening
- **Route Guarding:** Critical admin and user checkout/points routes are fully protected by token authorization.
- **JWT Expiry Validation:** Seamless client-side token validation ensures users are gracefully prompt to sign in again when their credentials expire.
- **Robust Multi-source Configuration:** Removed hardcoded API URLs; all endpoints are resolved dynamically via environment variables (`.env`).
- **Payment Safety:** Integrated Stripe payments with transaction checking using strict server-side validation to avoid points-earning manipulation.

---

## 🛠️ Tech Stack

### Frontend & Admin
- **Framework:** React.js (Vite configuration)
- **Styling:** Custom Vanilla CSS & CSS variables (Design Tokens)
- **State Management:** React Context API (StoreContext)
- **Routing:** React Router DOM
- **Charts:** Chart.js + React-Chartjs-2
- **Notifications:** React Toastify

### Backend & Database
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (using Mongoose Schema models)
- **File Uploads:** Multer (with disk-storage engine)
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt (password hashing)
- **Payment Gateway:** Stripe API Node SDK

---

## ⚙️ Running Locally

### Prerequisites
- Node.js (v16+)
- MongoDB database (Local or Atlas)
- Stripe account (for test API keys)

### Step 1: Clone the repository
```bash
git clone https://github.com/vinitdudhat2511-del/cravecart-backend.git
cd cravecart-backend
```

### Step 2: Configure Environment Variables
Create a `.env` file in the `/backend` folder:
```env
JWT_SECRET=your_jwt_secret_text
SALT=10
MONGO_URL=your_mongodb_connection_uri
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Create a `.env` file in the `/frontend` folder:
```env
VITE_API_URL=http://localhost:4000
```

Create a `.env` file in the `/admin` folder:
```env
VITE_API_URL=http://localhost:4000
```

### Step 3: Install & Start Services

#### Backend:
```bash
cd backend
npm install
npm run server
```

#### User Frontend:
```bash
cd ../frontend
npm install
npm run dev
```

#### Admin Dashboard:
```bash
cd ../admin
npm install
npm run dev
```

---

## 📄 License
This project is licensed under the MIT License.
