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
    <div className="project-card-wrapper w-full mb-12">
      <div className="project-card flex flex-col md:flex-row gap-8 p-10 md:p-14 items-center md:items-start bg-white/5 backdrop-blur-md border-y border-white/5 hover:bg-white/10 transition-all duration-500">
        {/* Left Side: Icon & Date */}
        <div className="flex flex-col items-center gap-6 shrink-0 md:w-48">
          <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${gradient} p-6 flex items-center justify-center shadow-2xl`}>
            <Icon size={48} weight="light" className="text-white" />
          </div>
          <span className="text-sm font-mono text-primary/80 uppercase tracking-[0.2em] font-bold">{project.date}</span>
        </div>

        {/* Right Side: Content */}
        <div className="flex-grow w-full">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tighter mb-2">{project.title}</h3>
              <p className="text-xl text-primary font-medium tracking-wide">{project.subtitle}</p>
            </div>
            
            {/* GitHub Link */}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-base text-white/70 hover:text-white transition-all group bg-white/5 px-6 py-3 rounded-2xl border border-white/10 hover:border-primary/50 self-start xl:self-center backdrop-blur-sm"
              >
                <GithubLogo size={24} weight="light" />
                <span>View Repository</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </a>
            )}
          </div>

          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 max-w-6xl font-light">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-3">
            {project.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-5 py-2 text-xs md:text-sm font-bold rounded-xl bg-primary/20 text-primary border border-primary/20 hover:bg-primary/30 transition-colors tracking-wider"
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
            duration: 0.8,
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
    <section ref={sectionRef} id="projects" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Decor */}
      <div className="orb orb-blue w-[700px] h-[700px] top-1/4 -right-64 opacity-10" />
      <div className="orb orb-pink w-[600px] h-[600px] bottom-0 -left-48 opacity-10" />

      <div className="w-full">
        <div className="projects-title text-center mb-24 px-6">
          <h2 className="text-4xl md:text-7xl font-black mb-6 uppercase tracking-tight">
            <span className="text-gradient">Featured Projects</span>
          </h2>
          <p className="text-muted-foreground text-xl md:text-2xl max-w-3xl mx-auto font-light">
            A showcase of my work in AI, Machine Learning, and IoT systems.
          </p>
        </div>

        {/* Academic Projects Category */}
        <div className="mb-32">
          <h3 className="category-header text-2xl md:text-4xl font-black mb-12 px-10 flex items-center gap-6 text-white/90">
            <span className="w-20 h-[2px] bg-primary"></span>
            ACADEMIC PROJECTS
          </h3>
          <div className="flex flex-col w-full">
            {academicProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>

        {/* Personal Projects Category */}
        <div className="pb-10">
          <h3 className="category-header text-2xl md:text-4xl font-black mb-12 px-10 flex items-center gap-6 text-white/90">
            <span className="w-20 h-[2px] bg-primary"></span>
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

