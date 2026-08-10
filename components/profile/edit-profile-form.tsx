"use client";

import { useState } from "react";

type Props = {
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  onUpdated: (user: {
    name: string;
    email: string;
    phone?: string;
  }) => void;
};

export default function EditProfileForm({
  user,
  onUpdated,
}: Props) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    const token = localStorage.getItem("pizza_token");

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        phone,
      }),
    });

    const json = await res.json();

    setLoading(false);

    if (!json.success) {
      setError(json.message || "Unable to update profile.");
      return;
    }

    setSuccess("Profile updated successfully! 🎉");

    onUpdated({
      ...user,
      name,
      phone,
    });
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

      <h2 className="text-2xl font-black mb-6">
        ✏️ Edit Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block text-sm font-semibold mb-2">
            Full Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-red-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Email
          </label>

          <input
            value={user.email}
            readOnly
            className="w-full rounded-xl border bg-gray-100 border-gray-200 px-4 py-3 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Phone Number
          </label>

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-red-500 outline-none"
          />
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

      </form>

    </div>
  );
}