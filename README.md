# ⚙️ GearGuard – Equipment Maintenance Management Platform 

GearGuard is a modern, scalable SaaS platform designed to streamline equipment maintenance, tracking, and preventive servicing.  

---

## 🚀 Overview

GearGuard helps organizations:

- Track equipment health and lifecycle
- Manage maintenance requests efficiently
- Schedule preventive maintenance
- Monitor task progress visually using dashboards

The frontend focuses on clean UI/UX, responsiveness, and scalability for real-world usage.

---

## ✨ Key Features

- **Dashboard Overview**  
  High-level insights into equipment status and maintenance activity

- **Kanban Board**  
  Visual task and request management with a drag-ready layout

- **Calendar View**  
  Preventive maintenance scheduling and clear task visibility

- **Equipment Management**  
  Centralized equipment tracking with filtering and status management

- **Maintenance Requests**  
  Request tracking with priority, status, and updates

- **Modern UI/UX**  
  Clean layout, smooth animations, and responsive design

---

## 🛠 Tech Stack

### Frontend
- **React 18** – UI framework
- **Vite** – Build tool and development server
- **Tailwind CSS** – Utility-first CSS framework
- **Framer Motion** – Animations and transitions
- **React Router** – Client-side routing
- **Lucide React** – Icon library
- **date-fns** – Date utilities

### Backend
- **Node.js** – JavaScript runtime
- **Express.js** – Backend framework for APIs

### Database
- **MongoDB** – NoSQL database
- **MongoDB Atlas** – Cloud-hosted MongoDB service

---

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm

---

### Installation

```bash
cd frontend
npm install
```
##Development
```
npm run dev
```
## The application will be available at:
```
http://localhost:3000
```
## 📁 Project Folder Structure

```text
GearGuard/
├── backend/
│   ├── config/
│   │   └── db.js                # MongoDB connection setup
│   ├── controllers/
│   │   ├── equipment.controller.js
│   │   ├── request.controller.js
│   │   └── user.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js   # Authentication & authorization
│   │   └── error.middleware.js  # Global error handling
│   ├── models/
│   │   ├── Equipment.js
│   │   ├── Request.js
│   │   └── User.js
│   ├── routes/
│   │   ├── equipment.routes.js
│   │   ├── request.routes.js
│   │   └── user.routes.js
│   ├── scripts/
│   │   └── seed.js
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── assets/
│   │       └── heroImg.png
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
│
└── README.md
