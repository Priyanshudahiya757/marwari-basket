import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function LoginForm() {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
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

  // Handle OTP input changes
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
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

  // Simulate sending OTP
  const sendOTP = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast.success(`OTP sent to ${phoneOrEmail}`);
      
      // Move to OTP step
      setStep('otp');
      setResendTimer(60);
      setCanResend(false);
      
      // Focus first OTP input
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
      
    } catch {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Simulate OTP verification
  const verifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful verification
      toast.success('Login successful!');
      
      // Simulate redirect after a short delay
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
      
      // Focus first OTP input
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
      
    } catch {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Go back to phone input
  const goBack = () => {
    setStep('phone');
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {step === 'phone' ? 'Login to Your Account' : 'Enter OTP'}
            </h2>
            <p className="text-sm text-gray-600">
              {step === 'phone' 
                ? 'Enter your phone number or email to continue' 
                : `We've sent a code to ${phoneOrEmail}`
              }
            </p>
          </div>

          {/* Phone/Email Step */}
          {step === 'phone' && (
            <form onSubmit={(e) => { e.preventDefault(); sendOTP(); }} className="space-y-5">
              <div>
                <label htmlFor="phoneOrEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number or Email
                </label>
                <input
                  id="phoneOrEmail"
                  type="text"
                  placeholder="Enter your phone number or email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors duration-200"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-yellow-400 text-black py-3 px-4 rounded-lg font-semibold hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={loading || !phoneOrEmail.trim()}
              >
                {loading ? 'Sending OTP...' : 'Continue'}
              </button>
            </form>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <div className="space-y-5">
              {/* OTP Inputs */}
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

              {/* Verify Button */}
              <button 
                onClick={verifyOTP}
                className="w-full bg-yellow-400 text-black py-3 px-4 rounded-lg font-semibold hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={loading || otp.join('').length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              {/* Resend OTP */}
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

              {/* Back Button */}
              <button
                onClick={goBack}
                className="w-full text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm"
              >
                ← Back to phone/email
              </button>
            </div>
          )}

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              New to Marwari Basket?{' '}
              <Link 
                to="/signup" 
                className="font-medium text-yellow-600 hover:text-yellow-700 hover:underline transition-colors duration-200"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm; 