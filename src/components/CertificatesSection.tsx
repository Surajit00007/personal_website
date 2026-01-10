import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Certificate, GraduationCap, SealCheck, Cloud } from '@phosphor-icons/react';

gsap.registerPlugin(ScrollTrigger);

const certificates = [
    {
        title: 'GENAI JOB SIMULATION',
        issuer: 'FORAGE (BOSTON CONSULTING GROUP)',
        date: 'DEC 2025',
        description: [
            'Built an AI-powered financial chatbot using Python.',
            'Analyzed and interpreted data from 10-K and 10-Q financial reports.'
        ],
        icon: Certificate,
        gradient: 'from-neon-blue to-neon-cyan',
    },
    {
        title: 'GOOGLE CLOUD ARCADE TROOPER',
        issuer: 'GOOGLE CLOUD',
        date: 'JUN 2025',
        description: [
            'Achieved Trooper Tier in the Google Cloud Arcade Summer Batch (APR - JUN) 2025.',
            'Gained hands-on experience with BigQuery, Kubernetes, and AI/ML tools on GCP.',
            'Completed various labs, trivia challenges, and skill badges in the Google Cloud ecosystem.'
        ],
        icon: Cloud,
        gradient: 'from-neon-cyan to-neon-blue',
    },
    {
        title: 'SALESFORCE AGENTBLAZE CHAMPIONS BADGE',
        issuer: 'SALESFORCE',
        date: 'JUN 2025',
        description: [
            'Confidently explain Agentforce concepts and their business impact.',
            'Gain foundational knowledge of agent technology.',
            'Build an AI-powered agent.',
            'Identify real-world use cases for intelligent agent deployment.'
        ],
        icon: SealCheck,
        gradient: 'from-neon-pink to-neon-violet',
    }
];

const CertificatesSection = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Title animation
            gsap.fromTo(
                '.certificates-title',
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

            // Certificates animation
            const certs = gsap.utils.toArray('.certificate-card');
            certs.forEach((cert: any) => {
                gsap.fromTo(
                    cert,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: cert,
                            start: 'top 95%',
                            toggleActions: 'play none none reverse',
                        },
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="certificates" className="py-10 md:py-16 relative overflow-hidden bg-muted/30">
            <div className="container mx-auto px-6">
                <div className="certificates-title text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        <span className="text-gradient">Certificates</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Professional certifications and specialized training programs.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    {certificates.map((cert, index) => {
                        const Icon = cert.icon;
                        return (
                            <div key={index} className="certificate-card glass p-8 rounded-3xl mb-8 flex flex-col md:flex-row gap-8 items-center md:items-start border border-white/10 transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_hsl(var(--primary)/0.3)] hover:-translate-y-1">
                                <div className={`w-20 h-20 shrink-0 rounded-2xl bg-gradient-to-br ${cert.gradient} p-4 flex items-center justify-center`}>
                                    <Icon size={40} weight="light" className="text-white" />
                                </div>

                                <div className="flex-grow text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-foreground mb-1 uppercase">{cert.title}</h3>
                                            <p className="text-primary font-medium flex items-center justify-center md:justify-start gap-2">
                                                <GraduationCap size={20} />
                                                {cert.issuer}
                                            </p>
                                        </div>
                                        <span className="text-muted-foreground font-mono">{cert.date}</span>
                                    </div>

                                    <ul className="space-y-3 text-muted-foreground text-left">
                                        {cert.description.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CertificatesSection;
