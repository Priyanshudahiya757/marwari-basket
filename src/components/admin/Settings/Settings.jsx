import React, { useState } from 'react';
import GeneralSettings from './GeneralSettings';
import SecuritySettings from './SecuritySettings';
import UserManagement from './UserManagement';
import EmailSettings from './EmailSettings';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️', component: GeneralSettings },
    { id: 'security', name: 'Security', icon: '🔒', component: SecuritySettings },
    { id: 'users', name: 'User Management', icon: '👥', component: UserManagement },
    { id: 'email', name: 'Email Settings', icon: '📧', component: EmailSettings }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings & Configuration</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage system settings, user permissions, and application configuration
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>
      </div>
    </div>
  );
} 