import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Animate the name letters
    tl.fromTo(
      '.loader-letter',
      { opacity: 0, y: 30, filter: 'blur(10px)' },
      { 
        opacity: 1, 
        y: 0, 
        filter: 'blur(0px)',
        duration: 0.1,
        stagger: 0.08,
        ease: 'power2.out'
      }
    );

    // Progress bar animation
    const progress = { value: 0 };
    tl.to(progress, {
      value: 100,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        if (progressRef.current) {
          progressRef.current.style.width = `${progress.value}%`;
        }
        if (percentRef.current) {
          percentRef.current.textContent = `${Math.round(progress.value)}%`;
        }
      }
    }, '-=0.5');

    // Exit animation
    tl.to(textRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in'
    });

    tl.to(preloaderRef.current, {
      opacity: 0,
      scale: 0.95,
      filter: 'blur(10px)',
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        onComplete();
      }
    }, '-=0.2');

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  const letters = 'SURAJIT'.split('');

  return (
    <div ref={preloaderRef} className="preloader">
      {/* Background orbs */}
      <div className="orb orb-blue w-96 h-96 -top-48 -left-48" />
      <div className="orb orb-violet w-80 h-80 -bottom-40 -right-40" />
      
      <div ref={textRef} className="flex flex-col items-center gap-8">
        {/* Animated name */}
        <div className="flex gap-1">
          {letters.map((letter, index) => (
            <span
              key={index}
              className="loader-letter text-6xl md:text-8xl font-black text-gradient tracking-wider"
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Subtitle */}
        <p className="text-muted-foreground text-lg tracking-widest uppercase">
          AI & ML Engineer
        </p>

        {/* Progress bar */}
        <div className="flex flex-col items-center gap-3 w-64">
          <div className="progress-bar-container w-full">
            <div ref={progressRef} className="progress-bar" />
          </div>
          <span ref={percentRef} className="text-sm text-muted-foreground font-mono">
            0%
          </span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
