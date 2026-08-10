
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">🍕</div>
              <div><p className="font-black text-xl">Pizza Town</p><p className="text-red-400 text-sm font-semibold">Sukkur</p></div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">Sukkur's favourite pizza destination. 16 signature flavours, fresh ingredients, and free home delivery.</p>
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/Pizzatownsukkur1/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors"><span className="text-sm font-bold">f</span></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-pink-600 rounded-xl flex items-center justify-center transition-colors"><span className="text-sm font-bold">ig</span></a>
              <a href="https://wa.me/923315633133" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-green-600 rounded-xl flex items-center justify-center transition-colors"><MessageCircle size={18} /></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-3">
              {[{label:"Home",href:"/"},{label:"Full Menu",href:"/menu"},{label:"Pizza",href:"/menu?category=pizza"},{label:"Burgers",href:"/menu?category=burgers"},{label:"Deals",href:"/menu?category=deals"},{label:"About Us",href:"/about"}].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-red-500 rounded-full group-hover:w-2 transition-all" />{link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"><MapPin size={14} className="text-red-400" /></div>
                <p className="text-gray-400 text-sm">Military Road Near Public School, Sukkur, Sindh 65200</p>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0"><Phone size={14} className="text-red-400" /></div>
                <div className="space-y-1">
                  <a href="tel:+923315633133" className="text-gray-400 hover:text-white text-sm transition-colors block">0331-5633133</a>
                  <a href="tel:+92715633138" className="text-gray-400 hover:text-white text-sm transition-colors block">071-5633138</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0"><Mail size={14} className="text-red-400" /></div>
                <a href="mailto:pizzatownsukkur1@gmail.com" className="text-gray-400 hover:text-white text-sm transition-colors">pizzatownsukkur1@gmail.com</a>
              </li>
            </ul>
            <a href="https://wa.me/923315633133?text=Hi! I would like to place an order." target="_blank" rel="noopener noreferrer"
              className="mt-5 flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors w-fit">
              <MessageCircle size={16} />Order via WhatsApp
            </a>
          </div>
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">Opening Hours</h4>
            <ul className="space-y-3">
              {[{day:"Sunday",time:"10:00 AM – 12:00 AM"},{day:"Monday",time:"12:00 PM – 1:00 AM"},{day:"Tuesday",time:"12:00 PM – 1:00 AM"},{day:"Wednesday",time:"12:00 PM – 1:00 AM"},{day:"Thursday",time:"12:00 PM – 1:00 AM"},{day:"Friday",time:"12:00 PM – 1:00 AM"},{day:"Saturday",time:"12:00 PM – 1:00 AM"}].map((h) => (
                <li key={h.day} className="flex justify-between text-sm">
                  <span className="text-gray-500">{h.day}</span>
                  <span className="text-gray-300 font-medium">{h.time}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-semibold">Open Now</span>
            </div>
            <div className="mt-4 bg-white/5 rounded-xl p-3 text-center border border-white/10">
              <MapPin size={20} className="text-red-400 mx-auto mb-1" />
              <a href="https://maps.google.com/?q=Pizza+Town+Sukkur" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-white transition-colors">View on Google Maps →</a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">© 2024 Pizza Town Sukkur. All rights reserved.</p>
          <p className="text-gray-600 text-xs">Designed with ❤️ for Sukkur's food lovers</p>
        </div>
      </div>
    </footer>
  );
}
