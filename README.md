# 🏨 Xplore - Accommodation Booking Platform

A full-stack web application built with **Node.js, Express, MongoDB, and EJS**. Xplore enables users to discover, list, and book accommodations seamlessly. Features secure authentication, real-time booking management, integrated payments with Stripe, and a responsive UI with Bootstrap.

---

## 🎯 Features

### 👤 User Management
- ✅ **User Authentication**: Secure signup/login with Passport.js (Local Strategy)
- ✅ **Password Management**: Forgot password & reset via email (Nodemailer)
- ✅ **Profile Management**: Edit profile, change password, upload profile picture
- ✅ **User Roles**: Guests (bookers) and Hosts (listers)

### 🏠 Listings Management
- ✅ **Browse Accommodations**: View all listings with pagination
- ✅ **Category Filtering**: Browse by Rooms, Beachfront, Pools, Castles, Boat House, Golfing, Iconic Cities, Palaces
- ✅ **Create Listings**: Hosts can create property listings with images via Cloudinary
- ✅ **Edit/Delete Listings**: Update or remove property listings
- ✅ **My Listings Dashboard**: View and manage your own listings

### 📅 Booking System
- ✅ **Date Selection**: Pick check-in and check-out dates with validation
- ✅ **Guest Count**: Select number of guests (1-5)
- ✅ **Price Calculation**: Dynamic pricing with tax calculations (10% tax)
- ✅ **Stripe Payment Integration**: Secure payment processing
- ✅ **Booking History**: View past and current bookings
- ✅ **Booking Cancellation**: Cancel bookings with status tracking

### ⭐ Reviews & Ratings
- ✅ **Add Reviews**: Leave ratings (1-5) and comments on booked properties
- ✅ **Delete Reviews**: Remove your own reviews
- ✅ **Review Management**: View all property reviews

### 🎨 UI/UX
- ✅ **Responsive Design**: Mobile, tablet, and desktop optimized
- ✅ **Flash Messages**: Success and error notifications
- ✅ **Modern Styling**: Bootstrap 5 + custom CSS
- ✅ **Tax Toggle**: Switch between base price and tax-inclusive pricing
- ✅ **Image Uploads**: Cloudinary CDN for fast image delivery

---

## 🛠️ Tech Stack

### **Backend**
| Technology | Purpose |
|-----------|---------|
| Node.js | JavaScript runtime |
| Express.js | Web framework |
| MongoDB | NoSQL database |
| Mongoose | ODM for MongoDB |
| Passport.js | Authentication strategy |
| Nodemailer | Email service (password reset) |
| Stripe API | Payment processing |
| Cloudinary | Image storage & CDN |
| Multer | File upload middleware |
| Joi | Schema validation |
| express-session | Session management |
| connect-mongo | MongoDB session store |
| dotenv | Environment variables |

### **Frontend**
| Technology | Purpose |
|-----------|---------|
| EJS | Template engine |
| Bootstrap 5 | CSS framework |
| Vanilla JavaScript | Client-side logic |
| CSS 3 | Custom styling |
| FontAwesome | Icons |

### **Infrastructure**
- MongoDB Atlas (Cloud Database)
- Cloudinary (Image Storage)
- Stripe (Payments)
- Nodemailer (Email)

---

## 📂 Project Structure

```
xplore/
├── config/                    # Configuration files
│   ├── cloudinary.js         # Cloudinary config
│   ├── multerListing.js      # Image upload config for listings
│   ├── multerProfilePic.js   # Image upload config for profiles
│   └── passport.js           # Passport authentication config
│
├── controllers/              # Business logic (MVC pattern)
│   ├── bookings.js          # Booking operations
│   ├── listings.js          # Listing CRUD operations
│   ├── profile.js           # Profile management
│   └── users.js             # User auth & registration
│
├── init/                    # Initialization scripts
│   ├── data.js             # Sample data
│   └── Seed.js             # Database seeding script
│
├── models/                 # Mongoose schemas
│   ├── listing.js          # Listing schema
│   ├── user.js             # User schema with passport integration
│   ├── booking.js          # Booking schema
│   └── review.js           # Review schema
│
├── routes/                 # API routes
│   ├── auth.js            # Authentication routes
│   ├── bookings.js        # Booking routes
│   ├── listings.js        # Listing routes
│   ├── profile.js         # Profile routes
│   └── users.js           # User routes (signup, login, etc.)
│
├── utils/                 # Utility functions
│   ├── wrapAsync.js       # Async error handler wrapper
│   ├── ExpressError.js    # Custom error class
│   └── mailer.js          # Email service setup
│
├── views/                 # EJS templates
│   ├── bookings/
│   │   ├── checkout.ejs        # Booking form with Stripe
│   │   ├── mybookings.ejs      # Booking history
│   │   ├── success.ejs         # Payment success page
│   │   └── cancel.ejs          # Payment cancel page
│   │
│   ├── listings/
│   │   ├── home.ejs           # Landing page
│   │   ├── index.ejs          # Listings grid with filters
│   │   ├── show.ejs           # Listing details + reviews
│   │   ├── new.ejs            # Create listing form
│   │   ├── edit.ejs           # Edit listing form
│   │   └── my-listings.ejs    # Host's listings dashboard
│   │
│   ├── users/
│   │   ├── login.ejs          # Login page
│   │   ├── signup.ejs         # Registration page
│   │   ├── forgot.ejs         # Forgot password
│   │   ├── reset.ejs          # Reset password form
│   │   ├── profile.ejs        # User profile
│   │   ├── edit.ejs           # Edit profile
│   │   ├── changePassword.ejs # Change password form
│   │   └── settings.ejs       # User settings
│   │
│   ├── includes/
│   │   ├── navbar.ejs         # Navigation bar
│   │   ├── footer.ejs         # Footer
│   │   └── flash.ejs          # Flash messages
│   │
│   ├── layouts/
│   │   └── boilerplate.ejs    # Main layout template
│   │
│   └── error.ejs              # Error page
│
├── public/                # Static assets
│   ├── css/              # Stylesheets
│   ├── images/           # Static images
│   └── uploads/          # User-uploaded files (fallback)
│
├── app.js               # Express app setup & entry point
├── middleware.js        # Custom middleware (auth, validation, etc.)
├── schema.js           # Joi validation schemas
├── package.json        # Dependencies
├── .env                # Environment variables (⚠️ NEVER commit)
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

---

## 🚀 Getting Started

### Prerequisites
```bash
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)
- Cloudinary account (free tier available)
- Stripe account (for payments)
- Gmail account (for Nodemailer setup)
```

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/sandeepdane4864/xplore.git
cd xplore
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Set Up Environment Variables
Create a `.env` file in the root directory and add:

```env
# Server
PORT=8080
NODE_ENV=development

# Database
ATLAS_URL=mongodb+srv://username:password@cluster.mongodb.net/xplore?retryWrites=true&w=majority

# Session & Security
SESSION_SECRET=your_super_secret_session_key_here

# Cloudinary (Image Upload)
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Email Service (Nodemailer - Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
# Note: Use Gmail App Password, not regular password. Generate at: https://myaccount.google.com/apppasswords

# Stripe (Payment Processing)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret



# Base URL (for email links, payment redirects)
BASE_URL=http://localhost:8080
```

Server runs on: **http://localhost:8080** 🎉

---

## 📝 API Routes & Endpoints

### **Authentication Routes** (`/auth`)
| Method | Route | Description | 
|--------|-------|-------------|
| GET | `/login` | Login page | 
| POST | `/login` | Authenticate user | 
| GET | `/signup` | Signup page | 
| POST | `/signup` | Register new user | 
| GET | `/logout` | Logout user | 

### **User Routes** (`/`)
| Method | Route | Description |  |
|--------|-------|-------------|------|
| GET | `/forgot-password` | Forgot password page | |
| POST | `/forgot-password` | Send reset email | |
| GET | `/reset-password/:token` | Reset password form |  |
| POST | `/reset-password/:token` | Update password |  |

### **Profile Routes** (`/profile`)
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/` | View profile | ✅ |
| GET | `/edit` | Edit profile page | ✅ |
| PUT | `/edit` | Update profile | ✅ |
| GET | `/change-password` | Change password page | ✅ |
| POST | `/change-password` | Update password | ✅ |

### **Listings Routes** (`/listings`)
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/` | View all listings (with pagination) |  |
| GET | `/?category=Rooms` | Filter by category |  |
| GET | `/new` | Create listing form | ✅ |
| POST | `/` | Create new listing | ✅ |
| GET | `/:id` | View listing details |  |
| GET | `/:id/edit` | Edit listing form | ✅ Owner |
| PUT | `/:id` | Update listing | ✅ Owner |
| DELETE | `/:id` | Delete listing | ✅ Owner |
| GET | `/:id/checkout` | Booking form (Stripe) | ✅ |
| POST | `/:id/reviews` | Add review | ✅ |
| DELETE | `/:id/reviews/:reviewId` | Delete review | ✅ Author |

### **Bookings Routes** (`/`)
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/my-bookings` | View booking history | ✅ |
| POST | `/create-checkout-session/:id` | Create Stripe session | ✅ |
| GET | `/booking-success` | Payment success page | ✅ |
| POST | `/cancel-booking/:id` | Cancel booking | ✅ |

---

## 🔐 Security Best Practices Implemented

✅ **Authentication**
- Passport.js Local Strategy with salted passwords
- Session-based authentication with MongoDB store
- Protected routes with `IsloggedIn` middleware

✅ **Authorization**
- `isOwner` middleware - only listing owners can edit/delete
- `isReviewAuthor` middleware - only review authors can delete
- Role-based access control

✅ **Data Validation**
- Joi schema validation on all user inputs
- Client-side HTML5 validation
- Server-side re-validation

✅ **Password Security**
- Passwords hashed with bcrypt (via Passport)
- Reset tokens expire after 30 minutes
- Forgot password via email verification

✅ **Session Security**
- HTTPOnly cookies (prevents XSS attacks)
- Secure session store in MongoDB
- Session auto-expires after 24 hours

✅ **File Upload Security**
- Only allowed formats: JPG, PNG, JPEG
- Cloudinary CDN (no local file storage vulnerability)
- Multer middleware validates uploads