import { ALL_ARTICLES, INITIAL_CATEGORIES } from './data.js';
import { createArticleCard } from './components.js';
import { languageService } from './language.js';

const { t } = languageService;
const mainContent = document.getElementById('main-content');

let state = {
    articles: ALL_ARTICLES,
    categories: INITIAL_CATEGORIES,
    activeCategory: sessionStorage.getItem('active_category') || 'All',
    searchQuery: sessionStorage.getItem('search_query') || '',
    displayedCount: 6,
};

function render() {
    // Filter articles based on state
    let displayArticles = state.articles.filter(a => a.type !== 'page');

    if (state.searchQuery) {
        const lowerQuery = state.searchQuery.toLowerCase();
        displayArticles = displayArticles.filter(a => 
            a.title.toLowerCase().includes(lowerQuery) || 
            a.summary.toLowerCase().includes(lowerQuery) ||
            a.content.toLowerCase().includes(lowerQuery)
        );
        state.activeCategory = 'All'; // Reset category when searching
    } else if (state.activeCategory !== 'All') {
        displayArticles = displayArticles.filter(a => a.category === state.activeCategory);
    }
    
    const featuredArticle = !state.searchQuery && state.activeCategory === 'All' ? displayArticles.find(a => a.featured) : null;
    let gridArticles = featuredArticle ? displayArticles.filter(a => a.id !== featuredArticle.id) : displayArticles;

    const categoryCards = state.categories.map(cat => {
        const catArticle = state.articles.find(a => a.category === cat && a.imageUrl);
        const bgImage = catArticle?.imageUrl || 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600';
        return {
            id: cat,
            title: t(`cat.${cat}`),
            image: bgImage,
            count: state.articles.filter(a => a.category === cat).length
        };
    });
    
    // Build HTML
    let html = '';
    
    // HERO (only on home)
    if (state.activeCategory === 'All' && !state.searchQuery) {
        html += `
            <div class="relative w-full h-[650px] flex items-center bg-brand-dark overflow-hidden group">
                <div class="absolute inset-0 z-0">
                   <img src="https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&q=80&w=2000" class="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[20s] ease-linear" alt="Industrial Background" />
                   <div class="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/90 to-transparent"></div>
                </div>
                <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div class="max-w-3xl space-y-8 animate-fade-in-up">
                     <div class="flex items-center space-x-3 mb-6">
                        <div class="h-px w-12 bg-brand-copper"></div>
                        <span class="text-brand-copper font-bold uppercase tracking-[0.3em] text-[10px]">The Regional Authority</span>
                     </div>
                     <h1 class="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white leading-[0.9] tracking-tighter">${t('hero.title')}</h1>
                     <p class="text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-xl border-l-4 border-white/10 pl-6">${t('hero.subtitle')}</p>
                     <div class="flex flex-wrap gap-4 pt-8">
                        <a href="article.html?id=page-submit" class="group px-10 py-4 text-xs font-bold uppercase tracking-widest text-white border border-white/30 hover:bg-white/10 transition-all duration-300 rounded-sm backdrop-blur-sm flex items-center">${t('hero.submit_story')}</a>
                     </div>
                  </div>
                </div>
            </div>
        `;
    }

    // Main Content Area
    html += `<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">`;
    
    // Search Results Header
    if (state.searchQuery) {
        html += `
            <div class="mb-12">
                <h2 class="text-3xl font-display font-bold text-brand-dark mb-4">Search Results: "${state.searchQuery}"</h2>
                <p class="text-brand-steel">${displayArticles.length} articles found.</p>
            </div>
        `;
    }
    
    // Featured Article
    if (featuredArticle) {
        html += `
            <section class="mb-24 animate-fade-in-up" style="animation-delay: '0.3s'">
                <div class="flex items-center space-x-6 mb-10">
                    <div class="h-px bg-gray-200 flex-grow"></div>
                    <span class="text-brand-steel uppercase tracking-[0.2em] text-xs font-bold">${t('section.top_story')}</span>
                    <div class="h-px bg-gray-200 flex-grow"></div>
                </div>
                ${createArticleCard(featuredArticle, { variant: 'featured' })}
            </section>
        `;
    }

    // Article Grid
    html += `
        <section class="animate-fade-in-up" style="animation-delay: '0.4s'">
            <div class="flex items-end justify-between mb-12 border-b border-gray-200 pb-6">
                <h2 class="text-3xl font-display font-bold text-brand-dark">
                ${state.activeCategory === 'All' ? t('section.latest_news') : (t(`cat.${state.activeCategory}`) || state.activeCategory)}
                </h2>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:block">${gridArticles.length} Stories</span>
            </div>
            <div id="article-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                ${gridArticles.slice(0, state.displayedCount).map((article, idx) => `
                    <div style="animation-delay: ${0.1 * idx}s" class="animate-fade-in-up">
                        ${createArticleCard(article)}
                    </div>
                `).join('')}
            </div>
            ${gridArticles.length === 0 ? `
                <div class="text-center py-32 bg-gray-50 rounded-sm border border-dashed border-gray-300">
                    <p class="text-brand-steel font-medium text-lg">${state.searchQuery ? t('search.no_results') : 'No stories found.'}</p>
                    ${state.searchQuery ? `<button id="clear-search-btn" class="mt-4 text-brand-copper font-bold uppercase text-xs underline">Clear Search</button>` : ''}
                </div>
            ` : ''}
            ${gridArticles.length > state.displayedCount ? `
                <div class="mt-16 text-center">
                    <button id="load-more-btn" class="inline-flex items-center bg-white border border-gray-200 px-8 py-3 text-xs font-bold uppercase tracking-widest text-brand-dark hover:border-brand-copper hover:text-brand-copper transition-colors shadow-sm">
                        ${t('btn.load_more')}
                    </button>
                </div>
            ` : ''}
        </section>
    `;

    // Category Cards
    if (state.activeCategory === 'All' && !state.searchQuery) {
        html += `
            <section class="mt-32 pt-16 border-t border-gray-100 animate-fade-in">
                <h2 class="text-2xl font-display font-bold text-brand-dark flex items-center mb-10">${t('section.explore_categories')}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${categoryCards.map(cat => `
                        <div data-category-id="${cat.id}" class="category-card group relative h-64 rounded-sm overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                            <img src="${cat.image}" alt="${cat.title}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div class="absolute inset-0 bg-brand-dark/60 group-hover:bg-brand-dark/40 transition-colors duration-500"></div>
                            <div class="absolute inset-0 p-8 flex flex-col justify-end items-start">
                                <span class="text-xs text-white/80 font-bold uppercase tracking-wider mb-2">${cat.count} Stories</span>
                                <h3 class="text-2xl font-display font-bold text-white mb-4 group-hover:translate-x-2 transition-transform">${cat.title}</h3>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }

    html += `</div>`; // Close main content area

    // Newsletter Section
    html += `
        <section class="py-24 px-4 bg-brand-surface">
            <div class="max-w-6xl mx-auto bg-brand-dark rounded-sm overflow-hidden shadow-2xl relative">
                <div class="relative z-10 grid md:grid-cols-2 gap-12 p-12 md:p-20 items-center">
                    <div class="text-left space-y-6">
                       <h2 class="text-4xl font-display font-bold text-white leading-tight">${t('newsletter.title')}</h2>
                       <p class="text-gray-400 text-lg leading-relaxed">${t('newsletter.text')}</p>
                    </div>
                    <div class="bg-white/5 backdrop-blur-sm p-8 rounded-sm border border-white/10">
                       <form class="flex flex-col gap-4">
                         <input type="email" placeholder="${t('newsletter.placeholder')}" class="w-full px-6 py-4 bg-white/10 border border-white/10 rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-copper focus:bg-white/20 transition-all"/>
                         <button class="w-full bg-brand-copper text-white px-6 py-4 font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-brand-dark transition-all rounded-sm shadow-lg hover:shadow-xl mt-2">${t('newsletter.button')}</button>
                       </form>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    mainContent.innerHTML = html;
    addEventListeners();
}

function addEventListeners() {
    document.getElementById('load-more-btn')?.addEventListener('click', () => {
        state.displayedCount += (state.activeCategory === 'All' ? 6 : 9);
        render();
    });

    document.getElementById('clear-search-btn')?.addEventListener('click', () => {
        state.searchQuery = '';
        sessionStorage.setItem('search_query', '');
        render();
        // Also clear search in header if it exists
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';
    });

    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.categoryId;
            handleCategoryChange(category);
        });
    });
}

function handleCategoryChange(category) {
    state.activeCategory = category;
    state.searchQuery = '';
    sessionStorage.setItem('active_category', category);
    sessionStorage.setItem('search_query', '');
    state.displayedCount = category === 'All' ? 6 : 9;
    render();
    // Re-render header to update active state by triggering language-change event
    window.dispatchEvent(new CustomEvent('language-change'));
}

window.addEventListener('language-change', render);

window.addEventListener('search-change', (e) => {
    state.searchQuery = e.detail;
    if(state.searchQuery) {
        state.displayedCount = 100; // show all results
    } else {
        state.displayedCount = 6;
    }
    render();
});

// Listen for category changes from the header/footer
window.addEventListener('category-change', (e) => {
    handleCategoryChange(e.detail.category);
});


document.addEventListener('DOMContentLoaded', () => {
    // Check if category was passed from another page via session storage
    const navCategory = sessionStorage.getItem('active_category');
    if (navCategory) {
        handleCategoryChange(navCategory);
    } else {
        render();
    }
});