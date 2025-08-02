import { useState } from 'react';

function OtpForm({ onSubmit, onResend, loading, successMessage }) {
  const [otp, setOtp] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      onSubmit(otp);
      setShowSuccess(true);
    } else {
      alert('Please enter a 6-digit OTP');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Enter OTP</h2>
      <input
        type="text"
        maxLength={6}
        pattern="[0-9]{6}"
        placeholder="6-digit OTP"
        className="w-full mb-4 px-4 py-2 border rounded text-center tracking-widest text-lg"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
        required
      />
      <button type="submit" className="w-full bg-primary text-white py-2 rounded font-semibold mb-2" disabled={loading}>
        Verify OTP
      </button>
      <button type="button" className="w-full border border-primary text-primary py-2 rounded font-semibold" onClick={onResend} disabled={loading}>
        Resend OTP
      </button>
      {showSuccess && successMessage && (
        <div className="text-green-600 text-center mt-4">{successMessage}</div>
      )}
    </form>
  );
}

export default OtpForm; 