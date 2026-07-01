import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Certificate, GraduationCap } from '@phosphor-icons/react';
import { useAdmin } from '@/contexts/AdminContext';

gsap.registerPlugin(ScrollTrigger);



const CertificatesSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const { siteContent } = useAdmin();

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
                    {siteContent.certificates.map((cert) => (
                        <div key={cert.id} className="certificate-card glass p-8 rounded-3xl mb-8 flex flex-col md:flex-row gap-8 items-center md:items-start border border-white/10 transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_hsl(var(--primary)/0.3)] hover:-translate-y-1">
                            {/* Certificate Image or Fallback Icon */}
                            <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden bg-muted/50 border border-white/10 flex items-center justify-center">
                                {cert.imageUrl ? (
                                    <img
                                        src={cert.imageUrl}
                                        alt={cert.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Certificate size={40} weight="light" className="text-primary/50" />
                                )}
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

                                {cert.linkedinUrl && (
                                    <div className="mb-4">
                                        <a
                                            href={cert.linkedinUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors border border-primary/20"
                                        >
                                            View Credential
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-16,0V59.31l-66.34,66.35a8,8,0,0,1-11.32-11.32L196.69,48H128a8,8,0,0,1,0-16h88a8,8,0,0,1,8,8Z"></path></svg>
                                        </a>
                                    </div>
                                )}

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
                    ))}

                    {siteContent.certificates.length === 0 && (
                        <div className="text-center text-muted-foreground">
                            No certificates to display.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CertificatesSection;
