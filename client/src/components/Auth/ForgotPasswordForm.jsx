import { useState } from 'react';

function ForgotPasswordForm({ onOtpClick, loading }) {
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormLoading(true);
    onOtpClick(emailOrMobile);
    setFormLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
      <input
        type="text"
        placeholder="Email or Mobile"
        className="w-full mb-4 px-4 py-2 border rounded"
        value={emailOrMobile}
        onChange={(e) => setEmailOrMobile(e.target.value)}
        required
      />
      <button type="submit" className="w-full bg-primary text-white py-2 rounded font-semibold mb-2" disabled={!emailOrMobile || formLoading || loading}>
        {formLoading || loading ? 'Requesting OTP...' : 'Request OTP'}
      </button>
    </form>
  );
}

export default ForgotPasswordForm; 