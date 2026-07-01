import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Github, Linkedin, Mail, Globe, Instagram, Download, ExternalLink, ImageIcon } from "lucide-react";
import { Loader } from "./Loader";
import { GridBackground } from "./GridBackground";
import { SuraWidget } from "./SuraWidget";
import { SideNav } from "./SideNav";
import { Reveal } from "./Reveal";
import portrait from "@/assets/portrait.jpg";
import bgTex from "@/assets/bg-texture.jpg";
import networkSharing from "@/assets/network_sharing.png";
import agriForecast from "@/assets/agri_forecast.png";
import chatbotAgent from "@/assets/chatbot_agent.png";
import webrtcFileshare from "@/assets/webrtc_fileshare.png";
import localLlm from "@/assets/local_llm.png";
import expenseTracker from "@/assets/expense_tracker.png";
import smartLight from "@/assets/smart_light.png";

const skills = [
  "Python", "TensorFlow", "scikit-learn", "NumPy", "Pandas", "OpenCV",
  "Java", "C", "Streamlit", "HTML/CSS", "JavaScript", "Git", "GitHub", "MySQL", "VS Code", "Google Colab", "Arduino IDE", "Embedded C", "Figma", "Canva",
];

const academicProjects = [
  { date: "JAN 2026", title: "Centralised File-Sharing System with DHCP & FTP Server", sub: "Computer Networks",
    desc: "Implemented a centralised file-sharing network with dynamic IP allocation using DHCP and secure FTP-based file transfer across multiple departmental subnets, connected via static routing and DHCP relay in Cisco Packet Tracer.",
    tags: ["DHCP", "FTP", "Static Routing", "Subnetting", "Networking"], repo: "https://github.com/Surajit00007/CN_project", image: networkSharing },
  { date: "DEC 2025", title: "Agricultural Commodity Price Prediction", sub: "Deep Learning / Time-Series",
    desc: "Built an intelligent prediction system using deep learning. Performed rigorous EDA, feature engineering (lags, rolling statistics, seasonality encoding) and time-aware train–test splitting, achieving improved forecasting accuracy measured via RMSE, MAE, R², and MAPE.",
    tags: ["Deep Learning", "EDA", "Forecasting"], repo: "https://github.com/Surajit00007/Agricultural_Price_Prediction_using_DL", image: agriForecast },
  { date: "May 2025", title: "Intelligent Chatbot Development", sub: "Transformer-based AI",
    desc: "Built an intelligent conversational chatbot using transformer models trained on Cornell Movie Dialogs datasets, enabling human-like responses through contextual understanding and self-attention mechanisms. Fine-tuned the model for relevance, tone consistency, and response quality using techniques like beam search and sampling.",
    tags: ["Transformers", "NLP", "Python"], repo: "https://github.com/Surajit00007/Intelligent_Chatbot_Development-project", image: chatbotAgent },
];

const personalProjects = [
  { date: "Feb 2026", title: "Local Drop", sub: "Peer-to-Peer File Transfer App",
    desc: "Developed a robust peer-to-peer file sharing application using WebRTC, designed to work seamlessly across mobile hotspots and various network topologies. Implemented reliable ICE candidate handling and connection fallback mechanisms to ensure stable and fast file transfers.",
    tags: ["WebRTC", "Networking", "Android", "File Transfer"], repo: "https://github.com/Surajit00007/LocalDrop-fileshare", image: webrtcFileshare },
  { date: "Dec 2025", title: "Local AI Chatbot", sub: "Privacy-focused LLM Prototype",
    desc: "Developed a ChatGPT-like chatbot that runs completely on a local laptop using phi3, llama3, and mistral via Ollama. Works fully offline with no internet or API dependency, ensuring total data privacy. Built with Python and Streamlit, featuring custom system prompts and chat memory.",
    tags: ["Ollama", "LLM", "Python"], repo: "https://github.com/Surajit00007/Customised_GPT_project", image: localLlm },
  { date: "March 2025", title: "Swallet App — Expense Tracker", sub: "Personal Finance App",
    desc: "Developed Swallet, a personal finance tracking app using Streamlit, enabling users to log income and expenses in INR with intuitive UI and date selection via Google Calendar integration. Implemented data visualization using pie charts and graphs for spending insights; ensured local CSV-based storage to maintain user privacy.",
    tags: ["Streamlit", "Data Viz", "Python"], repo: "https://github.com/Surajit00007/Swallet", image: expenseTracker },
  { date: "Jun 2024", title: "Automatic Room Light System", sub: "IoT Project",
    desc: "Designed and implemented a microcontroller-based automatic room light system with a bidirectional counter using an infrared sensor and Arduino Uno, enabling lights to toggle based on human presence. Developed the control logic using Embedded C, integrated infrared relay switching, and documented the design with flowcharts.",
    tags: ["Arduino", "IoT", "Embedded C"], repo: "https://github.com/Surajit00007/Automatic_Room_Light_System", image: smartLight },
];

const internships = [
  {
    role: "Research Intern",
    org: "Samsung R&D Institute India — Bangalore",
    tag: "Samsung PRISM",
    period: "Nov 2025 – Present",
    duration: "9 mos",
    type: "Remote",
    logo: "/samsung-prism.png",
    points: [
      "Built a White Balance Enhancement System for RAW (DNG) images with multi-level control (5–10 levels) for adaptive colour correction from scratch.",
      "Developed an end-to-end pipeline from Raw image input to Enhanced image Output.",
    ],
  },
  {
    role: "Graphic Designer",
    org: "Soa Flying Community",
    tag: "Design · Community",
    period: "Mar 2024 – Apr 2026",
    duration: "2 yrs 2 mos",
    type: "Hybrid",
    logo: "/soa-flying.png",
    points: [
      "Created promotional graphics, event posters, and branding materials for the SOA Flying Community.",
      "Worked in a hybrid team environment contributing visual design across multiple college events and initiatives.",
    ],
  },
];

const certs = [
  { title: "GenAI Job Simulation", issuer: "Forage (Boston Consulting Group)", date: "Dec 2025",
    points: ["AI-powered financial chatbot in Python", "Analyzed 10-K and 10-Q financial reports"],
    logo: "https://cdn.uconnectlabs.com/wp-content/uploads/sites/60/2025/12/ChatGPT-Image-Dec-1-2025-08_58_40-AM-480x480.png" },
  { title: "Google Cloud Arcade Trooper", issuer: "Google Cloud", date: "Jun 2025",
    points: ["Trooper Tier — Summer Batch (Apr–Jun) 2025", "Hands-on BigQuery, Kubernetes, AI/ML on GCP", "Labs, trivia, and skill badges"],
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg" },
  { title: "Salesforce Agentblaze Champions Badge", issuer: "Salesforce", date: "Jun 2025",
    points: ["Agentforce concepts & business impact", "Foundational agent technology", "Built an AI-powered agent"],
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/salesforce/salesforce-original.svg" },
];

export function Portfolio() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <AnimatePresence>{loading && <Loader onComplete={() => setLoading(false)} />}</AnimatePresence>

      {/* Global grain */}
      <div className="grain-overlay" aria-hidden />

      {/* Fixed atmospheric background with ambient orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <img
          src={bgTex}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25 animate-drift"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="absolute -left-[10%] top-[5%] h-[60vw] max-h-[700px] w-[60vw] max-w-[700px] rounded-full bg-accent/5 blur-[120px] animate-drift" />
        <div className="absolute -right-[10%] top-[35%] h-[50vw] max-h-[600px] w-[50vw] max-w-[600px] rounded-full bg-accent/5 blur-[100px] animate-drift" style={{ animationDelay: "-10s" }} />
      </div>

      {/* Animated 3D perspective grid */}
      <GridBackground />

      {/* Scrolling section orbs */}
      <div className="pointer-events-none absolute left-[5%] top-[20%] h-[450px] w-[450px] rounded-full bg-accent/5 blur-[120px]" />
      <div className="pointer-events-none absolute right-[5%] top-[48%] h-[550px] w-[550px] rounded-full bg-accent/5 blur-[140px]" />
      <div className="pointer-events-none absolute left-[10%] top-[75%] h-[450px] w-[450px] rounded-full bg-accent/5 blur-[120px]" />

      <SideNav />

      <main className="relative z-10 lg:pl-20">
        <Hero />
        <About />
        <Projects />
        <Internships />
        <Certificates />
        <Contact />
      </main>
      <SuraWidget />
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center px-6 pt-24 pb-16 sm:px-12 lg:px-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[60vw] w-[60vw] -translate-x-1/2 rounded-full opacity-30 animate-drift blur-3xl"
          style={{ background: "radial-gradient(circle, #88bda480, transparent 70%)" }} />
      </div>

      <div className="relative grid w-full grid-cols-12 items-center gap-8">
        <div className="col-span-12 text-center lg:col-span-7 lg:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl leading-[0.95] tracking-tighter sm:text-7xl lg:text-[9vw] text-glow"
          >
            SURAJIT<br />SAHOO
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 flex items-center justify-center gap-3 lg:justify-start"
          >
            <span className="font-mono text-[13px] uppercase tracking-[0.45em] text-muted-foreground sm:text-[15px]">
              Creative Developer
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mx-auto mt-8 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0"
          >
            Crafting intelligent systems at the intersection of machine learning,
            deep learning, and human-centered design.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <a href="#projects"
              className="group relative inline-flex items-center gap-3 rounded-full border border-foreground/20 bg-foreground/5 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.3em] backdrop-blur-xl transition-all hover:border-accent hover:bg-foreground/10"
            >
              <span>View Work</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a href="#contact" className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground">
              Get in touch
            </a>
          </motion.div>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto aspect-[3/4] w-full max-w-md"
          >
            <div className="glass absolute inset-0 rounded-3xl" />
            <img
              src={portrait}
              alt="Portrait of Surajit Sahoo"
              className="relative h-full w-full rounded-3xl object-cover"
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl"
              style={{ boxShadow: "inset 0 0 80px #0f1a1699" }} />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-10 right-6 flex items-center gap-4 sm:right-12 lg:right-20"
      >
        <span className="h-px w-12 bg-foreground/30" />
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          Based in India
        </span>
      </motion.div>
    </section>
  );
}

function SectionLabel({ num, label }: { num: string; label: string }) {
  return (
    <div className="mb-12 flex items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground lg:justify-start">
      <span className="text-accent">{num}</span>
      <span className="h-px w-12 bg-border" />
      <span>{label}</span>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="relative px-6 py-20 sm:py-32 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionLabel num="01" label="About" /></Reveal>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-7">
            <Reveal>
              <h2 className="text-center font-display text-4xl leading-[1.05] tracking-tighter sm:text-6xl lg:text-left lg:text-7xl">
                Building intelligent systems<br />
                <span className="text-foreground/40">that solve real problems.</span>
              </h2>
            </Reveal>
            <Reveal i={1}>
              <p className="mx-auto mt-8 max-w-xl text-center text-base leading-relaxed text-muted-foreground lg:mx-0 lg:text-left">
                I'm an aspiring AI/ML Engineer with a strong foundation in machine learning
                and deep learning. I enjoy building industry-level technologies and transforming
                complex data into actionable insights.
              </p>
            </Reveal>
            <Reveal i={2}>
              <p className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-muted-foreground lg:mx-0 lg:text-left">
                My work spans neural networks, NLP, computer vision, and IoT systems —
                continuously pushing the boundaries of what's possible with AI.
              </p>
            </Reveal>

            <Reveal i={3}>
              <div className="mt-10">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <motion.span
                      key={s}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="rounded-full border border-[color:var(--card-accent)]/20 bg-[#e6f2dd]/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--card-fg)]/90 backdrop-blur-sm"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <Reveal i={1}>
              <div className="rounded-2xl border border-[color:var(--card-accent)]/15 bg-[linear-gradient(135deg,var(--card-from),var(--card-to))] p-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--card-accent)]">
                  Education
                </div>
                <div className="mt-4 font-display text-lg leading-tight tracking-tight text-[color:var(--card-fg)]">
                  Institute of Technical Education and Research
                </div>
                <div className="mt-1 text-sm text-[color:var(--card-accent)]">SOA University · 2023 — 2027</div>
                <div className="mt-4 text-sm text-[color:var(--card-fg)]/90">
                  B.Tech, Computer Science — AI & ML
                </div>
                <div className="mt-1 font-mono text-xs text-[color:var(--card-accent)]">
                  GPA <span className="text-[color:var(--card-fg)]">8.45 / 10</span> (upto 4th sem)
                </div>

                <div className="mt-6 border-t border-[color:var(--card-accent)]/20 pt-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Coursework
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-[color:var(--card-fg-soft)]/80">
                    {["DSA in Java", "Machine Learning", "Deep Learning", "Algorithm Analysis", "Artificial Intelligence"].map((c) => (
                      <span key={c} className="rounded-md border border-[color:var(--card-accent)]/20 px-2 py-1 text-[color:var(--card-fg-soft)]/80">{c}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { n: "07+", l: "Projects" },
                  { n: "03", l: "Certifications" },
                  { n: "04", l: "Domains" },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl border border-[color:var(--card-accent)]/15 bg-[linear-gradient(135deg,var(--card-from),var(--card-to))] p-5">
                    <div className="font-display text-3xl tracking-tight text-[color:var(--card-fg)]">{s.n}</div>
                    <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[color:var(--card-accent)]">{s.l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ p, i }: { p: typeof academicProjects[0]; i: number }) {
  return (
    <Reveal key={p.title} i={i}>
      <article className="group relative overflow-hidden rounded-2xl border border-[color:var(--card-accent)]/15 bg-[linear-gradient(135deg,var(--card-from),var(--card-to))] p-5 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.005] hover:border-[color:var(--card-accent)]/30 hover:bg-[linear-gradient(135deg,var(--card-from),var(--card-hover-to))] sm:p-7">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[color:var(--card-accent)]/10 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-[color:var(--card-accent)]/20" />

        <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6">
          {/* Image placeholder tile */}
          <div className="flex shrink-0 flex-col items-center gap-2 sm:items-start">
            <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-[color:var(--card-accent)]/25 bg-[linear-gradient(135deg,var(--card-accent),var(--card-hover-to))] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] xs:h-28 xs:w-28 sm:h-32 sm:w-32">
              {p.image ? (
                <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
                  <ImageIcon className="relative h-8 w-8 text-[color:var(--card-fg)]/70 xs:h-9 xs:w-9" strokeWidth={1.5} />
                </>
              )}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--card-accent)]">
              {p.date}
            </div>
          </div>

          {/* Content */}
          <div className="min-w-0 w-full flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <h3 className="font-display text-xl leading-tight tracking-tight text-[color:var(--card-fg)] transition-all duration-500 group-hover:text-glow sm:text-2xl lg:text-3xl">
                  {p.title}
                </h3>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--card-accent)] sm:text-xs">
                  {p.sub}
                </div>
              </div>
              <a
                href={p.repo}
                target="_blank"
                rel="noreferrer"
                className="group/cta mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[color:var(--card-fg)]/15 bg-[color:var(--card-fg)]/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--card-fg)]/90 transition-all duration-500 hover:border-[color:var(--card-accent)] hover:bg-[color:var(--card-accent)]/15 hover:text-[color:var(--card-fg)] sm:mt-0 sm:w-auto sm:self-start"
                style={{ boxShadow: "0 0 0 rgba(0,0,0,0)" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 24px rgba(101,146,135,0.3)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)")}
              >
                <Github className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span>View Repository</span>
                <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
              </a>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[color:var(--card-fg-soft)]/80">
              {p.desc}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {p.tags.map((t) => (
                <span key={t} className="rounded-full border border-[color:var(--card-accent)]/20 bg-[color:var(--card-fg)]/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--card-fg-soft)]/80 transition-all duration-500 group-hover:border-[color:var(--card-accent)]/40 group-hover:text-[color:var(--card-fg)]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[color:var(--card-accent)]/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[color:var(--card-accent)]/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </article>
    </Reveal>
  );
}

function Projects() {
  return (
    <section id="projects" className="relative px-6 py-20 sm:py-32 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionLabel num="02" label="Projects" /></Reveal>

        <Reveal>
          <h2 className="mb-16 text-center font-display text-4xl leading-[1.05] tracking-tighter sm:text-6xl lg:text-left lg:text-7xl">
            Featured Projects
          </h2>
        </Reveal>

        <Reveal>
          <p className="mx-auto mb-16 max-w-2xl text-center text-base leading-relaxed text-muted-foreground lg:mx-0 lg:text-left">
            A showcase of my work in AI, Machine Learning, and IoT systems.
          </p>
        </Reveal>

        {/* Academic Projects */}
        <div className="mb-6 flex items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-accent lg:justify-start">
          <span className="h-px w-8 bg-accent/40" />
          <span>Academic Projects</span>
          <span className="h-px w-8 bg-accent/40" />
        </div>
        <div className="mb-20 space-y-6">
          {academicProjects.map((p, i) => (
            <ProjectCard key={p.title} p={p} i={i} />
          ))}
        </div>

        {/* Personal Projects */}
        <div className="mb-6 flex items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-accent lg:justify-start">
          <span className="h-px w-8 bg-accent/40" />
          <span>Personal Projects</span>
          <span className="h-px w-8 bg-accent/40" />
        </div>
        <div className="space-y-6">
          {personalProjects.map((p, i) => (
            <ProjectCard key={p.title} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Internships() {
  return (
    <section id="internships" className="relative px-6 py-20 sm:py-32 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionLabel num="03" label="Internships" /></Reveal>

        <Reveal>
          <h2 className="mb-16 text-center font-display text-4xl leading-[1.05] tracking-tighter sm:text-6xl lg:text-left lg:text-7xl">
            Work<br /><span className="text-foreground/40">experience.</span>
          </h2>
        </Reveal>

        <div className="space-y-6">
          {internships.map((intern, i) => (
            <Reveal key={intern.org} i={i}>
              <div className="group relative overflow-hidden rounded-2xl border border-[color:var(--card-accent)]/15 bg-[linear-gradient(160deg,var(--card-from),var(--card-to))] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[color:var(--card-accent)]/30 hover:bg-[linear-gradient(160deg,var(--card-from),var(--card-hover-to))]">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[color:var(--card-accent)]/10 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-[color:var(--card-accent)]/20" />
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[color:var(--card-accent)]/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
                  {/* Logo */}
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                    {intern.logo ? (
                      <img src={intern.logo} alt={intern.org} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full rounded-2xl bg-[color:var(--card-accent)]/20" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-xl leading-tight tracking-tight text-[color:var(--card-fg)] transition-all duration-500 group-hover:text-glow">
                        {intern.role}
                      </h3>
                      <span className="rounded-full border border-[color:var(--card-accent)]/30 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--card-accent)]">
                        {intern.tag}
                      </span>
                    </div>

                    <div className="mt-1 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-[color:var(--card-accent)]/80">
                      {intern.org}
                    </div>

                    {/* Meta badges */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="flex items-center gap-1.5 rounded-md border border-[color:var(--card-accent)]/20 bg-[color:var(--card-accent)]/5 px-2.5 py-1 font-mono text-[10px] text-[color:var(--card-fg-soft)]/80">
                        <span className="h-1 w-1 rounded-full bg-[color:var(--card-accent)]" />
                        {intern.period}
                      </span>
                      <span className="rounded-md border border-[color:var(--card-accent)]/20 bg-[color:var(--card-accent)]/5 px-2.5 py-1 font-mono text-[10px] text-[color:var(--card-fg-soft)]/80">
                        {intern.duration}
                      </span>
                      <span className="rounded-md border border-[color:var(--card-accent)]/20 bg-[color:var(--card-accent)]/5 px-2.5 py-1 font-mono text-[10px] text-[color:var(--card-fg-soft)]/80">
                        {intern.type}
                      </span>
                    </div>

                    {/* Points */}
                    <ul className="mt-5 space-y-2 border-t border-[color:var(--card-accent)]/20 pt-4">
                      {intern.points.map((pt) => (
                        <li key={pt} className="flex gap-2 text-sm text-[color:var(--card-fg-soft)]/80">
                          <span className="mt-2 inline-block h-px w-3 shrink-0 bg-[color:var(--card-fg)]/20" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Certificates() {
  return (
    <section id="certificates" className="relative px-6 py-20 sm:py-32 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionLabel num="04" label="Certificates" /></Reveal>

        <Reveal>
          <h2 className="mb-16 text-center font-display text-4xl leading-[1.05] tracking-tighter sm:text-6xl lg:text-left lg:text-7xl">
            Credentials<br /><span className="text-foreground/40">& training.</span>
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {certs.map((c, i) => (
            <Reveal key={c.title} i={i}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-[color:var(--card-accent)]/15 bg-[linear-gradient(160deg,var(--card-from),var(--card-to))] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[color:var(--card-accent)]/30 hover:bg-[linear-gradient(160deg,var(--card-from),var(--card-hover-to))]">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[color:var(--card-accent)]/10 blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:bg-[color:var(--card-accent)]/20" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--card-accent)]">{c.date}</div>
                    {c.logo ? (
                      <div className="h-14 w-14 overflow-hidden rounded-2xl">
                        <img src={c.logo} alt={c.issuer} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-[color:var(--card-accent)]/60" />
                    )}
                  </div>
                  <h3 className="mt-6 font-display text-xl leading-tight tracking-tight text-[color:var(--card-fg)] transition-all duration-500 group-hover:text-glow">{c.title}</h3>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--card-accent)]">
                    {c.issuer}
                  </div>
                  <ul className="mt-6 space-y-2 border-t border-[color:var(--card-accent)]/20 pt-4 text-sm text-[color:var(--card-fg-soft)]/80">
                    {c.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="mt-2 inline-block h-px w-3 shrink-0 bg-[color:var(--card-fg)]/20" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[color:var(--card-accent)]/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[color:var(--card-accent)]/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}



function Contact() {
  return (
    <section id="contact" className="relative px-6 py-20 sm:py-32 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal><SectionLabel num="05" label="Contact" /></Reveal>

        <Reveal>
          <h2 className="font-display text-5xl leading-[0.95] tracking-tighter sm:text-7xl lg:text-[9vw] text-glow">
            Let's build<br /><span className="text-foreground/40">something.</span>
          </h2>
        </Reveal>

        <Reveal i={1}>
          <p className="mx-auto mt-8 max-w-md text-base text-muted-foreground">
            Open to collaborations, research, and engineering roles in AI / ML.
          </p>
        </Reveal>

        <Reveal i={2}>
          <a
            href="mailto:surajit007inc@gmail.com"
            className="mt-10 inline-flex items-center gap-3 rounded-full border border-foreground/20 bg-foreground/5 px-8 py-4 font-mono text-xs uppercase tracking-[0.3em] backdrop-blur-xl transition-all hover:border-accent hover:bg-foreground/10"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-glow" />
            Reach out
          </a>
        </Reveal>

        {/* Footer */}
        <div className="mt-24">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="flex flex-col items-center gap-6 py-10">
            {/* Social Links */}
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Social Links
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {[
                { href: "https://surajitsahoo.netlify.app/", icon: Globe, label: "Portfolio" },
                { href: "https://github.com/Surajit00007", icon: Github, label: "GitHub" },
                { href: "https://linkedin.com/in/surajit-sahoo-084173335", icon: Linkedin, label: "LinkedIn" },
                { href: "https://instagram.com/surajit._007", icon: Instagram, label: "Instagram" },
                { href: "mailto:surajit007inc@gmail.com", icon: Mail, label: "Email" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={s.href.startsWith("mailto") ? undefined : "noreferrer"}
                  aria-label={s.label}
                  className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-foreground/[0.03] transition-all duration-500 hover:border-accent/50 hover:bg-accent/10"
                >
                  <s.icon className="h-[16px] w-[16px] text-muted-foreground transition-colors duration-500 group-hover:text-accent" strokeWidth={1.5} />
                  <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ boxShadow: "0 0 20px color-mix(in oklch, var(--accent-glow) 30%, transparent)" }}
                  />
                </a>
              ))}
            </div>

            <a
              href="/resume.pdf"
              download
              className="group relative inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
              Download Resume
            </a>
            <div className="text-sm text-muted-foreground">
              Made with <span className="text-accent">♥</span> by Surajit Sahoo
            </div>
            <div className="text-xs text-muted-foreground/60">
              © 2026 All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
