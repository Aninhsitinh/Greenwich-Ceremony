# Stitch Ceremony Registration - Frontend

Vue.js 3 frontend application for the FPT Greenwich Graduation Ceremony Management System.

## Features

- ✅ **Modern UI** with Tailwind CSS
- ✅ **Vue Router** with route guards
- ✅ **Pinia** state management
- ✅ **Axios** API integration
- ✅ **Role-based** navigation (Student, Staff, Admin, MC)
- ✅ **Responsive** design
- ✅ **Dark mode** support

## Project Structure

```
frontend/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css         # Global styles + Tailwind
│   ├── components/              # Reusable components
│   ├── views/                   # Page components
│   │   ├── auth/               # Login, Register, Forgot Password
│   │   ├── student/            # Student pages
│   │   ├── staff/              # Staff pages
│   │   └── admin/              # Admin pages
│   ├── router/                  # Vue Router config
│   ├── stores/                  # Pinia stores
│   ├── services/               # API services
│   ├── App.vue                 # Root component
│   └── main.js                 # App entry point
├── .env                        # Environment variables
├── tailwind.config.js          # Tailwind configuration
├── vite.config.js              # Vite configuration
└── package.json                # Dependencies
```

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## Pages Implemented

### Student Portal
- ✅ Dashboard with countdown timer
- ✅ Ceremony Registration form
- ✅ E-Ticket with QR code
- 🚧 Seat Booking
- 🚧 Profile Management

### Staff Portal
- 🚧 QR Code Scanner
- 🚧 Dashboard

### Admin Portal
- 🚧 Student Management
- 🚧 Registration Management
- 🚧 Dashboard

### Authentication
- ✅ Login Page
- 🚧 Register Page
- 🚧 Forgot Password

## Development

### Start Backend First
```bash
cd ../backend
npm run dev
```

### Then Start Frontend
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`  
Backend API runs on `http://localhost:5000`

## Default Test Accounts

See backend README for test account credentials.

## Tech Stack

- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Fast build tool
- **Vue Router** - Official router
- **Pinia** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

## API Integration

All API calls go through the centralized `services/api.js` which handles:
- Token injection
- Error handling
- 401 redirect to login

Example usage:
```javascript
import api from '@/services/api';

const response = await api.get('/registrations/me');
const data = await api.post('/tickets/generate', { ticketType: 'student' });
```

## Route Protection

Routes are protected based on authentication and roles:

```javascript
{
  path: '/student',
  meta: { requiresAuth: true, role: 'student' }
}
```

## State Management

Using Pinia for centralized state:

```javascript
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
authStore.login({ email, password });
authStore.logout();
```

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit for review

## License

© 2026 FPT Greenwich. All rights reserved.
