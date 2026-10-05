// ─── SINGLE SOURCE OF TRUTH ───────────────────────────────────────────────────
// Edit this file to update BOTH the website UI and the SURA AI chatbot context.
// No need to touch portfolio-context.ts — it auto-generates from this data.
// ──────────────────────────────────────────────────────────────────────────────

export interface EducationData {
  degree: string;
  school: string;
  year: string;
  gpa: string;
  coursework: string[];
}

export interface BioData {
  name: string;
  role: string;
  email: string;
  linkedin: string;
  github: string;
  portfolio: string;
  instagram: string;
  resume: string;
  education: EducationData;
  interests: string;
}

export interface InternshipItem {
  role: string;
  org: string;
  tag: string;
  period: string;
  duration: string;
  type: string;
  logo: string;
  points: string[];
}

export interface ProjectItem {
  date: string;
  title: string;
  sub: string;
  desc: string;
  tags: string[];
  repo: string;
  image: string;
}

export interface CertItem {
  title: string;
  issuer: string;
  date: string;
  points: string[];
  logo: string;
}

export interface PortfolioData {
  bio: BioData;
  skills: string[];
  internships: InternshipItem[];
  academicProjects: ProjectItem[];
  personalProjects: ProjectItem[];
  certs: CertItem[];
}

export const bio: BioData = {
  name: "Surajit Sahoo",
  role: "AI/ML Engineer building intelligent systems across ML, deep learning, NLP, computer vision, and IoT.",
  email: "surajitcoc121@gmail.com",
  linkedin: "https://linkedin.com/in/surajit-sahoo-084173335",
  github: "https://github.com/Surajit00007",
  portfolio: "https://surajitsahoo.netlify.app/",
  instagram: "https://instagram.com/surajit._007",
  resume: "https://surajitsahoo.netlify.app/resume.pdf",
  education: {
    degree: "B.Tech in Computer Science with specialization in AI & ML",
    school: "Institute of Technical Education and Research, SOA University",
    year: "Expected Aug 2027",
    gpa: "8.37 / 10.0 (Upto 6th sem)",
    coursework: [
      "DSA in JAVA",
      "Machine Learning",
      "Deep Learning",
      "Algorithm Analysis",
      "Artificial Intelligence",
    ],
  },
  interests:
    "AI, Machine Learning, Deep Learning, NLP, Automation Workflows (n8n), IoT systems, and clean product design.",
};

export const skills = [
  "Python",
  "PyTorch",
  "TensorFlow",
  "scikit-learn",
  "NumPy",
  "Pandas",
  "OpenCV",
  "FastAPI",
  "Java",
  "C",
  "Streamlit",
  "HTML/CSS",
  "JavaScript",
  "WordPress",
  "Git",
  "GitHub",
  "MongoDB",
  "MySQL",
  "VS Code",
  "Google Colab",
  "Jupyter Notebook",
  "Arduino IDE",
  "Embedded C",
  "Figma",
  "Canva",
  "n8n",
];

// ─── ADD NEW INTERNSHIPS AT THE TOP (most recent first) ──────────────────────
export const internships: InternshipItem[] = [
  {
    role: "Consultant I Intern — Cash Application",
    org: "HighRadius Technologies",
    tag: "HighRadius",
    period: "Jul 2026 – Sep 2026",
    duration: "3 mos",
    type: "Onsite · Hyderabad",
    logo: "/highradius.png",
    points: [
      "Gained hands-on exposure to Cash Application and Accounts Receivable processes within an enterprise Order-to-Cash environment.",
      "Worked with customer, invoice, payment, and remittance data and developed an understanding of payment matching and exception-handling workflows.",
      "Applied SQL and database concepts to understand and work with structured enterprise data.",
      "Developed practical experience in business-process analysis, problem-solving, communication, and consulting workflows.",
    ],
  },
  {
    role: "AI/ML Research Intern",
    org: "Samsung R&D Institute India — PRISM",
    tag: "Samsung PRISM",
    period: "Sep 2025 – Feb 2026",
    duration: "6 mos",
    type: "Virtual",
    logo: "/samsung-prism.png",
    points: [
      "Developed an AI-based RAW/DNG White Balance Enhancement System using PyTorch, MobileNetV3-Small, rawpy, and FastAPI for scene illuminant estimation and real-time colour correction.",
      "Implemented adaptive WB control using model prediction, Grey World estimation, and RAW (as-shot Neutral) metadata with 10 controllable enhancement levels.",
    ],
  },
  {
    role: "Machine Learning Intern",
    org: "Inligntech",
    tag: "Inligntech",
    period: "Jul 2025 – Sep 2025",
    duration: "3 mos",
    type: "Virtual",
    logo: "",
    points: [
      "Developed a Spam Email Classifier using NLP and ML techniques.",
      "Built a Credit Card Fraud Detection system to handle imbalanced datasets using methods like SMOTE and evaluated multiple ML models for high accuracy.",
      "Implemented a Breast Cancer Classification model to predict malignancy/benign cases using supervised learning.",
      "Applied an end-to-end ML pipeline including data preprocessing, feature selection, model training, and evaluation.",
      "Strengthened expertise in classification, imbalanced data handling, and real-world ML applications.",
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

// ─── ADD NEW PROJECTS AT THE TOP (most recent first) ─────────────────────────
export const academicProjects: ProjectItem[] = [
  {
    date: "JAN 2026",
    title: "Centralised File-Sharing System with DHCP & FTP Server",
    sub: "Computer Networks",
    desc: "Implemented a centralised file-sharing network with dynamic IP allocation using DHCP and secure FTP-based file transfer across multiple departmental subnets, connected via static routing and DHCP relay in Cisco Packet Tracer.",
    tags: ["DHCP", "FTP", "Static Routing", "Subnetting", "Networking"],
    repo: "https://github.com/Surajit00007/CN_project",
    image: "networkSharing",
  },
  {
    date: "DEC 2025",
    title: "Agricultural Commodity Price Prediction using Deep Learning",
    sub: "Deep Learning / Time-Series",
    desc: "Performed rigorous EDA, feature engineering (lags and rolling statistics) and achieved improved forecasting accuracy measured via RMSE, MAE, R², and MAPE. Worked with real Indian agricultural market price data (23K+ records) to study price trends and volatility. Designed and trained a Random Forest regression model achieving strong performance (R² ≈ 0.88). Explored deep learning models such as LSTM, GRU, and Transformer architectures.",
    tags: ["Deep Learning", "Random Forest", "Time-Series", "EDA", "Python"],
    repo: "https://github.com/Surajit00007/Agricultural_Price_Prediction_using_DL",
    image: "agriForecast",
  },
  {
    date: "May 2025",
    title: "Intelligent Chatbot Development",
    sub: "Transformer-based AI",
    desc: "Built an intelligent conversational chatbot using transformer models trained on Cornell Movie Dialogs datasets, enabling human-like responses through contextual understanding and a self-attention mechanism. Fine-tuned the model for relevance, tone consistency, and response quality using beam search and sampling.",
    tags: ["Transformers", "NLP", "Python", "Self-Attention"],
    repo: "https://github.com/Surajit00007/Intelligent_Chatbot_Development-project",
    image: "chatbotAgent",
  },
];

export const personalProjects: ProjectItem[] = [
  {
    date: "MARCH 2026",
    title: "Sahara — AI-Based Elderly Health Monitoring System",
    sub: "Hackathon Project · AI Healthcare",
    desc: "Built an AI-driven health monitoring webapp for elderly users with simplified step-by-step logging of vitals (BP, sugar, Hb, weight) and real-time risk scoring. Developed AI Nutrition Tracker using Gemini API to parse Indian meals (Hindi/Odia input) and generate macronutrient insights aligned with ICMR standards. Designed an anaemia risk prediction model using Hb trends and dietary intake with early warning alerts. Implemented SOS emergency system with one-tap alert, live GPS tracking, and SMS integration.",
    tags: ["Gemini API", "AI Healthcare", "Risk Scoring", "Python", "SMS Alert"],
    repo: "https://github.com/Surajit00007",
    image: "chatbotAgent",
  },
  {
    date: "Feb 2026",
    title: "Local Drop",
    sub: "Secure P2P File Transfer",
    desc: "Developed Local Drop, a secure peer-to-peer file transfer application enabling seamless file sharing between devices over local networks using WebRTC DataChannels, eliminating the need for cloud storage or third-party servers. Implemented real-time encrypted file transfer with chunked streaming, progress tracking (percentage, speed, ETA) and bidirectional sharing (laptop to phone and vice versa).",
    tags: ["WebRTC", "Networking", "P2P", "Encryption", "File Transfer"],
    repo: "https://github.com/Surajit00007/LocalDrop-fileshare",
    image: "webrtcFileshare",
  },
  {
    date: "Dec 2025",
    title: "Local AI Chatbot",
    sub: "Privacy-focused LLM Prototype",
    desc: "Developed a ChatGPT-like chatbot that runs completely on a local laptop using phi3, llama3, and mistral via Ollama. Works fully offline with no internet or API dependency, ensuring total data privacy.",
    tags: ["Ollama", "LLM", "Python"],
    repo: "https://github.com/Surajit00007/Customised_GPT_project",
    image: "localLlm",
  },
  {
    date: "March 2025",
    title: "Swallet App — Expense Tracker",
    sub: "Personal Finance App",
    desc: "Developed Swallet, a personal finance tracking app using Streamlit, enabling users to log income and expenses in INR with intuitive UI. Implemented pie charts and graphs for spending insights; local CSV-based storage for privacy.",
    tags: ["Streamlit", "Data Viz", "Python"],
    repo: "https://github.com/Surajit00007/Swallet",
    image: "expenseTracker",
  },
  {
    date: "Jun 2024",
    title: "Automatic Room Light System",
    sub: "IoT Project",
    desc: "Designed and implemented a microcontroller-based automatic room light system with a bidirectional counter using an infrared sensor and Arduino Uno, enabling lights to toggle based on human presence. Developed the control logic using Embedded C (Arduino IDE), integrated infrared relay switching, and documented the design with flowcharts and circuit diagrams.",
    tags: ["Arduino Uno", "Embedded C", "IoT", "IR Sensor"],
    repo: "https://github.com/Surajit00007/Automatic_Room_Light_System",
    image: "smartLight",
  },
];

// ─── ADD NEW CERTS AT THE TOP (most recent first) ────────────────────────────
export const certs: CertItem[] = [
  {
    title: "GenAI Job Simulation",
    issuer: "Forage (Boston Consulting Group)",
    date: "Dec 2025",
    points: [
      "Built an AI-powered financial chatbot using Python",
      "Analyzed and interpreted data from 10-K and 10-Q financial reports",
    ],
    logo: "https://cdn.uconnectlabs.com/wp-content/uploads/sites/60/2025/12/ChatGPT-Image-Dec-1-2025-08_58_40-AM-480x480.png",
  },
  {
    title: "Google Cloud Arcade Trooper",
    issuer: "Google Cloud",
    date: "Jun 2025",
    points: [
      "Trooper Tier — Summer Batch (Apr–Jun) 2025",
      "Hands-on experience with BigQuery, Kubernetes, and AI/ML tools on GCP",
      "Completed various labs, trivia challenges, and skill badges in the Google Cloud ecosystem",
    ],
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg",
  },
  {
    title: "Salesforce Agentblazer Champion Badge",
    issuer: "Salesforce",
    date: "Jun 2025",
    points: [
      "Built an AI-powered agent to send automated business emails",
      "Identified real-world use cases for intelligent agent deployment",
      "Agentforce concepts & foundational agent technology",
    ],
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/salesforce/salesforce-original.svg",
  },
];

export const defaultPortfolioData: PortfolioData = {
  bio,
  skills,
  internships,
  academicProjects,
  personalProjects,
  certs,
};
