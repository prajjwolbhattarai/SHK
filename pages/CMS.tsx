

import React, { useState, useRef } from 'react';
import { Article, ContentType, Business, DirectoryCategory } from '../types';
import { 
  Plus, Edit, Trash2, Image as ImageIcon, Sparkles, 
  BarChart, AlertCircle, Save, X, Eye, LogOut, Video,
  Layout, FileText, Settings, Home, Tag, TrendingUp, Users, Clock, Share2,
  Book, Building, Activity, RefreshCw, CheckCircle, ServerCrash
} from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import { syncDataWithGoogle } from '../services/googleApiService';

interface CMSProps {
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  directory: Business[];
  setDirectory: React.Dispatch<React.SetStateAction<Business[]>>;
  onLogout: () => void;
}

type ViewMode = 'dashboard' | 'articles' | 'pages' | 'categories' | 'directory' | 'analytics' | 'sync';

const CMS: React.FC<CMSProps> = ({ articles, setArticles, categories, setCategories, directory, setDirectory, onLogout }) => {
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  
  // Article State
  const [isEditingArticle, setIsEditingArticle] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<Article>>({});
  
  // Directory State
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState<Partial<Business>>({});

  // General State
  const [newCategory, setNewCategory] = useState('');
  const [syncState, setSyncState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter content based on type
  const newsArticles = articles.filter(a => a.type === 'article' || !a.type);
  const staticPages = articles.filter(a => a.type === 'page');

  // --- Analytics Helpers ---
  const totalViews = articles.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalShares = articles.reduce((acc, curr) => acc + (curr.shares || 0), 0);
  const totalArticles = newsArticles.length;
  const avgReadTime = Math.round(articles.reduce((acc, curr) => acc + (curr.readTime || 0), 0) / (articles.length || 1));
  
  const viewsByCategory = categories.map(cat => {
    const catArticles = newsArticles.filter(a => a.category === cat);
    const views = catArticles.reduce((acc, curr) => acc + (curr.views || 0), 0);
    return { name: cat, views, count: catArticles.length };
  }).sort((a, b) => b.views - a.views);

  const topArticles = [...newsArticles].sort((a,b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
  
  // --- General Functions ---
  const resetAllEditors = () => {
    setCurrentArticle({});
    setIsEditingArticle(false);
    setCurrentBusiness({});
    setIsEditingBusiness(false);
  };

  // --- Article Functions ---
  const handleEditArticle = (article: Article) => {
    setCurrentArticle({ ...article });
    setIsEditingArticle(true);
  };

  const handleDeleteArticle = (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      setArticles(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleCreateArticle = (type: ContentType) => {
    setCurrentArticle({
      id: crypto.randomUUID(),
      title: '', summary: '',
      content: '<h2>New Section</h2><p>Start writing here...</p>',
      author: 'Editorial Team',
      category: type === 'article' ? categories[0] : 'Page',
      type: type,
      publishedAt: new Date().toISOString(),
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=1200',
      views: 0, shares: 0, readTime: 0
    });
    setIsEditingArticle(true);
  };
  
  const handleSaveArticle = () => {
    if (!currentArticle.title || !currentArticle.content) {
      alert('Title and Content are required');
      return;
    }
    setArticles(prev => {
      const exists = prev.find(a => a.id === currentArticle.id);
      if (exists) {
        return prev.map(a => a.id === currentArticle.id ? currentArticle as Article : a);
      }
      return [currentArticle as Article, ...prev];
    });
    resetAllEditors();
  };

  const handleArticleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentArticle(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };


  // --- Directory Functions ---
  const handleEditBusiness = (business: Business) => {
    setCurrentBusiness({ ...business });
    setIsEditingBusiness(true);
  };

  const handleDeleteBusiness = (id: string) => {
    if (window.confirm('Are you sure you want to delete this directory entry?')) {
      setDirectory(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleCreateBusiness = () => {
    setCurrentBusiness({
      id: crypto.randomUUID(),
      name: '',
      category: 'Heizung',
      address: '', city: '', zip: '', phone: '', website: '', description: '',
      logoUrl: 'https://via.placeholder.com/150'
    });
    setIsEditingBusiness(true);
  };

  const handleSaveBusiness = () => {
    if (!currentBusiness.name || !currentBusiness.city) {
      alert('Name and City are required');
      return;
    }
    setDirectory(prev => {
      const exists = prev.find(b => b.id === currentBusiness.id);
      if (exists) {
        return prev.map(b => b.id === currentBusiness.id ? currentBusiness as Business : b);
      }
      return [currentBusiness as Business, ...prev];
    });
    resetAllEditors();
  };


  // --- Category Functions ---
  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
        setCategories([...categories, newCategory]);
        setNewCategory('');
    }
  };

  const handleDeleteCategory = (cat: string) => {
      if (window.confirm(`Delete category "${cat}"?`)) {
          setCategories(categories.filter(c => c !== cat));
      }
  };

  // --- Sync Function ---
  const handleSync = async () => {
    setSyncState('loading');
    try {
      const response = await syncDataWithGoogle({ articles, directory });
      setArticles(response.articles);
      setDirectory(response.directory);
      setSyncState('success');
    } catch (error) {
      setSyncState('error');
    }
    setTimeout(() => setSyncState('idle'), 3000); // Reset state after 3s
  };

  // --- RENDER LOGIC ---

  if (isEditingArticle) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 font-sans">
        {/* Editor Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center space-x-4">
            <button onClick={resetAllEditors} className="text-gray-500 hover:text-gray-800 transition">
              <X className="w-6 h-6" />
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-brand-copper tracking-widest">
                {currentArticle.type === 'page' ? 'Page Editor' : 'Article Editor'}
              </span>
              <h2 className="text-lg font-bold text-gray-800 leading-none">
                {currentArticle.title || 'New Content'}
              </h2>
            </div>
          </div>
          <div className="flex space-x-3">
             <button 
               onClick={handleSaveArticle}
               className="flex items-center bg-green-600 text-white px-6 py-2 rounded-sm hover:bg-green-700 font-bold uppercase text-xs tracking-wider shadow-sm transition"
             >
               <Save className="w-4 h-4 mr-2" /> Save Changes
             </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Headline</label>
                  <input type="text" value={currentArticle.title || ''} onChange={e => setCurrentArticle(prev => ({...prev, title: e.target.value}))} className="w-full text-2xl font-display font-bold border-b-2 border-gray-100 focus:border-brand-copper outline-none py-2 placeholder-gray-300 transition" placeholder="Enter headline here..."/>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Summary (Teaser)</label>
                   <textarea value={currentArticle.summary || ''} onChange={e => setCurrentArticle(prev => ({...prev, summary: e.target.value}))} className="w-full border border-gray-200 rounded-sm p-3 text-sm focus:ring-1 focus:ring-brand-copper outline-none transition" rows={3} placeholder="Short summary for the article cards..."/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Content <span className="text-brand-copper font-normal ml-1">(Rich Text)</span></label>
                  <RichTextEditor content={currentArticle.content || ''} onChange={(html) => setCurrentArticle(prev => ({...prev, content: html}))}/>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center border-b border-gray-100 pb-3 text-sm uppercase tracking-wider"><Eye className="w-4 h-4 mr-2" /> Publication</h3>
              {currentArticle.type === 'article' && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select value={currentArticle.category} onChange={e => setCurrentArticle(prev => ({...prev, category: e.target.value}))} className="w-full border border-gray-300 rounded-sm p-2 text-sm bg-white focus:border-brand-copper outline-none">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              {currentArticle.type === 'article' && (
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Featured Status</label>
                   <div className="flex items-center p-3 border border-gray-100 rounded-sm hover:bg-gray-50 transition cursor-pointer" onClick={() => setCurrentArticle(prev => ({...prev, featured: !prev.featured}))}>
                     <input type="checkbox" checked={currentArticle.featured || false} onChange={e => setCurrentArticle(prev => ({...prev, featured: e.target.checked}))} className="mr-3 h-4 w-4 text-brand-copper focus:ring-brand-copper border-gray-300 rounded"/>
                     <span className="text-sm text-gray-700 select-none">Highlight on Homepage</span>
                   </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cover Image</label>
                <div className="relative aspect-video bg-gray-100 rounded-sm overflow-hidden mb-2 group shadow-inner border border-gray-200">
                  {currentArticle.imageUrl ? <img src={currentArticle.imageUrl} alt="Cover" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Image</div>}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                     <button onClick={() => fileInputRef.current?.click()} className="bg-white p-2 rounded-full hover:bg-gray-200 transition" title="Upload"><ImageIcon className="w-4 h-4 text-gray-700" /></button>
                  </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleArticleImageUpload}/>
              </div>
               <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Video URL</label>
                   <div className="relative">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Video className="h-3 w-3 text-gray-400" /></div>
                       <input type="text" value={currentArticle.videoUrl || ''} onChange={e => setCurrentArticle(prev => ({...prev, videoUrl: e.target.value}))} className="w-full border border-gray-300 rounded-sm py-2 pl-8 pr-2 text-sm focus:border-brand-copper outline-none" placeholder="https://youtube.com/..."/>
                   </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isEditingBusiness) {
    const dirCats: DirectoryCategory[] = ['Heizung', 'Sanitär', 'Klima', 'Lüftung', 'Elektro'];
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
          <h2 className="text-lg font-bold text-gray-800">Edit Directory Entry</h2>
          <div className="flex space-x-3">
            <button onClick={resetAllEditors} className="text-gray-500 hover:text-gray-800 transition"><X/></button>
            <button onClick={handleSaveBusiness} className="flex items-center bg-green-600 text-white px-6 py-2 rounded-sm hover:bg-green-700 font-bold uppercase text-xs tracking-wider"><Save className="w-4 h-4 mr-2" /> Save</button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-xs font-bold">Name</label><input value={currentBusiness.name || ''} onChange={e => setCurrentBusiness(p => ({...p, name: e.target.value}))} className="w-full border p-2 rounded-sm" /></div>
              <div><label className="text-xs font-bold">Category</label><select value={currentBusiness.category} onChange={e => setCurrentBusiness(p => ({...p, category: e.target.value as DirectoryCategory}))} className="w-full border p-2 rounded-sm bg-white">{dirCats.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div><label className="text-xs font-bold">Address</label><input value={currentBusiness.address || ''} onChange={e => setCurrentBusiness(p => ({...p, address: e.target.value}))} className="w-full border p-2 rounded-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold">City</label><input value={currentBusiness.city || ''} onChange={e => setCurrentBusiness(p => ({...p, city: e.target.value}))} className="w-full border p-2 rounded-sm" /></div>
                <div><label className="text-xs font-bold">ZIP</label><input value={currentBusiness.zip || ''} onChange={e => setCurrentBusiness(p => ({...p, zip: e.target.value}))} className="w-full border p-2 rounded-sm" /></div>
              </div>
              <div><label className="text-xs font-bold">Phone</label><input value={currentBusiness.phone || ''} onChange={e => setCurrentBusiness(p => ({...p, phone: e.target.value}))} className="w-full border p-2 rounded-sm" /></div>
              <div><label className="text-xs font-bold">Website</label><input value={currentBusiness.website || ''} onChange={e => setCurrentBusiness(p => ({...p, website: e.target.value}))} className="w-full border p-2 rounded-sm" /></div>
            </div>
            <div><label className="text-xs font-bold">Description</label><textarea value={currentBusiness.description || ''} onChange={e => setCurrentBusiness(p => ({...p, description: e.target.value}))} className="w-full border p-2 rounded-sm" rows={4}></textarea></div>
        </div>
      </div>
    );
  }

  // --- Main Dashboard View ---
  return (
    <div className="min-h-screen bg-gray-100 font-sans flex">
      <aside className="w-64 bg-brand-dark text-gray-400 flex flex-col fixed h-full z-10">
        <div className="p-6">
           <div className="flex items-center space-x-2 text-white mb-8"><img src="https://k.sinaimg.cn/n/sinakd20230526s/256/w256h0/20230526/519e-e3b97b1029e08097b692482596409605.jpg/w700d1q75cms.jpg" alt="SHK CMS" className="h-10 w-auto rounded-sm bg-white" /><span className="text-xs uppercase tracking-wider font-medium opacity-50">CMS</span></div>
           <nav className="space-y-2">
             <button onClick={() => setActiveView('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm text-sm font-bold uppercase tracking-wider transition ${activeView === 'dashboard' ? 'bg-brand-copper text-white' : 'hover:bg-white/5 hover:text-white'}`}><Home className="w-4 h-4" /> <span>Dashboard</span></button>
             <button onClick={() => setActiveView('articles')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm text-sm font-bold uppercase tracking-wider transition ${activeView === 'articles' ? 'bg-brand-copper text-white' : 'hover:bg-white/5 hover:text-white'}`}><FileText className="w-4 h-4" /> <span>Articles</span></button>
             <button onClick={() => setActiveView('pages')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm text-sm font-bold uppercase tracking-wider transition ${activeView === 'pages' ? 'bg-brand-copper text-white' : 'hover:bg-white/5 hover:text-white'}`}><Layout className="w-4 h-4" /> <span>Pages</span></button>
             <button onClick={() => setActiveView('categories')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm text-sm font-bold uppercase tracking-wider transition ${activeView === 'categories' ? 'bg-brand-copper text-white' : 'hover:bg-white/5 hover:text-white'}`}><Tag className="w-4 h-4" /> <span>Categories</span></button>
             <button onClick={() => setActiveView('directory')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm text-sm font-bold uppercase tracking-wider transition ${activeView === 'directory' ? 'bg-brand-copper text-white' : 'hover:bg-white/5 hover:text-white'}`}><Building className="w-4 h-4" /> <span>Directory</span></button>
             <button onClick={() => setActiveView('analytics')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm text-sm font-bold uppercase tracking-wider transition ${activeView === 'analytics' ? 'bg-brand-copper text-white' : 'hover:bg-white/5 hover:text-white'}`}><BarChart className="w-4 h-4" /> <span>Analytics</span></button>
             <button onClick={() => setActiveView('sync')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm text-sm font-bold uppercase tracking-wider transition ${activeView === 'sync' ? 'bg-brand-copper text-white' : 'hover:bg-white/5 hover:text-white'}`}><RefreshCw className="w-4 h-4" /> <span>Sync Center</span></button>
           </nav>
        </div>
        <div className="mt-auto p-6 border-t border-gray-800"><button onClick={onLogout} className="flex items-center space-x-2 text-sm font-medium hover:text-white transition"><LogOut className="w-4 h-4" /> <span>Logout</span></button></div>
      </aside>

      <main className="ml-64 flex-grow p-8">
        <div className="flex justify-between items-center mb-10"><h1 className="text-3xl font-display font-bold text-gray-900 capitalize">{activeView}</h1><div className="flex items-center space-x-4"><span className="text-sm text-gray-500">Welcome, <strong>Editor-in-Chief</strong></span><div className="w-8 h-8 rounded-full bg-brand-copper text-white flex items-center justify-center font-bold text-xs">EC</div></div></div>
        
        {activeView === 'dashboard' && <div className="grid grid-cols-1 md:grid-cols-4 gap-6"><div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200"><div className="flex items-center justify-between mb-2"><h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Articles</h3><FileText className="w-4 h-4 text-brand-copper" /></div><p className="text-3xl font-display font-bold text-brand-dark">{totalArticles}</p></div><div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200"><div className="flex items-center justify-between mb-2"><h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Views</h3><Eye className="w-4 h-4 text-brand-copper" /></div><p className="text-3xl font-display font-bold text-brand-dark">{totalViews.toLocaleString()}</p></div><div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200"><div className="flex items-center justify-between mb-2"><h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Shares</h3><Share2 className="w-4 h-4 text-brand-copper" /></div><p className="text-3xl font-display font-bold text-brand-dark">{totalShares.toLocaleString()}</p></div><div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200"><div className="flex items-center justify-between mb-2"><h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avg Read Time</h3><Clock className="w-4 h-4 text-brand-copper" /></div><p className="text-3xl font-display font-bold text-brand-dark">{avgReadTime}s</p></div><div className="md:col-span-4 lg:col-span-2 bg-white p-6 rounded-sm shadow-sm border"><h3 className="font-bold text-gray-800 mb-4">Top Articles</h3><div className="space-y-3">{topArticles.map(a => <div key={a.id} className="flex justify-between items-center text-sm"><span className="font-medium text-gray-700">{a.title}</span><span className="font-bold text-brand-copper">{a.views.toLocaleString()} views</span></div>)}</div></div><div className="md:col-span-4 lg:col-span-2 bg-white p-6 rounded-sm shadow-sm border"><h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3></div></div>}

        {(activeView === 'articles' || activeView === 'pages') && <div><div className="flex justify-end mb-6"><button onClick={() => handleCreateArticle(activeView === 'pages' ? 'page' : 'article')} className="flex items-center bg-brand-copper text-white px-5 py-2.5 rounded-sm hover:bg-orange-800 transition shadow-sm font-bold uppercase text-xs tracking-wider"><Plus className="w-4 h-4 mr-2" /> New</button></div><div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden"><table className="w-full text-left border-collapse"><thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-200"><tr><th className="p-4 pl-6">Title</th>{activeView === 'articles' && <th className="p-4">Category</th>}<th className="p-4">Author</th><th className="p-4 text-right pr-6">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{(activeView === 'articles' ? newsArticles : staticPages).map(article => (<tr key={article.id} className="hover:bg-gray-50 transition group"><td className="p-4 pl-6 font-medium text-gray-900">{article.title}</td>{activeView === 'articles' && (<td className="p-4"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-sm text-[10px] uppercase font-bold tracking-wide border border-gray-200">{article.category}</span></td>)}<td className="p-4 text-gray-600 text-sm">{article.author}</td><td className="p-4 text-right space-x-2 pr-6"><button onClick={() => handleEditArticle(article)} className="text-gray-400 hover:text-brand-copper p-1 transition"><Edit className="w-4 h-4" /></button><button onClick={() => handleDeleteArticle(article.id)} className="text-gray-400 hover:text-red-500 p-1 transition"><Trash2 className="w-4 h-4" /></button></td></tr>))}{(activeView === 'articles' ? newsArticles : staticPages).length === 0 && (<tr><td colSpan={4} className="p-8 text-center text-gray-400 text-sm">No content found.</td></tr>)}</tbody></table></div></div>}
        
        {activeView === 'directory' && <div><div className="flex justify-end mb-6"><button onClick={handleCreateBusiness} className="flex items-center bg-brand-copper text-white px-5 py-2.5 rounded-sm hover:bg-orange-800 transition shadow-sm font-bold uppercase text-xs tracking-wider"><Plus className="w-4 h-4 mr-2" /> New Entry</button></div><div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden"><table className="w-full text-left"><thead><tr><th>Name</th><th>Category</th><th>City</th><th>Actions</th></tr></thead><tbody>{directory.map(b => <tr key={b.id}><td className="p-4">{b.name}</td><td>{b.category}</td><td>{b.city}</td><td><button onClick={()=>handleEditBusiness(b)}><Edit/></button><button onClick={()=>handleDeleteBusiness(b.id)}><Trash2/></button></td></tr>)}</tbody></table></div></div>}

        {activeView === 'categories' && <div className="max-w-2xl"><div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 mb-6"><h3 className="font-bold text-gray-800 mb-4">Create New Category</h3><div className="flex gap-2"><input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Category Name (e.g., Innovation)" className="flex-grow border border-gray-300 rounded-sm px-4 py-2 focus:border-brand-copper outline-none" /><button onClick={handleAddCategory} className="bg-brand-dark text-white px-6 py-2 rounded-sm font-bold uppercase text-xs hover:bg-brand-copper transition">Create</button></div></div><div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden"><table className="w-full text-left"><thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-200"><tr><th className="p-4">Name</th><th className="p-4">Article Count</th><th className="p-4 text-right">Action</th></tr></thead><tbody className="divide-y divide-gray-100">{categories.map(cat => (<tr key={cat}><td className="p-4 font-bold text-gray-700">{cat}</td><td className="p-4 text-gray-500">{articles.filter(a => a.category === cat).length} Articles</td><td className="p-4 text-right"><button onClick={() => handleDeleteCategory(cat)} className="text-gray-400 hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button></td></tr>))}</tbody></table></div></div>}

        {activeView === 'analytics' && <div className="space-y-8"><div className="bg-white p-6 rounded-sm shadow-sm border"><h3 className="text-sm font-bold uppercase text-gray-500 mb-6">Performance by Category</h3><div className="space-y-4">{viewsByCategory.map((cat, idx) => (<div key={idx}><div className="flex justify-between text-xs font-bold mb-1"><span>{cat.name}</span><span className="text-gray-500">{cat.views.toLocaleString()} Views</span></div><div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-brand-copper h-2 rounded-full" style={{ width: `${(cat.views / (totalViews || 1)) * 100}%` }}></div></div></div>))}</div><div className="bg-white rounded-sm shadow-sm border"><div className="p-6 border-b"><h3 className="text-sm font-bold uppercase text-gray-500">Top Articles</h3></div><table className="w-full"><tbody>{topArticles.map(a => <tr key={a.id} className="border-b"><td className="p-4">{a.title}</td><td className="text-right p-4">{a.views.toLocaleString()} views</td></tr>)}</tbody></table></div></div>}
        
        {/* FIX: Changed condition from an impossible `activeView === 'analytics' && activeView === 'sync'` to correctly be `activeView === 'sync'`. */}
        {/* FIX: The condition `activeView === 'analytics' && activeView === 'sync'` can never be true. It should check for 'sync' only. */}
        {activeView === 'sync' && <div className="max-w-xl mx-auto text-center"><div className="bg-white p-12 rounded-sm shadow-sm border"><RefreshCw className="w-12 h-12 mx-auto text-brand-copper mb-4" /><h2 className="text-2xl font-bold font-display text-brand-dark mb-2">Sync Center</h2><p className="text-brand-steel mb-8">Push your local changes to the Google Docs & Sheets database, and pull the latest version. This is your main save/load point.</p><button onClick={handleSync} disabled={syncState === 'loading'} className="bg-brand-dark text-white font-bold uppercase tracking-wider text-sm px-8 py-4 rounded-sm hover:bg-brand-copper transition disabled:opacity-50 w-64 h-16 flex items-center justify-center mx-auto">{syncState === 'loading' ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"/> : 'Sync Now'}</button>{syncState === 'success' && <p className="mt-4 text-green-600 font-bold flex items-center justify-center"><CheckCircle className="w-5 h-5 mr-2" /> Sync Successful!</p>}{syncState === 'error' && <p className="mt-4 text-red-600 font-bold flex items-center justify-center"><ServerCrash className="w-5 h-5 mr-2" /> Sync Failed!</p>}</div></div>}

      </main>
    </div>
  );
};

export default CMS;
