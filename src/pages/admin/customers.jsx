import React, { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import CustomerList from '../../components/admin/Customers/CustomerList';
import CustomerDetail from '../../components/admin/Customers/CustomerDetail';

export default function AdminCustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleViewDetail = (customer) => {
    setSelectedCustomer(customer);
    setShowDetail(true);
  };

  const handleEdit = (customer) => {
    // TODO: Implement edit functionality
    console.log('Edit customer:', customer);
  };

  const handleDelete = (customerId) => {
    // TODO: Implement delete functionality
    console.log('Delete customer:', customerId);
  };

  const handleBulkAction = (action, customerIds) => {
    // TODO: Implement bulk actions
    console.log('Bulk action:', action, customerIds);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-serif font-bold text-neutral-900">Customer Management</h1>
                <p className="text-sm text-gray-500">View and manage all customers</p>
              </div>
              <div className="flex space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                  Add Customer
                </button>
              </div>
            </div>
          </div>
        </div>
        <main className="flex-1 p-6 overflow-y-auto admin-scrollbar">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-8">
            <CustomerList
              onViewDetail={handleViewDetail}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onBulkAction={handleBulkAction}
            />
          </div>
        </main>
      </div>
      
      {showDetail && (
        <CustomerDetail
          customer={selectedCustomer}
          onClose={handleCloseDetail}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
} 