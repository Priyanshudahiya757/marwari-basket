import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { userAPI } from '../utils/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function MyAccount() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Address form state
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Load user profile and addresses
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadProfile();
    loadAddresses();
  }, [user, navigate]);

  const loadProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await userAPI.getProfile();
      const profile = response.data;
      setProfileForm({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || ''
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      setAddressLoading(true);
      const response = await userAPI.getAddresses();
      setAddresses(response.data);
    } catch (error) {
      console.error('Failed to load addresses:', error);
    } finally {
      setAddressLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await userAPI.updateProfile(profileForm);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      setPasswordLoading(true);
      await userAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Failed to change password:', error);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingAddress) {
        await userAPI.updateAddress(editingAddress._id, addressForm);
        toast.success('Address updated successfully!');
      } else {
        await userAPI.addAddress(addressForm);
        toast.success('Address added successfully!');
      }
      setShowAddressForm(false);
      setEditingAddress(null);
      setAddressForm({
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
      });
      loadAddresses();
    } catch (error) {
      console.error('Failed to save address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      name: address.name || '',
      phone: address.phone || '',
      address: address.address || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || ''
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    try {
      await userAPI.deleteAddress(addressId);
      toast.success('Address deleted successfully!');
      loadAddresses();
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully!');
  };

  if (!user) return null;

  return (
    <main className="pt-16 pb-20 md:pb-0 min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-12">
        <h1 className="text-2xl md:text-3xl font-serif font-bold mb-6 md:mb-8 text-neutral-900">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Profile Section */}
          <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-serif font-bold mb-4 md:mb-6 text-neutral-900">Profile Information</h2>
            {profileLoading ? (
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label className="block font-semibold mb-2 text-neutral-800 text-sm md:text-base">Full Name</label>
                  <input 
                    type="text" 
                    value={profileForm.name} 
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    className="w-full border-2 border-yellow-200 rounded-lg px-3 py-3 md:py-2 focus:border-pink-400 focus:outline-none text-base" 
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-neutral-800 text-sm md:text-base">Email</label>
                  <input 
                    type="email" 
                    value={profileForm.email} 
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    className="w-full border-2 border-yellow-200 rounded-lg px-3 py-3 md:py-2 focus:border-pink-400 focus:outline-none text-base" 
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-neutral-800 text-sm md:text-base">Phone</label>
                  <input 
                    type="tel" 
                    value={profileForm.phone} 
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    className="w-full border-2 border-yellow-200 rounded-lg px-3 py-3 md:py-2 focus:border-pink-400 focus:outline-none text-base" 
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-600 to-yellow-400 text-white py-3 md:py-3 rounded-xl font-semibold text-base md:text-lg hover:scale-105 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            )}
          </section>

          {/* Password Section */}
          <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-serif font-bold mb-4 md:mb-6 text-neutral-900">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2 text-neutral-800 text-sm md:text-base">Current Password</label>
                <input 
                  type="password" 
                  value={passwordForm.currentPassword} 
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  className="w-full border-2 border-yellow-200 rounded-lg px-3 py-3 md:py-2 focus:border-pink-400 focus:outline-none text-base" 
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-neutral-800 text-sm md:text-base">New Password</label>
                <input 
                  type="password" 
                  value={passwordForm.newPassword} 
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full border-2 border-yellow-200 rounded-lg px-3 py-3 md:py-2 focus:border-pink-400 focus:outline-none text-base" 
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-neutral-800 text-sm md:text-base">Confirm New Password</label>
                <input 
                  type="password" 
                  value={passwordForm.confirmPassword} 
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="w-full border-2 border-yellow-200 rounded-lg px-3 py-3 md:py-2 focus:border-pink-400 focus:outline-none text-base" 
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={passwordLoading}
                className="w-full bg-yellow-400 text-neutral-900 py-3 md:py-3 rounded-xl font-semibold hover:scale-105 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </section>
        </div>

        {/* Addresses Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-6 md:mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-neutral-900">My Addresses</h2>
            <button 
              onClick={() => setShowAddressForm(true)}
              className="bg-gradient-to-r from-pink-600 to-yellow-400 text-white px-4 py-3 rounded-xl font-semibold hover:scale-105 transition shadow text-sm md:text-base"
            >
              + Add Address
            </button>
          </div>

          {addressLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📍</div>
              <p className="text-gray-500">No addresses saved yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div key={address._id} className="border-2 border-yellow-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-neutral-800 text-sm md:text-base">{address.name}</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditAddress(address)}
                        className="text-pink-600 hover:text-pink-800 text-xs md:text-sm p-1 hover:bg-pink-50 rounded"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteAddress(address._id)}
                        className="text-red-600 hover:text-red-800 text-xs md:text-sm p-1 hover:bg-red-50 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">{address.phone}</p>
                  <p className="text-xs md:text-sm text-gray-600">{address.address}</p>
                  <p className="text-xs md:text-sm text-gray-600">{address.city}, {address.state} - {address.pincode}</p>
                </div>
              ))}
            </div>
          )}

          {/* Address Form Modal */}
          {showAddressForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg md:text-xl font-bold mb-4">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h3>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <input 
                    type="text" 
                    value={addressForm.name} 
                    onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                    className="w-full border-2 border-yellow-200 rounded-lg px-3 py-3 text-base" 
                    placeholder="Full Name"
                    required
                  />
                  <input 
                    type="tel" 
                    value={addressForm.phone} 
                    onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                    className="w-full border-2 border-yellow-200 rounded-lg px-3 py-3 text-base" 
                    placeholder="Phone Number"
                    required
                  />
                  <textarea 
                    value={addressForm.address} 
                    onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                    className="w-full border-2 border-yellow-200 rounded-lg px-3 py-3 text-base" 
                    placeholder="Address"
                    rows="3"
                    required
                  />
                  <input 
                    type="text" 
                    value={addressForm.city} 
                    onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                    className="w-full border-2 border-yellow-200 rounded-lg px-3 py-3 text-base" 
                    placeholder="City"
                    required
                  />
                  <input 
                    type="text" 
                    value={addressForm.state} 
                    onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                    className="w-full border-2 border-yellow-200 rounded-lg px-3 py-3 text-base" 
                    placeholder="State"
                    required
                  />
                  <input 
                    type="text" 
                    value={addressForm.pincode} 
                    onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})}
                    className="w-full border-2 border-yellow-200 rounded-lg px-3 py-3 text-base" 
                    placeholder="Pincode"
                    required
                  />
                  <div className="flex gap-3">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-pink-600 to-yellow-400 text-white py-3 rounded-xl font-semibold disabled:opacity-50 text-base"
                    >
                      {loading ? 'Saving...' : 'Save Address'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowAddressForm(false);
                        setEditingAddress(null);
                        setAddressForm({
                          name: '', phone: '', address: '', city: '', state: '', pincode: ''
                        });
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>

        {/* Logout Section */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-6 md:mt-8">
          <h2 className="text-xl md:text-2xl font-serif font-bold mb-4 md:mb-6 text-neutral-900">Account Actions</h2>
          <button 
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition shadow text-base md:text-lg"
          >
            Logout
          </button>
        </section>
      </div>
    </main>
  );
} 