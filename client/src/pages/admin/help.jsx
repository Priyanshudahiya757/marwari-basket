import React from 'react';
import Sidebar from '../../components/admin/Sidebar';

export default function AdminHelpPage() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-serif font-bold text-neutral-900">Help & FAQ</h1>
                <p className="text-sm text-gray-500">Get help and find answers to common questions</p>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto admin-scrollbar">
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl">
                <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
                <ul className="space-y-4">
                  <li>
                    <strong>How do I add a new product?</strong>
                    <p>Go to the Products section, click "Add Product", fill in the details, and save.</p>
                  </li>
                  <li>
                    <strong>How do I process an order?</strong>
                    <p>Go to the Orders section, select an order, update its status, and save changes.</p>
                  </li>
                  <li>
                    <strong>How do I update store information?</strong>
                    <p>Go to Settings, update your store name, contact info, or password, and click Save.</p>
                  </li>
                  <li>
                    <strong>How do I contact support?</strong>
                    <p>Email us at <a href="mailto:support@marwaribasket.com" className="text-blue-600 underline">support@marwaribasket.com</a>.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 