import { ALL_ARTICLES } from './data.js';
import { languageService } from './language.js';

const { t } = languageService;
const mainContent = document.getElementById('main-content');

function render() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    const article = ALL_ARTICLES.find(a => a.id === articleId);

    if (!article) {
        mainContent.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-gray-50">
                <div class="text-center p-12 bg-white shadow-lg rounded-sm">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Article not found</h2>
                    <a href="index.html" class="text-white bg-brand-copper px-6 py-2 rounded-sm font-bold uppercase text-xs tracking-widest hover:bg-brand-dark transition">Return Home</a>
                </div>
            </div>`;
        return;
    }

    document.title = `SHK Rhein-Neckar | ${article.title}`;

    const { lang } = languageService;
    const title = article.translations?.[lang]?.title || article.title;
    const summary = article.translations?.[lang]?.summary || article.summary;
    const content = article.translations?.[lang]?.content || article.content;
    const isPage = article.type === 'page';

    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url?.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };
    const videoId = getYouTubeId(article.videoUrl);

    let html = `
      <article class="max-w-6xl mx-auto my-0 bg-white">
        <header class="px-4 py-16 md:py-24 text-center max-w-4xl mx-auto">
           ${!isPage ? `<div class="mb-8"><span class="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white bg-brand-dark rounded-sm">${article.category}</span></div>` : ''}
           <h1 class="text-4xl md:text-6xl font-display font-black text-brand-dark leading-[1.1] mb-10 tracking-tight">${title}</h1>
           ${!isPage ? `
             <div class="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 text-sm text-brand-steel border-t border-b border-gray-100 py-6">
               <div class="flex items-center"><span class="font-bold text-brand-dark uppercase tracking-wide text-xs">${article.author}</span></div>
               <div class="hidden md:block w-px h-4 bg-gray-300"></div>
               <div class="flex items-center"><span class="uppercase tracking-wide text-xs">${new Date(article.publishedAt).toLocaleDateString()}</span></div>
               <div class="hidden md:block w-px h-4 bg-gray-300"></div>
               <div class="flex items-center text-gray-400 uppercase tracking-wide text-xs">${article.readTime ? Math.ceil(article.readTime / 60) : 5} ${t('article.read_time')}</div>
             </div>` : ''}
        </header>

        ${(article.imageUrl || videoId) ? `
          <div class="w-full aspect-video md:aspect-[21/9] overflow-hidden bg-gray-100 shadow-sm">
            ${videoId ? `
              <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=0" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full h-full"></iframe>
            ` : `<img src="${article.imageUrl}" alt="${title}" class="w-full h-full object-cover" />`}
          </div>` : ''
        }

        <div class="px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
           ${!isPage ? `
             <div class="hidden lg:flex lg:col-span-2 flex-col items-center">
                <div class="sticky top-32 space-y-6 flex flex-col items-center">
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest rotate-180 writing-mode-vertical mb-2">${t('article.share')}</span>
                  <button id="share-linkedin" class="p-3 rounded-full bg-white border border-gray-100 text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition shadow-sm">LN</button>
                  <button id="share-twitter" class="p-3 rounded-full bg-white border border-gray-100 text-gray-500 hover:text-sky-500 hover:border-sky-200 hover:bg-sky-50 transition shadow-sm">TW</button>
                  <button id="share-facebook" class="p-3 rounded-full bg-white border border-gray-100 text-gray-500 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50 transition shadow-sm">FB</button>
                </div>
             </div>` : ''
           }
           <div class="col-span-1 ${isPage ? 'lg:col-span-8 lg:col-start-3' : 'lg:col-span-8'}">
             ${summary && !isPage ? `<div class="mb-12"><p class="text-2xl md:text-3xl font-display font-medium leading-relaxed text-brand-dark">${summary}</p></div>` : ''}
             <div class="prose prose-lg md:prose-xl prose-slate max-w-none text-gray-700 leading-loose prose-headings:font-display prose-headings:font-bold prose-headings:text-brand-dark prose-p:mb-8 prose-a:text-brand-copper prose-a:no-underline hover:prose-a:underline prose-img:rounded-sm prose-img:shadow-lg">
               ${content}
             </div>
           </div>
        </div>
      </article>
    `;
    mainContent.innerHTML = html;
    addEventListeners(article);
}

function addEventListeners(article) {
    const shareUrl = window.location.href;
    const shareText = encodeURIComponent(`Check out this article: ${article.title}`);

    document.getElementById('share-linkedin')?.addEventListener('click', () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank'));
    document.getElementById('share-twitter')?.addEventListener('click', () => window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`, '_blank'));
    document.getElementById('share-facebook')?.addEventListener('click', () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank'));

    window.addEventListener('scroll', handleScroll, { passive: true });
}

function handleScroll() {
    const totalScroll = document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scroll = totalScroll / windowHeight;
    const progressBar = document.querySelector('#progress-bar > div');
    if(progressBar) {
        progressBar.style.width = `${scroll * 100}%`;
    }
}


window.addEventListener('language-change', render);
document.addEventListener('DOMContentLoaded', render);
