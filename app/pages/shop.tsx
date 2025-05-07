import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Footer from '../components/Footer';
import { bebasNeue } from '../fonts';

interface ShopItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buyUrl: string;
}

export default function Shop() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/getShopItems');
        if (!response.ok) {
          throw new Error('Failed to fetch shop items');
        }
        const data = await response.json();
        setItems(data.items);
      } catch (err) {
        setError('Failed to load shop items');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#4A154B] pt-20">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-white text-xl">Loading shop items...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-[#4A154B] pt-20">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-white text-xl bg-red-500/80 p-4 ">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#4A154B] pt-20">
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className={`${bebasNeue.className} text-4xl md:text-5xl lg:text-6xl text-white mb-8 text-center`}>
            Shop
          </h1>
          <div className="w-full border-b-2 border-[#f7ce46] pb-2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white/80 backdrop-blur-sm shadow-lg shadow-xl p-6 rounded-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => window.open(item.buyUrl, '_blank')}
                tabIndex={0}
                role="button"
                onKeyPress={e => { if (e.key === 'Enter') window.open(item.buyUrl, '_blank'); }}
              >
                <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className={`${bebasNeue.className} text-lg md:text-xl text-[#4A154B] font-semibold mb-2`}>
                  {item.title}
                </h4>
                <p className="text-base text-gray-600 mb-2">{item.description}</p>
                <button
                  className="mt-2 px-4 py-2 bg-[#931cf5] text-white rounded hover:bg-[#7b17cc] transition-colors font-semibold"
                  onClick={e => { e.stopPropagation(); window.open(item.buyUrl, '_blank'); }}
                >
                  Buy
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 