# API Testing Guide - Stitch Ceremony Registration

## Base URL
```
http://localhost:5000/api
```

## Authentication Flow

### 1. Register New Student
```bash
POST /auth/register
Content-Type: application/json

{
  "studentId": "GCS220004",
  "email": "newstudent@greenwich.edu.vn",
  "password": "student123",
  "fullName": "Test Student",
  "phone": "0901234599",
  "major": "Computer Science",
  "classOf": 2024
}
```

### 2. Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "student1@greenwich.edu.vn",
  "password": "student123"
}

# Response includes token:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {...}
  }
}
```

### 3. Get Current User
```bash
GET /auth/me
Authorization: Bearer <token>
```

## Registration APIs

### Create Ceremony Registration
```bash
POST /registrations
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "ceremonyDate": "2024-06-20",
  "gownSize": "M",
  "specialRequirements": "Wheelchair accessible"
}
```

### Get My Registration
```bash
GET /registrations/me
Authorization: Bearer <student_token>
```

### Get All Registrations (Admin)
```bash
GET /registrations?status=confirmed&page=1&limit=20
Authorization: Bearer <admin_token>
```

### Confirm Registration (Admin)
```bash
PUT /registrations/:id/confirm
Authorization: Bearer <admin_token>
```

## Seat Booking APIs

### Get Available Seats
```bash
GET /seats
Authorization: Bearer <token>
```

### Book a Seat
```bash
POST /seats/book
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "seatNumber": "A-15",
  "seatType": "student"
}
```

### Book Guest Seat
```bash
POST /seats/book
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "seatNumber": "B-20",
  "seatType": "guest",
  "guestName": "Nguyễn Văn Cha",
  "guestRelation": "parent",
  "guestPhone": "0909876543"
}
```

### Get My Bookings
```bash
GET /seats/my-bookings
Authorization: Bearer <student_token>
```

### Cancel Booking
```bash
DELETE /seats/:bookingId
Authorization: Bearer <student_token>
```

## Ticket APIs

### Generate QR Ticket
```bash
POST /tickets/generate
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "ticketType": "student",
  "seatNumber": "A-15"
}
```

### Get My Tickets
```bash
GET /tickets/me
Authorization: Bearer <student_token>
```

### Scan Ticket (Staff)
```bash
POST /tickets/scan
Authorization: Bearer <staff_token>
Content-Type: application/json

{
  "ticketNumber": "GRAD-2024-1234567890-123"
}
```

### Get Ticket Statistics (Admin/Staff)
```bash
GET /tickets/stats
Authorization: Bearer <admin_token>
```

### Get All Tickets (Admin)
```bash
GET /tickets?isScanned=false&page=1&limit=20
Authorization: Bearer <admin_token>
```

## Notification APIs

### Get My Notifications
```bash
GET /notifications?page=1&limit=20
Authorization: Bearer <token>
```

### Mark Notification as Read
```bash
PUT /notifications/:notificationId/read
Authorization: Bearer <token>
```

### Mark All as Read
```bash
PUT /notifications/read-all
Authorization: Bearer <token>
```

### Broadcast Notification (Admin)
```bash
POST /notifications/broadcast
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Important Update",
  "message": "Gown collection starts tomorrow!",
  "type": "urgent",
  "targetRole": "student"
}
```

## Password Reset Flow

### 1. Forgot Password
```bash
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "student1@greenwich.edu.vn"
}

# Response includes OTP (remove in production)
{
  "success": true,
  "message": "OTP sent to email",
  "data": {
    "otp": "123456"
  }
}
```

### 2. Verify OTP
```bash
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "student1@greenwich.edu.vn",
  "otp": "123456"
}

# Response includes reset token
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "resetToken": "..."
  }
}
```

### 3. Reset Password
```bash
POST /auth/reset-password
Content-Type: application/json

{
  "email": "student1@greenwich.edu.vn",
  "resetToken": "...",
  "newPassword": "newpassword123"
}
```

## Complete User Flow Example

### Student Journey:
1. **Register** → POST /auth/register
2. **Login** → POST /auth/login → Save token
3. **Create Registration** → POST /registrations
4. **Book Seat** → POST /seats/book
5. **Generate Ticket** → POST /tickets/generate
6. **View Ticket** → GET /tickets/me
7. **On Event Day** - Staff scans QR code → POST /tickets/scan

### Staff Journey:
1. **Login** → POST /auth/login
2. **Scan QR Codes** → POST /tickets/scan
3. **Mark Gown Collected** → PUT /registrations/:id/gown-collected
4. **View All Bookings** → GET /seats/all

### Admin Journey:
1. **Login** → POST /auth/login
2. **View All Registrations** → GET /registrations
3. **Confirm Registration** → PUT /registrations/:id/confirm
4. **Broadcast Notification** → POST /notifications/broadcast
5. **View Statistics** → GET /tickets/stats

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error message here",
  "errors": [ // Optional, for validation errors
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

## Testing with cURL

### Login Example:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@greenwich.edu.vn","password":"student123"}'
```

### Authenticated Request Example:
```bash
curl -X GET http://localhost:5000/api/registrations/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Socket.io Events

### Connect to Socket.io:
```javascript
const socket = io('http://localhost:5000');

// Join user room
socket.emit('join', userId);

// Listen for notifications
socket.on('new_notification', (data) => {
  console.log('New notification:', data);
});

// Listen for messages
socket.on('new_message', (data) => {
  console.log('New message:', data);
});
```

## Quick Start Testing

1. Start MongoDB
2. Start backend: `npm run dev`
3. Seed database: `npm run seed`
4. Use default accounts from seed.js
5. Test with Thunder Client, Postman, or cURL
