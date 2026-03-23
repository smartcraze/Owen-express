# Owen Express - Food Delivery Platform

A full-stack MERN food delivery application for single restaurant management with direct customer ordering.

🌐 **Live Demo**: [owen-express-food.vercel.app](https://owen-express-food.vercel.app)
🔧 **Backend API**: [owen-express-backend.onrender.com](https://owen-express-backend.onrender.com)

## 🚀 Features

### Customer Features
- User authentication (Login/Signup with bcrypt password hashing)
- Google OAuth login via Firebase
- Browse menu with veg/non-veg toggle filter
- Interactive ingredient display (3D flip cards)
- Search functionality
- Shopping cart with localStorage persistence
- Order placement with multiple payment options (UPI/Card/COD)
- Order history with rating and review system
- Responsive design for all screen sizes

### Admin Features
- Admin panel for menu management
- Add/Edit/Delete menu items
- Mark items as "Chef's Special"
- Image upload for food items
- Veg/Non-veg classification
- Real-time menu updates

## 🛠️ Tech Stack

**Frontend:**
- React.js 18
- React Router v6
- Tailwind CSS
- React Icons
- Firebase (Google OAuth)
- Vite

**Backend:**
- Node.js
- Express.js 5
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Bcryptjs (Password Hashing)
- Multer (File Upload)

**Deployment:**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## 📦 Local Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```env
MONGO_URI=mongodb://127.0.0.1:27017/foodshop
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

Start backend server:
```bash
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`
Backend runs on: `http://localhost:5000`

## 👤 Default Admin Credentials
```
Email: admin@gmail.com
Password: admin123
```

## 📁 Project Structure
```
owen-express/
├── backend/
│   ├── controllers/
│   │   ├── itemController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── Item.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/
│   │   ├── itemRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── uploads/
│   ├── .env
│   ├── app.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ItemList.jsx
│   │   │   ├── OrderForm.jsx
│   │   │   ├── Payment.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Admin.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Showcase.jsx
│   │   │   ├── Search.jsx
│   │   │   └── OrderHistory.jsx
│   │   ├── App.jsx
│   │   ├── config.js
│   │   ├── firebase.js
│   │   └── main.jsx
│   ├── public/
│   ├── .env
│   ├── .env.production
│   ├── vercel.json
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🎯 Key Features Explained

### Password Security
- All passwords hashed using bcryptjs (10 salt rounds)
- Secure JWT token-based authentication (7 day expiry)
- Protected routes for authenticated users

### Google OAuth
- Firebase Google sign-in on Login and Signup pages
- Auto-creates user account on first Google login

### Cart Management
- Prevents duplicate items
- Persists in localStorage
- Clears on logout

### Order System
- Multiple payment methods (UPI, Credit Card, COD)
- Order history per user
- Star rating and review system

### Admin Panel
- Full CRUD operations on menu items
- Image upload (stored on backend server)
- Chef's special marking
- Veg/Non-veg classification
- Inline success/error feedback

## 🌐 API Endpoints

### User Routes
- `POST /api/users/signup` - Register new user
- `POST /api/users/login` - User login
- `POST /api/users/google` - Google OAuth login
- `GET /api/users/verify` - Verify JWT token

### Item Routes
- `GET /api/items` - Get all items
- `POST /api/items` - Create item (Admin)
- `PUT /api/items/:id` - Update item (Admin)
- `DELETE /api/items/:id` - Delete item (Admin)

### Order Routes
- `POST /api/orders/payment` - Place order
- `GET /api/orders/user/:email` - Get user orders
- `PUT /api/orders/:id/rate` - Rate order

## 🎨 Color Scheme
- Primary: Orange (#ea580c) to Red (#dc2626) gradient
- Background: #fff5f0
- Success: Green (#16a34a)
- Error: Red (#dc2626)

## 🔒 Security Features
- Bcryptjs password hashing
- JWT authentication
- Protected API routes
- Input validation
- CORS configured for production domains

## 📱 Responsive Design
- Mobile-first approach
- Tailwind CSS responsive utilities
- Works on all screen sizes

## 🚀 Deployment

### Frontend (Vercel)
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: Vite
- Environment Variable: `VITE_API_URL=https://owen-express-backend.onrender.com`

### Backend (Render)
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables: `MONGO_URI`, `JWT_SECRET`, `PORT`

### Database (MongoDB Atlas)
- Free M0 cluster
- Network Access: `0.0.0.0/0` (allow all IPs for Render compatibility)

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first.

## 📄 License
MIT

## 👨‍💻 Author
**Vipul Patial**
- GitHub: [vipulpatial82](https://github.com/vipulpatial82)
- Repo: [Owen-express](https://github.com/vipulpatial82/Owen-express)

## 🙏 Acknowledgments
- React Icons
- Tailwind CSS
- MongoDB Atlas
- Firebase
- Render
- Vercel

---
