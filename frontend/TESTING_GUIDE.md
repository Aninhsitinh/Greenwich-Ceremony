# 🧪 Frontend Testing Guide

## Server Status
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## ✅ Student Portal Testing

### 1. Homepage & Navigation
**URL**: `http://localhost:3000`

**Expected**:
- Landing page with hero section
- "Celebrate Your Success" headline
- Key Features cards (Registration, Seat Booking, Digital Check-in)
- How It Works timeline
- Student Login & Staff Portal buttons

**Test**:
- [ ] Dark mode toggle works
- [ ] Hero image loads
- [ ] Buttons are clickable
- [ ] Navigation is smooth

---

### 2. Registration Flow
**URL**: `http://localhost:3000/register`

**Test New Account**:
1. Click "Register" from login page
2. Fill out form:
   - Student ID: `GCS220005`
   - Full Name: `Test Student`
   - Email: `test@greenwich.edu.vn`
   - Phone: `0901234567`
   - Major: Select from dropdown
   - Class of: `2024`
   - Password: `test123`
   - Confirm Password: `test123`
3. Click "Create Account"

**Expected**:
- [ ] Form validation works
- [ ] Password mismatch shows error
- [ ] Successful registration redirects to /student
- [ ] Token saved in localStorage

**Common Errors**:
- "User already exists" - Email/Student ID taken
- "Password mismatch" - Passwords don't match

---

### 3. Login Flow  
**URL**: `http://localhost:3000/login`

**Test Existing Account**:
- Email: `student1@greenwich.edu.vn`
- Password: `student123`

**Expected**:
- [ ] Login button shows spinner during request
- [ ] Successful login redirects to /student
- [ ] Error message shows for wrong credentials
- [ ] "Remember Me" checkbox works
- [ ] "Forgot Password" link visible

---

### 4. Student Dashboard
**URL**: `http://localhost:3000/student`

**Expected Features**:
- [ ] Profile header with student name
- [ ] Class of 2024 badge
- [ ] Countdown timer (updates every second)
- [ ] 4 Quick action buttons:
  - Register
  - Payment
  - Book Seats
  - My Ticket
- [ ] Event timeline with 3 events
- [ ] Bottom navigation bar (5 items)
- [ ] Notification badge

**Test**:
- [ ] Countdown timer decrements
- [ ] Quick actions navigate correctly
- [ ] Bottom nav highlights current page
- [ ] Profile photo placeholder loads

---

### 5. Ceremony Registration
**URL**: `http://localhost:3000/student/registration`

**First Time (No Registration)**:
1. Select Ceremony Date
2. Choose Gown Size (S, M, L, XL, XXL)
3. Add Special Requirements (optional)
4. Click "Submit Registration"

**Expected**:
- [ ] Form submits to backend
- [ ] Success message appears
- [ ] Registration status shows "PENDING"
- [ ] Cannot create duplicate registration

**With Existing Registration**:
- [ ] Shows current registration details
- [ ] Status badge (Pending/Confirmed/Cancelled)
- [ ] "Edit Registration" button
- [ ] "Cancel" button with confirmation

**Test Edit**:
1. Click "Edit Registration"
2. Change gown size
3. Click "Update Registration"
4. Verify changes saved

---

### 6. E-Ticket Page
**URL**: `http://localhost:3000/student/ticket`

**No Ticket Scenario**:
- [ ] Shows "No Ticket Yet" message
- [ ] "Generate Ticket" button visible
- [ ] Requires completed registration

**With Ticket**:
1. Click "Generate Ticket"
2. Wait for QR code generation

**Expected**:
- [ ] QR code displays (base64 image)
- [ ] Ticket number shown (GRAD-2024-xxx)
- [ ] Student name and ID
- [ ] Seat number (if assigned)
- [ ] Scan status (VALID/SCANNED)
- [ ] Download button works
- [ ] Important notes section

**Test Download**:
- [ ] Click download icon
- [ ] QR code downloads as PNG

---

### 7. Seat Booking
**URL**: `http://localhost:3000/student/seats`

**Features**:
- [ ] Total capacity displayed
- [ ] Available seats count
- [ ] Guest limit info (max 2)
- [ ] My bookings list

**Book Student Seat**:
1. Select "Student" seat type
2. Enter seat number: `A-15`
3. Click "Book Seat"

**Expected**:
- [ ] Seat added to "My Bookings"
- [ ] Available seats decreases
- [ ] Success message

**Book Guest Seat**:
1. Select "Guest" seat type
2. Enter seat number: `B-20`
3. Guest Name: `Nguyen Van Cha`
4. Relation: `Parent`
5. Guest Phone: `0909876543`
6. Click "Book Seat"

**Expected**:
- [ ] Guest details form appears
- [ ] All fields required
- [ ] Booking appears in list
- [ ] Guest name displayed

**Cancel Booking**:
1. Click delete icon on booking
2. Confirm alert
3. Booking removed

**Edge Cases**:
- [ ] Cannot book more than 2 guest seats
- [ ] Cannot book duplicate seat number
- [ ] Seat number validated

---

### 8. Profile Page
**URL**: `http://localhost:3000/student/profile`

**View Mode**:
- [ ] Profile photo (generated avatar)
- [ ] Full name and email
- [ ] Role badge (STUDENT)
- [ ] Class of year badge
- [ ] Student ID (read-only)
- [ ] Email (read-only)
- [ ] Major (read-only)

**Edit Mode**:
1. Click "Edit Profile"
2. Fields become editable:
   - Full Name
   - Phone Number
3. Make changes
4. Click "Save Changes"

**Expected**:
- [ ] Only editable fields active
- [ ] Success message on save
- [ ] Changes reflected immediately
- [ ] Cancel button reverts changes

**Account Settings**:
- [ ] Change Password button
- [ ] Notification Settings button
- [ ] Logout button (red)

**Test Logout**:
1. Click Logout
2. Confirm alert
3. Redirected to /login
4. Token cleared from localStorage

---

## 🎯 Backend Integration Tests

### API Endpoints to Verify

**Authentication**:
```bash
POST /api/auth/register - Create account
POST /api/auth/login - User login
GET /api/auth/me - Get current user
PUT /api/auth/profile - Update profile
```

**Registration**:
```bash
POST /api/registrations - Create registration
GET /api/registrations/me - Get my registration
PUT /api/registrations/:id - Update registration
DELETE /api/registrations/:id - Cancel registration
```

**Tickets**:
```bash
POST /api/tickets/generate - Generate QR ticket
GET /api/tickets/me - Get my tickets
```

**Seats**:
```bash
GET /api/seats - Get availability
POST /api/seats/book - Book seat
GET /api/seats/my-bookings - Get my bookings
DELETE /api/seats/:id - Cancel booking
```

---

## 🐛 Common Issues & Fixes

### 1. "Network Error" on Login
**Cause**: Backend not running  
**Fix**: Start backend with `cd backend && npm run dev`

### 2. "401 Unauthorized"
**Cause**: Token expired or invalid  
**Fix**: Logout and login again

### 3. QR Code Not Showing
**Cause**: No registration created  
**Fix**: Complete registration first

### 4. "Registration already exists"
**Cause**: User already registered  
**Fix**: Use Edit instead of Create

### 5. Seat booking limit error
**Cause**: Already booked 2 guest seats  
**Fix**: Cancel existing bookings first

---

## ✅ Testing Checklist

### Student Flow (Happy Path)
- [ ] 1. Register new account
- [ ] 2. Login successfully
- [ ] 3. View dashboard
- [ ] 4. Create ceremony registration
- [ ] 5. Generate QR ticket
- [ ] 6. Book student seat
- [ ] 7. Book 2 guest seats
- [ ] 8. Update profile
- [ ] 9. Edit registration
- [ ] 10. Download ticket QR
- [ ] 11. Logout

### Error Handling
- [ ] Wrong login credentials
- [ ] Password mismatch on register
- [ ] Duplicate seat booking
- [ ] Guest limit exceeded
- [ ] Network errors display properly
- [ ] Form validation works

### UI/UX
- [ ] All buttons clickable
- [ ] Loading spinners show
- [ ] Success/error messages display
- [ ] Navigation works smoothly
- [ ] Responsive on mobile
- [ ] Dark mode toggle works
- [ ] Icons load correctly

---

## 📊 Test Data

### Pre-seeded Accounts
```
Student 1:
- Email: student1@greenwich.edu.vn
- Password: student123
- ID: GCS220001

Student 2:
- Email: student2@greenwich.edu.vn
- Password: student123
- ID: GCS220002

Admin:
- Email: admin@greenwich.edu.vn
- Password: admin123

Staff:
- Email: staff@greenwich.edu.vn
- Password: staff123
```

---

## 🚀 Next Features to Test
1. Staff QR Scanner
2. Admin Dashboard
3. Real-time Notifications
4. Chat System

---

**Last Updated**: 2026-01-29  
**Status**: ✅ Student Portal Complete & Ready for Testing
