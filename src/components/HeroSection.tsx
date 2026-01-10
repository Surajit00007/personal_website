import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDown } from '@phosphor-icons/react';
import AnimatedBackground from './AnimatedBackground';
const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const tl = gsap.timeline({
      delay: 0.2
    });
    tl.fromTo(headlineRef.current, {
      opacity: 0,
      y: 60,
      filter: 'blur(10px)'
    }, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'power3.out'
    });
    tl.fromTo(subtitleRef.current, {
      opacity: 0,
      y: 30
    }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.5');
    tl.fromTo(ctaRef.current, {
      opacity: 0,
      scale: 0.9
    }, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'back.out(1.7)'
    }, '-=0.3');

    // Floating animation for orbs
    gsap.to('.hero-orb', {
      y: -30,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: 0.5
    });

    // Scroll indicator animation
    gsap.to('.scroll-indicator', {
      y: 10,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
  }, []);
  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section ref={sectionRef} id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background orbs */}
      <div className="hero-orb orb orb-blue w-[600px] h-[600px] top-0 -right-48 opacity-20" />
      <div className="hero-orb orb orb-violet w-[500px] h-[500px] -bottom-32 -left-32 opacity-20" />
      <div className="hero-orb orb orb-pink w-[300px] h-[300px] top-1/3 left-1/4 opacity-10" />

      {/* Three.js Animated Background */}
      <AnimatedBackground className="z-0 opacity-60" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <h1 ref={headlineRef} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6">
          <span className="text-foreground">Hi, I'm </span>
          <span className="text-gradient glow-text text-teal-300">SURAJIT</span>
          <br className="font-sans" />
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mt-4 block text-neon-cyan">
            An Aspiring AI/ML Engineer
          </span>
        </h1>

        <p ref={subtitleRef} className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-cyan-300 font-sans text-center font-normal">
          Crafting intelligent solutions with machine learning, deep learning, and a passion for innovation.
        </p>

        <a ref={ctaRef} href="#contact" onClick={e => {
        e.preventDefault();
        document.querySelector('#contact')?.scrollIntoView({
          behavior: 'smooth'
        });
      }} className="btn-neon inline-block">
          Contact Me
        </a>

        {/* Scroll indicator */}
        <button onClick={scrollToAbout} className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <span className="text-sm tracking-widest uppercase">Scroll</span>
          <ArrowDown size={24} weight="light" />
        </button>
      </div>
    </section>;
};
export default HeroSection;