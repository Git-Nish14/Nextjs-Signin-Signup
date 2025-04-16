"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, Github } from "lucide-react";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

import {
  SIGNIN,
  SIGNIN_WITH_GOOGLE,
  SIGNIN_WITH_GITHUB,
} from "@/graphql/mutations";

interface LoginFormInputs {
  email: string;
  password: string;
}

const SigninPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [signin, { loading, error }] = useMutation(SIGNIN);
  const [signinWithGoogle] = useMutation(SIGNIN_WITH_GOOGLE);
  const [signinWithGitHub] = useMutation(SIGNIN_WITH_GITHUB);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  // ⚙️ Email/Password Signin
  const onSubmit = async (formData: LoginFormInputs) => {
    try {
      const response = await signin({
        variables: { email: formData.email, password: formData.password },
      });

      if (response.data?.signin?.token) {
        Cookies.set("token", response.data.signin.token, {
          secure: true,
          sameSite: "strict",
        });
        router.push("/home");
      }
    } catch (err) {
      toast.error("Invalid credentials");
    }
  };

  // ⚙️ Google Signin
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await signinWithGoogle({
        variables: { token: credentialResponse.credential },
      });

      Cookies.set("token", response.data.googleSignin.token, {
        secure: true,
        sameSite: "strict",
      });

      router.push("/home");
    } catch (err: any) {
      const errorMessage = err?.message || "Google Signin failed.";
      toast.error(errorMessage);
    }
  };

  // ⚙️ GitHub Login (OAuth redirect)
  const handleGithubLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email`;
  };

  // ⚙️ GitHub Redirect Callback Handler
  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    const handleGitHubCallback = async () => {
      try {
        const response = await signinWithGitHub({ variables: { code } });

        Cookies.set("token", response.data.githubSignin.token, {
          secure: true,
          sameSite: "strict",
        });

        router.push("/home");
      } catch (err: any) {
        toast.error(err.message || "GitHub Signin failed.");
      }
    };

    handleGitHubCallback();
  }, [searchParams, signinWithGitHub, router]);

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-gray-200 to-blue-400"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-white text-sm"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h2
          className="text-2xl font-bold text-center mb-6"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Welcome Back
        </motion.h2>

        {error && (
          <motion.p className="text-red-500 text-center bg-gray-700 p-2 rounded-md">
            {error.message}
          </motion.p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-12 py-2.5 rounded-full bg-[#5C6691]"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-400 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-12 py-2.5 rounded-full bg-[#5C6691]"
              {...register("password", { required: "Password is required" })}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-300"
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
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 font-medium"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <div className="my-4 text-center text-gray-400">or</div>

        <div className="flex flex-col gap-3">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google login failed")}
          />

          <button
            onClick={handleGithubLogin}
            className="flex justify-center items-center gap-2 bg-black text-white py-2.5 rounded-full"
          >
            <Github className="w-5 h-5" />
            Sign in with GitHub
          </button>
        </div>

        <p className="text-gray-400 text-center text-xs mt-4">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-400 underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SigninPage;
