import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GithubLogo, Robot, ChartPie, Cpu, ChartLine } from '@phosphor-icons/react';

gsap.registerPlugin(ScrollTrigger);



import { useAdmin } from '@/contexts/AdminContext';

const ProjectCard = ({ project, index }: { project: any, index: number }) => {
  // Cycle through gradients based on index
  const gradients = [
    'from-neon-blue to-neon-violet',
    'from-neon-violet to-neon-pink',
    'from-neon-pink to-neon-cyan',
    'from-neon-cyan to-neon-blue',
  ];
  const gradient = gradients[index % gradients.length];

  // Choose icon based on tags/title or default
  let Icon = Robot;
  if (project.tags.includes('IoT') || project.tags.includes('Arduino')) Icon = Cpu;
  else if (project.tags.includes('Data Viz') || project.title.toLowerCase().includes('prediction')) Icon = ChartLine;
  else if (project.title.toLowerCase().includes('finance') || project.title.toLowerCase().includes('tracker')) Icon = ChartPie;

  return (
    <div className="project-card-wrapper mb-8">
      <div className="project-card glass p-8 rounded-3xl flex flex-col md:flex-row gap-8 items-center md:items-start border border-white/10 transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_hsl(var(--primary)/0.3)] hover:-translate-y-1">
        
        {/* Left Side: Icon & Date (Matches Certificate Image) */}
        <div className="flex flex-col items-center gap-4 shrink-0 w-full md:w-32">
          <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br ${gradient} border border-white/10 flex items-center justify-center shadow-lg relative overflow-hidden`}>
             <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
             <Icon size={48} weight="light" className="text-white relative z-10" />
          </div>
          <span className="text-sm font-mono text-muted-foreground uppercase">{project.date}</span>
        </div>

        {/* Right Side: Content */}
        <div className="flex-grow text-center md:text-left w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-1 uppercase tracking-tight">{project.title}</h3>
              <p className="text-primary font-medium text-lg">{project.subtitle}</p>
            </div>
            
            {/* GitHub Link */}
            {project.github && (
              <div className="flex-shrink-0">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors border border-primary/20"
                >
                  <GithubLogo size={20} weight="light" />
                  View Repository
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" className="ml-1"><path d="M224,128a8,8,0,0,1-16,0V59.31l-66.34,66.35a8,8,0,0,1-11.32-11.32L196.69,48H128a8,8,0,0,1,0-16h88a8,8,0,0,1,8,8Z"></path></svg>
                </a>
              </div>
            )}
          </div>

          <p className="text-muted-foreground text-base leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {project.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-semibold rounded-md bg-muted/80 text-muted-foreground border border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { siteContent } = useAdmin();

  const academicProjects = siteContent.projects.filter(p => p.category === 'ACADEMIC');
  const personalProjects = siteContent.projects.filter(p => p.category === 'PERSONAL');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        '.projects-title',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      // Category headers animation
      gsap.utils.toArray('.category-header').forEach((header: any) => {
        gsap.fromTo(
          header,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: header,
              start: 'top 90%',
            },
          }
        );
      });

      // Individual card scroll animations
      const cards = gsap.utils.toArray('.project-card-wrapper');
      cards.forEach((card: any) => {
        gsap.fromTo(
          card as HTMLElement,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card as HTMLElement,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="py-10 md:py-16 relative overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="orb orb-blue w-[500px] h-[500px] top-1/4 -right-64 opacity-10" />
      <div className="orb orb-pink w-[400px] h-[400px] bottom-0 -left-32 opacity-10" />

      <div className="container mx-auto px-6">
        <div className="projects-title text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Featured Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A showcase of my work in AI, Machine Learning, and IoT systems.
          </p>
        </div>

        {/* Academic Projects Category */}
        <div className="max-w-5xl mx-auto mb-20">
          <h3 className="category-header text-xl md:text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-8 h-px bg-primary"></span>
            ACADEMIC PROJECTS
          </h3>
          <div className="flex flex-col w-full">
            {academicProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>

        {/* Personal Projects Category */}
        <div className="max-w-5xl mx-auto">
          <h3 className="category-header text-xl md:text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-8 h-px bg-primary"></span>
            PERSONAL PROJECTS
          </h3>
          <div className="flex flex-col w-full">
            {personalProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index + academicProjects.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

