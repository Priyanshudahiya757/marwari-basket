# Settings & Configuration Module

This module provides comprehensive system configuration and management capabilities for the Marwari Basket admin panel.

## Components

### 1. Settings.jsx (Main Container)
- **Purpose**: Main container component that manages tab navigation between different settings sections
- **Features**: 
  - Tab-based navigation
  - Responsive design
  - Clean UI with consistent styling

### 2. GeneralSettings.jsx
- **Purpose**: Manage general system settings and site configuration
- **Features**:
  - Site information (name, description, contact details)
  - Regional settings (timezone, currency, language)
  - System settings (maintenance mode, user registration)
  - Notification preferences
  - Business rules (order limits, delivery radius)

### 3. SecuritySettings.jsx
- **Purpose**: Configure security and authentication settings
- **Features**:
  - Two-factor authentication settings
  - Password policies and requirements
  - Session management
  - Access control (IP whitelist, allowed domains)
  - System security (SSL, audit logging, backups)

### 4. UserManagement.jsx
- **Purpose**: Manage admin users and roles
- **Features**:
  - User listing with search and filtering
  - User creation and status management
  - Role management (create, edit, delete roles)
  - User-role assignment
  - Bulk operations

### 5. EmailSettings.jsx
- **Purpose**: Configure email server and notification settings
- **Features**:
  - SMTP configuration
  - Email identity settings
  - Email template management
  - Notification preferences
  - Test email functionality

## API Endpoints

The module expects the following API endpoints:

### General Settings
- `GET /api/admin/settings/general` - Fetch general settings
- `PUT /api/admin/settings/general` - Update general settings

### Security Settings
- `GET /api/admin/settings/security` - Fetch security settings
- `PUT /api/admin/settings/security` - Update security settings

### Email Settings
- `GET /api/admin/settings/email` - Fetch email settings
- `PUT /api/admin/settings/email` - Update email settings
- `POST /api/admin/settings/email/test` - Send test email

### User Management
- `GET /api/admin/users` - Fetch users list
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id/status` - Update user status

### Role Management
- `GET /api/admin/roles` - Fetch roles list
- `POST /api/admin/roles` - Create new role

## Mock API

For development purposes, a mock API is provided in `client/src/utils/mockApi.js` that simulates all the required endpoints with realistic data.

To enable mock API:
1. Set `localStorage.setItem('useMockApi', 'true')` in browser console
2. Refresh the page

## Usage

```jsx
import Settings from './components/admin/Settings/Settings';

// In your admin page
<Settings />
```

## Styling

All components use Tailwind CSS classes and follow the Marwari Basket design system:
- Primary color: Yellow (`yellow-600`)
- Background: Gray gradients
- Consistent spacing and typography
- Responsive design patterns

## Features

- **Real-time Updates**: Settings are saved immediately when changed
- **Validation**: Form validation for required fields and data types
- **Error Handling**: Graceful error handling with user-friendly messages
- **Loading States**: Loading indicators during API calls
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: ARIA labels and keyboard navigation support

## Future Enhancements

- Advanced role permissions system
- Audit trail for settings changes
- Import/export settings functionality
- Multi-language support for settings
- Advanced email template editor
- Integration with third-party services 