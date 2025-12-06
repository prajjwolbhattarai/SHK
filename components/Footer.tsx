
import React from 'react';
import { Mail, MapPin } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  categories: string[];
  onCategoryClick?: (category: string) => void;
}

const Footer: React.FC<FooterProps> = ({ categories, onCategoryClick }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const logoUrl = "https://k.sinaimg.cn/n/sinakd20230526s/256/w256h0/20230526/519e-e3b97b1029e08097b692482596409605.jpg/w700d1q75cms.jpg";

  const handleNavClick = (cat: string) => {
    if (location.pathname === '/' && onCategoryClick) {
      onCategoryClick(cat);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/', { state: { category: cat } });
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12">
        <div className="col-span-1 md:col-span-4 lg:col-span-2">
          <img 
            src={logoUrl} 
            alt="SHK Rhein-Neckar" 
            className="h-16 w-auto mb-4"
          />
          <p className="text-sm text-brand-steel leading-relaxed max-w-sm">
            {t('footer.about')}
          </p>
        </div>
        
        <div className="lg:col-start-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-dark mb-6">{t('nav.magazine')}</h3>
          <ul className="space-y-3 text-sm text-brand-steel">
            <li>
              <button onClick={() => handleNavClick('All')} className="hover:text-brand-copper transition text-left">
                {t('nav.home')}
              </button>
            </li>
            <li>
              <Link to="/directory" className="hover:text-brand-copper transition">{t('nav.directory')}</Link>
            </li>
            {categories.slice(0, 4).map(c => (
              <li key={c}>
                <button 
                  onClick={() => handleNavClick(c)} 
                  className="hover:text-brand-copper transition text-left"
                >
                  {t(`cat.${c}`)}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-dark mb-6">{t('nav.companies')}</h3>
          <ul className="space-y-3 text-sm text-brand-steel">
            <li><Link to="/article/page-submit" className="hover:text-brand-copper transition">{t('hero.submit_story')}</Link></li>
            <li><Link to="/article/page-advertising" className="hover:text-brand-copper transition">Advertising</Link></li>
            <li><Link to="/article/page-jobs" className="hover:text-brand-copper transition">Job Board</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-dark mb-6">{t('nav.contact')}</h3>
          <ul className="space-y-3 text-sm text-brand-steel">
            <li className="flex items-start"><Mail className="w-4 h-4 mr-2 mt-1 flex-shrink-0" /> redaktion@shk-rhein-neckar.de</li>
            <li className="flex items-start"><MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" /> Mannheim, Germany</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
        <div className="flex space-x-6">
          <Link to="/article/page-imprint" className="hover:text-brand-copper">Imprint</Link>
          <Link to="/article/page-privacy" className="hover:text-brand-copper">Privacy Policy</Link>
          <Link to="/article/page-terms" className="hover:text-brand-copper">Terms</Link>
        </div>
        <div className="mt-4 md:mt-0 text-center md:text-right">
          <span>© 2025 SHK Rhein-Neckar. {t('footer.rights')}</span>
          <Link to="/admin" className="ml-4 text-gray-300 hover:text-brand-copper transition">{t('footer.staff_login')}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
