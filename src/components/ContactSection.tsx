import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GithubLogo, LinkedinLogo, InstagramLogo, PaperPlaneTilt, Envelope } from '@phosphor-icons/react';


import { toast } from '@/hooks/use-toast';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        '.contact-title',
        { opacity: 0, y: 40, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      // Form inputs animation
      gsap.fromTo(
        '.form-input',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 80%',
          },
        }
      );

      // Social icons animation
      gsap.fromTo(
        '.social-icon',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.social-icons',
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Animate button
    gsap.to('.submit-btn', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', message: '' });
      toast({
        title: "Message sent!",
        description: "Thanks for reaching out. I'll get back to you soon!",
      });
    }, 1500);
  };

  const socials = [
    { icon: GithubLogo, href: 'https://github.com/Surajit00007', label: 'GitHub' },
    { icon: LinkedinLogo, href: 'https://linkedin.com/in/surajit-sahoo-084173335', label: 'LinkedIn' },
    { icon: InstagramLogo, href: 'https://instagram.com/surajit._007', label: 'Instagram' },
    { icon: Envelope, href: 'mailto:surajit007inc@gmail.com', label: 'Email' },
  ];

  return (
    <section ref={sectionRef} id="contact" className="py-10 md:py-16 relative overflow-hidden">
      {/* Background */}
      <div className="orb orb-violet w-[500px] h-[500px] -top-32 -right-32 opacity-15" />
      <div className="orb orb-blue w-[400px] h-[400px] bottom-0 -left-48 opacity-10" />

      <div className="container mx-auto px-6">
        <div className="contact-title text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Get in Touch</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto">
          {/* Contact Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="form-input">
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-5 py-4 glass-input text-foreground placeholder:text-muted-foreground focus:outline-none"
                placeholder="Your name"
              />
            </div>

            <div className="form-input">
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-5 py-4 glass-input text-foreground placeholder:text-muted-foreground focus:outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div className="form-input">
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                className="w-full px-5 py-4 glass-input text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
                placeholder="Your message..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-btn btn-neon w-full flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Sending...</span>
              ) : (
                <>
                  <span>Send Message</span>
                  <PaperPlaneTilt size={20} weight="light" />
                </>
              )}
            </button>
          </form>

          {/* Contact Info */}
          <div className="flex flex-col justify-center">
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">Let's Connect</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>

              {/* Social Links */}
              <div className="social-icons">
                <h4 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider">
                  Find me on
                </h4>
                <div className="flex gap-4">
                  {socials.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon w-14 h-14 glass flex items-center justify-center rounded-xl hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 group"
                        aria-label={social.label}
                      >
                        <Icon
                          size={28}
                          weight="light"
                          className="text-muted-foreground group-hover:text-primary transition-colors"
                        />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
