// AUTO-GENERATED — do not edit manually.
// Edit src/lib/portfolio-data.ts instead.
// This context is fed to SURA AI as its system prompt.

import { defaultPortfolioData, PortfolioData } from "./portfolio-data";

export function buildContextFromData(data: PortfolioData = defaultPortfolioData): string {
  const { bio, skills, internships, academicProjects, personalProjects, certs } = data;
  const lines: string[] = [];

  lines.push(`NAME: ${bio.name}`);
  lines.push(`ROLE: ${bio.role}`);
  lines.push(`CONTACT & SOCIAL LINKS:`);
  lines.push(`- Email: ${bio.email}`);
  lines.push(`- LinkedIn: ${bio.linkedin}`);
  lines.push(`- GitHub: ${bio.github}`);
  lines.push(`- Portfolio: ${bio.portfolio}`);
  lines.push(`- Instagram: ${bio.instagram}`);
  lines.push(`- Resume / CV: Downloadable at ${bio.resume}`);
  lines.push(``);

  lines.push(`EDUCATION:`);
  lines.push(
    `- ${bio.education.degree} at ${bio.education.school} (${bio.education.year}). GPA: ${bio.education.gpa}.`,
  );
  lines.push(`- Coursework: ${bio.education.coursework.join(", ")}.`);
  lines.push(``);

  lines.push(`SKILLS:`);
  lines.push(skills.join(", ") + ".");
  lines.push(``);

  lines.push(
    `INTERNSHIPS (listed most recent first — the first entry is the LATEST work experience):`,
  );
  internships.forEach((intern, i) => {
    const isLatest = i === 0 ? " ← MOST RECENT / LATEST WORK EXPERIENCE" : "";
    lines.push(
      `${i + 1}. ${intern.role} @ ${intern.org} (${intern.period}, ${intern.duration}, ${intern.type})${isLatest}:`,
    );
    intern.points.forEach((pt) => lines.push(`   - ${pt}`));
    if (i < internships.length - 1) lines.push(``);
  });
  lines.push(``);

  lines.push(`ACADEMIC PROJECTS:`);
  academicProjects.forEach((p, i) => {
    lines.push(`${i + 1}. ${p.title} (${p.date}) — ${p.desc} Tags: ${p.tags.join(", ")}.`);
  });
  lines.push(``);

  lines.push(`PERSONAL PROJECTS:`);
  personalProjects.forEach((p, i) => {
    lines.push(`${i + 1}. ${p.title} (${p.date}) — ${p.desc} Tags: ${p.tags.join(", ")}.`);
  });
  lines.push(``);

  lines.push(`CERTIFICATIONS:`);
  certs.forEach((c) => {
    lines.push(`- ${c.title} — ${c.issuer} (${c.date}): ${c.points.join("; ")}.`);
  });
  lines.push(``);

  lines.push(`INTERESTS: ${bio.interests}`);

  return lines.join("\n").trim();
}

export const portfolioContext = buildContextFromData(defaultPortfolioData);
