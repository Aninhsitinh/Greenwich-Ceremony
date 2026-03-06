# Stitch Ceremony Registration System

🎓 A modern, full-stack graduation ceremony registration and management system built with **Vue.js** and **Node.js/Express**.

## 🌟 Features

### Student Portal
- **Registration** - Ceremony attendance confirmation with gown size selection
- **E-Ticket Generation** - Digital tickets with QR codes
- **Seat Booking** - Reserve seats for family members (up to 3 guests)
- **Journey Tracking** - Visual progress through registration steps
- **Profile Management** - Update personal information

### Staff Portal
- **QR Code Scanner** - Check-in attendees at the ceremony
- **Registration Management** - View and manage student registrations
- **Analytics Dashboard** - Real-time statistics and insights

## 🛠️ Tech Stack

### Frontend
- Vue 3 (Composition API)
- Vue Router
- Pinia (State Management)
- Tailwind CSS
- Material Symbols Icons

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Socket.io (Real-time updates)
- QR Code Generation

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/stitch-ceremony-registration.git
cd stitch-ceremony-registration
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ceremony_registration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

Create `.env` file in frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

## ▶️ Running the Application

### Development Mode

**Backend** (from backend directory):
```bash
npm run start
```
Server runs on http://localhost:5000

**Frontend** (from frontend directory):
```bash
npm run dev
```
App runs on http://localhost:3000

### Production Build

**Frontend**:
```bash
cd frontend
npm run build
```

## 📱 Default Users

### Student Account
- Email: `student@example.com`
- Password: `password123`
- Student ID: `GCS230042`

### Staff Account
- Email: `staff@example.com`
- Password: `password123`

## 🎯 User Journey

1. **Registration** → Complete graduation details
2. **Generate E-Ticket** → Get digital entry pass
3. **Book Seats** → Reserve guest seating
4. **Collect Gown** → Schedule gown pickup
5. **Complete Payment** → Pay for packages

## 📂 Project Structure

```
stitch-ceremony-registration/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth, error handling
│   │   ├── utils/             # Helper functions
│   │   └── app.js             # Express app
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── views/             # Page components
│   │   ├── stores/            # Pinia stores
│   │   ├── services/          # API services
│   │   ├── router/            # Vue Router
│   │   └── assets/            # Images, styles
│   └── package.json
└── README.md
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet.js security headers
- Input validation

## 🎨 UI/UX Highlights

- **Modern Glassmorphism Design**
- **Greenwich University Branding** (Navy, Blue, Gold)
- **Responsive Layout** (Mobile, Tablet, Desktop)
- **Smooth Animations & Transitions**
- **Dark Mode Support**
- **Premium Visual Effects**

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Phan Công Duy Khương**
- Student ID: GCS230042
- Email: duykhuongpc@gmail.com

## 🙏 Acknowledgments

- FPT Greenwich University
- Vue.js Team
- Node.js Community

---

Made with ❤️ for FPT Greenwich Graduation 2026
