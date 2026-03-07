"use client";

import React from "react";
import { MapPin, ArrowRight, Package, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ListingCardProps {
  id: number;
  title: string;
  category?: string; 
  image: string;
  status?: "active" | "resolved";
  createdAt?: string;
  // Added these as optional so the component doesn't break if passed from different pages
  price?: number; 
  onBook?: (id: number) => void; 
}

export function ListingCard({
  id,
  title,
  category,
  image,
  status = "active",
  onBook,
}: ListingCardProps) {
  return (
    <div className="group relative bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        {/* Only render img if image string is valid to prevent "empty string" browser error */}
        {image && image.trim() !== "" ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-300">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm",
            status === "active" 
              ? "bg-amber-100 text-amber-700 border border-amber-200" 
              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
          )}>
            {status === "active" ? "Still Missing" : "Resolved"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow space-y-3">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center text-slate-500 text-sm gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-indigo-500" />
            <span className="line-clamp-1">{category || "Location Unknown"}</span>
          </div>
        </div>

        {/* Footer / Action */}
        <div className="pt-2 mt-auto border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Package className="h-3 w-3" />
            <span>ID: #{id}</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold gap-1 group/btn"
            onClick={() => onBook?.(id)}
          >
            Details
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}