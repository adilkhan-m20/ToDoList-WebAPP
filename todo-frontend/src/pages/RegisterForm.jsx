import RegisterForm from "../components/RegisterForm";

export default function RegisterPage({ onRegister, switchToLogin }) {
  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-2xl rounded-2xl p-8 mt-10">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
        Create an Account
      </h1>

      <RegisterForm onRegister={onRegister} switchToLogin={switchToLogin} />
    </div>
  );
}
