import { ALL_ARTICLES, ALL_BUSINESSES, INITIAL_CATEGORIES } from './data.js';
import { syncDataWithGoogle } from './googleApiService.js';

// --- STATE MANAGEMENT ---
let state = {
    isAuthenticated: sessionStorage.getItem('shk_authed') === 'true',
    articles: [...ALL_ARTICLES],
    directory: [...ALL_BUSINESSES],
    categories: [...INITIAL_CATEGORIES],
    activeView: 'dashboard',
    isEditing: false,
    currentItem: null,
    syncState: 'idle' // idle | loading | success | error
};

// --- DOM ELEMENTS ---
const loginContainer = document.getElementById('login-container');
const cmsContainer = document.getElementById('cms-container');
const editorContainer = document.getElementById('editor-container');
const sidebar = document.getElementById('cms-sidebar');
const mainContent = document.getElementById('cms-main-content');

// --- ICONS (as SVG strings) ---
const ICONS = {
    Home: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    FileText: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>',
    Layout: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
    Tag: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>',
    Building: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',
    BarChart: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
    RefreshCw: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>',
    LogOut: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
    Edit: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
    Trash2: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
    Plus: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
};

// --- RENDER FUNCTIONS ---
function render() {
    if (state.isAuthenticated) {
        loginContainer.style.display = 'none';
        if (state.isEditing) {
            cmsContainer.style.display = 'none';
            editorContainer.style.display = 'block';
            renderEditor();
        } else {
            cmsContainer.style.display = 'flex';
            editorContainer.style.display = 'none';
            renderSidebar();
            renderMainContent();
        }
    } else {
        loginContainer.style.display = 'flex';
        cmsContainer.style.display = 'none';
        editorContainer.style.display = 'none';
    }
}

function renderSidebar() {
    const navItems = [
        { view: 'dashboard', label: 'Dashboard', icon: ICONS.Home },
        { view: 'articles', label: 'Articles', icon: ICONS.FileText },
        { view: 'pages', label: 'Pages', icon: ICONS.Layout },
        { view: 'categories', label: 'Categories', icon: ICONS.Tag },
        { view: 'directory', label: 'Directory', icon: ICONS.Building },
        { view: 'analytics', label: 'Analytics', icon: ICONS.BarChart },
        { view: 'sync', label: 'Sync Center', icon: ICONS.RefreshCw },
    ];
    sidebar.innerHTML = `
        <div class="p-6">
            <div class="flex items-center space-x-2 text-white mb-8">
                <img src="https://k.sinaimg.cn/n/sinakd20230526s/256/w256h0/20230526/519e-e3b97b1029e08097b692482596409605.jpg/w700d1q75cms.jpg" alt="SHK CMS" class="h-10 w-auto rounded-sm bg-white" />
                <span class="text-xs uppercase tracking-wider font-medium opacity-50">CMS</span>
            </div>
            <nav class="space-y-2">
                ${navItems.map(item => `
                    <button data-view="${item.view}" class="nav-button w-full flex items-center space-x-3 px-4 py-3 rounded-sm text-sm font-bold uppercase tracking-wider transition ${state.activeView === item.view ? 'bg-brand-copper text-white' : 'hover:bg-white/5 hover:text-white'}">
                        ${item.icon} <span>${item.label}</span>
                    </button>
                `).join('')}
            </nav>
        </div>
        <div class="mt-auto p-6 border-t border-gray-800">
            <button id="logout-button" class="flex items-center space-x-2 text-sm font-medium hover:text-white transition">
                ${ICONS.LogOut} <span>Logout</span>
            </button>
        </div>
    `;
    addSidebarEventListeners();
}

function renderMainContent() {
    const header = `<div class="flex justify-between items-center mb-10"><h1 class="text-3xl font-display font-bold text-gray-900 capitalize">${state.activeView}</h1></div>`;
    let content = '';

    switch (state.activeView) {
        case 'dashboard': content = renderDashboard(); break;
        case 'articles': content = renderTable('article'); break;
        case 'pages': content = renderTable('page'); break;
        case 'directory': content = renderDirectoryTable(); break;
        case 'categories': content = renderCategories(); break;
        case 'analytics': content = renderAnalytics(); break;
        case 'sync': content = renderSyncCenter(); break;
    }
    mainContent.innerHTML = header + content;
    addMainContentViewEventListeners();
}

function renderDashboard() {
    // ... Simplified dashboard for brevity
    return `<div class="bg-white p-6 rounded-sm shadow-sm border border-gray-200">Welcome to the Dashboard. Select a view from the sidebar to get started.</div>`;
}

function renderTable(type) {
    const items = state.articles.filter(a => (type === 'article' ? a.type === 'article' : a.type === 'page'));
    return `
        <div class="flex justify-end mb-6">
            <button data-action="create" data-type="${type}" class="flex items-center bg-brand-copper text-white px-5 py-2.5 rounded-sm hover:bg-orange-800 transition shadow-sm font-bold uppercase text-xs tracking-wider">${ICONS.Plus} New</button>
        </div>
        <div class="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-200">
                    <tr>
                        <th class="p-4 pl-6">Title</th>
                        ${type === 'article' ? '<th class="p-4">Category</th>' : ''}
                        <th class="p-4 text-right pr-6">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    ${items.map(item => `
                        <tr class="hover:bg-gray-50 transition group">
                            <td class="p-4 pl-6 font-medium text-gray-900">${item.title}</td>
                            ${type === 'article' ? `<td class="p-4"><span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-sm text-[10px] uppercase font-bold tracking-wide border border-gray-200">${item.category}</span></td>` : ''}
                            <td class="p-4 text-right space-x-2 pr-6">
                                <button data-action="edit" data-id="${item.id}" class="text-gray-400 hover:text-brand-copper p-1 transition">${ICONS.Edit}</button>
                                <button data-action="delete" data-id="${item.id}" data-type="article" class="text-gray-400 hover:text-red-500 p-1 transition">${ICONS.Trash2}</button>
                            </td>
                        </tr>
                    `).join('')}
                    ${items.length === 0 ? `<tr><td colspan="3" class="p-8 text-center text-gray-400 text-sm">No content found.</td></tr>` : ''}
                </tbody>
            </table>
        </div>
    `;
}

// Simplified render functions for other views...
function renderDirectoryTable() {
    return `<div class="flex justify-end mb-6">
            <button data-action="create" data-type="business" class="flex items-center bg-brand-copper text-white px-5 py-2.5 rounded-sm hover:bg-orange-800 transition shadow-sm font-bold uppercase text-xs tracking-wider">${ICONS.Plus} New Entry</button>
        </div>
        <div class="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
            <table class="w-full text-left">
                <thead><tr><th>Name</th><th>Category</th><th>City</th><th>Actions</th></tr></thead>
                <tbody>${state.directory.map(b => `<tr><td class="p-4">${b.name}</td><td>${b.category}</td><td>${b.city}</td><td><button data-action="edit" data-id="${b.id}">${ICONS.Edit}</button><button data-action="delete" data-id="${b.id}" data-type="business">${ICONS.Trash2}</button></td></tr>`).join('')}</tbody>
            </table>
        </div>`;
}
function renderCategories() { /* ... */ return 'Categories view not fully implemented in this version.'; }
function renderAnalytics() { /* ... */ return 'Analytics view not fully implemented in this version.'; }

function renderSyncCenter() {
    let statusMessage = '';
    if (state.syncState === 'success') {
        statusMessage = `<p class="mt-4 text-green-600 font-bold flex items-center justify-center">Sync Successful!</p>`;
    } else if (state.syncState === 'error') {
        statusMessage = `<p class="mt-4 text-red-600 font-bold flex items-center justify-center">Sync Failed!</p>`;
    }

    return `
        <div class="max-w-xl mx-auto text-center">
            <div class="bg-white p-12 rounded-sm shadow-sm border">
                ${ICONS.RefreshCw.replace('w-4 h-4', 'w-12 h-12 mx-auto text-brand-copper mb-4')}
                <h2 class="text-2xl font-bold font-display text-brand-dark mb-2">Sync Center</h2>
                <p class="text-brand-steel mb-8">Push your local changes to the Google Docs & Sheets database, and pull the latest version.</p>
                <button id="sync-now-button" ${state.syncState === 'loading' ? 'disabled' : ''} class="bg-brand-dark text-white font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-sm hover:bg-brand-copper transition disabled:opacity-50 w-64 h-16 flex items-center justify-center mx-auto">
                    ${state.syncState === 'loading' ? `<div class="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>` : 'Sync Now'}
                </button>
                ${statusMessage}
            </div>
        </div>`;
}

function renderEditor() {
    // Simplified editor for brevity
    const isArticle = state.currentItem.type === 'article';
    editorContainer.innerHTML = `
        <div class="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
            <h2 class="text-lg font-bold text-gray-800">${state.currentItem.title || 'New Content'}</h2>
            <div class="flex space-x-3">
                <button id="editor-cancel" class="text-gray-500 hover:text-gray-800 transition">Cancel</button>
                <button id="editor-save" class="flex items-center bg-green-600 text-white px-6 py-2 rounded-sm hover:bg-green-700 font-bold uppercase text-xs tracking-wider">Save</button>
            </div>
        </div>
        <div class="max-w-4xl mx-auto p-6 space-y-4">
            <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Headline</label>
                <input id="editor-title" type="text" value="${state.currentItem.title || ''}" class="w-full text-2xl font-display font-bold border-b-2 focus:border-brand-copper outline-none py-2"/>
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Content</label>
                <div id="rich-text-editor" contenteditable="true" class="prose max-w-none p-4 border rounded-sm min-h-[300px] bg-white">${state.currentItem.content || ''}</div>
            </div>
             ${isArticle ? `
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select id="editor-category" class="w-full border p-2 rounded-sm bg-white">
                    ${state.categories.map(c => `<option value="${c}" ${state.currentItem.category === c ? 'selected' : ''}>${c}</option>`).join('')}
                  </select>
                </div>
            ` : ''}
        </div>
    `;
    addEditorEventListeners();
}

// --- EVENT LISTENERS ---
function addSidebarEventListeners() {
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', (e) => {
            state.activeView = e.currentTarget.dataset.view;
            render();
        });
    });
    document.getElementById('logout-button').addEventListener('click', handleLogout);
}

function addMainContentViewEventListeners() {
    mainContent.querySelectorAll('[data-action="create"]').forEach(btn => btn.addEventListener('click', handleCreate));
    mainContent.querySelectorAll('[data-action="edit"]').forEach(btn => btn.addEventListener('click', handleEdit));
    mainContent.querySelectorAll('[data-action="delete"]').forEach(btn => btn.addEventListener('click', handleDelete));
    mainContent.querySelector('#sync-now-button')?.addEventListener('click', handleSync);
}

function addEditorEventListeners() {
    document.getElementById('editor-cancel').addEventListener('click', handleCancelEdit);
    document.getElementById('editor-save').addEventListener('click', handleSave);
}

// --- HANDLER FUNCTIONS ---
function handleLogin(e) {
    e.preventDefault();
    // Simplified login logic
    state.isAuthenticated = true;
    sessionStorage.setItem('shk_authed', 'true');
    render();
}

function handleLogout() {
    state.isAuthenticated = false;
    sessionStorage.removeItem('shk_authed');
    render();
}

function handleCreate(e) {
    const type = e.currentTarget.dataset.type;
    state.isEditing = true;
    if (type === 'business') {
        state.currentItem = { id: crypto.randomUUID(), type: 'business', name: '', category: 'Heizung' };
    } else {
        state.currentItem = { id: crypto.randomUUID(), type, title: '', content: '<p></p>', category: state.categories[0] || ''};
    }
    render();
}

function handleEdit(e) {
    const id = e.currentTarget.dataset.id;
    const item = [...state.articles, ...state.directory].find(i => i.id === id);
    if (item) {
        state.isEditing = true;
        state.currentItem = { ...item };
        render();
    }
}

function handleDelete(e) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const { id, type } = e.currentTarget.dataset;
    if (type === 'business') {
        state.directory = state.directory.filter(item => item.id !== id);
    } else {
        state.articles = state.articles.filter(item => item.id !== id);
    }
    render();
}

function handleCancelEdit() {
    state.isEditing = false;
    state.currentItem = null;
    render();
}

function handleSave() {
    const item = state.currentItem;
    if (!item) return;

    // Collect data from editor form
    item.title = document.getElementById('editor-title')?.value || item.title;
    item.content = document.getElementById('rich-text-editor')?.innerHTML || item.content;
    const categorySelect = document.getElementById('editor-category');
    if (categorySelect) {
        item.category = categorySelect.value;
    }
    
    // Update state array
    const articlesIndex = state.articles.findIndex(a => a.id === item.id);
    if (articlesIndex > -1) {
        state.articles[articlesIndex] = item;
    } else {
        state.articles.unshift(item);
    }

    state.isEditing = false;
    state.currentItem = null;
    render();
}

async function handleSync() {
    state.syncState = 'loading';
    render();
    try {
        const response = await syncDataWithGoogle({ articles: state.articles, directory: state.directory });
        state.articles = response.articles;
        state.directory = response.directory;
        state.syncState = 'success';
    } catch (error) {
        state.syncState = 'error';
    }
    setTimeout(() => {
        state.syncState = 'idle';
        if (state.activeView === 'sync') render();
    }, 3000);
    render();
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    render();
});
