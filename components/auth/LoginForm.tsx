"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth/useAuth";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const success = await login(email, password);

    setLoading(false);

    if (!success) {
      setError("Invalid email or password.");
      return;
    }

    router.push("profile");
    router.refresh();
  }

  return (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 border border-gray-100">

      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-gray-900">
          Welcome Back 🍕
        </h1>

        <p className="text-gray-500 mt-2">
          Login to your Pizza Town account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="font-semibold text-sm mb-2 block">
            Email
          </label>

          <div className="relative">

            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              required
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:border-red-500 outline-none"
              placeholder="you@example.com"
            />

          </div>
        </div>

        <div>

          <label className="font-semibold text-sm mb-2 block">
            Password
          </label>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="password"
              required
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:border-red-500 outline-none"
              placeholder="********"
            />

          </div>

        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition flex justify-center items-center gap-2"
        >

          {loading ? (

            "Signing In..."

          ) : (

            <>
              <LogIn size={18}/>
              Login
            </>

          )}

        </button>

      </form>

      <div className="mt-6 text-center text-sm">

        <Link
          href="/forgot-password"
          className="text-red-500 hover:underline"
        >
          Forgot Password?
        </Link>

      </div>

      <div className="mt-3 text-center text-sm">

        Don't have an account?{" "}

        <Link
          href="/register"
          className="text-red-500 font-semibold hover:underline"
        >
          Register
        </Link>

      </div>

    </div>
  );
}