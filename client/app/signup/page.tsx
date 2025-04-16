"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@apollo/client";
import {
  SIGNUP,
  SIGNUP_WITH_GOOGLE,
  SIGNUP_WITH_GITHUB,
} from "@/graphql/mutations";
import Cookies from "js-cookie";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, Github } from "lucide-react";
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
  const [signupWithGitHub] = useMutation(SIGNUP_WITH_GITHUB);

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>();

  // ⏺ Email/Password Signup
  const onSubmit = async (formData: SignupFormInputs) => {
    try {
      const response = await signup({ variables: formData });
      if (response.data?.signup?.token) {
        Cookies.set("token", response.data.signup.token, {
          secure: true,
          sameSite: "strict",
        });
        router.push("/home");
      }
    } catch (err) {
      toast.error("Signup failed. Try again.");
      console.error("Signup Error:", err);
    }
  };

  // ⏺ Google Signup
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
      const message = err?.message || "Google Signup failed.";
      toast.error(message);
      if (message.includes("already exists")) {
        setTimeout(() => router.push("/signin"), 3000);
      }
    }
  };

  // ⏺ GitHub Signup Button Click
  const handleGithubSignup = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email`;
  };

  // ⏺ GitHub OAuth Callback Handler
  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    const registerWithGitHub = async () => {
      try {
        const res = await signupWithGitHub({ variables: { code } });
        Cookies.set("token", res.data.githubSignup.token, {
          secure: true,
          sameSite: "strict",
        });
        router.push("/home");
      } catch (err: any) {
        toast.error(err?.message || "GitHub signup failed.");
        if (err.message.includes("already exists")) {
          setTimeout(() => router.push("/signin"), 3000);
        }
      }
    };

    registerWithGitHub();
  }, [searchParams]);

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
            className="w-full px-12 py-2.5 rounded-full bg-[#5C6691]"
            {...register("firstName", { required: "First name is required" })}
          />
          {errors.firstName && (
            <p className="text-red-400">{errors.firstName.message}</p>
          )}

          <input
            type="text"
            placeholder="Last Name"
            className="w-full px-12 py-2.5 rounded-full bg-[#5C6691]"
            {...register("lastName", { required: "Last name is required" })}
          />
          {errors.lastName && (
            <p className="text-red-400">{errors.lastName.message}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full px-12 py-2.5 rounded-full bg-[#5C6691]"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-400">{errors.email.message}</p>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-12 py-2.5 rounded-full bg-[#5C6691]"
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

        <div className="flex flex-col gap-3">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google Signup Failed")}
          />

          <button
            onClick={handleGithubSignup}
            className="flex justify-center items-center gap-2 bg-black text-white py-2.5 rounded-full"
          >
            <Github className="w-5 h-5" />
            Sign up with GitHub
          </button>
        </div>

        <p className="text-gray-400 text-center text-xs mt-4">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-400 underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Signup;
