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
    <div className="project-card-wrapper h-full">
      <div className="project-card h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} p-3 flex items-center justify-center`}>
            <Icon size={32} weight="light" className="text-white" />
          </div>
          <span className="text-sm text-muted-foreground">{project.date}</span>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-foreground mb-1 uppercase tracking-tight">{project.title}</h3>
        <p className="text-sm text-primary mb-3">{project.subtitle}</p>
        <p className="text-muted-foreground text-sm leading-relaxed flex-grow mb-4">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* GitHub Link */}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <GithubLogo size={20} weight="light" />
            <span>View on GitHub</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        )}
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
            y: 50,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card as HTMLElement,
              start: 'top 85%',
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
          <h3 className="category-header text-xl md:text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-8 h-px bg-primary"></span>
            ACADEMIC PROJECTS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {academicProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>

        {/* Personal Projects Category */}
        <div>
          <h3 className="category-header text-xl md:text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-8 h-px bg-primary"></span>
            PERSONAL PROJECTS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

