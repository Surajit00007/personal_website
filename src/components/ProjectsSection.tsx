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
    <div className="project-card-wrapper w-full mb-8">
      <div className="project-card flex flex-col md:flex-row gap-6 p-6 md:p-8 items-start">
        {/* Left Side: Icon & Date */}
        <div className="flex flex-col items-center gap-4 shrink-0 w-full md:w-auto">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} p-5 flex items-center justify-center shadow-lg`}>
            <Icon size={40} weight="light" className="text-white" />
          </div>
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{project.date}</span>
        </div>

        {/* Right Side: Content */}
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-2xl font-bold text-foreground uppercase tracking-tight">{project.title}</h3>
              <p className="text-primary font-medium">{project.subtitle}</p>
            </div>
            
            {/* GitHub Link */}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group bg-muted/50 px-4 py-2 rounded-xl border border-white/5"
              >
                <GithubLogo size={20} weight="light" />
                <span className="hidden sm:inline">GitHub</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            )}
          </div>

          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 max-w-3xl">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-primary/10 text-primary border border-primary/10"
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
            scale: 0.98,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
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
    <section ref={sectionRef} id="projects" className="py-10 md:py-16 relative overflow-hidden">
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
        <div className="mb-20">
          <h3 className="category-header text-xl md:text-2xl font-bold mb-10 flex items-center gap-3">
            <span className="w-12 h-px bg-primary"></span>
            ACADEMIC PROJECTS
          </h3>
          <div className="flex flex-col max-w-5xl mx-auto">
            {academicProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>

        {/* Personal Projects Category */}
        <div>
          <h3 className="category-header text-xl md:text-2xl font-bold mb-10 flex items-center gap-3">
            <span className="w-12 h-px bg-primary"></span>
            PERSONAL PROJECTS
          </h3>
          <div className="flex flex-col max-w-5xl mx-auto">
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

