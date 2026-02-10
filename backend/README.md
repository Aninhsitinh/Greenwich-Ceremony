# Stitch Ceremony Registration System - Backend

Backend API for FPT Greenwich Graduation Ceremony Management System.

## Features

- 🔐 JWT Authentication (Register, Login, Password Reset)
- 👥 Role-based Access Control (Student, Staff, Admin, MC)
- 📝 Ceremony Registration Management
- 💺 Seat Booking System
- 🎫 QR Code Ticket Generation & Scanning
- 🔔 Real-time Notifications (Socket.io)
- 💬 Chat/Support System
- 📸 Photo Gallery
- 🎬 Procession Queue Management
- 💳 Payment Tracking
- 📊 Analytics & Reports

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Real-time**: Socket.io
- **Security**: Helmet.js, CORS, bcryptjs
- **Validation**: express-validator
- **File Upload**: Multer
- **QR Code**: qrcode library

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env` and update values
   - Set your MongoDB connection string
   - Set JWT secret key

3. Start MongoDB:
```bash
# Make sure MongoDB is running on your system
mongod
```

4. Run the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user
- `PUT /profile` - Update profile
- `POST /forgot-password` - Request password reset
- `POST /verify-otp` - Verify OTP
- `POST /reset-password` - Reset password

### Registrations (`/api/registrations`)
- `POST /` - Create registration (Student)
- `GET /me` - Get my registration
- `GET /` - Get all registrations (Admin, Staff)
- `PUT /:id` - Update registration
- `DELETE /:id` - Cancel registration
- `PUT /:id/confirm` - Confirm registration (Admin)
- `PUT /:id/gown-collected` - Mark gown collected (Staff)

### Tickets (`/api/tickets`)
- `POST /generate` - Generate QR ticket (Student)
- `GET /me` - Get my tickets
- `GET /stats` - Get ticket statistics (Admin, Staff)
- `GET /:ticketNumber` - Get ticket by number (Staff, Admin)
- `POST /scan` - Scan QR code (Staff, Admin)
- `GET /` - Get all tickets (Admin)

## Default User Roles

- **student**: Register, book seats, view tickets
- **staff**: Scan QR codes, manage check-ins
- **admin**: Full system access
- **mc**: Manage ceremony procession

## Socket.io Events

### Client → Server
- `join` - Join user room
- `chat_message` - Send chat message
- `send_notification` - Send notification

### Server → Client
- `new_message` - Receive new message
- `new_notification` - Receive new notification

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── app.js           # Main application file
├── uploads/             # Uploaded files
├── .env                 # Environment variables
├── .gitignore
└── package.json
```

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/stitch_ceremony
JWT_SECRET=your-secret-key
JWT_EXPIRE=24h
FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE=5242880
```

## Database Models

1. **User** - User accounts
2. **Registration** - Ceremony registrations
3. **SeatBooking** - Seat bookings
4. **Ticket** - QR code tickets
5. **Notification** - User notifications
6. **Announcement** - News & announcements
7. **ChatMessage** - Support messages
8. **PhotoGallery** - Event photos
9. **ProcessionQueue** - Ceremony queue
10. **Payment** - Payment records
11. **SystemSettings** - Global settings

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- HTTP security headers (Helmet)
- CORS protection
- Rate limiting on authentication routes
- Input validation on all endpoints
- Role-based access control

## Development

```bash
# Install nodemon for development
npm install -D nodemon

# Run in development mode
npm run dev
```

## Testing API

Use tools like:
- Postman
- Thunder Client (VS Code extension)
- cURL

Example login request:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "student@greenwich.edu.vn", "password": "password123"}'
```

## License

MIT
