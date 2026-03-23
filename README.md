<div align="center">

# 🍽️ Owen Express

### A full-stack food delivery platform for single restaurant management

[![Live Demo](https://img.shields.io/badge/Live%20Demo-owen--express--food.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://owen-express-food.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-blue?style=for-the-badge&logo=render)](https://owen-express-backend.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image%20Storage-3448C5?style=flat-square&logo=cloudinary)

</div>

---

## 📌 Overview

Owen Express is a production-ready MERN stack food delivery application built for single restaurant management. Customers can browse the menu, add items to cart, and place orders with multiple payment options. Admins get a full dashboard to manage menu items with real-time image uploads via Cloudinary.

---

## ✨ Features

### 👤 Customer
- Email/password authentication with bcryptjs hashing
- Google OAuth login via Firebase
- Browse full menu with veg / non-veg toggle filter
- 3D flip cards showing item ingredients
- Search across menu items
- Shopping cart with localStorage persistence
- Order placement — UPI, Credit Card, or Cash on Delivery
- Order history with star rating and review system
- Fully responsive on all screen sizes

### 🔧 Admin
- Secure admin panel (role-based access)
- Add, edit, and delete menu items
- Upload food images — stored permanently on Cloudinary
- Mark items as Chef's Special
- Veg / Non-veg classification
- Live stats — total items, veg count, non-veg count, specials count
- Inline success/error feedback (no alerts)

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React.js 18 | UI framework |
| | React Router v6 | Client-side routing |
| | Tailwind CSS | Utility-first styling |
| | Vite | Build tool & dev server |
| | React Icons | Icon library |
| | Firebase | Google OAuth |
| **Backend** | Node.js | Runtime environment |
| | Express.js 5 | REST API framework |
| | Mongoose | MongoDB ODM |
| | JWT | Token-based authentication |
| | Bcryptjs | Password hashing (10 salt rounds) |
| | Multer | Multipart form handling |
| | multer-storage-cloudinary | Cloudinary multer adapter |
| **Storage** | MongoDB Atlas | Database (M0 free cluster) |
| | Cloudinary | Persistent image storage & CDN |
| **Deployment** | Vercel | Frontend hosting |
| | Render | Backend hosting |

---

## 🌐 API Reference

### Users
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/signup` | Register new user |
| POST | `/api/users/login` | Login with email & password |
| POST | `/api/users/google` | Google OAuth login |
| GET | `/api/users/verify` | Verify JWT token |

### Menu Items
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/items` | Get all menu items |
| POST | `/api/items` | Create item *(Admin)* |
| PUT | `/api/items/:id` | Update item *(Admin)* |
| DELETE | `/api/items/:id` | Delete item *(Admin)* |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders/payment` | Place an order |
| GET | `/api/orders/user/:email` | Get orders by user |
| PUT | `/api/orders/:id/rate` | Submit rating & review |

---

## 📁 Project Structure

```
owen-express/
├── backend/
│   ├── controllers/
│   │   ├── itemController.js     # Menu CRUD + Cloudinary upload
│   │   ├── orderController.js    # Order placement & rating
│   │   └── userController.js     # Auth, JWT, Google OAuth
│   ├── middleware/
│   │   ├── auth.js               # JWT verification middleware
│   │   └── upload.js             # Multer + Cloudinary storage
│   ├── models/
│   │   ├── Item.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/
│   │   ├── itemRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── app.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ItemList.jsx       # 3D flip card menu grid
    │   │   ├── OrderForm.jsx      # Cart & order summary
    │   │   ├── Payment.jsx        # Payment method selection
    │   │   └── ProtectedRoute.jsx # Auth guard
    │   ├── pages/
    │   │   ├── Admin.jsx          # Admin dashboard
    │   │   ├── Home.jsx           # Full menu page
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Showcase.jsx       # Landing page
    │   │   ├── Search.jsx
    │   │   └── OrderHistory.jsx
    │   ├── App.jsx
    │   ├── config.js              # API_URL config
    │   └── firebase.js
    ├── .env
    ├── .env.production
    ├── vercel.json
    └── vite.config.ts
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- Cloudinary account

### 1. Clone the repo
```bash
git clone https://github.com/vipulpatial82/Owen-express.git
cd Owen-express
```

### 2. Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGO_URI=mongodb://127.0.0.1:27017/foodshop
JWT_SECRET=your_jwt_secret_here
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm start
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |

---

## 🚀 Deployment

### Frontend → Vercel
| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Framework | Vite |
| Env Variable | `VITE_API_URL=https://owen-express-backend.onrender.com` |

### Backend → Render
| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Env Variables | `MONGO_URI`, `JWT_SECRET`, `PORT`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |

### Database → MongoDB Atlas
- Free M0 cluster
- Network Access: `0.0.0.0/0` (required for Render)

---

## 🔒 Security

- Passwords hashed with bcryptjs (10 salt rounds)
- JWT authentication with 7-day token expiry
- Protected API routes via auth middleware
- CORS restricted to production domains
- Role-based access control (admin vs customer)

---

## 👤 Default Admin

```
Email:    admin@gmail.com
Password: admin123
```

---

## 👨‍💻 Author

**Vipul Patial**
- GitHub: [@vipulpatial82](https://github.com/vipulpatial82)
- Repo: [Owen-express](https://github.com/vipulpatial82/Owen-express)

---

## 📄 License

MIT © Vipul Patial
