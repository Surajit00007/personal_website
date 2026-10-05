# Surajit Sahoo — Personal Portfolio

A cinematic personal portfolio website built with React, TypeScript, Vite, and TailwindCSS v4. Features a dark monochrome macOS-card design theme and an integrated AI chatbot (SURA) powered by Groq.

## 📸 Screenshots

### Hero & About

![Hero & About Section](public/screenshots/hero_and_about.webp)

### Projects

![Projects](public/screenshots/projects.webp)

### SURA AI Chatbot

![SURA Chatbot](public/screenshots/sura_chatbot.png)

---

## 🛠️ Local Setup

```bash
npm install
```

Create a `.env` file in the root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Run locally:

```bash
npm run dev
```

Open **[http://localhost:8080](http://localhost:8080)**

---

## 📁 Project Structure

```
personal_website/
├── public/                        # Static assets served at root
│   ├── highradius.png             # Company logos
│   ├── samsung-prism.png
│   ├── soa-flying.png
│   ├── robot-face.png             # SURA chatbot icon
│   ├── resume.pdf                 # Downloadable resume
│   └── screenshots/               # README screenshots
│
├── src/
│   ├── assets/                    # Bundled image assets (project screenshots etc.)
│   │
│   ├── components/
│   │   ├── Portfolio.tsx          # Main page — renders all sections
│   │   ├── SuraWidget.tsx         # SURA AI chat widget (floating button + panel)
│   │   ├── SideNav.tsx            # Desktop vertical nav + mobile top bar
│   │   ├── ThemeToggle.tsx        # Dark / light theme switcher
│   │   ├── GridBackground.tsx     # Animated 3D grid background
│   │   ├── Reveal.tsx             # Scroll-triggered reveal animation wrapper
│   │   └── Loader.tsx             # Intro loader animation
│   │
│   ├── lib/
│   │   ├── portfolio-data.ts      # ⭐ SINGLE SOURCE OF TRUTH
│   │   │                          #    Edit THIS file to update:
│   │   │                          #    • Website UI (cards, sections)
│   │   │                          #    • SURA AI chatbot knowledge (auto-synced)
│   │   │                          #    Contains: bio, skills, internships,
│   │   │                          #    projects, certs
│   │   │
│   │   └── portfolio-context.ts   # Auto-generated from portfolio-data.ts
│   │                              # Do NOT edit manually — it builds the
│   │                              # SURA AI system prompt at runtime
│   │
│   ├── routes/
│   │   ├── __root.tsx             # Root layout (fonts, global head tags)
│   │   ├── index.tsx              # "/" route → renders Portfolio
│   │   └── api/
│   │       └── chat.ts            # Groq API server route for SURA AI
│   │
│   └── styles.css                 # Global CSS, theme variables, mac-card utilities
│
├── .env                           # GROQ_API_KEY (not committed)
├── vite.config.ts
└── package.json
```

---

## ✏️ How to Update Content

**All portfolio content lives in one file:**

```
src/lib/portfolio-data.ts
```

| What to update      | Where in the file                                             |
| ------------------- | ------------------------------------------------------------- |
| Add new internship  | `internships` array — add at the **top** (most recent first)  |
| Add new project     | `academicProjects` or `personalProjects` — add at the **top** |
| Add new certificate | `certs` array — add at the **top**                            |
| Update bio / links  | `bio` object                                                  |
| Update skills       | `skills` array                                                |

> The SURA AI chatbot will automatically reflect your changes — no need to touch `portfolio-context.ts`.

---

## 🐘 Neon Database Integration

You can store and fetch all frontend details dynamically from a **Neon Serverless PostgreSQL** database.

### 1. Get your Neon Connection String

1. Create a project at [Neon](https://neon.tech).
2. Copy your connection URL: `postgresql://user:password@ep-...neon.tech/neondb?sslmode=require`.

### 2. Add to `.env`

```env
DATABASE_URL=postgresql://user:password@ep-...neon.tech/neondb?sslmode=require
```

### 3. Initialize & Seed Database

Run the seed script to automatically create the `portfolio_sections` table and populate it with your portfolio details:

```bash
npm run db:seed
```

### 4. Automatic Fallback

- If `DATABASE_URL` is not provided or if the database is unreachable, the site automatically and smoothly falls back to `src/lib/portfolio-data.ts`.
- When Neon is configured, both the frontend website and the SURA AI chatbot dynamically load the latest content from Neon DB.
- REST API endpoint available at: `GET /api/portfolio` and `POST /api/portfolio`.

---

## 🤖 SURA AI Chatbot

SURA is a context-aware AI assistant that answers questions about Surajit's portfolio.

- **Model:** `llama3-8b-8192` via [Groq](https://groq.com)
- **Context:** Auto-built from `src/lib/portfolio-data.ts`
- **Rate limiting:** 5 requests per 15 minutes (client-side)
- **Mobile:** Adapts to visual viewport — keyboard-safe layout

---

## 🎨 Design System

- **Theme:** Dark monochrome (`#0d0d0d` bg, `#f2f2f0` fg) with warm cream alternate
- **Cards:** macOS browser chrome style with traffic-light controls
- **Typography:** `DM Serif Display` (headings) + `Inter` (body) + `JetBrains Mono` (labels)
- **Animations:** `motion/react` for scroll reveals, entrance transitions
