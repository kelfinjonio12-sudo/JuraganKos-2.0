'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { KOS_DATA, formatRupiah, Kost } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { Search, MapPin, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(query);
  const [filterType, setFilterType] = useState('Semua');
  const [filterPrice, setFilterPrice] = useState('Semua');
  const [results, setResults] = useState<Kost[]>(KOS_DATA);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    let filtered = KOS_DATA;

    if (searchTerm) {
      const lowerQuery = searchTerm.toLowerCase();
      filtered = filtered.filter(kos => 
        kos.name.toLowerCase().includes(lowerQuery) ||
        kos.city.toLowerCase().includes(lowerQuery) ||
        kos.address.toLowerCase().includes(lowerQuery)
      );
    }

    if (filterType !== 'Semua') {
      filtered = filtered.filter(kos => kos.type === filterType);
    }

    if (filterPrice !== 'Semua') {
      filtered = filtered.filter(kos => {
        if (filterPrice === '< 2JT') return kos.price < 2000000;
        if (filterPrice === '2JT - 4JT') return kos.price >= 2000000 && kos.price <= 4000000;
        if (filterPrice === '> 4JT') return kos.price > 4000000;
        return true;
      });
    }

    setResults(filtered);
  }, [searchTerm, filterType, filterPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex items-center">
        <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200 transition-all">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari lokasi, nama kos..."
            className="w-full bg-transparent px-3 py-2 outline-none text-gray-800"
          />
        </div>
        <button 
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="ml-4 lg:hidden p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-1/4 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-gray-900 border-b border-gray-100 pb-4">
              <Filter className="w-5 h-5" />
              <h2 className="font-bold text-lg">Filter Pencarian</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 text-sm">Tipe Kos</h3>
                <div className="space-y-2">
                  {['Semua', 'Putra', 'Putri', 'Campur'].map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input 
                          type="radio" 
                          name="type" 
                          className="peer sr-only"
                          checked={filterType === type}
                          onChange={() => setFilterType(type)}
                        />
                        <div className="w-5 h-5 rounded border border-gray-300 peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-colors"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm">Rentang Harga</h3>
                <div className="space-y-2">
                  {['Semua', '< 2JT', '2JT - 4JT', '> 4JT'].map(price => (
                    <label key={price} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input 
                          type="radio" 
                          name="price" 
                          className="peer sr-only"
                          checked={filterPrice === price}
                          onChange={() => setFilterPrice(price)}
                        />
                        <div className="w-5 h-5 rounded-full border border-gray-300 peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-colors"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      </div>
                      <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{price}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:w-3/4 flex-1">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {results.length > 0 ? `Ditemukan ${results.length} Kos` : 'Pencarian Tidak Ditemukan'}
            </h1>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-gray-500">Urutkan:</span>
              <button className="flex items-center gap-1 text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                Rekomendasi <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {results.map((kos) => (
                <div 
                  key={kos.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-gray-200">
                    <Image 
                      src={kos.images[0]} 
                      alt={kos.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                        {kos.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <Link href={`/kos/${kos.id}`} className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {kos.name}
                      </Link>
                      <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-blue-700 text-sm font-bold shrink-0">
                        <span>★</span> {kos.rating}
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-4 flex items-center gap-1 line-clamp-1">
                      <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
                      {kos.city}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                      {kos.facilities.slice(0, 3).map((facility, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md">
                          {facility}
                        </span>
                      ))}
                      {kos.facilities.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md">
                          +{kos.facilities.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-xl text-orange-500">{formatRupiah(kos.price)}<span className="text-sm font-normal text-gray-500">/bln</span></p>
                      </div>
                      <Link 
                        href={`/kos/${kos.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
                      >
                        Pesan
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl py-20 px-4 text-center border border-gray-100 shadow-sm flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Waduh, kos yang dicari nggak ada</h3>
              <p className="text-gray-500 max-w-md">Coba ubah filter lokasi atau tipe pencarian lainnya untuk menemukan kos idamanmu.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('Semua');
                  setFilterPrice('Semua');
                }}
                className="mt-6 text-orange-500 font-semibold hover:text-orange-600"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="flex justify-center items-center h-[50vh]"><p className="text-blue-500 font-bold">Memuat data...</p></div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
