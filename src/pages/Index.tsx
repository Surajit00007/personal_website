import { useState, useEffect } from 'react';
import Preloader from '@/components/Preloader';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import CertificatesSection from '@/components/CertificatesSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Prevent scrolling during loading
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  const handleLoadComplete = () => {
    setIsLoading(false);
    // Small delay before showing content for smooth transition
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <title>Surajit Sahoo | AI & ML Engineer Portfolio</title>
      <meta name="description" content="Portfolio of Surajit Sahoo - An aspiring AI/ML Engineer specializing in machine learning, deep learning, and intelligent systems." />

      {isLoading && <Preloader onComplete={handleLoadComplete} />}

      <div
        className={`transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'
          }`}
      >
        <Navigation />
        <main>
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <CertificatesSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;

