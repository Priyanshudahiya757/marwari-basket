import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function ForgotPassword() {
  const [step, setStep] = useState('email'); // 'email', 'otp', 'password'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  // Send reset OTP
  const sendResetOTP = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Reset OTP sent to ${email}`);
      
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

  // Verify OTP
  const verifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('OTP verified! Set your new password');
      setStep('password');
      
    } catch {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Password reset successful! Please login with your new password');
      
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      
    } catch {
      toast.error('Failed to reset password. Please try again.');
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

  // Go back to email step
  const goBackToEmail = () => {
    setStep('email');
    setOtp(['', '', '', '', '', '']);
  };

  // Go back to OTP step
  const goBackToOTP = () => {
    setStep('otp');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {step === 'email' && 'Reset Your Password'}
              {step === 'otp' && 'Verify Your Email'}
              {step === 'password' && 'Set New Password'}
            </h2>
            <p className="text-sm text-gray-600">
              {step === 'email' && 'Enter your email to receive a reset code'}
              {step === 'otp' && `We've sent a code to ${email}`}
              {step === 'password' && 'Create a new password for your account'}
            </p>
          </div>

          {/* Email Step */}
          {step === 'email' && (
            <form onSubmit={sendResetOTP} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-yellow-400 text-black py-3 px-4 rounded-lg font-semibold hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={loading || !email.trim()}
              >
                {loading ? 'Sending OTP...' : 'Send Reset Code'}
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
                {loading ? 'Verifying...' : 'Verify OTP'}
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
                onClick={goBackToEmail}
                className="w-full text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm"
              >
                ← Back to email
              </button>
            </div>
          )}

          {/* Password Step */}
          {step === 'password' && (
            <form onSubmit={resetPassword} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors duration-200"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

        <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors duration-200"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-yellow-400 text-black py-3 px-4 rounded-lg font-semibold hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={loading || !newPassword || !confirmPassword}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>

              <button
                onClick={goBackToOTP}
                className="w-full text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm"
              >
                ← Back to OTP
              </button>
            </form>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
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