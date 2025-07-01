// src/components/dealers/DealerLocatorClient.tsx
"use client";

import { useState, useMemo } from 'react';
import { Dealer } from '@/types/dealer';
import dynamic from 'next/dynamic';
import { Search, MapPin, Phone, Globe } from 'lucide-react';

// Dynamically import the MapComponent to prevent SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/dealers/MapComponent'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg flex items-center justify-center"><p>Loading Map...</p></div>
});

// --- DealerCard Component ---
function DealerCard({ dealer, isSelected, onSelect }: { dealer: Dealer; isSelected: boolean; onSelect: () => void; }) {
  return (
    <div 
      onClick={onSelect}
      className={`p-5 border rounded-lg cursor-pointer transition-all duration-300 ${isSelected ? 'bg-purple-100 border-purple-400 ring-2 ring-purple-300' : 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50'}`}
    >
      <h3 className="font-bold text-lg text-gray-800">{dealer.name}</h3>
      <p className="text-gray-600 mt-2 flex items-start gap-2">
        <MapPin className="w-5 h-5 mt-1 text-gray-400 flex-shrink-0" />
        <span>{dealer.address}</span>
      </p>
      {dealer.phone && (
        <p className="text-gray-600 mt-2 flex items-center gap-2">
          <Phone className="w-5 h-5 text-gray-400" />
          <span>{dealer.phone}</span>
        </p>
      )}
       {dealer.website && (
        <p className="text-gray-600 mt-2 flex items-center gap-2">
          <Globe className="w-5 h-5 text-gray-400" />
          <a href={dealer.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline" onClick={(e) => e.stopPropagation()}>
            Visit Website
          </a>
        </p>
      )}
    </div>
  );
}

// --- Main DealerLocatorClient Component ---
export default function DealerLocatorClient({ dealers }: { dealers: Dealer[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDealerId, setSelectedDealerId] = useState<number | null>(dealers[0]?.id || null);

  const filteredDealers = useMemo(() => {
    if (!searchTerm) return dealers;
    const lowercasedTerm = searchTerm.toLowerCase();
    return dealers.filter(dealer => 
      dealer.name.toLowerCase().includes(lowercasedTerm) ||
      dealer.address.toLowerCase().includes(lowercasedTerm)
    );
  }, [searchTerm, dealers]);

  const selectedDealer = useMemo(() => {
    return dealers.find(d => d.id === selectedDealerId) || null;
  }, [selectedDealerId, dealers]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[75vh]">
      {/* Left Panel: Search and List */}
      <div className="lg:col-span-4 flex flex-col h-full bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div className="flex-grow overflow-y-auto space-y-3 pr-2">
          {filteredDealers.length > 0 ? (
            filteredDealers.map(dealer => (
              <DealerCard 
                key={dealer.id}
                dealer={dealer}
                isSelected={dealer.id === selectedDealerId}
                onSelect={() => setSelectedDealerId(dealer.id)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">No dealers found.</p>
          )}
        </div>
      </div>

      {/* Right Panel: Map */}
      <div className="lg:col-span-8 h-full rounded-lg overflow-hidden shadow-md">
        <MapComponent 
            dealers={dealers}
            selectedDealer={selectedDealer}
            onMarkerClick={(id) => setSelectedDealerId(id)}
        />
      </div>
    </div>
  );
}
