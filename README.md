# 🎓 FPT Greenwich Ceremony Registration System (Stitch)

> **"A Premium Graduation Experience, Orchestrated in Real-Time."**

Stitch là một giải pháp quản lý lễ tốt nghiệp toàn diện (SaaS-ready), được thiết kế để nâng tầm trải nghiệm của sinh viên và tối ưu hóa quy trình tổ chức của nhà trường. Hệ thống kết hợp sức mạnh của **Vue 3**, **NodeJS**, **PostgreSQL** và **Socket.io** để tạo ra một hệ sinh thái đồng bộ từ lúc đăng ký đến khi cầm bằng trên sân khấu.

---

## 📑 Mục lục
- [🌟 Điểm nổi bật](#-điểm-nổi-bật)
- [🧩 Các Module Chức năng](#-các-module-chức-năng)
- [🏗️ Kiến trúc Hệ thống](#️-kiến-trúc-hệ-thống)
- [🛠️ Công nghệ Sử dụng](#️-công-nghệ-sử-dụng)
- [🚀 Hướng dẫn Cài đặt](#-hướng-dẫn-cài-đặt)
- [📱 Giao diện & Trải nghiệm](#-giao-diện--trải-nghiệm)
- [🔐 Bảo mật & Hiệu năng](#-bảo-mật--hiệu-năng)
- [🤝 Đóng góp](#-đóng-góp)

---

## 🌟 Điểm nổi bật

*   **Real-time Synchronization**: Đồng bộ tức thì giữa cổng quét QR của Staff và màn hình điều khiển của MC.
*   **Dynamic i18n**: Hỗ trợ đa ngôn ngữ (Anh/Việt) hoàn chỉnh với khả năng chuyển đổi không cần load lại trang.
*   **Customizable E-Ticket**: Hệ thống sinh vé QR động cho phép tùy chỉnh màu sắc, logo và kiểu dáng.
*   **Responsive Excellence**: Thiết kế di động linh hoạt (PWA-ready), lấy trải nghiệm trên iPhone 14 Pro Max làm chuẩn.
*   **Smart Automation**: Tự động hóa quy trình đặt chỗ, thuê áo và thanh toán.

---

## 🧩 Các Module Chức năng

### 🎓 1. Student Portal (Hành trình sinh viên)
Hệ thống dẫn dắt sinh viên qua 5 bước quan trọng:
1.  **Attendance Registration**: Xác nhận tham gia và cung cấp thông tin cần thiết.
2.  **E-Ticket Design**: Tự tay cá nhân hóa vé tốt nghiệp của mình.
3.  **Guest Seat Booking**: Đặt chỗ ngồi cho người thân (với phân loại ghế VIP/Thường).
4.  **Gown Collection**: Đặt lịch nhận/trả áo cử nhân chuyên nghiệp.
5.  **Payment Integration**: Thanh toán và theo dõi hóa đơn trực tuyến.
*   *Tính năng thêm:* Chat hỗ trợ trực tiếp với Staff, nhận thông báo đẩy (Internal Notifications).

### 🏢 2. Staff Portal (Điều hành & Hỗ trợ)
*   **Vận hành Ngày lễ:** Công cụ quét mã QR tốc độ cao, xác thực vé và đăng ký check-in thực tế.
*   **Quản lý Áo:** Theo dõi trạng thái đặt cọc, lấy áo và trả áo.
*   **Support Desk:** Hệ thống Chat tập trung quản lý tất cả các yêu cầu từ sinh viên.
*   **Datalist:** Danh sách sinh viên thời gian thực với bộ lọc đa năng.

### 🎤 3. MC Console (Điều phối Sân khấu)
*   **Live Attendance Feed:** Theo dõi danh sách sinh viên đã qua cửa check-in.
*   **Ceremony Control:** Điều phối luồng sinh viên lên sân khấu, đánh dấu trạng thái "đang trên bục" hoặc "đã nhận bằng".
*   **Broadcast:** Gửi thông báo khẩn cấp đến toàn bộ hệ thống.

### 🍱 4. Admin Portal (Quản trị Hệ thống)
*   **Global Settings:** Cấu hình thời gian, địa điểm, hạn chót và dung lượng hội trường.
*   **Account Management:** Quản lý hàng ngàn tài khoản sinh viên và phân quyền Staff/MC.
*   **Dashboard & Analytics:** Thống kê trực quan về tỷ lệ tham gia và tình trạng tài chính.

---

## 🏗️ Kiến trúc Hệ thống

```mermaid
graph TD
    User((User Roles)) -->|Vue 3| Frontend[Frontend - Vite/Tailwind]
    Frontend -->|HTTPS/WS| API[API Gateway - Node Express]
    API -->|JWT/Guard| Controllers[Logic Controllers]
    Controllers -->|Prisma| DB[(PostgreSQL Database)]
    API -->|Socket.io| Realtime[Realtime Events - MC/Staff/Chat]
```

---

## 🛠️ Công nghệ Sử dụng

### **Frontend**
- **Framework:** Vue 3 (Composition API)
- **State:** Pinia (Store management)
- **Style:** Tailwind CSS (Modern Utility-first)
- **Icons:** Google Material Symbols
- **Tools:** Vite, Vue-Router, Socket.io-client, QR-Code-Styling

### **Backend**
- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **ORM:** Prisma (Modern PostgreSQL interface)
- **Real-time:** Socket.io
- **Auth:** JWT (JSON Web Tokens) & Bcrypt
- **Security:** Helmet, CORS, Express-Rate-Limit
- **Storage:** Cloudinary Integration (Photos/Avatars)

---

## 🚀 Hướng dẫn Cài đặt

### **1. Clone dự án**
```bash
git clone https://github.com/Aninhsitinh/Greenwich-Ceremony.git
```

### **2. Cấu hình Backend**
Vào thư mục `backend`, tạo file `.env`:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/stitch_ceremony"
JWT_SECRET="your_secret_key"
FRONTEND_URL="http://localhost:5173"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```
Cài đặt & Chạy:
```bash
npm install
npx prisma db push
npx prisma generate
npm run seed
npm run dev
```

### **3. Cấu hình Frontend**
Vào thư mục `frontend`, tạo file `.env`:
```env
VITE_API_URL="http://localhost:5000/api"
VITE_SOCKET_URL="http://localhost:5000"
```
Cài đặt & Chạy:
```bash
npm install
npm run dev
```

---

## 📱 Giao diện & Trải nghiệm
- **Glassmorphism:** Sử dụng hiệu ứng kính mờ cho các card và sidebar, tạo cảm giác cao cấp.
- **Dynamic Themes:** Hỗ trợ Dark Mode hoàn chỉnh, bảo vệ mắt người dùng.
- **Micro-animations:** Các hiệu ứng chuyển cảnh mượt mà từ `transition-group` của Vue.
- **PWA Ready:** Tích hợp manifest để cài đặt làm ứng dụng gốc trên màn hình chính.

---

## 🔐 Bảo mật & Hiệu năng
*   **Security First:** Toàn bộ Header được bảo vệ bởi Helmet, Rate limit tránh tấn công Brute-force.
*   **Database optimization:** PostgreSQL với các Index được cấu hình sẵn trong Prisma schema giúp truy vấn cực nhanh ngay cả với hàng vạn record.
*   **Offline Support:** Sử dụng LocalStorage để cache trạng thái auth và các thiết lập ưu tiên.

---

## 🤵 Tác giả
**Phan Công Duy Khương**
- 🎓 *Greenwich University Vietnam*
- 📧 Email: duykhuongpc@gmail.com
- 🎨 Design & Full-stack Architecture

---

## 📝 License
Dự án được phân phối dưới giấy phép **MIT**. 

---
*Made with ❤️ for FPT Greenwich Graduation Ceremony 2026*
