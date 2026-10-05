import { createFileRoute } from "@tanstack/react-router";
import {
  getPortfolioDataFromDb,
  upsertPortfolioSection,
  seedAllPortfolioData,
  isNeonConfigured,
} from "@/lib/db.server";
import { defaultPortfolioData, type PortfolioData } from "@/lib/portfolio-data";

function checkAuth(password?: string, username?: string): boolean {
  const adminPass = process.env.ADMIN_PASSWORD || process.env.DEV_PASSWORD || "26122004";
  if (!password) return false;
  if (password === adminPass) return true;
  if (username === "surajit" && password === "26122004") return true;
  return false;
}

export const Route = createFileRoute("/api/portfolio")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const configured = isNeonConfigured();
          const data = await getPortfolioDataFromDb();
          return Response.json(
            {
              success: true,
              isNeonConfigured: configured,
              data,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
              },
            },
          );
        } catch (err) {
          console.error("GET /api/portfolio error:", err);
          return Response.json(
            {
              success: true,
              isNeonConfigured: false,
              data: defaultPortfolioData,
              error: err instanceof Error ? err.message : "Unknown error",
            },
            { status: 200 },
          );
        }
      },

      POST: async ({ request }) => {
        try {
          if (!isNeonConfigured()) {
            return Response.json(
              {
                success: false,
                error: "Neon database is not configured. Set DATABASE_URL in your environment.",
              },
              { status: 503 },
            );
          }

          const body = (await request.json()) as {
            action?: "verify_auth" | "seed" | "update_section" | "update_all";
            password?: string;
            username?: string;
            section?: string;
            data?: unknown;
          };

          if (body.action === "verify_auth") {
            if (checkAuth(body.password, body.username)) {
              return Response.json({
                success: true,
                message: "Authentication successful.",
              });
            }
            return Response.json(
              {
                success: false,
                error: "Invalid credentials. Please enter the correct password.",
              },
              { status: 401 },
            );
          }

          // Protect mutation actions with password check
          if (!checkAuth(body.password, body.username)) {
            return Response.json(
              {
                success: false,
                error: "Unauthorized. Valid password required to update Neon DB.",
              },
              { status: 401 },
            );
          }

          if (body.action === "seed") {
            await seedAllPortfolioData((body.data as PortfolioData) || defaultPortfolioData);
            const updated = await getPortfolioDataFromDb();
            return Response.json({
              success: true,
              message: "Portfolio data seeded to Neon database successfully.",
              data: updated,
            });
          }

          if (body.action === "update_section" && body.section && body.data !== undefined) {
            let sectionKey = body.section;
            if (sectionKey === "academicProjects") sectionKey = "academic_projects";
            if (sectionKey === "personalProjects") sectionKey = "personal_projects";

            await upsertPortfolioSection(sectionKey, body.data);
            const updated = await getPortfolioDataFromDb();
            return Response.json({
              success: true,
              message: `Section '${sectionKey}' updated successfully in Neon.`,
              data: updated,
            });
          }

          if (body.action === "update_all" && body.data) {
            await seedAllPortfolioData(body.data as PortfolioData);
            const updated = await getPortfolioDataFromDb();
            return Response.json({
              success: true,
              message: "All portfolio details updated successfully in Neon.",
              data: updated,
            });
          }

          return Response.json(
            {
              success: false,
              error:
                "Invalid payload. Provide action: 'verify_auth', 'seed', 'update_section', or 'update_all'.",
            },
            { status: 400 },
          );
        } catch (err) {
          console.error("POST /api/portfolio error:", err);
          return Response.json(
            {
              success: false,
              error: err instanceof Error ? err.message : "Unknown server error",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
