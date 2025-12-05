
export type Language = 'en' | 'de' | 'fr' | 'it' | 'es';
export type ContentType = 'article' | 'page';

export interface SEOData {
  score: number;
  keywords: string[];
  suggestions: string[];
  metaDescription: string;
}

export interface ArticleContent {
  title: string;
  summary: string;
  content: string;
}

export interface Article extends ArticleContent {
  id: string;
  type: ContentType;
  imageUrl: string;
  videoUrl?: string; // YouTube URL
  author: string;
  category: string; // Dynamic string now
  publishedAt: string;
  featured: boolean;
  seo?: SEOData;
  views: number;    // Analytics
  shares: number;   // Analytics
  readTime: number; // Analytics (seconds)
  translations?: {
    [key in Language]?: ArticleContent;
  };
}

export interface CMSState {
  isEditing: boolean;
  activeArticleId: string | null;
}

// New Types for Business Directory
export type DirectoryCategory = 'Heizung' | 'Sanitär' | 'Klima' | 'Lüftung' | 'Elektro';

export interface Business {
  id: string;
  name: string;
  category: DirectoryCategory;
  address: string;
  city: string;
  zip: string;
  phone: string;
  website: string;
  description: string;
  logoUrl: string;
}
