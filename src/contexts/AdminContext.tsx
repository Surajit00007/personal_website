import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  tags: string[];
  github?: string;
  category: 'ACADEMIC' | 'PERSONAL';
}

export interface SocialLink {
  platform: 'GitHub' | 'LinkedIn' | 'Instagram' | 'Email';
  url: string;
}

export interface SiteContent {
  about: {
    title: string;
    description: string;
    profileImage: string | null;
  };
  projects: Project[];
  contact: {
    title: string;
    description: string;
    email: string;
    socials: SocialLink[];
  };
}

interface AdminContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  siteContent: SiteContent;
  updateSiteContent: (newContent: SiteContent) => void;
}

const defaultContent: SiteContent = {
  about: {
    title: 'About Me',
    description: "I'm an aspiring AI/ML Engineer passionate about building intelligent systems that solve real-world problems.\nWith a strong foundation in machine learning, deep learning, and data science, I enjoy exploring cutting-edge technologies and transforming complex data into actionable insights.\n\nMy journey involves working with neural networks, natural language processing, computer vision, and IoT systems.\nI believe in continuous learning and pushing the boundaries of what's possible with AI.",
    profileImage: null,
  },
  projects: [
    {
      id: '1',
      title: 'INTELLIGENT CHATBOT DEVELOPMENT',
      subtitle: 'Transformer-based AI',
      date: 'May 2025',
      description: 'Built an intelligent conversational chatbot using transformer models trained on Cornell Movie Dialogs datasets, enabling human-like responses through contextual understanding and self-attention mechanisms. Fine-tuned the model for relevance, tone consistency, and response quality using techniques like beam search and sampling.',
      tags: ['Transformers', 'NLP', 'Python'],
      github: 'https://github.com/Surajit00007',
      category: 'ACADEMIC',
    },
    {
      id: '2',
      title: 'AGRICULTURAL COMMODITY PRICE PREDICTION',
      subtitle: 'Deep Learning / time-series',
      date: 'DEC 2025',
      description: 'Built an intelligent prediction system using deep learning. Performed rigorous EDA, feature engineering (lags, rolling statistics, seasonality encoding) and time-aware train–test splitting, achieving improved forecasting accuracy measured via RMSE, MAE, R², and MAPE.',
      tags: ['Deep Learning', 'EDA', 'Forecasting'],
      category: 'ACADEMIC',
    },
    {
      id: '3',
      title: 'LOCAL AI CHATBOT',
      subtitle: 'Privacy-focused LLM Prototype',
      date: 'Dec 2025',
      description: 'Developed a ChatGPT-like chatbot that runs completely on a local laptop using phi3, llama3, and mistral via Ollama. Works fully offline with no internet or API dependency, ensuring total data privacy. Built with Python and Streamlit, featuring custom system prompts and chat memory.',
      tags: ['Ollama', 'LLM', 'Python', 'Pushing Boundaries'],
      github: 'https://github.com/Surajit00007/Customised_GPT_project',
      category: 'PERSONAL',
    },
    {
      id: '4',
      title: 'SWALLET APP- Expense tracker',
      subtitle: 'Personal Finance App',
      date: 'March 2025',
      description: 'Developed Swallet, a personal finance tracking app using Streamlit, enabling users to log income and expenses in INR with intuitive UI and date selection via Google Calendar integration. Implemented data visualization using pie charts and graphs for spending insights; ensured local CSV-based storage to maintain user privacy.',
      tags: ['Streamlit', 'Data Viz', 'Python'],
      github: 'https://github.com/Surajit00007',
      category: 'PERSONAL',
    },
    {
      id: '5',
      title: 'AUTOMATIC ROOM LIGHT SYSTEM',
      subtitle: 'IoT Project',
      date: 'Jun 2024',
      description: 'Designed and implemented a microcontroller-based automatic room light system with a bidirectional counter using an infrared sensor and Arduino Uno, enabling lights to toggle based on human presence. Developed the control logic using Embedded C, integrated infrared relay switching, and documented the design with flowcharts.',
      tags: ['Arduino', 'IoT', 'Embedded C'],
      github: 'https://github.com/Surajit00007',
      category: 'PERSONAL',
    },
  ],
  contact: {
    title: 'Get in Touch',
    description: "Have a project in mind or want to collaborate? I'd love to hear from you!",
    email: 'surajit007inc@gmail.com',
    socials: [
      { platform: 'GitHub', url: 'https://github.com/Surajit00007' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/surajit-sahoo-084173335' },
      { platform: 'Instagram', url: 'https://instagram.com/surajit._007' },
      { platform: 'Email', url: 'mailto:surajit007inc@gmail.com' },
    ],
  },
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('_sc_v2_'); // New key for new structure
    return saved ? JSON.parse(saved) : defaultContent;
  });

  useEffect(() => {
    const session = sessionStorage.getItem('_as_');
    if (session === btoa('authenticated')) {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('_sc_v2_', JSON.stringify(siteContent));
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

  const updateSiteContent = (newContent: SiteContent) => {
    setSiteContent(newContent);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, siteContent, updateSiteContent }}>
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
