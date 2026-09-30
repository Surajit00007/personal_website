// ─── SINGLE SOURCE OF TRUTH ───────────────────────────────────────────────────
// Edit this file to update BOTH the website UI and the SURA AI chatbot context.
// No need to touch portfolio-context.ts — it auto-generates from this data.
// ──────────────────────────────────────────────────────────────────────────────

export const bio = {
  name: "Surajit Sahoo",
  role: "AI/ML Engineer building intelligent systems across ML, deep learning, NLP, computer vision, and IoT.",
  email: "surajit007inc@gmail.com",
  linkedin: "https://linkedin.com/in/surajit-sahoo-084173335",
  github: "https://github.com/Surajit00007",
  portfolio: "https://surajitsahoo.netlify.app/",
  instagram: "https://instagram.com/surajit._007",
  resume: "https://surajitsahoo.netlify.app/resume.pdf",
  education: {
    degree: "B.Tech, Computer Science (AI & ML)",
    school: "Institute of Technical Education and Research, SOA University",
    year: "Currently in his 4th Year, 2023 — 2027",
    gpa: "8.45 / 10 (up to 4th semester)",
    coursework: ["DSA in Java", "Machine Learning", "Deep Learning", "Algorithm Analysis", "Artificial Intelligence"],
  },
  interests: "AI, Machine Learning, Deep Learning, NLP, Computer Vision, IoT systems, and clean product design.",
};

export const skills = [
  "Python", "PyTorch", "TensorFlow", "scikit-learn", "NumPy", "Pandas", "OpenCV", "FastAPI",
  "Java", "C", "Streamlit", "HTML/CSS", "JavaScript", "Git", "GitHub", "MySQL",
  "VS Code", "Google Colab", "Arduino IDE", "Embedded C", "Figma", "Canva",
];

// ─── ADD NEW INTERNSHIPS AT THE TOP (most recent first) ──────────────────────
export const internships = [
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
      "Worked with customer, invoice, payment, and remittance data; developed understanding of payment matching and exception-handling workflows.",
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
export const academicProjects = [
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
    title: "Agricultural Commodity Price Prediction",
    sub: "Deep Learning / Time-Series",
    desc: "Built an intelligent prediction system using deep learning. Performed rigorous EDA, feature engineering (lags, rolling statistics, seasonality encoding) and time-aware train–test splitting, achieving improved forecasting accuracy measured via RMSE, MAE, R², and MAPE.",
    tags: ["Deep Learning", "EDA", "Forecasting"],
    repo: "https://github.com/Surajit00007/Agricultural_Price_Prediction_using_DL",
    image: "agriForecast",
  },
  {
    date: "May 2025",
    title: "Intelligent Chatbot Development",
    sub: "Transformer-based AI",
    desc: "Built an intelligent conversational chatbot using transformer models trained on Cornell Movie Dialogs datasets. Fine-tuned for relevance, tone consistency, and response quality using beam search and sampling.",
    tags: ["Transformers", "NLP", "Python"],
    repo: "https://github.com/Surajit00007/Intelligent_Chatbot_Development-project",
    image: "chatbotAgent",
  },
];

export const personalProjects = [
  {
    date: "Feb 2026",
    title: "Local Drop",
    sub: "Peer-to-Peer File Transfer App",
    desc: "Developed a robust peer-to-peer file sharing application using WebRTC, designed to work seamlessly across mobile hotspots and various network topologies. Implemented reliable ICE candidate handling and connection fallback mechanisms.",
    tags: ["WebRTC", "Networking", "Android", "File Transfer"],
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
    desc: "Designed a microcontroller-based automatic room light system with a bidirectional counter using an IR sensor and Arduino Uno. Developed control logic in Embedded C, integrated infrared relay switching.",
    tags: ["Arduino", "IoT", "Embedded C"],
    repo: "https://github.com/Surajit00007/Automatic_Room_Light_System",
    image: "smartLight",
  },
];

// ─── ADD NEW CERTS AT THE TOP (most recent first) ────────────────────────────
export const certs = [
  {
    title: "GenAI Job Simulation",
    issuer: "Forage (Boston Consulting Group)",
    date: "Dec 2025",
    points: ["AI-powered financial chatbot in Python", "Analyzed 10-K and 10-Q financial reports"],
    logo: "https://cdn.uconnectlabs.com/wp-content/uploads/sites/60/2025/12/ChatGPT-Image-Dec-1-2025-08_58_40-AM-480x480.png",
  },
  {
    title: "Google Cloud Arcade Trooper",
    issuer: "Google Cloud",
    date: "Jun 2025",
    points: ["Trooper Tier — Summer Batch (Apr–Jun) 2025", "Hands-on BigQuery, Kubernetes, AI/ML on GCP", "Labs, trivia, and skill badges"],
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg",
  },
  {
    title: "Salesforce Agentblaze Champions Badge",
    issuer: "Salesforce",
    date: "Jun 2025",
    points: ["Agentforce concepts & business impact", "Foundational agent technology", "Built an AI-powered agent"],
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/salesforce/salesforce-original.svg",
  },
];
