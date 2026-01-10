import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  profileImage: string | null;
  contactTitle: string;
  contactDescription: string;
  footerTagline: string;
}

interface AdminContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  siteContent: SiteContent;
  updateContent: (key: keyof SiteContent, value: string) => void;
  updateProfileImage: (image: string) => void;
}

const defaultContent: SiteContent = {
  heroTitle: '',
  heroSubtitle: '',
  heroDescription: '',
  aboutTitle: '',
  aboutDescription: '',
  profileImage: null,
  contactTitle: '',
  contactDescription: '',
  footerTagline: '',
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('_sc_');
    return saved ? JSON.parse(saved) : defaultContent;
  });

  useEffect(() => {
    const session = sessionStorage.getItem('_as_');
    if (session === btoa('authenticated')) {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('_sc_', JSON.stringify(siteContent));
  }, [siteContent]);

  const login = (username: string, password: string): boolean => {
    if (username === 'surajit' && password === '26122004') {
      setIsAdmin(true);
      sessionStorage.setItem('_as_', btoa('authenticated'));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('_as_');
  };

  const updateContent = (key: keyof SiteContent, value: string) => {
    setSiteContent(prev => ({ ...prev, [key]: value }));
  };

  const updateProfileImage = (image: string) => {
    setSiteContent(prev => ({ ...prev, profileImage: image }));
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, siteContent, updateContent, updateProfileImage }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
