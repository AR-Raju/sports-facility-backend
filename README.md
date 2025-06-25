# Sports Facility Booking Platform - Backend API

A comprehensive backend API for a Sports Facility Booking Platform built with Node.js, Express.js, MongoDB, and TypeScript. This system supports user and admin roles, facility management, booking system with availability checks, payment integration, and dashboards.

## 🚀 Features

- **User Authentication & Authorization** (JWT-based)
- **Role-based Access Control** (User/Admin)
- **Facility Management** (CRUD operations)
- **Booking System** with availability checks
- **Payment Integration** (SSLCommerz)
- **Image Upload** (Cloudinary)
- **Contact Form** management
- **Admin Dashboard** with statistics
- **User Dashboard** with booking history
- **Rate Limiting** for security
- **Input Validation** with Zod
- **Error Handling** middleware
- **CORS** enabled for frontend integration

## 🛠️ Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **File Upload**: Multer + Cloudinary
- **Payment Gateway**: SSLCommerz
- **Security**: Helmet, CORS, Rate Limiting
- **Language**: TypeScript

## 📁 Project Structure

\`\`\`
src/
├── app/
│   ├── builder/
│   │   └── QueryBuilder.ts
│   ├── config/
│   │   └── index.ts
│   ├── errors/
│   │   ├── AppError.ts
│   │   ├── handleCastError.ts
│   │   ├── handleDuplicateError.ts
│   │   ├── handleValidationError.ts
│   │   └── handleZodError.ts
│   ├── interface/
│   │   ├── error.ts
│   │   └── index.ts
│   ├── middlewares/
│   │   ├── auth.ts
│   │   ├── globalErrorHandler.ts
│   │   ├── notFound.ts
│   │   └── validateRequest.ts
│   ├── modules/
│   │   ├── Auth/
│   │   ├── user/
│   │   ├── facility/
│   │   ├── booking/
│   │   ├── contact/
│   │   ├── admin/
│   │   ├── upload/
│   │   └── payment/
│   ├── routes/
│   │   └── index.ts
│   └── utils/
│       ├── catchAsync.ts
│       ├── sendResponse.ts
│       └── utils.ts
├── app.ts
└── server.ts
\`\`\`

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Cloudinary account (for image uploads)
- SSLCommerz account (for payments)

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd sports-facility-booking-backend
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Create a `.env` file in the root directory:

\`\`\`env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://localhost:27017/sports-booking
BCRYPT_SALT_ROUNDS=12
DEFAULT_PASS=defaultpass123

# JWT Secrets
JWT_ACCESS_SECRET=your-jwt-access-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# SSLCommerz Configuration
SSL_STORE_ID=your-sslcommerz-store-id
SSL_STORE_PASS=your-sslcommerz-store-password
SSL_PAYMENT_URL=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
SSL_VALIDATION_URL=https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php

# Client URL
CLIENT_URL=http://localhost:3000
\`\`\`

### 4. Build and Run
\`\`\`bash
# Development
npm run dev

# Production
npm run build
npm start
\`\`\`

## 📚 API Documentation

### Base URL
\`\`\`
http://localhost:5000/api
\`\`\`

### Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## 🔐 Authentication Endpoints

### Register User
\`\`\`http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "address": "123 Main St, City"
}
\`\`\`

### Login
\`\`\`http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

### Get Current User
\`\`\`http
GET /api/auth/me
Authorization: Bearer <token>
\`\`\`

### Logout
\`\`\`http
POST /api/auth/logout
\`\`\`

### Register Admin (Admin Only)
\`\`\`http
POST /api/auth/admin/register
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "adminpass123",
  "phone": "1234567890",
  "address": "Admin Address"
}
\`\`\`

## 🏢 Facility Endpoints

### Get All Facilities (Public)
\`\`\`http
GET /api/facilities?page=1&limit=10&searchTerm=football&sort=name
\`\`\`

### Get Facility by ID (Public)
\`\`\`http
GET /api/facilities/:id
\`\`\`

### Create Facility (Admin Only)
\`\`\`http
POST /api/facilities
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Football Field A",
  "description": "Professional football field with grass surface",
  "pricePerHour": 50,
  "location": "Sports Complex, City Center",
  "image": "https://cloudinary-url/image.jpg"
}
\`\`\`

### Update Facility (Admin Only)
\`\`\`http
PUT /api/facilities/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Updated Football Field A",
  "pricePerHour": 60
}
\`\`\`

### Delete Facility (Admin Only)
\`\`\`http
DELETE /api/facilities/:id
Authorization: Bearer <admin-token>
\`\`\`

## 📅 Booking Endpoints

### Check Availability
\`\`\`http
GET /api/check-availability?date=2024-01-15&facility=facility-id
\`\`\`

### Create Booking (User Only)
\`\`\`http
POST /api/bookings
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "date": "2024-01-15",
  "startTime": "10:00",
  "endTime": "12:00",
  "facility": "facility-id"
}
\`\`\`

### Get All Bookings (Admin Only)
\`\`\`http
GET /api/bookings?page=1&limit=10&isBooked=confirmed
Authorization: Bearer <admin-token>
\`\`\`

### Cancel Booking (User Only)
\`\`\`http
DELETE /api/bookings/:id
Authorization: Bearer <user-token>
\`\`\`

## 👤 User Dashboard Endpoints

### Get User Bookings
\`\`\`http
GET /api/user/bookings?page=1&limit=10
Authorization: Bearer <user-token>
\`\`\`

### Cancel User Booking
\`\`\`http
DELETE /api/user/bookings/:id
Authorization: Bearer <user-token>
\`\`\`

## 👨‍💼 Admin Dashboard Endpoints

### Get Admin Statistics
\`\`\`http
GET /api/admin/stats
Authorization: Bearer <admin-token>
\`\`\`

### Get Dashboard Data
\`\`\`http
GET /api/admin/dashboard
Authorization: Bearer <admin-token>
\`\`\`

### Get All Users
\`\`\`http
GET /api/admin/users?page=1&limit=10
Authorization: Bearer <admin-token>
\`\`\`

### Get Admin Facilities
\`\`\`http
GET /api/admin/facilities?page=1&limit=10
Authorization: Bearer <admin-token>
\`\`\`

## 📞 Contact Endpoints

### Submit Contact Form (Public)
\`\`\`http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "subject": "Inquiry about booking",
  "message": "I would like to know more about your facilities."
}
\`\`\`

### Get All Contacts (Admin Only)
\`\`\`http
GET /api/contact?page=1&limit=10
Authorization: Bearer <admin-token>
\`\`\`

### Mark Contact as Read (Admin Only)
\`\`\`http
PATCH /api/contact/:id/read
Authorization: Bearer <admin-token>
\`\`\`

### Delete Contact (Admin Only)
\`\`\`http
DELETE /api/contact/:id
Authorization: Bearer <admin-token>
\`\`\`

## 📤 Upload Endpoints

### Upload Image (Admin Only)
\`\`\`http
POST /api/upload/image
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data

Form Data:
- image: [image file]
\`\`\`

## 💳 Payment Endpoints

### Initiate Payment (User Only)
\`\`\`http
POST /api/payment/initiate
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "bookingId": "booking-id",
  "amount": 100,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "1234567890",
  "customerAddress": "123 Main St"
}
\`\`\`

### Verify Payment
\`\`\`http
GET /api/payment/verify/:transactionId
\`\`\`

## 📊 Response Format

### Success Response
\`\`\`json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
\`\`\`

### Error Response
\`\`\`json
{
  "success": false,
  "message": "Error message",
  "errorSources": [
    {
      "path": "field_name",
      "message": "Field specific error message"
    }
  ],
  "stack": "Error stack trace (development only)"
}
\`\`\`

## 🔒 Security Features

- **JWT Authentication** with access tokens
- **Password Hashing** using bcrypt
- **Rate Limiting** (100 requests per 15 minutes, 10 booking requests per 15 minutes)
- **CORS** configuration
- **Helmet** for security headers
- **Input Validation** using Zod schemas
- **Role-based Access Control**

## 🚀 Deployment

### Using Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Using Other Platforms
1. Build the project: `npm run build`
2. Upload the `dist` folder and `package.json`
3. Set environment variables
4. Run: `npm start`

## 🧪 Testing

\`\`\`bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@sportsbooking.com or create an issue in the repository.

---

**Note**: This is a backend API only. You'll need to create a frontend application to interact with these endpoints.
