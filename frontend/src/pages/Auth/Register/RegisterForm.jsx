import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./RegisterSchema";
import { useForm } from "react-hook-form";

export default function RegisterForm({ onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  return (
    <form
      className="flex items-center justify-center min-h-screen"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center gap-2 box-border border border-black p-3 w-[400px] rounded-lg">
        <h2 className="text-xl font-bold">Register</h2>

        {/* Name */}
        <label className="flex flex-col">
          <span className="mb-1">Name:</span>
          <input
            type="text"
            placeholder="Enter your name"
            className="border rounded-md border-black p-2 w-[250px]"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500">{errors.name.message}</p>
          )}
        </label>

        {/* Username */}
        <label className="flex flex-col">
          <span className="mb-1">Username:</span>
          <input
            type="text"
            placeholder="Choose a username"
            className="border rounded-md border-black p-2 w-[250px]"
            {...register("userName")}
          />
          {errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
          )}
        </label>

        {/* Email */}
        <label className="flex flex-col">
          <span className="mb-1">Email:</span>
          <input
            type="email"
            placeholder="Enter your email"
            className="border rounded-md border-black p-2 w-[250px]"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </label>

        {/* Password */}
        <label className="flex flex-col">
          <span className="mb-1">Password:</span>
          <input
            type="password"
            placeholder="Enter password"
            className="border rounded-md border-black p-2 w-[250px]"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </label>

        {/* Confirm Password */}
        <label className="flex flex-col">
          <span className="mb-1">Confirm Password:</span>
          <input
            type="password"
            placeholder="Confirm password"
            className="border rounded-md border-black p-2 w-[250px]"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </label>

        <button
          type="submit"
          disabled={!isValid || loading}
          className={`w-[250px] py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </form>
  );
}