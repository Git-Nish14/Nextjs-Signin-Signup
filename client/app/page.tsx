"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 px-4">
      <div className="bg-white/20 backdrop-blur-lg border border-white/30 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-white mb-6">
          Welcome to LegalOne
        </h1>
        <p className="text-white/80 mb-10">Choose how you'd like to continue</p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => router.push("/signin")}
            className="w-full bg-blue-500 text-white py-2 text-lg font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="w-full bg-green-500 text-white py-2 text-lg font-semibold rounded-lg hover:bg-green-600 transition duration-300"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
