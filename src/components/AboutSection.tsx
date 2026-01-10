import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Brain, Database, ChartLine, Eye, Coffee, Terminal, GitBranch, Cpu, PaintBrush, Palette, Gear } from '@phosphor-icons/react';
import profileImage from '@/assets/profile.jpg';
import { useAdmin } from '@/contexts/AdminContext';

gsap.registerPlugin(ScrollTrigger);
const skills = [{
  name: 'Python',
  icon: Code
}, {
  name: 'TensorFlow',
  icon: Brain
}, {
  name: 'scikit-learn',
  icon: ChartLine
}, {
  name: 'NumPy',
  icon: Database
}, {
  name: 'Pandas',
  icon: Database
}, {
  name: 'OpenCV',
  icon: Eye
}, {
  name: 'Java',
  icon: Coffee
}, {
  name: 'C',
  icon: Terminal
}, {
  name: 'Streamlit',
  icon: Code
}, {
  name: 'HTML/CSS',
  icon: Code
}, {
  name: 'JavaScript',
  icon: Code
}, {
  name: 'Git',
  icon: GitBranch
}, {
  name: 'GitHub',
  icon: GitBranch
}, {
  name: 'MySQL',
  icon: Database
}, {
  name: 'VS Code',
  icon: Terminal
}, {
  name: 'Google Colab',
  icon: Brain
}, {
  name: 'Arduino IDE',
  icon: Cpu
}, {
  name: 'Embedded C',
  icon: Gear
}, {
  name: 'Figma',
  icon: PaintBrush
}, {
  name: 'Canva',
  icon: Palette
}];
const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { siteContent } = useAdmin();
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section fade in
      gsap.fromTo(sectionRef.current, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%'
        }
      });

      // Image animation
      gsap.fromTo(imageRef.current, {
        opacity: 0,
        x: -60,
        filter: 'blur(10px)'
      }, {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%'
        }
      });

      // Content animation
      gsap.fromTo(contentRef.current, {
        opacity: 0,
        y: 40
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%'
        }
      });

      // Skills stagger animation
      gsap.fromTo('.skill-item', {
        opacity: 0,
        y: 20,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.skills-grid',
          start: 'top 80%'
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);
  return <section ref={sectionRef} id="about" className="py-10 md:py-16 relative overflow-hidden">
    {/* Background orbs */}
    <div className="orb orb-violet w-[400px] h-[400px] top-0 right-0 opacity-10" />
    <div className="orb orb-blue w-[300px] h-[300px] bottom-0 left-0 opacity-10" />

    <div className="container mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Profile Image */}
        <div ref={imageRef} className="flex justify-center lg:justify-start">
          <div className="relative group">
            <div className="profile-glow w-64 h-64 md:w-80 md:h-80 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                <img
                  alt="Surajit Sahoo"
                  className="w-full h-full object-cover"
                  src={siteContent.profileImage || profileImage}
                />
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 glass-card flex items-center justify-center animate-float">
              <Brain size={32} weight="light" className="text-primary" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-14 h-14 glass-card flex items-center justify-center animate-float" style={{
              animationDelay: '1s'
            }}>
              <Code size={28} weight="light" className="text-accent" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef}>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">About Me</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            I'm an aspiring AI/ML Engineer passionate about building intelligent systems that solve real-world problems.
            With a strong foundation in machine learning, deep learning, and data science, I enjoy exploring cutting-edge
            technologies and transforming complex data into actionable insights.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            My journey involves working with neural networks, natural language processing, computer vision, and IoT systems.
            I believe in continuous learning and pushing the boundaries of what's possible with AI.
          </p>

          {/* Skills Grid */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-foreground">Skills & Technologies</h3>
            <div className="skills-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {skills.map((skill, index) => {
                const Icon = skill.icon;
                return <div key={skill.name} className="skill-item skill-badge flex items-center gap-2 cursor-default">
                  <Icon size={18} weight="light" className="text-primary" />
                  <span className="text-sm">{skill.name}</span>
                </div>;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>;
};
export default AboutSection;