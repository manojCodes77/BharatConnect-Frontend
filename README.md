# BharatConnect - Professional Networking Platform

<div align="center">
<img src="./public/favicon.png" alt="Description" width="100"/>

![BharatConnect](https://img.shields.io/badge/BharatConnect-Rise%20Together-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)

**A modern, fully-responsive professional networking platform built for India's creators, builders, and dreamers.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Project Structure](#-project-structure)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**BharatConnect** is a LinkedIn-inspired professional networking platform tailored for the Indian community. It enables users to share their professional journey, connect with like-minded individuals, and build meaningful relationships in a community that celebrates progress.

### Why BharatConnect?

- 🇮🇳 **Built for India** - Crafted specifically for Indian creators, builders, and professionals
- ✨ **Modern UI/UX** - Beautiful, intuitive interface with smooth animations
- 📱 **Fully Responsive** - Seamless experience across all devices (mobile, tablet, desktop)
- 🚀 **Real-time Features** - Instant updates, likes, comments, and shares
- 🎨 **Custom Design** - Unique orange-themed design language

---

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration** with email and password
- **Secure Login** with JWT-based authentication
- **Password Hashing** using bcryptjs
- **Protected Routes** for authenticated users only
- **Persistent Sessions** with localStorage

### 📝 Post Management
- **Create Posts** with title and content
- **Edit Posts** - Update your stories anytime
- **Delete Posts** - Remove your posts
- **View Single Post** - Dedicated page for each post
- **Infinite Scroll** - Seamless loading of more posts
- **Post Interactions:**
  - ❤️ Like/Unlike posts
  - 💬 Comment on posts with @mentions
  - 🔗 Share posts (copy link)
  - 🔖 Save posts for later

### 👤 User Profile
- **Profile Page** with user statistics
- **View Your Posts** - See all your published stories
- **Profile Stats** - Track stories, connections, and profile views
- **Edit Profile** (UI ready)

### 🎨 UI/UX Features
- **Responsive Design** - Works perfectly on all screen sizes
- **Mobile Navigation** - Hamburger menu for mobile devices
- **Smooth Animations** - Engaging transitions and hover effects
- **Loading States** - Clear feedback during data fetching
- **Error Handling** - User-friendly error messages
- **Form Validation** - Real-time input validation
- **Password Strength Indicator** - Visual feedback for password security
- **Empty States** - Meaningful messages when no content is available

### 🌐 Additional Features
- **Trending Topics** - See what's popular
- **Community Spotlight** - Featured builders and events
- **Quick Actions** - Easy access to common tasks
- **Footer Links** - About, Privacy, Terms, Support
- **Success Messages** - Confirmation for actions

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | UI library for building user interfaces |
| **Redux Toolkit** | 2.10.1 | State management |
| **React Router** | 7.9.5 | Client-side routing |
| **Tailwind CSS** | 4.1.17 | Utility-first CSS framework |
| **Vite** | 7.1.7 | Build tool and dev server |
| **Axios** | 1.13.2 | HTTP client for API calls |
| **React Icons** | 5.5.0 | Icon library |

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | - | JavaScript runtime |
| **Express** | 4.21.2 | Web application framework |
| **TypeScript** | 5.8.3 | Type-safe JavaScript |
| **MongoDB** | 8.19.3 | NoSQL database |
| **Mongoose** | 8.19.3 | MongoDB object modeling |
| **JWT** | 9.0.2 | Authentication tokens |
| **Bcryptjs** | 3.0.3 | Password hashing |
| **CORS** | 2.8.5 | Cross-origin resource sharing |

### **Development Tools**
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Tsup** - TypeScript bundler
- **Git** - Version control

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/manojCodes77/BharatConnect-Frontend.git
cd 22-linkedin-clone
```

### Step 2: Install Dependencies

#### Install Client Dependencies
```bash
cd client
npm install
```

#### Install Server Dependencies
```bash
cd ../server
npm install
```

### Step 3: Environment Configuration

#### Client Environment Setup
Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:8080/api/v1/v1
```

#### Server Environment Setup
Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/bharatconnect
# OR use MongoDB Atlas
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bharatconnect

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

⚠️ **Important:** Change `JWT_SECRET` to a strong, unique secret in production!

### Step 4: Database Setup

If using **local MongoDB**:
```bash
# Start MongoDB service
mongod
```

If using **MongoDB Atlas**:
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `MONGO_URI` in server `.env`

### Step 5: Seed Database (Optional)

```bash
cd server
npm run seed
```

This will populate your database with sample users and posts.

---

## 🚀 Usage

### Development Mode

#### Start Backend Server
```bash
cd server
npm run dev
```
Server will run on `http://localhost:8080`

#### Start Frontend Development Server
```bash
cd client
npm run dev
```
Client will run on `http://localhost:5173`

### Production Build

#### Build Backend
```bash
cd server
npm run build
npm start
```

#### Build Frontend
```bash
cd client
npm run build
npm run preview
```

### Running Both Simultaneously

You can run both frontend and backend in parallel:

**Terminal 1:**
```bash
cd server && npm run dev
```

**Terminal 2:**
```bash
cd client && npm run dev
```

---

## 📁 Project Structure

```
22-linkedin-clone/
│
├── client/                          # Frontend React Application
│   ├── public/                      # Static assets
│   │   └── favicon.png             # App icon
│   │
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   │   ├── CreatePost.jsx      # Post creation form
│   │   │   ├── Layout.jsx          # Main layout wrapper
│   │   │   ├── Loading.jsx         # Loading spinner
│   │   │   ├── Navbar.jsx          # Navigation bar
│   │   │   ├── PostCard.jsx        # Post display component
│   │   │   └── ProtectedRoute.jsx  # Auth guard
│   │   │
│   │   ├── pages/                  # Page components
│   │   │   ├── Home.jsx            # Main feed
│   │   │   ├── Profile.jsx         # User profile
│   │   │   ├── SignIn.jsx          # Login page
│   │   │   ├── SignUp.jsx          # Registration page
│   │   │   └── SinglePost.jsx      # Individual post view
│   │   │
│   │   ├── store/                  # Redux state management
│   │   │   ├── authSlice.js        # Authentication state
│   │   │   ├── postsSlice.js       # Posts state
│   │   │   └── store.js            # Redux store config
│   │   │
│   │   ├── utils/                  # Utility functions
│   │   │   └── api.js              # API service layer
│   │   │
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # App entry point
│   │   └── index.css               # Global styles
│   │
│   ├── .env                        # Environment variables
│   ├── package.json                # Dependencies
│   ├── vite.config.js              # Vite configuration
│   └── tailwind.config.js          # Tailwind configuration
│
├── server/                          # Backend Node.js Application
│   ├── src/
│   │   ├── config/                 # Configuration files
│   │   │   └── db.ts               # Database connection
│   │   │
│   │   ├── controllers/            # Route controllers
│   │   │   ├── post-controller.ts  # Post logic
│   │   │   └── user-controller.ts  # User logic
│   │   │
│   │   ├── middlewares/            # Express middlewares
│   │   │   └── auth.ts             # JWT verification
│   │   │
│   │   ├── models/                 # Mongoose schemas
│   │   │   ├── post-model.ts       # Post schema
│   │   │   └── user-model.ts       # User schema
│   │   │
│   │   ├── routes/                 # API routes
│   │   │   ├── post-route.ts       # Post endpoints
│   │   │   └── user-route.ts       # User endpoints
│   │   │
│   │   ├── seed/                   # Database seeders
│   │   │   ├── seedPosts.ts        # Sample posts
│   │   │   └── seedUsers.ts        # Sample users
│   │   │
│   │   ├── utils/                  # Utility functions
│   │   │   └── HashPassword.ts     # Password hashing
│   │   │
│   │   └── index.ts                # Server entry point
│   │
│   ├── .env                        # Environment variables
│   ├── package.json                # Dependencies
│   └── tsconfig.json               # TypeScript config
│
└── README.md                        # This file
```

---

## 🔌 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/users/signup` | Register new user | ❌ |
| POST | `/api/v1/users/signin` | Login user | ❌ |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users/profile` | Get user profile | ✅ |

### Post Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/posts` | Get all posts (with pagination) | ❌ |
| GET | `/api/v1/posts/:id` | Get single post | ❌ |
| GET | `/api/v1/posts/my` | Get user's posts | ✅ |
| POST | `/api/v1/posts` | Create new post | ✅ |
| PUT | `/api/v1/posts/:id` | Update post | ✅ |
| DELETE | `/api/v1/posts/:id` | Delete post | ✅ |
| POST | `/api/v1/posts/:id/like` | Like/unlike post | ✅ |
| POST | `/api/v1/posts/:id/comment` | Add comment | ✅ |
| POST | `/api/v1/posts/:id/share` | Share post | ✅ |
| POST | `/api/v1/posts/:id/save` | Save post | ✅ |

### Request Examples

#### Sign Up
```javascript
POST /api/v1/users/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Create Post
```javascript
POST /api/v1/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Post",
  "content": "This is my story about building in public..."
}
```

#### Like Post
```javascript
POST /api/v1/posts/:postId/like
Authorization: Bearer <token>
```

---

## 🎨 Design Features

### Color Scheme
- **Primary:** Orange (#FF6B2C - #D94A00)
- **Background:** White with subtle gradients
- **Text:** Black with varying opacity
- **Accents:** Emerald for status indicators

### Typography
- **Headings:** Bold, extrabold weights
- **Body:** Medium, semibold weights
- **Special:** Uppercase with letter spacing for labels

### Responsive Breakpoints
- **Mobile:** < 640px (sm)
- **Tablet:** 640px - 1024px (md, lg)
- **Desktop:** > 1024px (xl, 2xl)

---

## 🔒 Security Features

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - bcryptjs with salt rounds
- ✅ **Protected Routes** - Client and server-side protection
- ✅ **CORS Protection** - Configured for specific origins
- ✅ **Input Validation** - Server-side validation
- ✅ **XSS Protection** - React's built-in protection
- ✅ **SQL Injection Prevention** - MongoDB parameterized queries

---

## 🧪 Testing

### Manual Testing
1. Start both servers
2. Open browser at `http://localhost:5173`
3. Test user registration
4. Test login
5. Test creating, editing, deleting posts
6. Test post interactions (like, comment, share, save)

### Test Accounts (after seeding)
```
Email: builder@bharatconnect.com
Password: jaihind
```

---

## 🚧 Future Enhancements

- [ ] Real-time notifications
- [ ] Direct messaging
- [ ] File uploads (images, videos)
- [ ] Advanced search and filters
- [ ] User connections/network
- [ ] Email verification
- [ ] Password reset
- [ ] Social media login (Google, LinkedIn)
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Manoj Singh Rawat**
- GitHub: [@manojCodes77](https://github.com/manojCodes77)

---

## 🙏 Acknowledgments

- Design inspiration from LinkedIn
- Built with ❤️ for the Indian developer community
- Special thanks to all contributors

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with 💙 in India 🇮🇳

</div>
