import { useState, useEffect } from 'react';
import { List, X } from '@phosphor-icons/react';
import gsap from 'gsap';
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    if (isOpen) {
      gsap.fromTo('.mobile-nav-item', {
        opacity: 0,
        x: -30
      }, {
        opacity: 1,
        x: 0,
        stagger: 0.1,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  }, [isOpen]);
  const navItems = [{
    label: 'Home',
    href: '#home'
  }, {
    label: 'About',
    href: '#about'
  }, {
    label: 'Projects',
    href: '#projects'
  }, {
    label: 'Certificates',
    href: '#certificates'
  }, {
    label: 'Contact',
    href: '#contact'
  }];
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };
  return <>
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass py-4' : 'py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" onClick={e => {
          e.preventDefault();
          scrollToSection('#home');
        }} className="text-2xl text-gradient font-light">
          SURAJIT
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map(item => <a key={item.label} href={item.href} onClick={e => {
            e.preventDefault();
            scrollToSection(item.href);
          }} className="text-muted-foreground hover:text-foreground transition-colors duration-300 relative group">
            {item.label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-neon group-hover:w-full transition-all duration-300" />
          </a>)}
        </div>

        {/* CTA Button */}
        <a href="#contact" onClick={e => {
          e.preventDefault();
          scrollToSection('#contact');
        }} className="hidden md:block btn-neon text-sm px-6 py-3">
          Get in Touch
        </a>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-foreground" aria-label="Toggle menu">
          {isOpen ? <X size={28} weight="light" /> : <List size={28} weight="light" />}
        </button>
      </div>
    </nav>

    {/* Mobile Menu */}
    <div className={`fixed inset-0 z-40 glass transition-all duration-500 md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      <div className="flex flex-col items-center justify-center h-full gap-8">
        {navItems.map(item => <a key={item.label} href={item.href} onClick={e => {
          e.preventDefault();
          scrollToSection(item.href);
        }} className="mobile-nav-item text-3xl font-semibold text-foreground hover:text-gradient transition-all duration-300">
          {item.label}
        </a>)}
        <a href="#contact" onClick={e => {
          e.preventDefault();
          scrollToSection('#contact');
        }} className="mobile-nav-item btn-neon mt-4">
          Get in Touch
        </a>
      </div>
    </div>
  </>;
};
export default Navigation;