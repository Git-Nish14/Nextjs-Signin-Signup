"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Github, Lock, Mail } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6 md:px-12">
        <div className="flex items-center">
          <Lock className="h-8 w-8 text-white mr-2" />
          <span className="font-bold text-2xl">Loginfy</span>
        </div>
        <div className="space-x-4">
          <button
            onClick={() => router.push("/signin")}
            className="text-white/80 hover:text-white transition duration-200"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="bg-white text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition duration-200"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 md:px-12 py-12">
        {/* Left Column - Text content */}
        <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Authentication{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-300">
              Simplified
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-md">
            Seamless authentication for your applications with multiple
            providers and secure token management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push("/signup")}
              className="bg-gradient-to-r from-pink-500 to-purple-600 py-3 px-8 rounded-xl font-semibold text-lg flex items-center justify-center hover:opacity-90 transition duration-300"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={() => router.push("/signin")}
              className="bg-white/10 backdrop-blur-sm border border-white/20 py-3 px-8 rounded-xl font-semibold text-lg hover:bg-white/20 transition duration-300"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Right Column - Authentication card */}
        <div className="md:w-1/2 max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-12 -top-12 h-40 w-40 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -left-12 -bottom-12 h-40 w-40 bg-blue-500/20 rounded-full blur-3xl"></div>

            <h2 className="text-2xl font-bold mb-6">Authentication Options</h2>

            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center hover:bg-white/10 transition cursor-pointer">
                <div className="bg-white/10 p-2 rounded-lg mr-4">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Email & Password</h3>
                  <p className="text-sm text-white/60">
                    Sign in with your email address
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center hover:bg-white/10 transition cursor-pointer">
                <div className="bg-white/10 p-2 rounded-lg mr-4">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Google</h3>
                  <p className="text-sm text-white/60">Sign in with Google</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center hover:bg-white/10 transition cursor-pointer">
                <div className="bg-white/10 p-2 rounded-lg mr-4">
                  <Github className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">GitHub</h3>
                  <p className="text-sm text-white/60">Sign in with GitHub</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 md:px-12 text-white/60 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span>© 2025 Loginfy. All rights reserved.</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms
            </a>
            <a href="#" className="hover:text-white transition">
              Help
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
