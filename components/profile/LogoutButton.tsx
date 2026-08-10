"use client";

import { useRouter } from "next/navigation";


export default function LogoutButton() {
  const router = useRouter();

  function logout() {
    localStorage.removeItem("pizza_token");

    router.push("/");

    router.refresh();
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-black mb-3">
        Logout
      </h2>

      <p className="text-gray-500 mb-6">
        Sign out from your Pizza Town account.
      </p>

      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold transition"
      >
        Logout
      </button>
    </div>
  );
}