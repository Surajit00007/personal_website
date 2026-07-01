import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GithubLogo, LinkedinLogo, InstagramLogo, Heart } from '@phosphor-icons/react';
import AnimatedBackground from './AnimatedBackground';
import AdminLoginModal from './AdminLoginModal';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const clickTimestamps = useRef<number[]>([]);

  const handleLogoClick = () => {
    const now = Date.now();
    clickTimestamps.current = clickTimestamps.current.filter(t => now - t < 7000);
    clickTimestamps.current.push(now);
    
    if (clickTimestamps.current.length >= 7) {
      setShowAdminModal(true);
      clickTimestamps.current = [];
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.footer-content',
        { opacity: 0, y: 40, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  const socials = [
    { icon: GithubLogo, href: 'https://github.com/Surajit00007' },
    { icon: LinkedinLogo, href: 'https://linkedin.com/in/surajit-sahoo-084173335' },
    { icon: InstagramLogo, href: 'https://instagram.com/surajit._007' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer ref={footerRef} className="relative py-16 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <AnimatedBackground />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent z-[1]" />

      <div className="footer-content container mx-auto px-6 relative z-10">
        <div className="glass-card p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo */}
            <div className="text-center md:text-left">
              <span 
                onClick={handleLogoClick}
                className="text-3xl font-bold text-gradient cursor-pointer select-none"
              >
                SURAJIT
              </span>
              <p className="text-muted-foreground text-sm mt-2">
                AI & ML Engineer
              </p>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-wrap justify-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Socials */}
            <div className="flex gap-4">
              {socials.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 glass flex items-center justify-center rounded-lg hover:bg-primary/10 transition-all duration-300"
                  >
                    <Icon size={20} weight="light" className="text-muted-foreground hover:text-primary" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border my-8" />

          {/* Copyright */}
          <div className="text-center text-muted-foreground text-sm">
            <p className="flex items-center justify-center gap-1">
              Made with <Heart size={16} weight="fill" className="text-neon-pink" /> by Surajit Sahoo
            </p>
            <p className="mt-2">© {new Date().getFullYear()} All rights reserved.</p>
          </div>
        </div>
      </div>
      
      <AdminLoginModal open={showAdminModal} onOpenChange={setShowAdminModal} />
    </footer>
  );
};

export default Footer;
