import { languageService } from './language.js';

const { t, getLanguage } = languageService;

export function createHeader({ categories, activeCategory, isDirectoryActive }) {
  const lang = getLanguage();
  const logoUrl = "https://k.sinaimg.cn/n/sinakd20230526s/256/w256h0/20230526/519e-e3b97b1029e08097b692482596409605.jpg/w700d1q75cms.jpg";
  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-20 items-center">
        <div class="flex items-center lg:hidden">
          <button id="mobile-menu-button" class="p-2 text-brand-dark">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
        <div class="flex-shrink-0 flex items-center justify-center lg:justify-start w-full lg:w-auto">
          <a href="index.html" data-nav-link="All" class="cursor-pointer group">
            <img src="${logoUrl}" alt="SHK Rhein-Neckar" class="h-16 w-auto object-contain transition-all duration-300">
          </a>
        </div>
        <div id="desktop-nav-links" class="hidden lg:flex space-x-8 items-center h-full">
            <a href="index.html" data-nav-link="All" class="relative h-full text-xs font-bold uppercase tracking-widest transition-colors flex items-center ${activeCategory === 'All' && !isDirectoryActive ? 'text-brand-copper' : 'text-brand-steel hover:text-brand-dark'}">
              ${t('nav.home')}
              ${activeCategory === 'All' && !isDirectoryActive ? '<span class="absolute bottom-0 left-0 w-full h-0.5 bg-brand-copper animate-fade-in"></span>' : ''}
            </a>
            <a href="directory.html" class="relative h-full text-xs font-bold uppercase tracking-widest transition-colors flex items-center ${isDirectoryActive ? 'text-brand-copper' : 'text-brand-steel hover:text-brand-dark'}">
              ${t('nav.directory')}
              ${isDirectoryActive ? '<span class="absolute bottom-0 left-0 w-full h-0.5 bg-brand-copper animate-fade-in"></span>' : ''}
            </a>
            ${categories.slice(0, 4).map(cat => `
              <a href="index.html" data-nav-link="${cat}" class="relative h-full text-xs font-bold uppercase tracking-widest transition-colors flex items-center ${activeCategory === cat && !isDirectoryActive ? 'text-brand-copper' : 'text-brand-steel hover:text-brand-dark'}">
                ${t(`cat.${cat}`) || cat}
                ${activeCategory === cat && !isDirectoryActive ? '<span class="absolute bottom-0 left-0 w-full h-0.5 bg-brand-copper animate-fade-in"></span>' : ''}
              </a>
            `).join('')}
        </div>
        <div id="header-actions" class="flex items-center space-x-4">
          <div id="search-container" class="flex items-center transition-all duration-300 w-8">
            <button id="search-toggle-button" class="p-2 text-brand-steel hover:text-brand-copper transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
          </div>
          <div id="lang-switcher-container" class="hidden lg:block relative group">
            <button id="lang-menu-button" class="flex items-center space-x-2 text-xs font-bold uppercase text-brand-steel hover:text-brand-dark transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              <span>${lang.toUpperCase()}</span>
            </button>
            <div id="lang-menu" class="hidden absolute right-0 mt-4 w-40 bg-white border border-gray-100 shadow-xl rounded-sm py-2 z-50 animate-fade-in">
              <div class="absolute -top-2 right-4 w-4 h-4 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
              ${languages.map(l => `
                <button data-lang="${l.code}" class="lang-option w-full text-left px-4 py-3 text-xs font-bold flex items-center hover:bg-gray-50 transition-colors ${lang === l.code ? 'text-brand-copper bg-orange-50/50' : 'text-gray-700'}">
                  <span class="mr-3 text-lg">${l.flag}</span> ${l.label}
                </button>
              `).join('')}
            </div>
          </div>
          <div class="hidden lg:block h-6 w-px bg-gray-200"></div>
          <a href="article.html?id=page-submit" class="hidden lg:block group relative bg-brand-dark text-white px-6 py-3 text-xs font-bold uppercase tracking-wider overflow-hidden rounded-sm transition-all hover:shadow-lg">
            <span class="relative z-10 group-hover:text-brand-copper transition-colors">${t('nav.get_featured')}</span>
            <div class="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
          </a>
        </div>
      </div>
    </div>
    <div id="mobile-menu" class="hidden lg:hidden border-t border-gray-100 bg-white absolute w-full z-40 shadow-2xl animate-fade-in">
      <!-- Mobile menu content will be injected here -->
    </div>
  `;
}

export function createFooter({ categories }) {
  const logoUrl = "https://k.sinaimg.cn/n/sinakd20230526s/256/w256h0/20230526/519e-e3b97b1029e08097b692482596409605.jpg/w700d1q75cms.jpg";
  return `
    <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12">
      <div class="col-span-1 md:col-span-4 lg:col-span-2">
        <img src="${logoUrl}" alt="SHK Rhein-Neckar" class="h-16 w-auto mb-4"/>
        <p class="text-sm text-brand-steel leading-relaxed max-w-sm">${t('footer.about')}</p>
      </div>
      <div class="lg:col-start-3">
        <h3 class="text-xs font-bold uppercase tracking-widest text-brand-dark mb-6">${t('nav.magazine')}</h3>
        <ul class="space-y-3 text-sm text-brand-steel">
          <li><a href="index.html" data-nav-link="All" class="hover:text-brand-copper transition">${t('nav.home')}</a></li>
          <li><a href="directory.html" class="hover:text-brand-copper transition">${t('nav.directory')}</a></li>
          ${categories.slice(0, 4).map(c => `<li><a href="index.html" data-nav-link="${c}" class="hover:text-brand-copper transition">${t(`cat.${c}`)}</a></li>`).join('')}
        </ul>
      </div>
      <div>
        <h3 class="text-xs font-bold uppercase tracking-widest text-brand-dark mb-6">${t('nav.companies')}</h3>
        <ul class="space-y-3 text-sm text-brand-steel">
          <li><a href="article.html?id=page-submit" class="hover:text-brand-copper transition">${t('hero.submit_story')}</a></li>
          <li><a href="article.html?id=page-advertising" class="hover:text-brand-copper transition">Advertising</a></li>
          <li><a href="article.html?id=page-jobs" class="hover:text-brand-copper transition">Job Board</a></li>
        </ul>
      </div>
      <div>
        <h3 class="text-xs font-bold uppercase tracking-widest text-brand-dark mb-6">${t('nav.contact')}</h3>
        <ul class="space-y-3 text-sm text-brand-steel">
          <li class="flex items-start"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 mt-1 flex-shrink-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> redaktion@shk-rhein-neckar.de</li>
          <li class="flex items-start"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2 mt-1 flex-shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> Mannheim, Germany</li>
        </ul>
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
      <div class="flex space-x-6">
        <a href="article.html?id=page-imprint" class="hover:text-brand-copper">Imprint</a>
        <a href="article.html?id=page-privacy" class="hover:text-brand-copper">Privacy Policy</a>
        <a href="article.html?id=page-terms" class="hover:text-brand-copper">Terms</a>
      </div>
      <div class="mt-4 md:mt-0 text-center md:text-right">
        <span>© 2025 SHK Rhein-Neckar. ${t('footer.rights')}</span>
        <a href="admin.html" class="ml-4 text-gray-300 hover:text-brand-copper transition">${t('footer.staff_login')}</a>
      </div>
    </div>
  `;
}

export function createArticleCard(article, { variant = 'standard' } = {}) {
  const { lang, t } = languageService;
  const title = article.translations?.[lang]?.title || article.title;
  const summary = article.translations?.[lang]?.summary || article.summary;

  if (variant === 'featured') {
    return `
      <a href="article.html?id=${article.id}" class="group relative w-full h-[600px] block overflow-hidden rounded-sm shadow-2xl cursor-pointer">
        <img src="${article.imageUrl}" alt="${title}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
        <div class="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"></div>
        ${article.videoUrl ? `
          <div class="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 text-white p-4 rounded-full animate-pulse shadow-lg z-10 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
          </div>
        ` : ''}
        <div class="absolute bottom-0 left-0 p-8 md:p-12 text-white max-w-5xl z-20">
          <div class="overflow-hidden mb-6">
            <span class="inline-block uppercase tracking-[0.2em] text-[10px] font-bold bg-brand-copper text-white px-3 py-1.5 rounded-sm transform translate-y-0 transition-transform group-hover:-translate-y-1">${article.category}</span>
          </div>
          <h2 class="text-3xl md:text-5xl lg:text-6xl font-display font-black mb-6 leading-none tracking-tight group-hover:text-gray-100 transition-colors">${title}</h2>
          <p class="text-gray-300 mb-8 line-clamp-2 max-w-2xl font-light text-lg md:text-xl leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">${summary}</p>
          <div class="flex items-center space-x-6 text-xs font-bold text-gray-400 uppercase tracking-widest border-t border-white/10 pt-6">
             <span class="text-brand-copper">${article.author}</span>
             <span class="w-1 h-1 bg-gray-600 rounded-full"></span>
             <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3 mr-2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
               ${new Date(article.publishedAt).toLocaleDateString()}
             </span>
             <div class="ml-auto hidden md:flex items-center text-white group-hover:translate-x-2 transition-transform duration-300">
                ${t('article.read_story')} <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2 w-4 h-4"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
             </div>
          </div>
        </div>
      </a>
    `;
  }

  return `
    <a href="article.html?id=${article.id}" class="flex flex-col group cursor-pointer h-full bg-white rounded-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-transparent hover:border-gray-100">
      <div class="overflow-hidden aspect-[16/10] relative">
        <img src="${article.imageUrl}" alt="${title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div class="absolute top-4 left-4">
            <span class="bg-white/90 backdrop-blur-sm text-brand-dark text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 shadow-sm rounded-sm">${article.category}</span>
        </div>
        <div class="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        ${article.videoUrl ? `
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div class="bg-brand-copper/90 p-3 rounded-full shadow-lg transform scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 delay-75">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-white"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
             </div>
          </div>
        ` : ''}
      </div>
      <div class="flex flex-col flex-grow p-6 relative">
        <div class="mb-4 flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider space-x-2">
           <span>${new Date(article.publishedAt).toLocaleDateString()}</span>
           <span class="w-px h-3 bg-gray-300"></span>
           <span class="text-brand-copper">${article.readTime ? Math.ceil(article.readTime / 60) : 5} min read</span>
        </div>
        <h3 class="text-xl font-display font-bold text-brand-dark mb-3 leading-snug group-hover:text-brand-copper transition-colors">${title}</h3>
        <p class="text-brand-steel text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">${summary}</p>
        <div class="mt-auto pt-4 border-t border-gray-50 flex items-center text-xs font-bold uppercase tracking-wider text-brand-dark group-hover:text-brand-copper transition-colors">
           ${article.videoUrl ? t('article.watch_video') : t('article.read_story')}
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
    </a>
  `;
}

export function createDirectoryCard(business) {
    const categoryColors = {
      Heizung: 'bg-red-100 text-red-800 border-red-200',
      Sanitär: 'bg-blue-100 text-blue-800 border-blue-200',
      Klima: 'bg-sky-100 text-sky-800 border-sky-200',
      Lüftung: 'bg-green-100 text-green-800 border-green-200',
      Elektro: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
    return `
      <div class="bg-white rounded-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div class="flex items-start mb-4">
          <img src="${business.logoUrl}" alt="${business.name} logo" class="w-16 h-16 rounded-sm object-contain border border-gray-100 p-1 mr-4 bg-white" onError="this.onerror=null;this.src='https://via.placeholder.com/150';">
          <div class="flex-grow">
            <h3 class="font-display font-bold text-lg text-brand-dark leading-tight">${business.name}</h3>
            <span class="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${categoryColors[business.category] || 'bg-gray-100 text-gray-800'}">${business.category}</span>
          </div>
        </div>
        <p class="text-sm text-brand-steel mb-5 leading-relaxed flex-grow">${business.description}</p>
        <div class="mt-auto space-y-3 text-sm text-brand-steel border-t border-gray-100 pt-5">
          <div class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-3 mt-0.5 text-gray-400 flex-shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${business.address}, ${business.zip} ${business.city}</span>
          </div>
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-3 text-gray-400 flex-shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>${business.phone}</span>
          </div>
          ${business.website ? `
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-3 text-gray-400 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              <a href="${business.website}" target="_blank" rel="noopener noreferrer" class="text-brand-copper hover:underline truncate">${business.website.replace(/^(https?:\/\/)?(www\.)?/, '')}</a>
            </div>
          ` : ''}
        </div>
      </div>
    `;
}