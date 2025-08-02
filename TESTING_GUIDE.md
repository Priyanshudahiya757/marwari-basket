# 🧪 Marwari Basket - Testing Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Database Setup

#### Option A: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `server/.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/marwari-basket
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

#### Option B: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Update `server/.env`:
```env
MONGO_URI=mongodb://localhost:27017/marwari-basket
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 2. Start the Application

```bash
# Terminal 1: Start Backend
cd server
npm install
npm run dev

# Terminal 2: Start Frontend
cd client
npm install
npm run dev
```

### 3. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 🧪 Testing Checklist

### ✅ User Authentication
- [ ] User Registration
- [ ] User Login
- [ ] Password Reset
- [ ] JWT Token Management
- [ ] Protected Routes

### ✅ User Profile Management
- [ ] View Profile
- [ ] Update Profile Information
- [ ] Change Password
- [ ] Address Management (Add/Edit/Delete)

### ✅ Product Management
- [ ] Browse Products
- [ ] Product Search
- [ ] Product Categories
- [ ] Product Details
- [ ] Product Images

### ✅ Shopping Cart
- [ ] Add to Cart
- [ ] Remove from Cart
- [ ] Update Quantities
- [ ] Cart Persistence

### ✅ Checkout Process
- [ ] Multi-step Checkout
- [ ] Address Selection
- [ ] Payment Method Selection
- [ ] Order Confirmation
- [ ] Guest Checkout

### ✅ Order Management
- [ ] Order History
- [ ] Order Details
- [ ] Order Status Tracking
- [ ] Cancel Orders
- [ ] Request Returns

### ✅ Admin Panel
- [ ] Admin Login
- [ ] Dashboard Overview
- [ ] Order Management
- [ ] Product Management
- [ ] Customer Management
- [ ] Analytics

## 🔧 API Testing

### Authentication Endpoints
```bash
# Register User
POST http://localhost:5000/api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "9876543210",
  "password": "password123"
}

# Login User
POST http://localhost:5000/api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}

# Forgot Password
POST http://localhost:5000/api/auth/forgot-password
{
  "email": "test@example.com"
}
```

### User Profile Endpoints
```bash
# Get Profile (requires auth)
GET http://localhost:5000/api/users/profile
Authorization: Bearer <token>

# Update Profile (requires auth)
PUT http://localhost:5000/api/users/profile
Authorization: Bearer <token>
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "phone": "9876543210"
}

# Change Password (requires auth)
PUT http://localhost:5000/api/users/change-password
Authorization: Bearer <token>
{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

### Address Management
```bash
# Get Addresses (requires auth)
GET http://localhost:5000/api/users/addresses
Authorization: Bearer <token>

# Add Address (requires auth)
POST http://localhost:5000/api/users/addresses
Authorization: Bearer <token>
{
  "name": "Home",
  "phone": "9876543210",
  "address": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001"
}
```

### Order Endpoints
```bash
# Get My Orders (requires auth)
GET http://localhost:5000/api/orders/my-orders
Authorization: Bearer <token>

# Get Order Details (requires auth)
GET http://localhost:5000/api/orders/:orderId
Authorization: Bearer <token>

# Place Order (requires auth)
POST http://localhost:5000/api/orders/checkout
Authorization: Bearer <token>
{
  "items": [
    {
      "product": "productId",
      "quantity": 2,
      "price": 1000
    }
  ],
  "shippingAddress": {
    "name": "Test User",
    "phone": "9876543210",
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "payment": {
    "method": "cod"
  },
  "totalAmount": 2000
}
```

## 🎯 Frontend Testing

### 1. User Registration Flow
1. Navigate to http://localhost:5173
2. Click "Login" → "Sign Up"
3. Fill in registration form
4. Verify email confirmation
5. Test login with new account

### 2. Product Browsing
1. Browse products on homepage
2. Use search functionality
3. Filter by categories
4. View product details
5. Add products to cart

### 3. Shopping Cart
1. Add multiple products to cart
2. Update quantities
3. Remove items
4. Verify cart persistence
5. Proceed to checkout

### 4. Checkout Process
1. Complete multi-step checkout
2. Add shipping address
3. Select payment method
4. Place order
5. Verify order confirmation

### 5. Order Management
1. View order history
2. Check order details
3. Track order status
4. Cancel pending orders
5. Request returns for delivered orders

### 6. Profile Management
1. Update personal information
2. Change password
3. Manage addresses
4. View order history
5. Test logout functionality

## 🛠️ Admin Testing

### 1. Admin Access
1. Login with admin credentials
2. Access admin dashboard
3. Verify admin-only routes

### 2. Order Management
1. View all orders
2. Update order status
3. Process returns/refunds
4. Generate reports

### 3. Product Management
1. Add new products
2. Edit existing products
3. Upload product images
4. Manage inventory

### 4. Customer Management
1. View customer list
2. Check customer details
3. View order history
4. Add communication logs

## 🐛 Common Issues & Solutions

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :5000  # Windows
lsof -i :5000  # macOS/Linux

# Kill process
taskkill /PID <process_id>  # Windows
kill -9 <process_id>  # macOS/Linux
```

### JWT Token Issues
- Check JWT_SECRET in .env file
- Verify token expiration
- Clear browser localStorage

### CORS Issues
- Verify backend CORS configuration
- Check API base URL in frontend
- Ensure proper headers

## 📊 Performance Testing

### Load Testing
```bash
# Install Artillery
npm install -g artillery

# Run load test
artillery quick --count 100 --num 10 http://localhost:5000/api/products
```

### Database Performance
- Monitor MongoDB query performance
- Check indexes on frequently queried fields
- Optimize aggregation pipelines

## 🔒 Security Testing

### Authentication
- Test JWT token validation
- Verify password hashing
- Check rate limiting
- Test session management

### Authorization
- Verify admin-only routes
- Test user role permissions
- Check API endpoint protection

### Input Validation
- Test SQL injection prevention
- Verify XSS protection
- Check file upload security

## 📝 Test Data

### Sample Products
```json
{
  "name": "Traditional Rajasthani Dress",
  "description": "Beautiful handcrafted dress",
  "price": 2500,
  "category": "Clothing",
  "images": ["dress1.jpg", "dress2.jpg"],
  "stock": 50
}
```

### Sample Users
```json
{
  "name": "Admin User",
  "email": "admin@marwaribasket.com",
  "phone": "9876543210",
  "password": "admin123",
  "role": "admin"
}
```

## 🎉 Success Criteria

### Functional Requirements
- [ ] All user stories implemented
- [ ] No critical bugs
- [ ] Responsive design working
- [ ] Cross-browser compatibility

### Performance Requirements
- [ ] Page load time < 3 seconds
- [ ] API response time < 1 second
- [ ] Database queries optimized
- [ ] Images properly compressed

### Security Requirements
- [ ] Authentication working
- [ ] Authorization enforced
- [ ] Input validation complete
- [ ] No security vulnerabilities

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check database connection
5. Review API documentation

Happy Testing! 🚀 