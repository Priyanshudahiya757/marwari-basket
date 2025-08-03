import React from 'react';
import Sidebar from '../../components/admin/Sidebar';
import GeneralSettings from '../../components/admin/Settings/GeneralSettings';

export default function AdminSettingsPage() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-serif font-bold text-neutral-900">Settings</h1>
                <p className="text-sm text-gray-500">Manage your store information and preferences</p>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto admin-scrollbar">
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="slide-in">
                <GeneralSettings />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 