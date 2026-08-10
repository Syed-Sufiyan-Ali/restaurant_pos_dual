"use client";
import { useAuth } from "@/lib/auth/useAuth";
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Phone } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { totalItems, toggleCart } = useCartStore();
  const { user, logout } = useAuth();
  const count = totalItems();
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = [{ href:"/", label:"Home" },{ href:"/menu", label:"Menu" },{ href:"/menu#deals", label:"Deals" },{ href:"/about", label:"About" }];
  return (
    <motion.nav initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-lg shadow-black/5" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white text-xl">🍕</span>
            </div>
            <div className="hidden sm:block">
              <p className={`font-black text-lg leading-none ${scrolled ? "text-gray-900" : "text-white"}`}>Pizza Town</p>
              <p className={`text-xs font-medium ${scrolled ? "text-red-500" : "text-red-300"}`}>Sukkur</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={`text-sm font-semibold transition-colors hover:text-red-500 ${scrolled ? "text-gray-700" : "text-white/90"}`}>{l.label}</Link>
            ))}
          </div>
         <div className="flex items-center gap-3">

  <a
    href="tel:+923315633133"
    className={`hidden md:flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border transition-all hover:scale-105 ${
      scrolled
        ? "border-red-200 text-red-600 hover:bg-red-50"
        : "border-white/30 text-white hover:bg-white/10"
    }`}
  >
    <Phone size={14} />
    Call Now
  </a>

  {!user ? (
    <>
      <Link
        href="/login"
        className={`hidden md:flex px-4 py-2 rounded-full text-sm font-semibold transition ${
          scrolled
            ? "text-gray-700 hover:text-red-500"
            : "text-white hover:text-red-300"
        }`}
      >
        Login
      </Link>

      <Link
        href="/register"
        className="hidden md:flex bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
      >
        Join Us
      </Link>
    </>
  ) : (
    <div className="relative hidden md:block">

      <button
        onClick={() => setProfileOpen(!profileOpen)}
        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
      >
        <User size={16} />
        {user.name.split(" ")[0]}
      </button>

      <AnimatePresence>
        {profileOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border overflow-hidden"
          >
            <Link
              href="/profile"
              className="block px-5 py-3 hover:bg-gray-50"
            >
              👤 My Profile
            </Link>

            <Link
              href="/profile"
              className="block px-5 py-3 hover:bg-gray-50"
            >
              📦 My Orders
            </Link>
            
            <button
              onClick={() => {
                logout();
                setProfileOpen(false);
              }}
              className="w-full text-left px-5 py-3 text-red-500 hover:bg-red-50"
            >
              🚪 Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )}

  <button
    onClick={toggleCart}
    className="relative flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-full font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-md shadow-red-500/30"
  >
    <ShoppingCart size={16} />
    <span className="hidden sm:inline">Cart</span>

    <AnimatePresence> 
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-gray-900 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center"
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  </button>

  <button
    onClick={() => setMobileOpen(!mobileOpen)}
    className={`md:hidden p-2 rounded-lg transition-colors ${
      scrolled
        ? "text-gray-700 hover:bg-gray-100"
        : "text-white hover:bg-white/10"
    }`}
  >
    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
  </button>

</div>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-xl">
            <div className="px-4 py-4 flex flex-col gap-1">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  className="text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors">{l.label}</Link>
              ))}
              {!user ? (
  <>
    <Link
      href="/login"
      onClick={() => setMobileOpen(false)}
      className="text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-red-50"
    >
      Login
    </Link>

    <Link
      href="/register"
      onClick={() => setMobileOpen(false)}
      className="bg-red-500 text-white text-center py-3 rounded-xl font-semibold"
    >
      Join Us
    </Link>
  </>
) : (
  <>
    <Link
      href="/profile"
      onClick={() => setMobileOpen(false)}
      className="text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-red-50"
    >
      👤 My Profile
    </Link>

    <button
      onClick={() => {
        logout();
        setMobileOpen(false);
      }}
      className="text-left text-red-500 font-semibold py-3 px-4 rounded-xl hover:bg-red-50"
    >
      Logout
    </button>
  </>
)}
              <a href="tel:+923315633133" className="flex items-center gap-2 text-red-600 font-semibold py-3 px-4 rounded-xl hover:bg-red-50 transition-colors mt-1">
                <Phone size={16} />+92 331 5633133
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
