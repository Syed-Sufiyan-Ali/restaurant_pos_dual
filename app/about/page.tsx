"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, Clock, Star, Users, Award, ArrowRight, MessageCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-80 flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=1400&q=80" alt="Pizza Town" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }}>
            <p className="text-red-400 font-bold text-sm uppercase tracking-widest mb-2">Our Story</p>
            <h1 className="text-4xl sm:text-5xl font-black text-white">About Pizza Town</h1>
          </motion.div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div initial={{ opacity:0,x:-30 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }}>
              <p className="text-red-500 font-bold text-sm uppercase tracking-widest mb-3">Est. 2012 · Sukkur</p>
              <h2 className="text-3xl font-black text-gray-900 mb-5">Sukkur's Favourite Pizza Destination</h2>
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>Pizza Town started on Military Road, Sukkur with a simple mission — to bring authentic, high-quality pizza to the people of Sukkur at an affordable price. What began as a small takeaway spot quickly grew into the city's most loved restaurant.</p>
                <p>We take pride in our 16 signature pizza flavours, each crafted with fresh ingredients and bold spices. From our world-famous Pizza Town Special to the desi-inspired Tikka and Karahi pizzas — there's something for everyone.</p>
                <p>Today, thousands of happy customers order from us every month, and free home delivery across Sukkur means your favourite pizza is never more than a phone call away.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity:0,x:30 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} className="relative">
              <div className="relative h-80 rounded-3xl overflow-hidden shadow-2xl">
                <Image src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80" alt="Our Pizza" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-2xl">⭐</div>
                <div><p className="font-black text-gray-900 text-lg">4.8 / 5</p><p className="text-gray-400 text-xs">3,400+ Reviews</p></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-14 bg-gradient-to-r from-red-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[{icon:Users,value:"50,000+",label:"Happy Customers"},{icon:Award,value:"16",label:"Pizza Flavours"},{icon:Star,value:"4.8★",label:"Average Rating"},{icon:Clock,value:"12+",label:"Years Serving"}].map((s,i) => (
              <motion.div key={s.label} initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }} className="text-center text-white">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3"><s.icon size={22} className="text-white" /></div>
                <p className="text-3xl font-black">{s.value}</p>
                <p className="text-red-100 text-sm mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900">Find Us</h2>
            <p className="text-gray-400 mt-2">Visit us in person or order for delivery</p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <motion.div initial={{ opacity:0,x:-20 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} className="bg-gray-100 rounded-3xl h-72 flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <MapPin size={40} className="text-red-500 mx-auto mb-3" />
                <p className="font-bold text-gray-900">Military Road, Near Public School</p>
                <p className="text-gray-400 text-sm mt-1">Sukkur, Sindh 65200</p>
                <a href="https://maps.google.com/?q=Pizza+Town+Sukkur+Military+Road" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block bg-red-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-600 transition-colors">Open in Google Maps</a>
              </div>
            </motion.div>
            <motion.div initial={{ opacity:0,x:20 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} className="space-y-4">
              {[
                {icon:Phone,title:"Call Us",lines:["0331-5633133","071-5633138"],action:"tel:+923315633133",al:"Call Now"},
                {icon:MessageCircle,title:"WhatsApp Order",lines:["Chat with us on WhatsApp","Quick response guaranteed"],action:"https://wa.me/923315633133",al:"Open WhatsApp"},
                {icon:MapPin,title:"Address",lines:["Military Road, Near Public School","Sukkur, Sindh 65200"],action:"https://maps.google.com/?q=Pizza+Town+Sukkur",al:"Get Directions"},
                {icon:Clock,title:"Opening Hours",lines:["Sunday: 10 AM – 12 AM","Mon–Sat: 12 PM – 1 AM"],action:null,al:""},
              ].map((item) => (
                <div key={item.title} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-100 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0"><item.icon size={20} className="text-red-500" /></div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                    {item.lines.map((l) => <p key={l} className="text-gray-400 text-xs mt-0.5">{l}</p>)}
                  </div>
                  {item.action && <a href={item.action} target={item.action.startsWith("http")?"_blank":undefined} rel="noopener noreferrer" className="self-center text-xs font-bold text-red-500 hover:text-red-600 whitespace-nowrap transition-colors">{item.al} →</a>}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Ready to Order?</h2>
            <p className="text-gray-400 mb-8">Browse our menu and get your favourite delivered fresh.</p>
            <Link href="/menu"><button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-red-500/30 transition-all hover:scale-105 inline-flex items-center gap-2">Order Now <ArrowRight size={20} /></button></Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
