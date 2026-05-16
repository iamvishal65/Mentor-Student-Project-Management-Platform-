import { loginSchema } from "./LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginForm({ onSubmit, loading }) {
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ resolver: zodResolver(loginSchema), mode: "onChange" });

  return (
    <form
      className="flex  items-center justify-center min-h-screen "
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center gap-3 box-border border border-gray-300 p-6 w-[400px] rounded-xl shadow-md bg-white">
        <h2 className="text-2xl font-bold mb-3">Login</h2>

        {/* Email */}
        <label className="flex flex-col w-full">
          <span className="mb-1 text-gray-700">Email:</span>
          <input
            type="email"

            placeholder="Enter your email or enrollment no."

            placeholder="Enter your email "

            className="border rounded-md border-gray-400 p-2 w-full focus:border-blue-500 focus:outline-none"
            {...register("email", {
              required: "Email  is required",
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </label>

        {/* Password */}
        <label className="flex flex-col w-full relative">
          <span className="mb-1 text-gray-700">Password:</span>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="border rounded-md border-gray-400 p-2 w-full focus:border-blue-500 focus:outline-none"
            {...register("password", {
              required: "Password is required",
            })}
          />

          {/* Eye Icon */}
          <span
            className="absolute right-3 top-10 cursor-pointer text-gray-600"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>

          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </label>

        {/* Login Button */}
        <button
          type="submit"
          disabled={!isValid || loading}
          className={`${
            !isValid || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white py-2 px-6 rounded-md w-full transition`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  );
}
