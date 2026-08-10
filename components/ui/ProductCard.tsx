"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Flame, Star, Sparkles } from "lucide-react";
import { Product } from "@/types";

interface Props { product: Product; onClick: (p: Product) => void; index?: number; }

const tagConfig = {
  bestseller: { label: "Best Seller", icon: Star,     bg: "bg-yellow-400", text: "text-yellow-900" },
  new:        { label: "New",         icon: Sparkles,  bg: "bg-blue-500",   text: "text-white"      },
  spicy:      { label: "Spicy",       icon: Flame,     bg: "bg-red-500",    text: "text-white"      },
  deal:       { label: "Deal",        icon: Star,      bg: "bg-green-500",  text: "text-white"      },
};

export default function ProductCard({ product, onClick, index = 0 }: Props) {
  const tag = product.tag ? tagConfig[product.tag] : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -4 }} onClick={() => onClick(product)}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/10 transition-all duration-300 cursor-pointer border border-gray-100"
    >
      <div className="relative h-48 overflow-hidden">
        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {tag && (
          <div className={`absolute top-3 left-3 ${tag.bg} ${tag.text} text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1`}>
            <tag.icon size={11} />{tag.label}
          </div>
        )}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">Customize →</div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base group-hover:text-red-600 transition-colors line-clamp-1">{product.name}</h3>
        <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-xs text-gray-400 font-medium">Starting from</p>
            <p className="font-black text-red-500 text-lg">Rs. {product.basePrice.toLocaleString()}</p>
          </div>
          <motion.button whileTap={{ scale: 0.9 }}
            className="bg-red-50 hover:bg-red-500 text-red-500 hover:text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl transition-all duration-200 border border-red-100 hover:border-red-500">
            +
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
