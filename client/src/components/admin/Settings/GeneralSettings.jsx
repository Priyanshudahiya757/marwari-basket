import React, { useState, useEffect } from 'react';

export default function GeneralSettings() {
  const [generalSettings, setGeneralSettings] = useState({
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
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchGeneralSettings();
  }, []);

  const fetchGeneralSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings/general', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch general settings');
      }

      const data = await response.json();
      setGeneralSettings(data.settings);
    } catch (error) {
      console.error('Error fetching general settings:', error);
      // Keep default settings if API fails
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/settings/general', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(generalSettings)
      });

      if (!response.ok) {
        throw new Error('Failed to save general settings');
      }

      alert('General settings saved successfully!');
    } catch (error) {
      console.error('Error saving general settings:', error);
      alert('Failed to save general settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setGeneralSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Site Configuration */}
      <div className="admin-card bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Site Configuration</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
              <input
                type="text"
                value={generalSettings.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                className="admin-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Enter site name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
              <textarea
                value={generalSettings.siteDescription}
                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                rows={3}
                className="admin-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Enter site description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input
                type="email"
                value={generalSettings.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                className="admin-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Enter contact email"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
              <input
                type="tel"
                value={generalSettings.supportPhone}
                onChange={(e) => handleInputChange('supportPhone', e.target.value)}
                className="admin-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Enter support phone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={generalSettings.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                className="admin-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={generalSettings.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="admin-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={generalSettings.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="admin-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="admin-card bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">System Settings</h3>
        <div className="space-y-6">
          {/* Maintenance Mode */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">Maintenance Mode</h4>
              <p className="text-sm text-gray-500">Temporarily disable the site for maintenance</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={generalSettings.maintenanceMode}
                onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* Allow Registration */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">Allow User Registration</h4>
              <p className="text-sm text-gray-500">Enable new user registration</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={generalSettings.allowRegistration}
                onChange={(e) => handleInputChange('allowRegistration', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* Auto Confirm Orders */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">Auto-Confirm Orders</h4>
              <p className="text-sm text-gray-500">Automatically confirm orders without manual review</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={generalSettings.orderAutoConfirm}
                onChange={(e) => handleInputChange('orderAutoConfirm', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="admin-card bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-500">Send notifications via email</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={generalSettings.emailNotifications}
                onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
              <p className="text-sm text-gray-500">Send notifications via SMS</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={generalSettings.smsNotifications}
                onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Business Rules */}
      <div className="admin-card bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Business Rules</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Order Value (₹)</label>
            <input
              type="number"
              value={generalSettings.maxOrderValue}
              onChange={(e) => handleInputChange('maxOrderValue', parseInt(e.target.value))}
              className="admin-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter maximum order value"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Radius (km)</label>
            <input
              type="number"
              value={generalSettings.deliveryRadius}
              onChange={(e) => handleInputChange('deliveryRadius', parseInt(e.target.value))}
              className="admin-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter delivery radius"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-btn px-8 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
        >
          {saving ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Saving...</span>
            </div>
          ) : (
            'Save Settings'
          )}
        </button>
      </div>
    </div>
  );
} 