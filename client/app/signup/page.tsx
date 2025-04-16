"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { SIGNUP, SIGNUP_WITH_GOOGLE } from "@/graphql/mutations";
import Cookies from "js-cookie";
import Link from "next/link";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

interface SignupFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const [signup, { loading, error }] = useMutation(SIGNUP);
  const [signupWithGoogle] = useMutation(SIGNUP_WITH_GOOGLE);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>();

  const onSubmit = async (formData: SignupFormInputs) => {
    try {
      const response = await signup({ variables: formData });
      if (response.data) {
        Cookies.set("token", response.data.signup.token, {
          secure: true,
          sameSite: "strict",
        });
        router.push("/home");
      }
    } catch (err) {
      console.error("Signup Error:", err);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await signupWithGoogle({
        variables: { token: credentialResponse.credential },
      });

      Cookies.set("token", response.data.googleSignup.token, {
        secure: true,
        sameSite: "strict",
      });

      router.push("/home");
    } catch (err: any) {
      const message = err?.message || "Google Signup failed. Please try again.";

      toast.error(message);

      // Optional: Redirect to login if account exists
      if (message.includes("already exists")) {
        setTimeout(() => router.push("/signin"), 3000);
      }

      console.error("Google Signup Error:", message);
    }
  };

  const handleGithubSignup = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=user:email`;
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-gray-200 to-blue-400"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-colour text-sm"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h2
          className="text-white text-2xl font-bold text-center mb-6"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Create Your Account
        </motion.h2>

        {error && (
          <motion.p
            className="text-red-500 text-center bg-gray-700 p-2 rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {error.message}
          </motion.p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input
            type="text"
            placeholder="First Name"
            className="mb-2 w-full px-12 py-2.5 rounded-full bg-[#5C6691]"
            {...register("firstName", { required: "First name is required" })}
          />
          {errors.firstName && (
            <p className="text-red-400 text-sm mt-1">
              {errors.firstName.message}
            </p>
          )}

          <input
            type="text"
            placeholder="Last Name"
            className="mb-2 w-full px-12 py-2.5 rounded-full bg-[#5C6691]"
            {...register("lastName", { required: "Last name is required" })}
          />
          {errors.lastName && (
            <p className="text-red-400 text-sm mt-1">
              {errors.lastName.message}
            </p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="mb-2 w-full px-12 py-2.5 rounded-full bg-[#5C6691]"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="mb-4 w-full px-12 py-2.5 rounded-full bg-[#5C6691]"
              {...register("password", { required: "Password is required" })}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          <motion.button
            type="submit"
            className="text-white font-medium w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </motion.button>
        </form>

        <div className="my-4 text-center text-gray-400">or</div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.error("Google Login Failed")}
          />
        </div>

        <button
          onClick={handleGithubSignup}
          className="mt-3 flex items-center justify-center gap-2 bg-black text-white py-2.5 px-6 rounded-full w-full"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .5C5.5.5.5 5.7.5 12.2c0 5.2 3.4 9.5 8 11.1.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2.9 1.6 2.3 1.1 2.9.8.1-.7.4-1.1.7-1.4-2.6-.3-5.4-1.3-5.4-5.7 0-1.2.4-2.1 1.1-2.9 0-.3-.5-1.3.1-2.8 0 0 .9-.3 2.9 1.1.9-.2 1.9-.3 2.9-.3s2 .1 2.9.3c2-1.4 2.9-1.1 2.9-1.1.6 1.5.1 2.5.1 2.8.7.8 1.1 1.7 1.1 2.9 0 4.4-2.8 5.4-5.4 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.7-1.6 8.1-5.9 8.1-11.1C23.5 5.7 18.5.5 12 .5z" />
          </svg>
          Sign up with GitHub
        </button>

        <p className="text-gray-400 text-center text-xs mt-4">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-blue-400 cursor-pointer underline"
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Signup;
