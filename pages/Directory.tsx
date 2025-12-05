
import React, { useState, useMemo } from 'react';
import { Article, Business, DirectoryCategory } from '../types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DirectoryCard from '../components/DirectoryCard';
import { useLanguage } from '../contexts/LanguageContext';
import { Search, MapPin, Building } from 'lucide-react';

interface DirectoryProps {
  businesses: Business[];
  categories: string[]; // Article categories for header/footer
}

const DIRECTORY_CATEGORIES: DirectoryCategory[] = ['Heizung', 'Sanitär', 'Klima', 'Lüftung', 'Elektro'];

const Directory: React.FC<DirectoryProps> = ({ businesses, categories }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<DirectoryCategory | 'All'>('All');

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(business => {
      const matchesCategory = activeCategory === 'All' || business.category === activeCategory;
      const matchesSearch = searchQuery.length === 0 ||
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [businesses, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-brand-surface font-sans">
      <Header categories={categories} />
      
      <main>
        {/* Hero Section */}
        <div className="bg-white py-16 md:py-24 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex justify-center items-center p-4 bg-brand-surface rounded-full mb-6">
               <Building className="w-8 h-8 text-brand-copper" />
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black text-brand-dark mb-4">
              {t('directory.title')}
            </h1>
            <p className="text-lg md:text-xl text-brand-steel max-w-2xl mx-auto">
              {t('directory.subtitle')}
            </p>
          </div>
        </div>

        {/* Filters and Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* Filter Bar */}
          <div className="sticky top-20 z-40 bg-brand-surface/80 backdrop-blur-md p-4 mb-12 rounded-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-1/2 lg:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.placeholder_dir')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-brand-copper outline-none transition"
              />
            </div>
            
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition ${activeCategory === 'All' ? 'bg-brand-dark text-white' : 'bg-white text-brand-dark hover:bg-gray-100 border border-gray-200'}`}
              >
                All
              </button>
              {DIRECTORY_CATEGORIES.map(cat => (
                 <button
                   key={cat}
                   onClick={() => setActiveCategory(cat)}
                   className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition ${activeCategory === cat ? 'bg-brand-dark text-white' : 'bg-white text-brand-dark hover:bg-gray-100 border border-gray-200'}`}
                 >
                   {cat}
                 </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          {filteredBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredBusinesses.map(business => (
                <DirectoryCard key={business.id} business={business} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-sm border border-dashed border-gray-300">
                <p className="text-brand-steel font-medium text-lg">No businesses found matching your criteria.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} 
                  className="mt-4 text-brand-copper font-bold uppercase text-xs underline"
                >
                  Clear Filters
                </button>
            </div>
          )}
        </div>
      </main>

      <Footer categories={categories} />
    </div>
  );
};

export default Directory;
