import { createHeader, createFooter } from './components.js';
import { languageService } from './language.js';
import { INITIAL_CATEGORIES } from './data.js';

const { t } = languageService;

// State for header
let mobileMenuOpen = false;
let langMenuOpen = false;
let searchOpen = false;
let scrolled = false;

function renderSharedComponents() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    
    // Determine active category for header styling
    const pageCategory = sessionStorage.getItem('active_category') || 'All';
    const isDirectoryActive = window.location.pathname.includes('directory.html');
    
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = createHeader({ 
            categories: INITIAL_CATEGORIES, 
            activeCategory: pageCategory,
            isDirectoryActive: isDirectoryActive,
        });
        addHeaderEventListeners();
        updateHeaderOnScroll();
    }
    
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = createFooter({ categories: INITIAL_CATEGORIES });
        addFooterEventListeners();
    }
}

function setupNavLinkListeners(selector) {
    document.querySelectorAll(selector).forEach(link => {
        link.addEventListener('click', (e) => {
            const href = e.currentTarget.getAttribute('href');
            if (href && href.includes('index.html')) {
                e.preventDefault();
                const category = e.currentTarget.dataset.navLink;
                sessionStorage.setItem('active_category', category);
                sessionStorage.removeItem('search_query'); // Clear search on category change

                const isIndexPage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');

                if (isIndexPage) {
                    // On homepage, dispatch event to re-render content without reload
                    window.dispatchEvent(new CustomEvent('category-change', { detail: { category } }));
                } else {
                    // On another page, navigate to homepage
                    window.location.href = 'index.html';
                }
            }
        });
    });
}


function addHeaderEventListeners() {
    // Mobile menu
    document.getElementById('mobile-menu-button')?.addEventListener('click', toggleMobileMenu);

    // Language switcher
    document.getElementById('lang-menu-button')?.addEventListener('click', () => {
        langMenuOpen = !langMenuOpen;
        document.getElementById('lang-menu')?.classList.toggle('hidden', !langMenuOpen);
    });
    document.querySelectorAll('.lang-option').forEach(button => {
        button.addEventListener('click', (e) => {
            const lang = e.currentTarget.dataset.lang;
            languageService.setLanguage(lang);
            langMenuOpen = false;
        });
    });
    
    // Search
    document.getElementById('search-toggle-button')?.addEventListener('click', toggleSearch);
    
    // Nav links
    setupNavLinkListeners('#header-placeholder [data-nav-link]');
}

function addFooterEventListeners() {
    setupNavLinkListeners('#footer-placeholder [data-nav-link]');
}

function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) return;

    if (mobileMenuOpen) {
        mobileMenu.classList.remove('hidden');
        const languages = [
            { code: 'en', label: 'English', flag: '🇬🇧' },
            { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
            { code: 'fr', label: 'Français', flag: '🇫🇷' },
            { code: 'it', label: 'Italiano', flag: '🇮🇹' },
            { code: 'es', label: 'Español', flag: '🇪🇸' },
        ];
        const currentLang = languageService.getLanguage();
        mobileMenu.innerHTML = `
            <div class="px-6 py-6 space-y-4">
                <div class="flex space-x-3 mb-6 pb-6 border-b border-gray-100 overflow-x-auto">
                    ${languages.map(lang => `
                        <button data-lang="${lang.code}" class="mobile-lang-option flex-shrink-0 px-4 py-2 rounded-sm text-xs font-bold border transition-colors ${currentLang === lang.code ? 'bg-brand-copper text-white border-brand-copper' : 'bg-transparent text-gray-600 border-gray-200'}">
                            ${lang.flag} ${lang.code.toUpperCase()}
                        </button>
                    `).join('')}
                </div>
                <a href="index.html" data-nav-link="All" class="block w-full text-left py-3 text-sm font-bold uppercase tracking-wide text-brand-dark hover:text-brand-copper hover:pl-2 transition-all border-b border-gray-50">${t('nav.home')}</a>
                <a href="directory.html" class="block w-full text-left py-3 text-sm font-bold uppercase tracking-wide text-brand-dark hover:text-brand-copper hover:pl-2 transition-all border-b border-gray-50">${t('nav.directory')}</a>
                ${INITIAL_CATEGORIES.map(cat => `
                    <a href="index.html" data-nav-link="${cat}" class="block w-full text-left py-3 text-sm font-bold uppercase tracking-wide text-brand-dark hover:text-brand-copper hover:pl-2 transition-all border-b border-gray-50">${t(`cat.${cat}`)}</a>
                `).join('')}
                <a href="article.html?id=page-submit" class="block w-full mt-6 bg-brand-dark text-white px-4 py-4 text-sm font-bold uppercase tracking-wider text-center rounded-sm">${t('nav.get_featured')}</a>
            </div>
        `;
        mobileMenu.querySelectorAll('.mobile-lang-option').forEach(btn => btn.addEventListener('click', (e) => {
            languageService.setLanguage(e.currentTarget.dataset.lang);
            toggleMobileMenu();
        }));
        // Apply fixed navigation logic to mobile menu links
        mobileMenu.querySelectorAll('[data-nav-link]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = e.currentTarget.getAttribute('href');
                if (href && href.includes('index.html')) {
                    e.preventDefault();
                    const category = e.currentTarget.dataset.navLink;
                    sessionStorage.setItem('active_category', category);
                    sessionStorage.removeItem('search_query');
                    
                    toggleMobileMenu(); // Close menu after click
                    
                    const isIndexPage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');
                    if (isIndexPage) {
                        window.dispatchEvent(new CustomEvent('category-change', { detail: { category } }));
                    } else {
                        window.location.href = 'index.html';
                    }
                }
            });
        });
    } else {
        mobileMenu.classList.add('hidden');
    }
}

function toggleSearch() {
    searchOpen = !searchOpen;
    const container = document.getElementById('search-container');
    const navLinks = document.getElementById('desktop-nav-links');
    const langSwitcher = document.getElementById('lang-switcher-container');
    const headerActions = document.getElementById('header-actions');

    if (searchOpen) {
        navLinks?.classList.add('hidden');
        langSwitcher?.classList.add('hidden');
        headerActions?.classList.add('flex-grow', 'justify-end');
        container.classList.remove('w-8');
        container.classList.add('w-full', 'md:w-96');
        container.innerHTML = `
            <form id="search-form" class="relative w-full flex items-center">
                 <input id="search-input" type="text" placeholder="${t('search.placeholder')}" class="w-full bg-gray-100 border-none rounded-sm px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-brand-copper outline-none" />
                 <button type="button" id="close-search-button" class="absolute right-2 p-1 text-gray-400 hover:text-brand-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                 </button>
             </form>
        `;
        document.getElementById('search-input').focus();
        document.getElementById('close-search-button').addEventListener('click', toggleSearch);
        document.getElementById('search-form').addEventListener('submit', handleSearchSubmit);
    } else {
        sessionStorage.setItem('search_query', '');
        if (window.location.pathname.includes('index.html')) {
            window.dispatchEvent(new CustomEvent('search-change', { detail: '' }));
        }
        container.classList.add('w-8');
        container.classList.remove('w-full', 'md:w-96');
        navLinks?.classList.remove('hidden');
        langSwitcher?.classList.remove('hidden');
        headerActions?.classList.remove('flex-grow', 'justify-end');
        container.innerHTML = `
            <button id="search-toggle-button" class="p-2 text-brand-steel hover:text-brand-copper transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
        `;
        document.getElementById('search-toggle-button').addEventListener('click', toggleSearch);
    }
}

function handleSearchSubmit(e) {
    e.preventDefault();
    const query = document.getElementById('search-input').value;
    sessionStorage.setItem('search_query', query);
    
    if (window.location.pathname.includes('index.html')) {
        window.dispatchEvent(new CustomEvent('search-change', { detail: query }));
    } else {
        window.location.href = 'index.html';
    }
}

function updateHeaderOnScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    const logoImg = nav.querySelector('img');
    const handleScroll = () => {
      if (window.scrollY > 20) {
        if (!scrolled) {
            nav.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-md', 'border-b', 'border-gray-200', 'py-0');
            nav.classList.remove('bg-white', 'border-gray-100', 'py-2');
            logoImg.classList.add('h-12');
            logoImg.classList.remove('h-16');
            scrolled = true;
        }
      } else {
        if (scrolled) {
            nav.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-md', 'border-b', 'border-gray-200', 'py-0');
            nav.classList.add('bg-white', 'border-gray-100', 'py-2');
            logoImg.classList.remove('h-12');
            logoImg.classList.add('h-16');
            scrolled = false;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
}


// Listen for language changes and re-render
window.addEventListener('language-change', renderSharedComponents);

// Initial render
document.addEventListener('DOMContentLoaded', renderSharedComponents);