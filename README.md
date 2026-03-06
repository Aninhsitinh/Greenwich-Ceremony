# 🎓 Stitch Ceremony Registration System

> **A premium, full-stack graduation ceremony management system** built for FPT Greenwich University. 🚀

[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Vue 3](https://img.shields.io/badge/Frontend-Vue%203-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Express](https://img.shields.io/badge/Backend-Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-010101?logo=socketdotio&logoColor=white)](https://socket.io/)

---

## 🌟 Overview

Stitch là một hệ thống quản lý lễ tốt nghiệp hiện đại, tự động hóa toàn bộ quy trình từ đăng ký, chọn trang phục, đặt chỗ cho phụ huynh đến việc check-in và gọi tên sinh viên trên sân khấu trong thời gian thực.

## 👥 Portals & Features

### 🎓 Student Portal
- **Smart Registration** - Xác nhận tham gia lễ tốt nghiệp và chọn size áo cử nhân.
- **E-Ticket & QR Styling** - Tạo vé điện tử với mã QR có thể tùy chỉnh màu sắc, hình dạng và logo.
- **Interactive Seat Booking** - Đặt tối đa 3 ghế cho khách mời với bản đồ chỗ ngồi trực quan.
- **Support Chat** - Chat trực tiếp với nhân viên hỗ trợ thông qua Socket.io.
- **Journey Tracking** - Thanh trạng thái theo dõi lộ trình 5 bước tốt nghiệp.
- **Payments** - Quản lý và xem lịch sử thanh toán các gói dịch vụ.

### 🏢 Staff Portal
- **High-speed QR Scanner** - Quét mã QR check-in sinh viên và khách mời ngay tại cổng.
- **Real-time Student List** - Quản lý danh sách sinh viên, trạng thái nhận áo và check-in.
- **Support Chat Archive** - Trả lời thắc mắc của sinh viên trong thời gian thực.
- **Seat Management** - Điều phối chỗ ngồi và xử lý các tình huống phát sinh.

### 🎤 MC Console
- **Live Ceremony Feed** - Theo dõi danh sách sinh viên đã check-in và sẵn sàng lên sân khấu.
- **Procession Control** - Điều khiển luồng gọi tên sinh viên lên bục nhận bằng.
- **Real-time Synchronization** - Đồng bộ dữ liệu tức thì giữa Staff (quét QR) và MC.

### 🖥️ Admin Portal
- **Full System Configuration** - Cài đặt ngày lễ, địa điểm, thời hạn đăng ký.
- **User & Role Management** - Quản lý tài khoản Student, Staff, MC.
- **Broadcast Notifications** - Gửi thông báo đẩy đến toàn bộ người dùng.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vue 3 (Composition API), Pinia, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | **PostgreSQL** with **Prisma ORM** |
| **Real-time** | **Socket.io** (Chat, Live Sync) |
| **i18n** | **vue-i18n** (Full support for English & Vietnamese) |
| **Security** | JWT, bcrypt, Helmet, Express Rate Limit |

---

## 🚀 Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL (Running locally or via Docker)
- mkcert (For local HTTPS development)

### 2. Clone & Install
```bash
git clone https://github.com/Aninhsitinh/Greenwich-Ceremony.git
cd stitch_ceremony_registration

# Install dependencies for both
cd backend && npm install
cd ../frontend && npm install
```

### 3. Database Setup (Prisma)
Configure your `.env` in the `backend` folder:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/stitch_ceremony?schema=public"
```
Then run:
```bash
npx prisma db push
npx prisma generate
npm run seed
```

### 4. Running the Project
**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🎨 UI/UX Features
- **Premium Design**: Glassmorphism, smooth animations, và typography hiện đại.
- **Multi-language**: Chuyển đổi linh hoạt giữa Tiếng Anh và Tiếng Việt.
- **Responsive Layout**: Tối ưu hóa hoàn hảo cho Mobile (iPhone 14 Pro Max chuẩn) và Desktop.
- **PWA Ready**: Có thể cài đặt như một ứng dụng trên điện thoại.

## 📂 Project Structure
```
├── backend/
│   ├── prisma/             # Database schema
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API endpoints
│   │   └── socket/         # Real-time event handlers
├── frontend/
│   ├── src/
│   │   ├── views/          # Portal pages (Student, Staff, MC, Admin)
│   │   ├── components/     # UI design system
│   │   └── i18n/           # Translation files
```

---

Made with ❤️ for **FPT Greenwich Graduation 2026**
