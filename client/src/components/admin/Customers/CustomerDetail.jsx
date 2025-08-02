import React, { useState } from 'react';

export default function CustomerDetail({ customer, onClose, onEdit }) {
  const [activeTab, setActiveTab] = useState('profile');

  if (!customer) return null;

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'orders', name: 'Orders', icon: '📦' },
    { id: 'communications', name: 'Communications', icon: '💬' },
    { id: 'notes', name: 'Notes', icon: '📝' }
  ];

  const mockOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 4500,
      items: 3
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'Shipped',
      total: 3200,
      items: 2
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      status: 'Delivered',
      total: 1800,
      items: 1
    }
  ];

  const mockCommunications = [
    {
      id: 1,
      type: 'email',
      subject: 'Order Confirmation - ORD-001',
      date: '2024-01-15',
      status: 'sent'
    },
    {
      id: 2,
      type: 'sms',
      subject: 'Your order has been shipped',
      date: '2024-01-12',
      status: 'sent'
    },
    {
      id: 3,
      type: 'email',
      subject: 'Welcome to Marwari Basket!',
      date: '2024-01-01',
      status: 'sent'
    }
  ];

  const mockNotes = [
    {
      id: 1,
      content: 'VIP customer - prefers premium packaging',
      date: '2024-01-10',
      author: 'Admin'
    },
    {
      id: 2,
      content: 'Customer requested faster delivery for next order',
      date: '2024-01-08',
      author: 'Support'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-yellow-800 font-medium text-lg">
                {customer.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{customer.name}</h2>
              <p className="text-sm text-gray-500">{customer.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(customer)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                      <dd className="text-sm text-gray-900">{customer.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="text-sm text-gray-900">{customer.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="text-sm text-gray-900">{customer.phone}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {customer.status}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Segment</dt>
                      <dd>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          customer.segment === 'VIP' ? 'bg-purple-100 text-purple-800' :
                          customer.segment === 'Regular' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {customer.segment}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Total Orders</dt>
                      <dd className="text-2xl font-bold text-gray-900">{customer.totalOrders}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Total Spent</dt>
                      <dd className="text-2xl font-bold text-green-600">₹{customer.totalSpent.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Last Order</dt>
                      <dd className="text-sm text-gray-900">{new Date(customer.lastOrder).toLocaleDateString()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Average Order Value</dt>
                      <dd className="text-sm text-gray-900">₹{(customer.totalSpent / customer.totalOrders).toLocaleString()}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Order History</h3>
                <button className="text-sm text-yellow-600 hover:text-yellow-700">View All Orders</button>
              </div>
              <div className="space-y-3">
                {mockOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{order.id}</h4>
                        <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">{order.items} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₹{order.total.toLocaleString()}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'communications' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Communication History</h3>
                <button className="text-sm text-yellow-600 hover:text-yellow-700">Send Message</button>
              </div>
              <div className="space-y-3">
                {mockCommunications.map((comm) => (
                  <div key={comm.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        comm.type === 'email' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {comm.type === 'email' ? '📧' : '📱'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{comm.subject}</h4>
                        <p className="text-sm text-gray-500">{new Date(comm.date).toLocaleDateString()}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          comm.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {comm.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Customer Notes</h3>
                <button className="text-sm text-yellow-600 hover:text-yellow-700">Add Note</button>
              </div>
              <div className="space-y-3">
                {mockNotes.map((note) => (
                  <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-900 mb-2">{note.content}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>By {note.author}</span>
                      <span>{new Date(note.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 