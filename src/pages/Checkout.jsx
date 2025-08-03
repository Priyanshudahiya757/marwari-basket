import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Helper: POST to backend checkout API
async function submitCheckout(data) {
  const res = await fetch('/api/orders/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Checkout failed');
  return res.json();
}

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Rajasthan',
    pincode: '',
    billingSame: true,
    billing: {
      firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: 'Rajasthan', pincode: ''
    },
    shippingMethod: 'standard',
    paymentMethod: 'cod',
    card: { number: '', expiry: '', cvc: '', name: '' },
    upi: '',
  });
  const [errors, setErrors] = useState({});

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    const price = typeof item.price === 'string' ? parseInt(item.price.replace(/[^\d]/g, '')) : item.price || 0;
    return sum + (price * (item.quantity || 1));
  }, 0);
  const deliveryCharge = subtotal > 2000 ? 0 : 100;
  const total = subtotal + deliveryCharge;

  useEffect(() => { if (cart.length === 0) navigate('/cart'); }, [cart, navigate]);

  // Handle form input changes
  const handleInputChange = (e, billing=false) => {
    const { name, value, type, checked } = e.target;
    if (billing) {
      setFormData(prev => ({ ...prev, billing: { ...prev.billing, [name]: value } }));
      if (errors[`billing.${name}`]) setErrors(prev => ({ ...prev, [`billing.${name}`]: '' }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form (shipping, billing, payment)
  const validateForm = () => {
    const newErrors = {};
    // Shipping
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = 'Phone number is invalid';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^[1-9][0-9]{5}$/.test(formData.pincode)) newErrors.pincode = 'Pincode is invalid';
    // Billing (if not same)
    if (!formData.billingSame) {
      ['firstName','lastName','email','phone','address','city','pincode'].forEach(f => {
        if (!formData.billing[f].trim()) newErrors[`billing.${f}`] = 'Required';
      });
      if (formData.billing.email && !/\S+@\S+\.\S+/.test(formData.billing.email)) newErrors['billing.email'] = 'Email is invalid';
      if (formData.billing.phone && !/^[6-9]\d{9}$/.test(formData.billing.phone)) newErrors['billing.phone'] = 'Phone number is invalid';
      if (formData.billing.pincode && !/^[1-9][0-9]{5}$/.test(formData.billing.pincode)) newErrors['billing.pincode'] = 'Pincode is invalid';
    }
    // Payment
    if (formData.paymentMethod === 'card') {
      if (!formData.card.number.match(/^\d{16}$/)) newErrors['card.number'] = 'Card number must be 16 digits';
      if (!formData.card.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) newErrors['card.expiry'] = 'MM/YY';
      if (!formData.card.cvc.match(/^\d{3}$/)) newErrors['card.cvc'] = 'CVC must be 3 digits';
      if (!formData.card.name.trim()) newErrors['card.name'] = 'Name required';
    }
    if (formData.paymentMethod === 'upi' && !formData.upi.match(/^\w+@\w+$/)) newErrors.upi = 'Enter valid UPI ID';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Simulate OTP (for demo)
  const handleSendOTP = async () => {
    if (!validateForm()) { toast.error('Please fill all required fields correctly'); return; }
    setIsLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
      toast.success('OTP sent!');
      setCurrentStep(2); // Move to OTP verification step
    }, 1200);
  };
  const handleVerifyOTP = async () => {
    setIsLoading(true);
    setTimeout(() => { setOtpVerified(true); setCurrentStep(3); setIsLoading(false); toast.success('OTP verified!'); }, 1200);
  };

  // Place order (connect to backend)
  const handlePlaceOrder = async () => {
    if (!validateForm()) { toast.error('Please fill all required fields correctly'); return; }
    setIsLoading(true);
    try {
      const payload = {
        cart: cart.map(item => ({ product: item.id || item._id, quantity: item.quantity, price: typeof item.price === 'string' ? parseInt(item.price.replace(/[^\d]/g, '')) : item.price })),
        shippingAddress: {
          name: formData.firstName + ' ' + formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        billingAddress: formData.billingSame ? undefined : {
          name: formData.billing.firstName + ' ' + formData.billing.lastName,
          email: formData.billing.email,
          phone: formData.billing.phone,
          address: formData.billing.address,
          city: formData.billing.city,
          state: formData.billing.state,
          pincode: formData.billing.pincode
        },
        shippingMethod: formData.shippingMethod,
        payment: {
          method: formData.paymentMethod,
          ...(formData.paymentMethod === 'card' ? { card: formData.card } : {}),
          ...(formData.paymentMethod === 'upi' ? { upi: formData.upi } : {})
        },
        customerEmail: formData.email,
        customerPhone: formData.phone
      };
      const result = await submitCheckout(payload);
      setOrderConfirmation(result);
      clearCart();
      setCurrentStep(4);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Delivery Details', active: currentStep === 1 },
    { number: 2, title: 'OTP Verification', active: currentStep === 2 },
    { number: 3, title: 'Payment & Confirm', active: currentStep === 3 },
    { number: 4, title: 'Order Placed', active: currentStep === 4 }
  ];

  return (
    <main className="pt-28 min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 font-sans">
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold mb-8 text-neutral-900 text-center">Checkout</h1>
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step.active ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{step.number}</div>
                <span className={`ml-2 font-medium ${step.active ? 'text-pink-600' : 'text-gray-500'}`}>{step.title}</span>
                {index < steps.length - 1 && (<div className="w-8 h-0.5 bg-gray-300 mx-4"></div>)}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">Delivery Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-2 text-neutral-800">First Name *</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`w-full border-2 rounded-lg px-3 py-2 ${errors.firstName ? 'border-red-500' : 'border-yellow-200'}`} placeholder="Enter first name" />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block font-semibold mb-2 text-neutral-800">Last Name *</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`w-full border-2 rounded-lg px-3 py-2 ${errors.lastName ? 'border-red-500' : 'border-yellow-200'}`} placeholder="Enter last name" />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-2 text-neutral-800">Email *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full border-2 rounded-lg px-3 py-2 ${errors.email ? 'border-red-500' : 'border-yellow-200'}`} placeholder="Enter email address" />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block font-semibold mb-2 text-neutral-800">Phone Number *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full border-2 rounded-lg px-3 py-2 ${errors.phone ? 'border-red-500' : 'border-yellow-200'}`} placeholder="Enter 10-digit number" />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-2 text-neutral-800">Delivery Address *</label>
                    <textarea name="address" value={formData.address} onChange={handleInputChange} rows={3} className={`w-full border-2 rounded-lg px-3 py-2 ${errors.address ? 'border-red-500' : 'border-yellow-200'}`} placeholder="Enter complete delivery address" />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold mb-2 text-neutral-800">City *</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} className={`w-full border-2 rounded-lg px-3 py-2 ${errors.city ? 'border-red-500' : 'border-yellow-200'}`} placeholder="Enter city" />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block font-semibold mb-2 text-neutral-800">State</label>
                      <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full border-2 border-yellow-200 rounded-lg px-3 py-2" readOnly />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2 text-neutral-800">Pincode *</label>
                      <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className={`w-full border-2 rounded-lg px-3 py-2 ${errors.pincode ? 'border-red-500' : 'border-yellow-200'}`} placeholder="Enter pincode" />
                      {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                    </div>
                  </div>
                  {/* Shipping Method Selection */}
                  <div>
                    <label className="block font-semibold mb-2 text-neutral-800">Shipping Method</label>
                    <select name="shippingMethod" value={formData.shippingMethod} onChange={handleInputChange} className="w-full border-2 border-yellow-200 rounded-lg px-3 py-2">
                      <option value="standard">Standard (3-7 days, Free over ₹2000)</option>
                      <option value="express">Express (1-2 days, +₹200)</option>
                    </select>
                  </div>
                  {/* Billing Address Option */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="billingSame" checked={formData.billingSame} onChange={handleInputChange} />
                      <span>Billing address same as delivery</span>
                    </label>
                  </div>
                  {!formData.billingSame && (
                    <div className="bg-yellow-50 rounded-lg p-4 mt-2">
                      <h3 className="font-semibold mb-2">Billing Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-semibold mb-2 text-neutral-800">First Name *</label>
                          <input type="text" name="firstName" value={formData.billing.firstName} onChange={e => handleInputChange(e, true)} className={`w-full border-2 rounded-lg px-3 py-2 ${errors['billing.firstName'] ? 'border-red-500' : 'border-yellow-200'}`} placeholder="Enter first name" />
                          {errors['billing.firstName'] && <p className="text-red-500 text-sm mt-1">{errors['billing.firstName']}</p>}
                        </div>
                        <div>
                          <label className="block font-semibold mb-2 text-neutral-800">Last Name *</label>
                          <input type="text" name="lastName" value={formData.billing.lastName} onChange={e => handleInputChange(e, true)} className={`w-full border-2 rounded-lg px-3 py-2 ${errors['billing.lastName'] ? 'border-red-500' : 'border-yellow-200'}`} placeholder="Enter last name" />
                          {errors['billing.lastName'] && <p className="text-red-500 text-sm mt-1">{errors['billing.lastName']}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-semibold mb-2 text-neutral-800">Email *</label>
                          <input type="email" name="email" value={formData.billing.email} onChange={e => handleInputChange(e, true)} className={`w-full border-2 rounded-lg px-3 py-2 ${errors['billing.email'] ? 'border-red-500' : 'border-yellow-200'}`} placeholder="Enter email address" />
                          {errors['billing.email'] && <p className="text-red-500 text-sm mt-1">{errors['billing.email']}</p>}
                        </div>
                        <div>
                          <label className="block font-semibold mb-2 text-neutral-800">Phone Number *</label>
                          <input type="tel" name="phone" value={formData.billing.phone} onChange={e => handleInputChange(e, true)} className={`w-full border-2 rounded-lg px-3 py-2 ${errors['billing.phone'] ? 'border-red-500' : 'border-yellow-200'}`} placeholder="Enter 10-digit number" />
                          {errors['billing.phone'] && <p className="text-red-500 text-sm mt-1">{errors['billing.phone']}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold mb-2 text-neutral-800">Billing Address *</label>
                        <textarea name="address" value={formData.billing.address} onChange={e => handleInputChange(e, true)} rows={2} className={`w-full border-2 rounded-lg px-3 py-2 ${errors['billing.address'] ? 'border-red-500' : 'border-yellow-200'}`} placeholder="Enter billing address" />
                        {errors['billing.address'] && <p className="text-red-500 text-sm mt-1">{errors['billing.address']}</p>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
                          <label className="block font-semibold mb-2 text-neutral-800">City *</label>
                          <input type="text" name="city" value={formData.billing.city} onChange={e => handleInputChange(e, true)} className={`w-full border-2 rounded-lg px-3 py-2 ${errors['billing.city'] ? 'border-red-500' : 'border-yellow-200'}`} placeholder="Enter city" />
                          {errors['billing.city'] && <p className="text-red-500 text-sm mt-1">{errors['billing.city']}</p>}
        </div>
        <div>
                          <label className="block font-semibold mb-2 text-neutral-800">Pincode *</label>
                          <input type="text" name="pincode" value={formData.billing.pincode} onChange={e => handleInputChange(e, true)} className={`w-full border-2 rounded-lg px-3 py-2 ${errors['billing.pincode'] ? 'border-red-500' : 'border-yellow-200'}`} placeholder="Enter pincode" />
                          {errors['billing.pincode'] && <p className="text-red-500 text-sm mt-1">{errors['billing.pincode']}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                  <button onClick={handleSendOTP} disabled={isLoading} className="w-full bg-gradient-to-r from-pink-600 to-yellow-400 text-white py-3 rounded-lg font-semibold text-lg hover:scale-105 transition shadow disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? 'Sending OTP...' : 'Send OTP'}</button>
                </div>
              )}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">OTP Verification</h2>
                  <p className="text-gray-600 mb-4">We've sent a 6-digit OTP to {formData.phone} and {formData.email}</p>
                  <div>
                    <label className="block font-semibold mb-2 text-neutral-800">Enter OTP *</label>
                    <input id="otp" type="text" maxLength={6} className="w-full border-2 border-yellow-200 rounded-lg px-3 py-2 text-center text-2xl tracking-widest" placeholder="000000" />
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setCurrentStep(1)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">Back</button>
                    <button onClick={handleVerifyOTP} disabled={isLoading} className="flex-1 bg-gradient-to-r from-pink-600 to-yellow-400 text-white py-3 rounded-lg font-semibold hover:scale-105 transition shadow disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? 'Verifying...' : 'Verify OTP'}</button>
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">Payment & Confirmation</h2>
                  {/* Payment Method Selection */}
                  <div>
                    <label className="block font-semibold mb-4 text-neutral-800">Payment Method</label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="text-pink-600" />
                        <span>Cash on Delivery (COD)</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleInputChange} className="text-pink-600" />
                        <span>Credit/Debit Card</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" name="paymentMethod" value="upi" checked={formData.paymentMethod === 'upi'} onChange={handleInputChange} className="text-pink-600" />
                        <span>UPI</span>
                      </label>
                    </div>
                  </div>
                  {/* Card Payment UI */}
                  {formData.paymentMethod === 'card' && (
                    <div className="bg-gray-50 rounded-lg p-4 mt-2 space-y-3">
                      <input type="text" name="number" value={formData.card.number} onChange={e => setFormData(prev => ({ ...prev, card: { ...prev.card, number: e.target.value } }))} className={`w-full border-2 rounded-lg px-3 py-2 ${errors['card.number'] ? 'border-red-500' : 'border-yellow-200'}`} placeholder="Card Number (16 digits)" maxLength={16} />
                      {errors['card.number'] && <p className="text-red-500 text-sm mt-1">{errors['card.number']}</p>}
                      <div className="flex gap-2">
                        <input type="text" name="expiry" value={formData.card.expiry} onChange={e => setFormData(prev => ({ ...prev, card: { ...prev.card, expiry: e.target.value } }))} className={`w-full border-2 rounded-lg px-3 py-2 ${errors['card.expiry'] ? 'border-red-500' : 'border-yellow-200'}`} placeholder="MM/YY" maxLength={5} />
                        <input type="text" name="cvc" value={formData.card.cvc} onChange={e => setFormData(prev => ({ ...prev, card: { ...prev.card, cvc: e.target.value } }))} className={`w-full border-2 rounded-lg px-3 py-2 ${errors['card.cvc'] ? 'border-red-500' : 'border-yellow-200'}`} placeholder="CVC" maxLength={3} />
                      </div>
                      {errors['card.expiry'] && <p className="text-red-500 text-sm mt-1">{errors['card.expiry']}</p>}
                      {errors['card.cvc'] && <p className="text-red-500 text-sm mt-1">{errors['card.cvc']}</p>}
                      <input type="text" name="name" value={formData.card.name} onChange={e => setFormData(prev => ({ ...prev, card: { ...prev.card, name: e.target.value } }))} className={`w-full border-2 rounded-lg px-3 py-2 ${errors['card.name'] ? 'border-red-500' : 'border-yellow-200'}`} placeholder="Name on Card" />
                      {errors['card.name'] && <p className="text-red-500 text-sm mt-1">{errors['card.name']}</p>}
                    </div>
                  )}
                  {/* UPI Payment UI */}
                  {formData.paymentMethod === 'upi' && (
                    <div className="bg-gray-50 rounded-lg p-4 mt-2">
                      <input type="text" name="upi" value={formData.upi} onChange={handleInputChange} className={`w-full border-2 rounded-lg px-3 py-2 ${errors.upi ? 'border-red-500' : 'border-yellow-200'}`} placeholder="Enter UPI ID (e.g. name@bank)" />
                      {errors.upi && <p className="text-red-500 text-sm mt-1">{errors.upi}</p>}
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Delivery Address</h3>
                    <p className="text-gray-600">{formData.firstName} {formData.lastName}<br />{formData.address}<br />{formData.city}, {formData.state} - {formData.pincode}<br />Phone: {formData.phone}</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setCurrentStep(2)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">Back</button>
                    <button onClick={handlePlaceOrder} disabled={isLoading} className="flex-1 bg-gradient-to-r from-pink-600 to-yellow-400 text-white py-3 rounded-lg font-semibold hover:scale-105 transition shadow disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? 'Placing Order...' : 'Place Order'}</button>
                  </div>
                </div>
              )}
              {currentStep === 4 && orderConfirmation && (
                <div className="space-y-6 text-center">
                  <h2 className="text-2xl font-bold text-green-700 mb-6">Order Placed Successfully!</h2>
                  <p className="text-lg">Thank you for your order. Your order ID is <span className="font-mono font-bold">{orderConfirmation.orderId}</span>.</p>
                  <p className="text-lg">Track your order: <a href={orderConfirmation.trackingUrl} className="text-pink-600 underline" target="_blank" rel="noopener noreferrer">{orderConfirmation.trackingNumber}</a></p>
                  <button onClick={() => navigate('/orders')} className="mt-6 bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition">View My Orders</button>
                </div>
              )}
            </div>
          </div>
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
              <h2 className="text-xl font-bold mb-4 text-neutral-900">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity || 1}</p>
                    </div>
                    <span className="font-semibold">₹{typeof item.price === 'string' ? parseInt(item.price.replace(/[^\d]/g, '')) : item.price || 0}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>{deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}</span></div>
                <div className="flex justify-between font-bold text-lg text-pink-600 border-t pt-2"><span>Total</span><span>₹{total}</span></div>
              </div>
              {deliveryCharge > 0 && (<div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200"><p className="text-sm text-yellow-800">Add ₹{2000 - subtotal} more for free delivery!</p></div>)}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 