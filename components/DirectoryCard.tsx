
import React from 'react';
import { Business } from '../types';
import { MapPin, Phone, Globe } from 'lucide-react';

interface DirectoryCardProps {
  business: Business;
}

const DirectoryCard: React.FC<DirectoryCardProps> = ({ business }) => {
  const categoryColors: { [key: string]: string } = {
    Heizung: 'bg-red-100 text-red-800 border-red-200',
    Sanitär: 'bg-blue-100 text-blue-800 border-blue-200',
    Klima: 'bg-sky-100 text-sky-800 border-sky-200',
    Lüftung: 'bg-green-100 text-green-800 border-green-200',
    Elektro: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  return (
    <div className="bg-white rounded-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start mb-4">
        <img
          src={business.logoUrl}
          alt={`${business.name} logo`}
          className="w-16 h-16 rounded-sm object-contain border border-gray-100 p-1 mr-4 bg-white"
          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150'; }}
        />
        <div className="flex-grow">
          <h3 className="font-display font-bold text-lg text-brand-dark leading-tight">{business.name}</h3>
          <span className={`mt-1 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${categoryColors[business.category] || 'bg-gray-100 text-gray-800'}`}>
            {business.category}
          </span>
        </div>
      </div>

      <p className="text-sm text-brand-steel mb-5 leading-relaxed flex-grow">
        {business.description}
      </p>

      <div className="mt-auto space-y-3 text-sm text-brand-steel border-t border-gray-100 pt-5">
        <div className="flex items-start">
          <MapPin className="w-4 h-4 mr-3 mt-0.5 text-gray-400 flex-shrink-0" />
          <span>{business.address}, {business.zip} {business.city}</span>
        </div>
        <div className="flex items-center">
          <Phone className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
          <span>{business.phone}</span>
        </div>
        {business.website && (
          <div className="flex items-center">
            <Globe className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
            <a 
              href={business.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-brand-copper hover:underline truncate"
            >
              {business.website.replace(/^(https?:\/\/)?(www\.)?/, '')}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectoryCard;
