import AdminLoginForm from '../../components/Auth/AdminLoginForm';

export default function AdminLogin() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded shadow max-w-md w-full">
        <AdminLoginForm />
      </div>
    </div>
  );
} 