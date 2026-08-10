"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, MapPin, Star, Flame, ChevronRight, Phone } from "lucide-react";
import { deals } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";
import ProductModal from "@/components/modals/ProductModal";
import { Product } from "@/types";
export default function HomePage() {
  const [sel, setSel] = useState<Product | null>(null);
const [products, setProducts] = useState<Product[]>([]);
const [categories, setCategories] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
  async function loadProducts() {
    try {
      const res = await fetch("/api/menu/items");
      const json = await res.json();

      if (json.success) {
        const mappedProducts = json.data.items.map((item: any) => ({
          id: item.slug,
          name: item.name,
          description: item.description,
          image: item.images?.[0]?.url || "",
          basePrice: Number(item.basePrice),
          category: item.category.slug,
          tag: item.tag,
          sizes: item.sizes.map((size: any) => ({
            label: size.label,
            price: Number(size.priceAddon),
            serves: size.serves,
          })),
          extras: item.addons,
          ingredients: item.ingredients.map((i: any) => i.name),
        }));

        setProducts(mappedProducts);
        const catRes = await fetch("/api/menu/categories");
const catJson = await catRes.json();

if (catJson.success) {
  const categoryImages: Record<string, string> = {
  pizza: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
  burgers: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  deals: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
  sides: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80",
  drinks: "https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=400&q=80",
};

const categoryIcons: Record<string, string> = {
  pizza: "🍕",
  burgers: "🍔",
  deals: "🔥",
  sides: "🍟",
  drinks: "🥤",
};

const mappedCategories = catJson.data.map((cat: any) => ({
  id: cat.slug,
  name: cat.name,
  description: cat.description ?? "",
  image: cat.imageUrl || categoryImages[cat.slug],
  icon: categoryIcons[cat.slug] || "🍽️",
}));

  setCategories(mappedCategories);
}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  loadProducts();
}, []);
const featured = products
  .filter((p) => p.tag === "bestseller" || p.tag === "new")
  .slice(0, 6);
  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&q=80" alt="Pizza" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
        </div>
        <div className="absolute top-1/4 right-[15%] w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity:0,x:-30 }} animate={{ opacity:1,x:0 }} transition={{ duration:0.6 }} className="flex items-center gap-2 mb-6">
              <span className="bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest">🔥 Sukkur's Favourite</span>
            </motion.div>
            <motion.h1 initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.7,delay:0.1 }} className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight">
              Taste the <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Perfection</span>
            </motion.h1>
            <motion.p initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.7,delay:0.2 }} className="mt-6 text-gray-300 text-lg leading-relaxed">
              16 signature pizza flavours, loaded burgers, and exclusive deals. Fresh ingredients, bold flavours — delivered hot to your door.
            </motion.p>
            <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.7,delay:0.3 }} className="flex items-center gap-6 mt-8">
              {[{icon:Star,label:"4.8 Rating",sub:"3,400+ Reviews"},{icon:Clock,label:"30–45 Min",sub:"Delivery Time"},{icon:MapPin,label:"Sukkur",sub:"Military Road"}].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center"><s.icon size={14} className="text-red-400" /></div>
                  <div><p className="text-white text-sm font-bold">{s.label}</p><p className="text-gray-400 text-xs">{s.sub}</p></div>
                </div>
              ))}
            </motion.div>
            <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.7,delay:0.4 }} className="flex flex-wrap gap-4 mt-10">
              <Link href="/menu"><button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-base hover:shadow-2xl hover:shadow-red-500/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">Order Now <ArrowRight size={18} /></button></Link>
              <Link href="/menu#deals"><button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-white/20 transition-all hover:scale-105 flex items-center gap-2">View Deals <Flame size={18} className="text-orange-400" /></button></Link>
            </motion.div>
          </div>
        </div>
      </section>
      <div className="bg-gradient-to-r from-red-600 to-orange-500 py-3">
        <div className="flex items-center justify-center gap-3 text-white text-sm font-semibold">
          <span className="animate-bounce">🎉</span> Free delivery on all orders above Rs. 500 — Call us at <a href="tel:+923315633133" className="underline underline-offset-2">0331-5633133</a> <span className="animate-bounce">🛵</span>
        </div>
      </div>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="text-center mb-10">
            <p className="text-red-500 font-bold text-sm uppercase tracking-widest mb-2">What are you craving?</p>
            <h2 className="text-3xl font-black text-gray-900">Browse Categories</h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }} whileHover={{ y:-4,scale:1.02 }}>
                <Link href={`/menu?category=${cat.id}`}>
                  <div className="group bg-gray-50 hover:bg-red-50 rounded-3xl p-5 text-center cursor-pointer transition-all border border-gray-100 hover:border-red-200">
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4">
                      <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className="absolute inset-0 flex items-center justify-center text-4xl">{cat.icon}</span>
                    </div>
                    <p className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">{cat.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{cat.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section id="deals" className="py-16 bg-gradient-to-br from-gray-900 to-red-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="flex items-center justify-between mb-10">
            <div><p className="text-red-400 font-bold text-sm uppercase tracking-widest mb-2">🔥 Limited Time</p><h2 className="text-3xl font-black text-white">Hot Deals</h2></div>
            <Link href="/menu?category=deals"><button className="text-red-400 font-semibold text-sm flex items-center gap-1 hover:text-red-300 transition-colors">View all <ChevronRight size={16} /></button></Link>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {deals.map((deal, i) => (
              <motion.div key={deal.id} initial={{ opacity:0,y:30 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }} whileHover={{ y:-4 }}
                className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-red-400/50 transition-all group">
                <div className="relative h-44">
                  <Image src={deal.image} alt={deal.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full">{deal.badge}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-black text-white text-lg">{deal.title}</h3>
                  <p className="text-gray-400 text-xs mt-1 mb-3">{deal.description}</p>
                  <ul className="space-y-1 mb-4">{deal.items.map((item) => (<li key={item} className="text-gray-300 text-xs flex items-center gap-1.5"><span className="w-1 h-1 bg-red-400 rounded-full flex-shrink-0" />{item}</li>))}</ul>
                  <div className="flex items-center justify-between">
                    <div><p className="text-gray-500 text-xs line-through">Rs. {deal.originalPrice.toLocaleString()}</p><p className="text-white font-black text-xl">Rs. {deal.salePrice.toLocaleString()}</p></div>
                    <Link href="/menu"><button className="bg-red-500 hover:bg-red-400 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors">Order Now</button></Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="flex items-center justify-between mb-10">
            <div><p className="text-red-500 font-bold text-sm uppercase tracking-widest mb-2">⭐ Fan Favourites</p><h2 className="text-3xl font-black text-gray-900">Featured Items</h2></div>
            <Link href="/menu"><button className="text-red-500 font-semibold text-sm flex items-center gap-1 hover:text-red-600 transition-colors">Full menu <ChevronRight size={16} /></button></Link>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p, i) => <ProductCard key={p.id} product={p} onClick={setSel} index={i} />)}
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900">Why Choose Pizza Town?</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{icon:"🍕",title:"16 Flavours",desc:"The widest pizza selection in Sukkur"},{icon:"🚀",title:"Fast Delivery",desc:"Hot food at your door in 30–45 min"},{icon:"⭐",title:"4.8★ Rated",desc:"Loved by 3,400+ happy customers"},{icon:"💯",title:"Fresh Daily",desc:"All ingredients freshly sourced every day"}].map((item,i) => (
              <motion.div key={item.title} initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                className="text-center p-6 rounded-3xl bg-gray-50 hover:bg-red-50 transition-colors border border-gray-100 hover:border-red-100">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gradient-to-r from-red-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}>
            <h2 className="text-4xl font-black text-white mb-4">Hungry? Call Us Now!</h2>
            <p className="text-red-100 mb-8 text-lg">Free home delivery • Open till 1 AM</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="tel:+923315633133"><button className="bg-white text-red-600 font-black px-8 py-4 rounded-2xl text-lg hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2"><Phone size={20} />0331-5633133</button></a>
              <Link href="/menu"><button className="bg-white/20 border-2 border-white text-white font-bold px-8 py-4 rounded-2xl text-lg hover:bg-white/30 transition-all hover:scale-105">Order Online</button></Link>
            </div>
          </motion.div>
        </div>
      </section>
      <ProductModal product={sel} onClose={() => setSel(null)} />
    </>
  );
}
