"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, Lock, UserPlus } from "lucide-react";
import { useAuth } from "@/lib/auth/useAuth";

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

   try {
  await register(name, email, phone, password);

  router.push("/");
  router.refresh();
} catch (err: any) {
  setError(err.message);
} finally {
  setLoading(false);
}

    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-lg border border-gray-100 p-8">

      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-gray-900">
          Create Account 🍕
        </h1>

        <p className="text-gray-500 mt-2">
          Join Pizza Town today
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Name */}

        <div>

          <label className="block text-sm font-semibold mb-2">
            Full Name
          </label>

          <div className="relative">

            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              required
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="Syed Sufiyan Ali"
              className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:border-red-500 outline-none"
            />

          </div>

        </div>

        {/* Email */}

        <div>

          <label className="block text-sm font-semibold mb-2">
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
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:border-red-500 outline-none"
            />

          </div>

        </div>

        {/* Phone */}

        <div>

          <label className="block text-sm font-semibold mb-2">
            Phone Number
          </label>

          <div className="relative">

            <Phone
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              required
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
              placeholder="03XXXXXXXXX"
              className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:border-red-500 outline-none"
            />

          </div>

        </div>

        {/* Password */}

        <div>

          <label className="block text-sm font-semibold mb-2">
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
              placeholder="********"
              className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:border-red-500 outline-none"
            />

          </div>
          <p className="mt-2 text-xs text-gray-500">
  Password must be at least <strong>8 characters</strong>, include
  <strong> 1 uppercase letter</strong> and
  <strong> 1 number</strong>.
</p>

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

            "Creating Account..."

          ) : (

            <>
              <UserPlus size={18}/>
              Register
            </>

          )}

        </button>

      </form>

      <div className="mt-6 text-center text-sm">

        Already have an account?{" "}

        <Link
          href="/login"
          className="text-red-500 font-semibold hover:underline"
        >
          Login
        </Link>

      </div>

    </div>
  );
}