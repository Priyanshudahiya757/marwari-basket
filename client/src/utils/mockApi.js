// Mock API responses for settings endpoints
const mockApi = {
  // Dashboard endpoints
  '/api/admin/dashboard/sales-overview': {
    GET: {
      today: 12450,
      week: 87500,
      month: 325000,
      growth: 12.5
    }
  },
  '/api/admin/dashboard/orders-status': {
    GET: {
      pending: 8,
      processing: 12,
      shipped: 25,
      delivered: 45,
      cancelled: 3
    }
  },
  '/api/admin/dashboard/top-products': {
    GET: {
      products: [
        { name: 'Block Print Saree', sales: 45, revenue: 67500 },
        { name: 'Handcrafted Pottery', sales: 32, revenue: 48000 },
        { name: 'Traditional Jewelry', sales: 28, revenue: 42000 },
        { name: 'Rajasthani Shawl', sales: 25, revenue: 37500 },
        { name: 'Leather Bags', sales: 22, revenue: 33000 }
      ]
    }
  },
  '/api/admin/dashboard/recent-activity': {
    GET: {
      activities: [
        { type: 'order', message: 'New order #1234 received', time: '2 minutes ago', user: 'Customer' },
        { type: 'product', message: 'Product "Block Print Saree" stock updated', time: '15 minutes ago', user: 'Admin' },
        { type: 'customer', message: 'New customer registered', time: '1 hour ago', user: 'System' },
        { type: 'payment', message: 'Payment received for order #1230', time: '2 hours ago', user: 'System' },
        { type: 'shipping', message: 'Order #1228 shipped', time: '3 hours ago', user: 'Admin' }
      ]
    }
  },
  '/api/admin/dashboard/stock-alerts': {
    GET: {
      alerts: [
        { product: 'Block Print Saree', current: 5, min: 10, status: 'critical' },
        { product: 'Handcrafted Pottery', current: 8, min: 15, status: 'warning' },
        { product: 'Traditional Jewelry', current: 3, min: 8, status: 'critical' }
      ]
    }
  },

  // Notification endpoints
  '/api/admin/notifications': {
    GET: {
      notifications: [
        {
          id: 1,
          type: 'order',
          title: 'New Order Received',
          message: 'Order #1234 has been placed by customer John Doe',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          read: false,
          priority: 'high'
        },
        {
          id: 2,
          type: 'alert',
          title: 'Low Stock Alert',
          message: 'Block Print Saree is running low on stock (5 items remaining)',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          read: false,
          priority: 'medium'
        },
        {
          id: 3,
          type: 'system',
          title: 'System Update',
          message: 'Database backup completed successfully',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          read: true,
          priority: 'low'
        },
        {
          id: 4,
          type: 'payment',
          title: 'Payment Received',
          message: 'Payment of ₹2,500 received for order #1230',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          read: true,
          priority: 'medium'
        },
        {
          id: 5,
          type: 'customer',
          title: 'Customer Support Request',
          message: 'New support ticket from customer Sarah Wilson',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false,
          priority: 'high'
        }
      ],
      unreadCount: 3
    }
  },
  '/api/admin/notifications/:id/read': {
    PUT: { success: true, message: 'Notification marked as read' }
  },
  '/api/admin/notifications/mark-all-read': {
    PUT: { success: true, message: 'All notifications marked as read' }
  },
  '/api/admin/notifications/:id': {
    DELETE: { success: true, message: 'Notification deleted' }
  },

  // General Settings
  '/api/admin/settings/general': {
    GET: {
      settings: {
        siteName: 'Marwari Basket',
        siteDescription: 'Premium grocery delivery service',
        contactEmail: 'admin@marwaribasket.com',
        supportPhone: '+91-9876543210',
        timezone: 'Asia/Kolkata',
        currency: 'INR',
        language: 'en',
        maintenanceMode: false,
        allowRegistration: true,
        emailNotifications: true,
        smsNotifications: false,
        orderAutoConfirm: false,
        maxOrderValue: 5000,
        deliveryRadius: 10
      }
    },
    PUT: { success: true, message: 'General settings updated successfully' }
  },

  // Security Settings
  '/api/admin/settings/security': {
    GET: {
      settings: {
        twoFactorAuth: true,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        passwordMinLength: 8,
        requireStrongPassword: true,
        enableAuditLog: true,
        ipWhitelist: [],
        allowedDomains: ['marwaribasket.com'],
        sslEnabled: true,
        backupEnabled: true,
        backupFrequency: 'daily'
      }
    },
    PUT: { success: true, message: 'Security settings updated successfully' }
  },

  // Email Settings
  '/api/admin/settings/email': {
    GET: {
      settings: {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUsername: 'noreply@marwaribasket.com',
        smtpPassword: '',
        smtpSecure: true,
        fromName: 'Marwari Basket',
        fromEmail: 'noreply@marwaribasket.com',
        replyToEmail: 'support@marwaribasket.com',
        emailTemplates: {
          orderConfirmation: {
            subject: 'Order Confirmation - Marwari Basket',
            enabled: true
          },
          orderShipped: {
            subject: 'Your Order Has Been Shipped - Marwari Basket',
            enabled: true
          },
          orderDelivered: {
            subject: 'Order Delivered - Marwari Basket',
            enabled: true
          },
          passwordReset: {
            subject: 'Password Reset Request - Marwari Basket',
            enabled: true
          },
          welcomeEmail: {
            subject: 'Welcome to Marwari Basket!',
            enabled: true
          },
          newsletter: {
            subject: 'Marwari Basket Newsletter',
            enabled: false
          }
        },
        notifications: {
          newOrder: true,
          orderCancelled: true,
          lowStock: true,
          customerSupport: true,
          systemAlerts: true
        }
      }
    },
    PUT: { success: true, message: 'Email settings updated successfully' }
  },

  // Test Email
  '/api/admin/settings/email/test': {
    POST: { success: true, message: 'Test email sent successfully' }
  },

  // Users
  '/api/admin/users': {
    GET: {
      users: [
        {
          id: 1,
          name: 'Admin User',
          email: 'admin@marwaribasket.com',
          role: 'admin',
          status: 'active',
          phone: '+91-9876543210',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          name: 'Manager User',
          email: 'manager@marwaribasket.com',
          role: 'manager',
          status: 'active',
          phone: '+91-9876543211',
          createdAt: '2024-01-05T00:00:00Z'
        },
        {
          id: 3,
          name: 'Support User',
          email: 'support@marwaribasket.com',
          role: 'support',
          status: 'active',
          phone: '+91-9876543212',
          createdAt: '2024-01-10T00:00:00Z'
        },
        {
          id: 4,
          name: 'Inactive User',
          email: 'inactive@marwaribasket.com',
          role: 'support',
          status: 'inactive',
          phone: '+91-9876543213',
          createdAt: '2024-01-12T00:00:00Z'
        }
      ]
    },
    POST: { success: true, message: 'User created successfully' }
  },

  // User Status Update
  '/api/admin/users/:id/status': {
    PUT: { success: true, message: 'User status updated successfully' }
  },

  // Roles
  '/api/admin/roles': {
    GET: {
      roles: [
        {
          id: 1,
          name: 'admin',
          description: 'Full system access and control',
          permissions: ['all']
        },
        {
          id: 2,
          name: 'manager',
          description: 'Manage products, orders, and customers',
          permissions: ['products', 'orders', 'customers', 'analytics']
        },
        {
          id: 3,
          name: 'support',
          description: 'Handle customer support and basic operations',
          permissions: ['orders', 'customers']
        },
        {
          id: 4,
          name: 'user',
          description: 'Basic user access',
          permissions: ['view']
        }
      ]
    },
    POST: { success: true, message: 'Role created successfully' }
  }
};

// Mock fetch function to intercept API calls
export const mockFetch = async (url, options = {}) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const method = options.method || 'GET';
  const endpoint = url.split('?')[0]; // Remove query parameters

  // Find matching endpoint
  let responseData = null;
  let status = 404;

  // Handle dynamic routes (like /api/admin/users/:id/status)
  const dynamicRoutes = {
    '/api/admin/users/:id/status': (url) => {
      const id = url.split('/')[4]; // Extract ID from URL
      return mockApi['/api/admin/users/:id/status'][method];
    }
  };

  if (dynamicRoutes[endpoint]) {
    responseData = dynamicRoutes[endpoint](url);
    status = 200;
  } else if (mockApi[endpoint] && mockApi[endpoint][method]) {
    responseData = mockApi[endpoint][method];
    status = 200;
  }

  if (status === 404) {
    throw new Error(`API endpoint ${endpoint} not found`);
  }

  return {
    ok: status === 200,
    status,
    json: async () => responseData,
    text: async () => JSON.stringify(responseData)
  };
};

// Override fetch in development
if (process.env.NODE_ENV === 'development') {
  // Only override fetch if we're in development and want to use mock data
  // You can add a flag to enable/disable this
  const useMockApi = localStorage.getItem('useMockApi') === 'true';
  
  if (useMockApi) {
    window.fetch = mockFetch;
  }
}

export default mockApi; 