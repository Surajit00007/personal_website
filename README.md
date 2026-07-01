# Surajit Sahoo — Personal Portfolio & AI Chatbot

A premium, glassmorphic, high-performance personal website and portfolio built for AI/ML engineering showcases. Features a modern dark theme with atmospheric background grid animations, responsive layout, and an integrated rate-limited AI chatbot.

## 🚀 Key Features

*   **SURA AI Chatbot**: Fully integrated conversational AI powered by **Groq (Llama 3.3 70B)**. Includes:
    *   *Rate Limiting*: 20 requests per 5 minutes per user sliding-window limit (enforced both client-side and server-side).
    *   *Input Validation*: Limits questions to 500 characters to prevent excessive processing.
    *   *Brevity Tuning*: Answers are strictly to-the-point (1-2 sentences).
*   **Atmospheric Grid & Animations**: Smooth micro-animations using Framer Motion (motion/react), floating orbs, and a futuristic interactive perspective grid background.
*   **Complete Professional Sections**:
    *   **About**: Education details (Institute of Technical Education and Research, SOA University), GPA, and coursework.
    *   **Projects**: Grouped into Academic and Personal categories, displaying description, tags, GitHub link, and project domain screenshots.
    *   **Internships**: Work experience cards displaying details for Research Intern @ Samsung PRISM and Graphic Designer @ SOA Flying Community with clean, padding-free logos.
    *   **Certificates**: Visual credentials with logos for Forage/BCG, Google Cloud, and Salesforce.
*   **Responsive Desktop Side-Nav & Mobile Top Bar**: Distributed perfectly using CSS Flexbox for visual balance.

---

## 📸 Screenshots

### 1. Hero & About Section
![Hero & About Section](public/screenshots/hero_and_about.webp)

### 2. Featured Projects & Internships
![Featured Projects](public/screenshots/projects.webp)

### 3. SURA AI Chatbot with Rate Limiting
![SURA Chatbot](public/screenshots/sura_chatbot.png)

---

## 🛠️ Local Development & Setup

### Prerequisites
Make sure you have Node.js installed.

### 1. Installation
Clone the repository, go to the project directory, and install dependencies:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add your Groq API key:
```env
GROQ_API_KEY=your_groq_api_key_here
```
*(The `.env` file is excluded from git commits in `.gitignore` to keep credentials secure).*

### 3. Run Development Server
Start the local server:
```bash
npm run dev
```
Open **[http://localhost:8080](http://localhost:8080)** in your browser to view the site.

---

## 📁 Repository Structure

*   `/src` - Main React components, routes, styles, and logic.
    *   `/src/components/SuraWidget.tsx` - Chatbot UI, message history, and client-side rate limits.
    *   `/src/routes/api/chat.ts` - Chat API endpoint, server rate-limiting logic, and Groq SDK caller.
*   `/public` - Static assets, resume, and screenshots.
*   `/Old website` - Contains the full source code and assets of the previous live website.
