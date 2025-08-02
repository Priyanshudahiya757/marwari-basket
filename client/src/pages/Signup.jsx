import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Signup() {
  const [step, setStep] = useState('details'); // 'details' or 'otp'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef([]);
  const navigate = useNavigate();

  // Initialize OTP refs
  useEffect(() => {
    otpRefs.current = otpRefs.current.slice(0, 6);
  }, []);

  // Handle resend timer
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle OTP input changes
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace in OTP inputs
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Validate form data
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error('Phone number is required');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  // Send OTP for registration
  const sendOTP = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`OTP sent to ${formData.phone}`);
      
      setStep('otp');
      setResendTimer(60);
      setCanResend(false);
      
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
      
    } catch {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and complete registration
  const verifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Registration successful! Welcome to Marwari Basket!');
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('OTP resent successfully!');
      setResendTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
      
    } catch {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Go back to details step
  const goBack = () => {
    setStep('details');
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {step === 'details' ? 'Create Your Account' : 'Verify Your Phone'}
            </h2>
            <p className="text-sm text-gray-600">
              {step === 'details' 
                ? 'Join Marwari Basket and discover amazing products' 
                : `We've sent a code to ${formData.phone}`
              }
            </p>
          </div>

          {/* Details Step */}
          {step === 'details' && (
            <form onSubmit={sendOTP} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors duration-200"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors duration-200"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors duration-200"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors duration-200"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors duration-200"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-yellow-400 text-black py-3 px-4 rounded-lg font-semibold hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Enter 6-digit OTP
                </label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors duration-200 text-lg font-semibold"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    />
                  ))}
                </div>
              </div>

              <button 
                onClick={verifyOTP}
                className="w-full bg-yellow-400 text-black py-3 px-4 rounded-lg font-semibold hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={loading || otp.join('').length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify & Create Account'}
              </button>

              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend OTP in {resendTimer}s
                  </p>
                ) : (
                  <button
                    onClick={handleResendOTP}
                    disabled={loading || !canResend}
                    className="text-sm text-yellow-600 hover:text-yellow-700 hover:underline transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                onClick={goBack}
                className="w-full text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm"
              >
                ← Back to details
              </button>
            </div>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-yellow-600 hover:text-yellow-700 hover:underline transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 