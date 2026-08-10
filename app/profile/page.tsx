"use client";
import { useEffect, useState } from "react";
import ProfileCard from "@/components/profile/profile-card";
import EditProfileForm from "@/components/profile/edit-profile-form";
import LogoutButton from "@/components/profile/LogoutButton";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem("pizza_token");

        const res = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();

        if (json.success) {
          setUser(json.data);
        }
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg p-10 text-center max-w-md">
          <div className="text-6xl mb-5">🔒</div>

          <h2 className="text-3xl font-black mb-3">
            Login Required
          </h2>

          <p className="text-gray-500 mb-8">
            Please login to access your profile.
          </p>

          <a
            href="/login"
            className="inline-block bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold transition"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-28">

      <div className="max-w-5xl mx-auto px-4">

        <div className="mb-10">

          <h1 className="text-5xl font-black text-gray-900">
            My Profile
          </h1>

          <p className="text-gray-500 mt-2 text-lg">
            Manage your Pizza Town account
          </p>

        </div>

        <div className="space-y-8">

          <ProfileCard user={user} />

          <EditProfileForm
            user={user}
            onUpdated={(updatedUser) =>
              setUser({
                ...user,
                ...updatedUser,
              })
            }
          />

         < LogoutButton />

        </div>

      </div>

    </div>
  );
}