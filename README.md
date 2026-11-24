# 🎓 Student Placement Management System (SPMS)

[![React](https://img.shields.io/badge/Frontend-React%2018-blue?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20Express-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Mongoose-brightgreen?logo=mongodb)](https://www.mongodb.com/)
[![Bootstrap](https://img.shields.io/badge/UI-Bootstrap%205-purple?logo=bootstrap)](https://getbootstrap.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A centralized, professional, full-stack campus recruitment platform connecting **College Placement Administrators**, **Students**, and **Corporate Recruiters**. The application streamlines student registration, resume uploads, job listings with eligibility verification, application tracking, and placement drive scheduling.

---

## 📌 Table of Contents
- [Project Overview](#-project-overview)
- [Main Objectives](#-main-objectives)
- [System Architecture & Role Modules](#-system-architecture--role-modules)
  - [1. College Admin Module](#1-college-admin-module)
  - [2. Student Module](#2-student-module)
  - [3. Recruiter Module](#3-recruiter-module)
- [Technology Stack](#-technology-stack)
- [Project Folder Structure](#-project-folder-structure)
- [Database Schema Design](#-database-schema-design)
- [REST API Endpoints](#-rest-api-endpoints)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Deployment Guide (Vercel & Render)](#-deployment-guide-vercel--render)
- [Screenshots & UI Progression](#-screenshots--ui-progression)
- [Author & Acknowledgments](#-author--acknowledgments)

---

## 📖 Project Overview

Campus placements in universities typically involve hundreds of students, dozens of recruiting companies, and multi-round interviews. Manual spreadsheets and emails often lead to missed deadlines, unverified candidate credentials, and lost applications.

The **Student Placement Management System (SPMS)** is an end-to-end web platform designed to digitize campus recruitment workflows:
- Eliminates duplicate applications through database constraints.
- Automates candidate eligibility checks against job requirements (minimum CGPA, 10th/12th percentages, active backlogs, and allowed degree programs).
- Provides real-time application status updates with full audit trails.
- Delivers an administrative control tower with placement analytics (overall placement rate, average CTC package, and top hiring partners).

---

## 🎯 Main Objectives

1. **Centralize Placement Operations**: Unify students, recruiters, and placement officers into a single coordinated platform.
2. **Automated Eligibility Filtering**: Prevent ineligible candidates from applying, saving recruiter screening time.
3. **Transparent Recruitment Tracking**: Give students real-time feedback and status history for each application.
4. **Data-Driven Administration**: Provide placement officers with actionable statistics and exportable records.
5. **Security & Role-Based Access**: Protect student academic data, enforce JWT authorization, and ensure recruiters only access applications submitted to their own company.

---

## 👥 System Architecture & Role Modules

### 1. College Admin Module
- **Placement Dashboard**: Overview of total enrolled students, placed vs. unplaced counts, placement rate %, partner companies, active jobs, highest package, and average package.
- **Student Directory**: Add, view, edit, search, filter (by department, CGPA, batch), and delete student accounts. Direct access to student PDF resumes.
- **Company Management**: Maintain verified corporate partner profiles, website links, and recruiter account associations.
- **Job Opportunity Oversight**: Monitor active campus postings and review requirements.
- **Application Tracker**: View all campus-wide applications and update selection statuses across interview rounds.
- **Placement Drive Scheduling**: Announce on-campus, virtual, and pool-campus placement drives with date, venue, and eligible degree batches.

### 2. Student Module
- **Registration & Authentication**: Student signup with automatic academic profile initialization.
- **Academic Profile Management**: Maintain academic records (10th %, 12th %, graduation CGPA, backlogs), technical skills, LinkedIn, and GitHub links.
- **Resume Upload**: Upload and update PDF or Word resumes with server-side file type and 5MB size validation.
- **Job Search & Filtering**: Search active vacancies by job title, company, role category (*Full Time*, *Internship*), and minimum package.
- **Automated Eligibility Engine**: The system checks student CGPA and backlogs against job requirements before allowing submission.
- **One-Click Application**: Apply with an optional cover note. Compound index on `{ job: 1, student: 1 }` strictly prevents duplicate applications.
- **Real-Time Application History**: Track progress through stages (*Applied* → *Shortlisted* → *Interviewing* → *Selected* / *Rejected*) with recruiter remarks.

### 3. Recruiter Module
- **Company Profile Management**: Customize company description, industry type, headquarters, and contact coordinates.
- **Job Management**: Create, edit, and delete job postings with customizable academic criteria (min CGPA, max backlogs, allowed degrees).
- **Candidate Screening**: Browse applicants for specific jobs, view student profiles, and download submitted PDF resumes.
- **Hiring Pipeline Actions**: Move candidates through recruitment stages (*Shortlist*, *Hire*, *Reject*) with notes.
- **Strict Tenant Isolation**: Recruiters are restricted from viewing or altering applications submitted to other companies.

---

## 💻 Technology Stack

### Frontend
- **React.js 18** (Vite build engine)
- **Bootstrap 5.3 & Bootstrap Icons** (Clean, responsive university theme)
- **React Router DOM v6** (Client-side routing with role-based route guards)
- **Axios** (HTTP client with request/response JWT interceptors)
- **HTML5 & CSS3** (Custom typography and styled components)

### Backend
- **Node.js** (Runtime environment)
- **Express.js** (REST API framework)
- **JSON Web Tokens (JWT)** (Stateless authorization with expiration)
- **bcrypt.js** (Password hashing with 10 salt rounds)
- **Multer** (Secure file upload handling with mimetype filters)
- **CORS & Dotenv** (Origin policy and environment variable isolation)

### Database
- **MongoDB** (NoSQL document store)
- **Mongoose ODM** (Schema models, validation rules, relational population, and compound indexes)

---

## 📂 Project Folder Structure

```
Student-Placement-Management-System/
├── backend/
│   ├── config/
│   │   └── db.js                 # Strict MongoDB connection configuration
│   ├── controllers/
│   │   ├── analyticsController.js# Placement metrics & aggregations
│   │   ├── applicationController.js# Applications, duplicate check & recruiter guards
│   │   ├── authController.js     # User registration, login & JWT generation
│   │   ├── companyController.js  # Company profile & directory CRUD
│   │   ├── driveController.js    # Placement drive scheduling
│   │   ├── jobController.js      # Job postings & eligibility verification
│   │   └── studentController.js  # Student directory, profile & resume upload
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT token verification & role authorization
│   │   ├── errorMiddleware.js    # Centralized API error handler
│   │   └── uploadMiddleware.js   # Multer file validation (PDF, docx, 5MB limit)
│   ├── models/
│   │   ├── Application.js        # Relational schema with compound unique index
│   │   ├── Company.js            # Company schema linked to recruiter
│   │   ├── Job.js                # Job criteria and requirements schema
│   │   ├── PlacementDrive.js     # Drive schedule schema
│   │   ├── Student.js            # Student academic details & skills schema
│   │   └── User.js               # User auth schema with hashed passwords
│   ├── routes/                   # Modular Express route definitions
│   ├── uploads/resumes/          # Uploaded student resume documents
│   ├── .env.example              # Backend environment template
│   ├── package.json              # Backend dependencies & npm scripts
│   ├── render.yaml               # Render Cloud deployment blueprint
│   ├── seed.js                   # Realistic demo database seeder
│   ├── server.js                 # Main server entrypoint
│   └── testRunner.js             # Self-contained 16-point automated test suite
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx        # App footer with quick links
│   │   │   ├── Navbar.jsx        # Navigation header with role badges
│   │   │   ├── ProtectedRoute.jsx# Client-side route protection
│   │   │   └── Sidebar.jsx       # Sidebar navigation for dashboards
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global authentication state provider
│   │   ├── pages/
│   │   │   ├── admin/            # AdminDashboard, StudentManagement, etc.
│   │   │   ├── recruiter/        # RecruiterDashboard, ManageJobs, Applicants
│   │   │   ├── student/          # StudentDashboard, StudentProfile, MyApplications
│   │   │   ├── About.jsx         # Project overview page
│   │   │   ├── Contact.jsx       # T&P Cell contact desk
│   │   │   ├── Home.jsx          # Public landing page with live metrics
│   │   │   ├── JobDetails.jsx    # Job description & one-click application
│   │   │   ├── Jobs.jsx          # Searchable, filterable job directory
│   │   │   ├── Login.jsx         # Login page with demo autofill buttons
│   │   │   ├── PlacementDrives.jsx# Drive schedules & venues
│   │   │   └── Register.jsx      # Student and Recruiter registration
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT bearer interceptors
│   │   ├── App.jsx               # Route mapping
│   │   ├── index.css             # Theme stylesheet
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json              # Frontend dependencies & build scripts
│   ├── vercel.json               # SPA routing rewrite configuration for Vercel
│   └── vite.config.js
├── .gitignore                    # Excludes .env, node_modules, and uploads
└── README.md
```

---

## 🗄️ Database Schema Design

The MongoDB database consists of 6 interconnected Mongoose collections:

```
[User] (Authentication: name, email, password, role)
   │
   ├─► [Student] (RollNo, Course, CGPA, Backlogs, Skills, ResumeUrl, PlacedStatus)
   │      │
   │      └─► [Application] ◄─── [Job] (Title, Package, MinCGPA, MaxBacklogs)
   │             (Status, Notes)    │
   └─► [Company] ───────────────────┘
         (Name, Industry, RecruiterID)
```

1. **Users**: Core credentials, role (`admin`, `student`, `recruiter`), contact number, and account status.
2. **Students**: 1-to-1 link with User. Academic percentages, CGPA, backlog counts, skills array, resume document URL, and placement status.
3. **Companies**: Linked to Recruiter User. Organization details, industry, office location, logo, and website.
4. **Jobs**: Linked to Company and posted by Recruiter. Package (LPA), openings, required skills, deadline, and eligibility rules (min CGPA, max backlogs, allowed branches).
5. **Applications**: Relational document linking Student, Job, and Company. Enforces `{ job: 1, student: 1 }` compound unique index to prevent duplicate submissions. Contains `statusHistory` array with stage updates and recruiter comments.
6. **PlacementDrives**: Campus drive schedules with dates, venues, drive types (*On-Campus*, *Virtual*, *Pool-Campus*), and eligible branches.

---

## 🔌 REST API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new Student or Recruiter account (Admin registration blocked) |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials and return JWT |
| `GET` | `/api/auth/me` | Private | Retrieve logged-in user profile and role details |
| `PUT` | `/api/auth/updatedetails`| Private | Update name or contact phone |

### Students (`/api/students`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/students/profile` | Student | Fetch logged-in student's full academic profile |
| `PUT` | `/api/students/profile` | Student | Update academic marks, skills, and portfolio links |
| `POST` | `/api/students/resume` | Student | Upload resume PDF via `multipart/form-data` |
| `GET` | `/api/students` | Admin / Recruiter | List all students with search and filter parameters |
| `POST` | `/api/students` | Admin | Direct creation of student records |
| `PUT` | `/api/students/:id` | Admin | Update student information or placement status |
| `DELETE`| `/api/students/:id` | Admin | Remove student record and linked user account |

### Jobs (`/api/jobs`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Public | List active jobs with search, category, and package filters |
| `GET` | `/api/jobs/:id` | Public / Student | Job details with automated eligibility evaluation for students |
| `GET` | `/api/jobs/recruiter/my`| Recruiter | List all jobs posted by the recruiter with applicant counts |
| `POST` | `/api/jobs` | Recruiter / Admin | Create a new job vacancy with criteria |
| `PUT` | `/api/jobs/:id` | Recruiter / Admin | Edit job posting |
| `DELETE`| `/api/jobs/:id` | Recruiter / Admin | Delete job posting and associated applications |

### Applications (`/api/applications`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/applications/apply/:jobId` | Student | Submit job application (with duplicate check) |
| `GET` | `/api/applications/my` | Student | Retrieve student's application history |
| `GET` | `/api/applications/recruiter` | Recruiter | Retrieve applications for recruiter's company |
| `GET` | `/api/applications` | Admin | Global application oversight |
| `PUT` | `/api/applications/:id/status` | Recruiter / Admin | Update application status (*Shortlisted*, *Interviewing*, *Selected*, *Rejected*) |

### Placement Drives (`/api/drives`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/drives` | Public | View upcoming and ongoing placement drives |
| `POST` | `/api/drives` | Admin / Recruiter | Schedule a new placement drive |
| `PUT` | `/api/drives/:id` | Admin | Update drive details |
| `DELETE`| `/api/drives/:id` | Admin | Cancel placement drive |

### Analytics (`/api/analytics`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics/admin` | Admin | Placement rate %, salary statistics, student counts |
| `GET` | `/api/analytics/recruiter` | Recruiter | Company hiring metrics (applicants, shortlisted, hired) |
| `GET` | `/api/analytics/student` | Student | Personal application status metrics |

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** running locally on port `27017` or a **MongoDB Atlas** cluster URI
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Sourabhpw/Student-Placement-Management-System.git
cd Student-Placement-Management-System
```

### 2. Backend Installation
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/placement_portal
JWT_SECRET=your_strong_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

*(Optional)* Seed demo data (users, companies, jobs, drives):
```bash
node seed.js
```

### 3. Frontend Installation
In a separate terminal:
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Running the Project

### Start Backend API Server
```powershell
cd backend
npm start
# Server starts on http://localhost:5000
```

### Start Frontend Client
```powershell
cd frontend
npm run dev
# React Vite application runs on http://localhost:3000
```

Open **`http://localhost:3000`** in your browser.

---

## 🔑 Demo Login Accounts

On the **Login page** (`http://localhost:3000/login`), quick buttons are available to auto-fill these demo credentials:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@college.edu` | `Admin@123` | Full administrative control |
| **Recruiter** | `recruiter@infosys.com` | `Recruiter@123` | Post jobs & screen applicants |
| **Student (Placed)** | `sourabh@student.edu` | `Student@123` | View profile & offer details |
| **Student (Unplaced)** | `aakash@student.edu` | `Student@123` | Browse jobs & submit applications |

---

## 🧪 Testing & Quality Assurance

A comprehensive, self-contained automated integration test suite is included in `backend/testRunner.js`.

To execute the test suite:
```powershell
cd backend
npm test
```

### Verification Results:
```
======================================================
 STARTING FULL AUTOMATED SYSTEM & API TEST SUITE
======================================================
  ✓ PASS: API Health Check & Database Connectivity
  ✓ PASS: Security: Block Public User Registration as Admin
  ✓ PASS: Authentication: Admin Login & JWT Issuance
  ✓ PASS: Authentication: Student Login & Role Verification
  ✓ PASS: Authentication: Recruiter 1 Login
  ✓ PASS: Authentication: Recruiter 2 Login (Cross-Company Verification)
  ✓ PASS: Student CRUD: Read and Update Academic Profile
  ✓ PASS: Student Resume Upload: PDF Upload & Type Filter
  ✓ PASS: Admin Student CRUD: Create and Manage Student Records
  ✓ PASS: Company CRUD: Create and Fetch Company Profile
  ✓ PASS: Jobs CRUD: Recruiter Create Job Posting with Cutoff Criteria
  ✓ PASS: Applications: Student Submit Job Application
  ✓ PASS: Security: Prevent Duplicate Job Application (Compound Index)
  ✓ PASS: Authorization: Recruiter Cannot Alter Other Company Applications
  ✓ PASS: Authorization: Legitimate Company Recruiter Can Update Application Status
  ✓ PASS: Admin Analytics: Calculation of Metrics & Aggregations
======================================================
 ALL 16 AUTOMATED TESTS EXECUTED AND PASSED
======================================================
```

### Frontend Production Build Test:
```powershell
cd frontend
npm run build
# Verified: 121 modules transformed, compiled into dist/ with zero errors
```

---

## ☁️ Deployment Guide (MongoDB Atlas, Render & Vercel)

### Step 1: Create MongoDB Atlas Database
1. Sign up / Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new free **M0 Shared Cluster**.
3. Under **Security > Database Access**:
   - Create a database user with read/write privileges (e.g. username: `placement_user`, and a strong password).
4. Under **Security > Network Access**:
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere, required for Render).
5. Click **Connect > Drivers (Node.js)**:
   - Copy your connection string (format: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/placement_portal?retryWrites=true&w=majority`).

### Step 2: Deploy Backend Web Service to Render
1. Log in to [Render](https://render.com/).
2. Click **New + > Web Service** and select your GitHub repository (`Student-Placement-Management-System`).
3. Set service settings:
   - **Name**: `student-placement-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `JWT_SECRET`: `<generate-a-strong-random-key>`
   - `JWT_EXPIRE`: `7d`
   - `MONGODB_URI`: `<your-mongodb-atlas-connection-string>`
   - `CLIENT_URL`: `https://your-frontend.vercel.app` (Add after deploying frontend, or use temporary placeholder)
5. Click **Create Web Service**. Once deployed, copy your Render URL:
   `https://student-placement-backend.onrender.com`

### Step 3: Deploy Frontend to Vercel
1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New > Project** and import `Student-Placement-Management-System`.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://student-placement-backend.onrender.com/api`
5. Click **Deploy**. Vercel will build the React application and deploy it with SPA client-side routing.
6. Once deployed, copy your Vercel URL (e.g. `https://your-project.vercel.app`) and update the `CLIENT_URL` variable in Render.

---

## 📸 Screenshots & UI

- **Public Home Page**: Hero section with live placement statistics, featured job cards, and drive announcements.
- **Student Dashboard**: Application progress cards (*Active Jobs*, *Applied*, *Shortlisted*, *Offers*), placement status banner, and drive calendar.
- **Profile & Resume Upload**: Academic inputs (10th %, 12th %, CGPA, backlogs), skills badges, and PDF resume upload.
- **Recruiter Dashboard**: Job posting manager, cutoff criteria configuration, and candidate screening table with resume download links.
- **Admin Control Tower**: Placement percentage metrics, department breakdowns, student directory CRUD, and global application management.

---

## 👨‍💻 Author & Acknowledgments

- **Developer**: Sourabh ([@Sourabhpw](https://github.com/Sourabhpw))
- **Program**: Master of Computer Applications (MCA)
- **Project**: Full-Stack Student Placement Management System
- **Repository**: [https://github.com/Sourabhpw/Student-Placement-Management-System](https://github.com/Sourabhpw/Student-Placement-Management-System)

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
