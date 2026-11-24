# 🎓 Student Placement Management System (SPMS)

A full-stack, responsive, and role-based web application connecting **College Administrators**, **Students**, and **Corporate Recruiters** for university campus placements.

Developed with **React.js**, **Node.js**, **Express.js**, **MongoDB**, **Bootstrap 5**, and **JWT Authentication**.

---

## 📌 Project Overview

The **Student Placement Management System** automates the entire campus recruitment cycle:
- **College Administrators**: Manage student records, company approvals, job vacancies, placement drive schedules, and view real-time placement statistics (placement rate, highest & average packages).
- **Students**: Build academic profiles, upload PDF resumes, search and filter job openings, check automated eligibility criteria, submit job applications (with duplicate prevention), and track application status history.
- **Corporate Recruiters**: Manage company profiles, post job vacancies with dynamic academic cutoffs, review student applicants and download resumes, update hiring stages (*Applied* → *Shortlisted* → *Interviewing* → *Selected* / *Rejected*), and add notes.

---

## 🚀 Technology Stack

### Frontend
- **React.js 18** (Vite build tool)
- **Bootstrap 5 & Bootstrap Icons** (Modern, clean UI)
- **React Router DOM v6** (Role-protected routing)
- **Axios** (API requests with automatic JWT interceptors)
- **HTML5 & CSS3** (Custom blue & white university theme)

### Backend
- **Node.js** (v26+ compatible runtime)
- **Express.js** (REST API architecture)
- **JSON Web Tokens (JWT)** (Secure stateless authentication)
- **bcrypt.js** (Password hashing)
- **Multer** (Resume uploads with file type & size limits)
- **CORS & Dotenv** (Environment isolation)

### Database
- **MongoDB** & **Mongoose ODM**
- Schema relations, data validation, and compound indexes (preventing duplicate applications)

---

## 📂 Project Structure

```
StudentPlacementManagement/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection (supports Atlas & Local)
│   ├── controllers/
│   │   ├── analyticsController.js# Dashboard statistics APIs
│   │   ├── applicationController.js# Job application management APIs
│   │   ├── authController.js     # User registration & login APIs
│   │   ├── companyController.js  # Company CRUD APIs
│   │   ├── driveController.js    # Placement drive scheduling APIs
│   │   ├── jobController.js      # Job posting and eligibility APIs
│   │   └── studentController.js  # Student profile & directory APIs
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & role authorization
│   │   ├── errorMiddleware.js    # Global error handling
│   │   └── uploadMiddleware.js   # Multer PDF resume upload filter
│   ├── models/
│   │   ├── Application.js        # Application schema with status history
│   │   ├── Company.js            # Company & Recruiter schema
│   │   ├── Job.js                # Job postings & criteria schema
│   │   ├── PlacementDrive.js     # Campus recruitment drive schema
│   │   ├── Student.js            # Academic details & skills schema
│   │   └── User.js               # User authentication schema
│   ├── routes/                   # Express route definitions
│   ├── uploads/resumes/          # PDF resume storage folder
│   ├── .env.example              # Backend environment template
│   ├── package.json
│   ├── render.yaml               # Render cloud deployment blueprint
│   ├── seed.js                   # Realistic demo database seeder
│   ├── server.js                 # Main server entrypoint
│   └── testRunner.js             # Automated API integration test suite
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx        # App footer
│   │   │   ├── Navbar.jsx        # Navigation bar with role badges
│   │   │   ├── ProtectedRoute.jsx# Role-based route guard
│   │   │   └── Sidebar.jsx       # Responsive dashboard sidebar
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global authentication state
│   │   ├── pages/
│   │   │   ├── admin/            # Admin dashboard, students, companies, apps
│   │   │   ├── recruiter/        # Recruiter dashboard, job manager, applicants
│   │   │   ├── student/          # Student dashboard, profile, applications
│   │   │   ├── About.jsx         # About the system
│   │   │   ├── Contact.jsx       # T&P Cell contact page
│   │   │   ├── Home.jsx          # Public landing page with stats
│   │   │   ├── JobDetails.jsx    # Detailed job view & one-click apply
│   │   │   ├── Jobs.jsx          # Searchable, filterable job list
│   │   │   ├── Login.jsx         # Sign in with instant demo fill buttons
│   │   │   ├── PlacementDrives.jsx# Upcoming drive schedules
│   │   │   └── Register.jsx      # Student & Recruiter registration
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT interceptor
│   │   ├── App.jsx               # Routes setup
│   │   ├── index.css             # Theme stylesheet
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vercel.json               # Vercel SPA routing rewrite config
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## 🔑 Demo Login Credentials

The system includes pre-configured realistic accounts. On the **Login Page**, you can click any role button to automatically fill credentials:

| Role | Email Address | Password | Features Accessible |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@college.edu` | `Admin@123` | Full student directory, companies, drives, analytics |
| **Recruiter** | `recruiter@infosys.com` | `Recruiter@123` | Post jobs, screen applicants, shortlist, hire candidates |
| **Student (Placed)** | `sourabh@student.edu` | `Student@123` | Profile, uploaded resume, application history |
| **Student (Unplaced)**| `aakash@student.edu` | `Student@123` | Browse jobs, check eligibility, apply for positions |

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, OR a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI.

### 1. Clone or Open the Repository
```bash
cd "D:\Student Placement Management"
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Configure your environment file `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/placement_portal
JWT_SECRET=placement_super_secret_jwt_key_2026_dev_prod
JWT_EXPIRE=7d
NODE_ENV=development
```

Seed the database with demo users, companies, jobs, drives, and applications:
```bash
node seed.js
```

Start the backend API server:
```bash
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
```

Configure `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

---

## 🧪 Automated Testing

An automated integration test runner is included at `backend/testRunner.js`.

To execute the test suite:
```bash
cd backend
node runTests.js
```

### Verification Checklist:
- [x] API Health Check endpoint (`/api/health`)
- [x] Admin authentication & JWT token generation
- [x] Student authentication and role validation
- [x] Recruiter authentication
- [x] Admin placement analytics aggregation
- [x] Job search and role-category filtering
- [x] Recruiter job posting creation
- [x] Duplicate application prevention validation
- [x] Student job application submission
- [x] Placement drive listing and retrieval
- [x] PDF resume upload validation (type & size constraints)

---

## ☁️ Deployment Instructions

### Backend Deployment (Render)
1. Push your repository to **GitHub**.
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New + Web Service**.
3. Connect your GitHub repository.
4. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `JWT_SECRET`: `<your_random_secret_string>`
   - `JWT_EXPIRE`: `7d`
   - `MONGODB_URI`: `<your_mongodb_atlas_connection_string>`
6. Deploy the service and copy the provided public URL (e.g., `https://your-backend.onrender.com`).

### Frontend Deployment (Vercel)
1. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
2. Select your GitHub repository.
3. Set:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://your-backend.onrender.com/api`
5. Click **Deploy**. Vercel will automatically build the React application with SPA routing handled by `frontend/vercel.json`.

---

## 🛡️ Security Features
- **Password Protection**: Passwords securely hashed using `bcrypt.js` with 10 salt rounds.
- **Stateless Authorization**: JWT issued with expiration; verified via custom middleware.
- **Role-Based Access Control (RBAC)**: Strict server-side route guards ensuring students cannot modify jobs, recruiters can only manage their own company, and admin privileges remain protected.
- **Upload Security**: PDF/Doc format verification with a 5MB size limit to prevent arbitrary file upload vulnerabilities.
- **Duplicate Prevention**: Mongoose compound index on `{ job: 1, student: 1 }` prevents duplicate job submissions.

---

## 📄 License
This project is open-source and built for academic and learning purposes.
