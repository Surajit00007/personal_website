import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import {
  defaultPortfolioData,
  type PortfolioData,
  type BioData,
  type InternshipItem,
  type ProjectItem,
  type CertItem,
} from "./portfolio-data";

/**
 * Neon Database Connection
 * Supports DATABASE_URL or NEON_DATABASE_URL environment variable.
 */
function getDatabaseUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
}

export function isNeonConfigured(): boolean {
  const url = getDatabaseUrl();
  return Boolean(url && url.trim().length > 0 && !url.includes("your-neon-database-url-here"));
}

let cachedSql: NeonQueryFunction<false, false> | null = null;

export function getDb(): NeonQueryFunction<false, false> | null {
  const url = getDatabaseUrl();
  if (!url || !isNeonConfigured()) {
    return null;
  }
  if (!cachedSql) {
    cachedSql = neon(url);
  }
  return cachedSql;
}

/**
 * Initializes the portfolio_sections table if it doesn't already exist.
 */
export async function initPortfolioTable(): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_sections (
        section_key VARCHAR(64) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    return true;
  } catch (err) {
    console.error("Failed to initialize portfolio_sections table in Neon DB:", err);
    return false;
  }
}

interface SectionRow {
  section_key: string;
  data: unknown;
  updated_at?: string;
}

/**
 * Fetches portfolio data from Neon Postgres.
 * If Neon is not yet configured or connection fails, seamlessly falls back to defaultPortfolioData.
 */
export async function getPortfolioDataFromDb(): Promise<PortfolioData> {
  const sql = getDb();
  if (!sql) {
    return defaultPortfolioData;
  }

  try {
    const rows = (await sql`
      SELECT section_key, data
      FROM portfolio_sections;
    `) as SectionRow[];

    if (!rows || rows.length === 0) {
      return defaultPortfolioData;
    }

    const rowMap = new Map<string, unknown>();
    for (const r of rows) {
      rowMap.set(r.section_key, r.data);
    }

    const bio = (rowMap.get("bio") as BioData) || defaultPortfolioData.bio;
    const skills = (rowMap.get("skills") as string[]) || defaultPortfolioData.skills;
    const internships =
      (rowMap.get("internships") as InternshipItem[]) || defaultPortfolioData.internships;
    const academicProjects =
      (rowMap.get("academic_projects") as ProjectItem[]) ||
      (rowMap.get("academicProjects") as ProjectItem[]) ||
      defaultPortfolioData.academicProjects;
    const personalProjects =
      (rowMap.get("personal_projects") as ProjectItem[]) ||
      (rowMap.get("personalProjects") as ProjectItem[]) ||
      defaultPortfolioData.personalProjects;
    const certs = (rowMap.get("certs") as CertItem[]) || defaultPortfolioData.certs;

    return {
      bio: {
        ...defaultPortfolioData.bio,
        ...bio,
        education: {
          ...defaultPortfolioData.bio.education,
          ...(bio?.education || {}),
        },
      },
      skills: Array.isArray(skills) ? skills : defaultPortfolioData.skills,
      internships: Array.isArray(internships) ? internships : defaultPortfolioData.internships,
      academicProjects: Array.isArray(academicProjects)
        ? academicProjects
        : defaultPortfolioData.academicProjects,
      personalProjects: Array.isArray(personalProjects)
        ? personalProjects
        : defaultPortfolioData.personalProjects,
      certs: Array.isArray(certs) ? certs : defaultPortfolioData.certs,
    };
  } catch (err) {
    console.warn(
      "Neon DB query notice (using local portfolio fallback):",
      err instanceof Error ? err.message : err,
    );
    return defaultPortfolioData;
  }
}

/**
 * Upserts a single section into portfolio_sections table.
 */
export async function upsertPortfolioSection(sectionKey: string, data: unknown): Promise<boolean> {
  const sql = getDb();
  if (!sql) {
    throw new Error("Neon Database URL is not configured. Set DATABASE_URL in your .env file.");
  }

  await initPortfolioTable();

  const jsonData = JSON.stringify(data);
  await sql`
    INSERT INTO portfolio_sections (section_key, data, updated_at)
    VALUES (${sectionKey}, ${jsonData}::jsonb, NOW())
    ON CONFLICT (section_key)
    DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();
  `;
  return true;
}

/**
 * Seeds or updates all sections in Neon DB using the provided or default portfolio data.
 */
export async function seedAllPortfolioData(
  data: PortfolioData = defaultPortfolioData,
): Promise<void> {
  const sql = getDb();
  if (!sql) {
    throw new Error("Cannot seed: DATABASE_URL or NEON_DATABASE_URL is not set.");
  }

  await initPortfolioTable();

  await upsertPortfolioSection("bio", data.bio);
  await upsertPortfolioSection("skills", data.skills);
  await upsertPortfolioSection("internships", data.internships);
  await upsertPortfolioSection("academic_projects", data.academicProjects);
  await upsertPortfolioSection("personal_projects", data.personalProjects);
  await upsertPortfolioSection("certs", data.certs);
}
