import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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
  updateSiteContent: (newContent: SiteContent) => Promise<void>;
  isLoading: boolean;
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
    {
      id: '6',
      title: 'CENTRALISED FILE-SHARING SYSTEM WITH DHCP & FTP Server',
      subtitle: 'Computer Networks',
      date: 'JAN 2026',
      description: 'Implemented a centralised file-sharing network with dynamic IP allocation using DHCP and secure FTP-based file transfer across multiple departmental subnets, connected via static routing and DHCP relay in Cisco Packet Tracer.',
      tags: ['DHCP', 'FTP', 'Static Routing', 'Subnetting', 'Networking'],
      category: 'ACADEMIC',
    }
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
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Content Fetch from Supabase
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching content from Supabase...');

        const [settingsRes, projectsRes] = await Promise.all([
          supabase.from('site_settings').select('*').eq('id', 'global').single(),
          supabase.from('projects').select('*').order('created_at', { ascending: false })
        ]);

        if (settingsRes.error && settingsRes.error.code !== 'PGRST116') {
          console.error('Error fetching settings:', settingsRes.error);
        }

        if (projectsRes.error) {
          console.error('Error fetching projects:', projectsRes.error);
        }

        // If no settings exist, we assume it's a fresh DB and seed it
        if (!settingsRes.data) {
          console.log('No data found in Supabase. Seeding initial content...');
          await seedInitialData();
          return;
        }

        const newContent: SiteContent = {
          about: settingsRes.data.about,
          contact: settingsRes.data.contact,
          projects: projectsRes.data || [],
        };

        setSiteContent(newContent);
      } catch (error) {
        console.error('Unexpected error fetching content:', error);
        toast.error('Failed to load content from server. Using local defaults.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();

    const session = sessionStorage.getItem('_as_');
    if (session === btoa('authenticated')) {
      setIsAdmin(true);
    }
  }, []);

  const seedInitialData = async () => {
    try {
      // Check for existing local data to migrate
      const localSaved = localStorage.getItem('_sc_v4_');
      const dataToSeed: SiteContent = localSaved ? JSON.parse(localSaved) : defaultContent;

      console.log('Seeding data source:', localSaved ? 'LocalStorage' : 'Default Content');

      // 1. Insert global settings
      const { error: settingsError } = await supabase.from('site_settings').upsert({
        id: 'global',
        about: dataToSeed.about,
        contact: dataToSeed.contact
      });

      if (settingsError) throw settingsError;

      // 2. Insert projects
      // Remove legacy 'id' to act as new inserts so Supabase generates UUIDs
      const projectsToInsert = dataToSeed.projects.map(({ id, ...rest }) => rest);

      const { data: insertedProjects, error: projectsError } = await supabase
        .from('projects')
        .insert(projectsToInsert)
        .select();

      if (projectsError) throw projectsError;

      // Update local state with the newly generated IDs
      setSiteContent({
        ...dataToSeed,
        projects: insertedProjects as Project[]
      });

      console.log('Database seeded successfully!');
      toast.success('Database migrated with existing content.');
    } catch (error: any) {
      console.error('Error seeding database:', error);
      // Log more detail if it's a Supabase error
      if (error?.message) console.error('Supabase message:', error.message);
      if (error?.details) console.error('Supabase details:', error.details);
      if (error?.hint) console.error('Supabase hint:', error.hint);

      toast.error('Failed to initialize database.');
    }
  };

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

  const updateSiteContent = async (newContent: SiteContent) => {
    try {
      toast.loading('Saving to database...');

      // 1. Update Settings
      const { error: settingsError } = await supabase
        .from('site_settings')
        .upsert({
          id: 'global',
          about: newContent.about,
          contact: newContent.contact,
          updated_at: new Date().toISOString()
        });

      if (settingsError) throw settingsError;

      // 2. Update Projects
      // We need to handle Add/Update/Delete
      // First, get current DB projects to check for deletions
      const { data: currentDbProjects } = await supabase.from('projects').select('id');
      const currentDbIds = currentDbProjects?.map(p => p.id) || [];
      const newIds = newContent.projects.map(p => p.id);

      // Delete missing projects
      const idsToDelete = currentDbIds.filter(id => !newIds.includes(id));
      if (idsToDelete.length > 0) {
        await supabase.from('projects').delete().in('id', idsToDelete);
      }

      // Upsert current projects
      for (const project of newContent.projects) {
        // If it's a legacy string ID (from previous local storage) or temp ID, we might need special handling.
        // But for simplicity in this "sync" function:
        // If ID looks like a valid UUID, we upsert.
        // If NOT, we insert (and let DB generate new UUID).
        // BUT, if we insert, the UI still holds the old ID until we refresh.
        // It is safer to:
        //   1. Check if ID exists in DB.
        //   2. If yes, update.
        //   3. If no (it's new), insert.
        // Since we are using upsert, we just need to ensure the ID is valid for UUID column.

        // Check if ID is likely a temp ID (numeric timestamp like '173655...') or legacy '1','2'
        // UUIDs are 36 chars with dashes.
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(project.id);

        if (!isUUID) {
          // It is a new or legacy project. Insert as new.
          const { id, ...projectData } = project; // Drop the invalid ID
          await supabase.from('projects').insert(projectData);
        } else {
          // It is an existing valid project. Update.
          await supabase.from('projects').upsert(project);
        }
      }

      // 3. Refresh State to get canonical source of truth (including new UUIDs)
      const { data: freshProjects } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: freshSettings } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'global')
        .single();

      if (freshProjects && freshSettings) {
        setSiteContent({
          about: freshSettings.about,
          contact: freshSettings.contact,
          projects: freshProjects as Project[],
        });
      }

      toast.dismiss();
      toast.success('Saved successfully to Supabase!');

    } catch (error) {
      console.error('Error updating content:', error);
      toast.dismiss();
      toast.error('Failed to save changes.');
      throw error;
    }
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, siteContent, updateSiteContent, isLoading }}>
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
