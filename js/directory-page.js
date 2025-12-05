import { ALL_BUSINESSES } from './data.js';
import { createDirectoryCard } from './components.js';
import { languageService } from './language.js';

const { t } = languageService;
const mainContent = document.getElementById('main-content');
const DIRECTORY_CATEGORIES = ['Heizung', 'Sanitär', 'Klima', 'Lüftung', 'Elektro'];

let state = {
    searchQuery: '',
    activeCategory: 'All',
};

function render() {
    const filteredBusinesses = ALL_BUSINESSES.filter(business => {
        const matchesCategory = state.activeCategory === 'All' || business.category === state.activeCategory;
        const matchesSearch = state.searchQuery.length === 0 ||
            business.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            business.city.toLowerCase().includes(state.searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    let html = `
        <div class="bg-white py-16 md:py-24 border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div class="inline-flex justify-center items-center p-4 bg-brand-surface rounded-full mb-6">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-brand-copper"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><path d="M12 20h4"/><path d="M12 20H8"/><path d="M12 4H8v4h4V4Z"/></svg>
                </div>
                <h1 class="text-4xl md:text-6xl font-display font-black text-brand-dark mb-4">${t('directory.title')}</h1>
                <p class="text-lg md:text-xl text-brand-steel max-w-2xl mx-auto">${t('directory.subtitle')}</p>
            </div>
        </div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="sticky top-20 z-40 bg-brand-surface/80 backdrop-blur-md p-4 mb-12 rounded-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
                <div class="relative w-full md:w-1/2 lg:w-1/3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <input id="dir-search-input" type="text" value="${state.searchQuery}" placeholder="${t('search.placeholder_dir')}" class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-brand-copper outline-none transition" />
                </div>
                <div class="flex flex-wrap gap-2 justify-center">
                    <button data-cat="All" class="dir-cat-btn px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition ${state.activeCategory === 'All' ? 'bg-brand-dark text-white' : 'bg-white text-brand-dark hover:bg-gray-100 border border-gray-200'}">All</button>
                    ${DIRECTORY_CATEGORIES.map(cat => `
                        <button data-cat="${cat}" class="dir-cat-btn px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition ${state.activeCategory === cat ? 'bg-brand-dark text-white' : 'bg-white text-brand-dark hover:bg-gray-100 border border-gray-200'}">${cat}</button>
                    `).join('')}
                </div>
            </div>
            ${filteredBusinesses.length > 0 ? `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    ${filteredBusinesses.map(biz => createDirectoryCard(biz)).join('')}
                </div>
            ` : `
                <div class="text-center py-32 bg-white rounded-sm border border-dashed border-gray-300">
                    <p class="text-brand-steel font-medium text-lg">No businesses found matching your criteria.</p>
                    <button id="clear-filters-btn" class="mt-4 text-brand-copper font-bold uppercase text-xs underline">Clear Filters</button>
                </div>
            `}
        </div>
    `;
    mainContent.innerHTML = html;
    addEventListeners();
}

function addEventListeners() {
    document.getElementById('dir-search-input')?.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        render();
    });

    document.querySelectorAll('.dir-cat-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            state.activeCategory = e.currentTarget.dataset.cat;
            render();
        });
    });
    
    document.getElementById('clear-filters-btn')?.addEventListener('click', () => {
        state.searchQuery = '';
        state.activeCategory = 'All';
        render();
    });
}

window.addEventListener('language-change', render);
document.addEventListener('DOMContentLoaded', render);
