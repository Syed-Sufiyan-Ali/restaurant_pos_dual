"use client";

import { CalendarDays, Mail, Phone, ShoppingBag } from "lucide-react";

type Props = {
  user: {
    name: string;
    email: string;
    phone?: string;
    role: string;
    createdAt: string;
    totalOrders: number;
  };
};

export default function ProfileCard({ user }: Props) {
  const joined = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

      {/* Header */}

      <div className="bg-gradient-to-r from-red-500 to-orange-500 px-8 py-10 text-white">

        <div className="flex items-center gap-5">

          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-black">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>

            <h2 className="text-3xl font-black">
              {user.name}
            </h2>

            <p className="text-red-100 mt-1">
              Welcome back 👋
            </p>

          </div>

        </div>

      </div>

      {/* Body */}

      <div className="p-8 grid md:grid-cols-2 gap-6">

        <div className="flex gap-3 items-start">

          <Mail className="text-red-500 mt-1" size={20} />

          <div>

            <p className="text-xs uppercase tracking-widest text-gray-400">
              Email
            </p>

            <p className="font-semibold text-gray-800">
              {user.email}
            </p>

          </div>

        </div>

        <div className="flex gap-3 items-start">

          <Phone className="text-red-500 mt-1" size={20} />

          <div>

            <p className="text-xs uppercase tracking-widest text-gray-400">
              Phone
            </p>

            <p className="font-semibold text-gray-800">
              {user.phone || "Not Added"}
            </p>

          </div>

        </div>

        <div className="flex gap-3 items-start">

          <CalendarDays className="text-red-500 mt-1" size={20} />

          <div>

            <p className="text-xs uppercase tracking-widest text-gray-400">
              Member Since
            </p>

            <p className="font-semibold text-gray-800">
              {joined}
            </p>

          </div>

        </div>

        <div className="flex gap-3 items-start">

          <ShoppingBag className="text-red-500 mt-1" size={20} />

          <div>

            <p className="text-xs uppercase tracking-widest text-gray-400">
              Total Orders
            </p>

            <p className="font-semibold text-gray-800">
              {user.totalOrders}
            </p>

          </div>

        </div>

      </div>

      <div className="border-t border-gray-100 px-8 py-5 flex items-center justify-between">

        <span className="text-sm text-gray-500">
          Account Type
        </span>

        <span className="px-4 py-1.5 rounded-full bg-red-100 text-red-600 font-bold text-sm">
          {user.role}
        </span>

      </div>

    </div>
  );
}