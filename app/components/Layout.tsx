import React from "react";
import { Heart } from "lucide-react";
import Image from "next/image";

interface LayoutProps {
  children: React.ReactNode;
  gif: string;
  name?: string;
}

const Layout = ({ children, gif, name }: LayoutProps) => (
  <div className="min-h-screen bg-gradient-to-br from-pink-100 to-red-50 flex items-center justify-center p-4">
    {/* Animated hearts */}
    <div className="absolute top-10 left-10 animate-pulse">
      <Heart className="w-8 h-8 text-pink-400" fill="currentColor" />
    </div>
    <div className="absolute top-20 right-20 animate-pulse delay-75">
      <Heart className="w-6 h-6 text-red-400" fill="currentColor" />
    </div>
    <div className="absolute bottom-10 left-20 animate-pulse delay-150">
      <Heart className="w-10 h-10 text-pink-300" fill="currentColor" />
    </div>
    <div className="absolute bottom-20 right-10 animate-pulse delay-200">
      <Heart className="w-7 h-7 text-red-300" fill="currentColor" />
    </div>
    <div className="max-w-md w-full bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-pink-600 mb-6">
        Hey{name && " " + name}, Will you be my Valentine? 💝
      </h1>
      <div className="w-full aspect-square mb-8 rounded-lg overflow-hidden">
        <Image
          src={gif}
          alt="Valentine's Day"
          className="w-full h-full object-contain"
          width={400}
          height={400}
          unoptimized
        />
      </div>
      {children}
    </div>
  </div>
);

export default Layout; 