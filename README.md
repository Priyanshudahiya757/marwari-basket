# Marwari Basket - Authentic Rajasthani E-commerce Platform

A modern, full-stack e-commerce platform showcasing authentic Rajasthani products with a beautiful UI and comprehensive admin panel.

## 🚀 Features

### Customer Features
- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Product Catalog**: 12+ SKUs across 3 categories (Clothing, Jewelry, Home Decor)
- **Advanced Search & Filtering**: Search by name, description, tags, and filter by category
- **Product Details**: Comprehensive product pages with image galleries, specifications, and reviews
- **Shopping Cart**: Persistent cart with quantity management
- **OTP-based Authentication**: Secure login/signup with phone/email verification
- **Order Management**: Track orders and view order history
- **Responsive Design**: Works perfectly on all devices

### Admin Features
- **Secret Access**: Konami Code (↑↑↓↓←→←→BA) or 5-click logo for admin access
- **Dashboard Analytics**: Sales overview, order status, top products, recent activity
- **Product Management**: Add, edit, delete products with image upload
- **Order Management**: View, update, and track all orders
- **Customer Management**: View customer details and order history
- **Inventory Management**: Stock alerts and inventory tracking
- **Modern Admin UI**: Clean, professional admin interface

### Technical Features
- **React 19**: Latest React with modern hooks and patterns
- **Node.js Backend**: Express.js with MongoDB
- **Authentication**: JWT-based authentication with role-based access
- **Database**: MongoDB Atlas cloud database
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Security**: Content Security Policy, X-Content-Type-Options headers
- **Performance**: Optimized builds with Vite

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account (free tier available)

### Frontend Setup
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your MongoDB Atlas credentials
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/marwaribasket
JWT_SECRET=your-super-secret-jwt-key

# Seed the database
node seed/seed.js

# Start development server
npm start
```

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Marwari Basket
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_ENABLE_DARK_MODE=true
VITE_DEV_MODE=true
```

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/marwaribasket
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

## 🗄️ Database Setup

### MongoDB Atlas Setup
1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in your `.env` file
5. Run the seed script to populate initial data

### Database Schema
- **Users**: Customer and admin user accounts
- **Products**: Product catalog with categories, pricing, and inventory
- **Orders**: Order management with status tracking
- **Categories**: Product categorization

## 🧪 Testing

### Unit Tests
```bash
# Run unit tests
npm run test

# Run tests with UI
npm run test:ui
```

### E2E Tests
```bash
# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
# Build for production
npm run build

# Deploy the dist folder
```

### Backend Deployment (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Database Deployment
- Use MongoDB Atlas for production
- Set up proper indexes for performance
- Configure backup and monitoring

## 📁 Project Structure

```
marwari-basket/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── utils/         # Utility functions
│   │   └── test/          # Test files
│   ├── public/            # Static assets
│   └── tests/             # E2E tests
├── server/                # Backend Node.js app
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── seed/            # Database seeding
└── docs/                # Documentation
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin and customer role separation
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured CORS for API security
- **Rate Limiting**: API rate limiting to prevent abuse
- **Content Security Policy**: XSS protection headers

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Mobile-first design approach
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG compliant design
- **Dark Mode Ready**: Theme switching capability

## 🛠️ Development

### Code Quality
- ESLint for code linting
- Prettier for code formatting
- TypeScript ready (can be easily migrated)

### Performance
- Lazy loading for components
- Image optimization
- Bundle size optimization
- Caching strategies

### Monitoring
- Error tracking ready
- Analytics integration
- Performance monitoring

## 📈 Future Enhancements

- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] PWA capabilities
- [ ] Advanced search with filters
- [ ] Wishlist functionality
- [ ] Social media integration
- [ ] Email marketing integration
- [ ] Advanced inventory management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@marwaribasket.com or create an issue in the repository.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the database
- All the open-source contributors

---

**Marwari Basket** - Bringing authentic Rajasthani craftsmanship to the digital world! 🛍️✨
