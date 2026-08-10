"use client";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { categories } from "@/lib/data";
import { Product } from "@/types";
import ProductCard from "@/components/ui/ProductCard";
import ProductModal from "@/components/modals/ProductModal";
import { ProductCardSkeleton } from "@/components/ui/Skeletons";

function MenuContent() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
 useEffect(() => {
  async function loadProducts() {
    try {
      const res = await fetch("/api/menu/items");
      const json = await res.json();

      if (json.success) {
         const mappedProducts = json.data.items.map((item: any) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    image: item.images?.[0]?.url || "",
    basePrice: Number(item.basePrice),
    category: item.category.slug,
    tag: item.tag,
    sizes: item.sizes.map((size: any) => ({
  
      id: size.id,
      label: size.label,
  price: Number(size.priceAddon),
  serves: size.serves,
})),
    extras: item.addons.map((addon: any) => ({
  id: addon.id,
  label: addon.label,
  price: Number(addon.price),
})),
    ingredients: item.ingredients.map((i: any) => i.name),
  }));

  setProducts(mappedProducts);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }

  loadProducts();
}, []);
 const filtered = useMemo(() => products.filter((p) => {
  const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
  const matchesSearch =
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase());

  return matchesCat && matchesSearch;
}), [products, selectedCategory, searchQuery]);
  return (
    <>
      <div className="bg-gradient-to-br from-gray-900 to-red-900 pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} className="text-center">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Our Full Menu</h1>
            <p className="text-gray-300 text-lg">Pizzas, burgers, sides, drinks & more</p>
          </motion.div>
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }} className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search pizzas, burgers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:border-red-400 transition-colors" />
            </div>
          </motion.div>
        </div>
      </div>
      <div className="sticky top-16 md:top-20 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3">
            <button onClick={() => setSelectedCategory("all")} className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory==="all" ? "bg-red-500 text-white shadow-md shadow-red-500/30" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>All Items</button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory===cat.id ? "bg-red-500 text-white shadow-md shadow-red-500/30" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                <span>{cat.icon}</span>{cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{Array.from({length:8}).map((_,i) => <ProductCardSkeleton key={i} />)}</div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-400 mb-6">Try a different search or category</p>
            <button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }} className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors">Clear Filters</button>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 text-sm font-medium"><span className="font-bold text-gray-900">{filtered.length}</span> items</p>
              <div className="flex items-center gap-2 text-gray-400 text-sm"><SlidersHorizontal size={14} /><span>Tap any item to customize</span></div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} onClick={setSelectedProduct} index={i} />)}
            </div>
          </>
        )}
      </div>
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
}
export default function MenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 pt-20 flex items-center justify-center"><div className="text-white text-xl">Loading menu...</div></div>}>
      <MenuContent />
    </Suspense>
  );
}
