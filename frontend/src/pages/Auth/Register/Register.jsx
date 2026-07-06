import React from "react";
import RegisterForm from "./RegisterForm";
import useRegister from "./UseRegister";

const Register = () => {
  const { handleRegister, loading, goLogin } = useRegister();

  return (
    <div className="relative">
      <button
        onClick={goLogin}
        className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Login
      </button>

      <RegisterForm onSubmit={handleRegister} loading={loading} />
    </div>
  );
};

export default Register;