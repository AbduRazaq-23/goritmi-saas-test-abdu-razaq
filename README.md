🚀 Goritmi Dev – MERN SaaS Platform

A modern full-stack MERN SaaS application featuring:

Fully animated Landing Page

JWT-based Authentication System

Protected Dashboard with analytics & charts

Role-based access control (Admin/User)

Modern UI with Tailwind CSS + Framer Motion + Recharts

# =====================================

✨ Features
🌐 Landing Page

Responsive Navbar

Hero Section

Features Section

Pricing

Testimonials

FAQ Accordion

Contact Form

Footer

Smooth animations using Framer Motion

# ===========================================

🔐 Authentication

Register & Login (JWT)

Secure password hashing (bcrypt)

Store token via cookie

Context API for global auth state

Protected routes

Logout

# =========================================

📊 Dashboard

Sidebar (collapsible)

Topbar with Name & avatar(name first letter)

Analytics cards

Recharts line & bar charts

Profile page (update name/email/password)

Admin-only area:

Get All Users

Delete User

# ===========================================

🔧 Backend (Node.js + Express)

JWT Authentication

Mongoose User Model

Auth Controller

Email Verification using resend

Protected Routes (verifyUser)

Admin Middleware

Validation Middleware (Joi)

# ==========================================

🛠 Tech Stack
Frontend

React.js

Tailwind CSS

Framer Motion

Recharts

React Router DOM

Axios

Backend

Node.js

Express.js

MongoDB + Mongoose

bcrypt

JWT (jsonwebtoken)

Cookie Parser

Validation Middleware

cors

dotenv

# ======================================

📦 Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/AbduRazaq-23/goritmi-saas-test-abdu-razaq.git

cd goritmi-saas-test-abdu-razaq

=====================================

2️⃣ Backend Setup

Install dependencies:

cd goritmi-backend

npm install

=====================================

PORT=5000

MONGOOSE_URI=your_mongo_connection_string

JWT_SECRET=yourJWTsecret

JWT_EXPIRE=7d

CLIENT_URL=http://localhost:5173

====================================

Run backend in dev mode:

npm run dev

Your backend runs at: http://localhost:5000

# ====================================

3️⃣ Frontend Setup

Install dependencies:

cd goritmi-frontend

npm install

Start frontend:

npm run dev

Frontend runs at: http://localhost:5173

# ==========================================

📁 Project Folder Structure

# ==========================================

🔐 Authentication API Documentation

▶ Base URL http://localhost:5000/api/auth

Endpoints Summary

Method-------Endpoint--------------Auth----Admin----Description

POST---------/register--------------❌-----❌------Register user

POST---------/login-----------------❌-----❌------Login user

GET----------/get-profile-----------✔------❌------Logged-in profile

POST---------/logout----------------✔------❌------Logout

PATCH--------/update-profile--------✔ -----❌-------Update name/email

PATCH--------/update-password-------✔------❌------Update password

GET----------/get-all-users---------✔------✔-------Admin: get all users

DELETE-------/delete-user/:id-------✔------✔-------Admin: delete user

👉 Full API Reference above.

==========================================================================

==========================================================================

🪟 Screenshots

=========================================================================

=========================================================================

🚀 Deployment Guide

Frontend Deployment: Vercel

==============================================================================
🧾 Goritmi – MERN Stack Task

Auth with Email OTP + Invoice & Payment Management

A full-stack MERN application implementing secure email OTP authentication and an admin/user invoice management system with audit logs and summaries.

🚀 Tech Stack

Frontend

React.js

Axios

React Router

Tailwind CSS (optional)

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Bcrypt

Nodemailer

Express Rate Limit

📌 Features Overview
🔐 Authentication (OTP via Email)

User registration with email verification

Secure login with OTP gating for unverified users

OTP rules:

6 digits

Expires in 10 minutes

Max 5 attempts

Resend OTP rate-limited

OTP is hashed (never stored in plain text)

JWT authentication using HTTP-only cookies

🧾 Invoice & Payment Management
👨‍💼 Admin

Create invoices for users

Update invoice status:

DUE

PAID

CANCELLED

Automatic invoice number generation
(INV-2025-0001)

Status change audit logs

Dashboard summary:

Total Receivable

Total Received

Total Cancelled

Invoice list with:

Search (invoice number / user email)

Filter by status

Pagination

👤 User

View own invoices only

View invoice details

Cannot modify invoices

🧩 Project Structure
backend/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── app.js
└── server.js

frontend/
├── pages/
├── components/
├── services/
└── store/

🔐 Authentication Flow (OTP)
📝 Registration

User registers with name, email, password

User saved with isEmailVerified = false

OTP generated and emailed

User verifies OTP

Account marked verified

JWT issued

🔑 Login

User logs in with email + password

If email not verified:

OTP sent

Login blocked

OTP verified → JWT issued

🧠 Security Decisions

Passwords hashed using bcrypt

OTPs hashed using bcrypt

OTP expiry & attempt limits enforced

JWT stored in HTTP-only cookies

Role-based access (adminOnly)

Rate limiting on OTP resend endpoints

Request validation on backend

📊 Invoice Status Rules
From To Allowed
DUE PAID ✅
DUE CANCELLED ✅
PAID ANY ❌
CANCELLED ANY ❌

All status changes are recorded in an audit log.

📦 API Endpoints
🔐 Auth
POST /api/auth/register
POST /api/auth/login
POST /api/auth/otp/verify
POST /api/auth/otp/resend
POST /api/auth/logout

👨‍💼 Admin
POST /api/admin/invoices
PATCH /api/admin/invoices/:id/status
GET /api/admin/invoices
GET /api/admin/invoices/summary

👤 User
GET /api/user/invoices
GET /api/user/invoices/:id

⚙️ Environment Variables

Create a .env file in backend/:

PORT=5000
MONGO_URI=mongodb://localhost:27017/goritmi
JWT_SECRET=your_jwt_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

⚠️ Do not commit .env

🛠️ Installation & Run
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm start

🧪 Test Credentials (Demo)
Admin
Email: admin@goritmi.com
Password: Admin@123
Role: admin

User
Email: user@goritmi.com
Password: User@123
Role: user

(OTP will be sent to email during login/register)

📸 Demo Evidence

OTP email screenshots

Admin dashboard (invoice list & summary)

Invoice creation form

User invoice list & detail page

(Screenshots / short demo video attached)

✅ Acceptance Criteria Checklist
OTP

OTP sent on registration

OTP expires in 10 minutes

OTP hashed in DB

Max attempts enforced

Resend OTP rate-limited

Unverified users blocked

Invoices

Admin creates invoice

Status updates enforced

Status change logs exist

User sees own invoices only

Summary totals accurate

Filters, search, pagination work

👨‍💻 Author

Abdu Razaq
MERN Stack Developer
📍 Peshawar, Pakistan
