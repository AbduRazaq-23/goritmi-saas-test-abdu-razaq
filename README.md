🚀 Goritmi Dev – MERN SaaS Platform

A modern full-stack MERN SaaS application featuring:

Fully animated Landing Page

JWT-based Authentication System

Protected Dashboard with analytics & charts

Role-based access control (Admin/User)

Modern UI with Tailwind CSS + Framer Motion + Recharts

This project is built for production-grade learning and SaaS boilerplate development.

=====================================
=====================================


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

===========================================
===========================================


🔐 Authentication

Register & Login (JWT)

Secure password hashing (bcrypt)

Store token via cookie 

Context API for global auth state

Protected routes

Logout

=========================================
=========================================


📊 Dashboard

Sidebar (collapsible)

Topbar with Name & avatar(name first letter)

Analytics cards

Recharts line & bar charts

Profile page (update name/email/password)

Admin-only area:

Get All Users

Delete User


===========================================
===========================================


🔧 Backend (Node.js + Express)

JWT Authentication

Mongoose User Model

Auth Controller

Protected Routes (verifyUser)

Admin Middleware

Validation Middleware (Joi)


==========================================
==========================================


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


======================================
======================================

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



====================================
====================================

3️⃣ Frontend Setup

Install dependencies:

cd goritmi-frontend

npm install

Start frontend:

npm run dev

Frontend runs at: http://localhost:5173


==========================================
==========================================


📁 Project Folder Structure


==========================================
==========================================

🔐 Authentication API Documentation

▶ Base URL http://localhost:5000/api/auth

Endpoints Summary

Method	     Endpoint	             Auth	  Admin	  Description

POST	       /register	           ❌	     ❌	    Register user

POST	       /login	               ❌	     ❌   	Login user

GET	         /get-profile	         ✔	     ❌	    Logged-in profile

POST	       /logout	             ✔	     ❌	    Logout

PATCH	      /update-profile	       ✔	     ❌	    Update name/email

PATCH	      /update-password	     ✔	     ❌	    Update password

GET	        /get-all-users	       ✔	     ✔	    Admin: get all users

DELETE	    /delete-user/:id	     ✔	     ✔	Admin: delete user

👉 Full API Reference already generated above.


==========================================================================

==========================================================================

🪟 Screenshots

Add your app screenshots inside /screenshots folder.

=========================================================================

=========================================================================

🚀 Deployment Guide

Frontend Deployment: Vercel






