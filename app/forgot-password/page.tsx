"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "If that email exists, a reset link has been sent.");
      } else {
        setError(data.message || "Failed to process request");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-24">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900">Forgot Password 🔐</h1>
          <p className="text-gray-500 mt-2">
            Enter your email and we'll send you instructions to reset your password.
          </p>
        </div>

        {message ? (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 text-center text-sm font-medium">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-semibold text-sm mb-2 block text-gray-700">Email Address</label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:border-red-500 outline-none transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition flex justify-center items-center gap-2"
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <Send size={18} />
                  Send Reset Link
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
