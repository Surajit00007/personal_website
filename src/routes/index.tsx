import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Portfolio } from "@/components/Portfolio";
import { defaultPortfolioData, type PortfolioData } from "@/lib/portfolio-data";

const getPortfolioServerData = createServerFn({ method: "GET" }).handler(
  async (): Promise<PortfolioData> => {
    try {
      const { getPortfolioDataFromDb } = await import("@/lib/db.server");
      return await getPortfolioDataFromDb();
    } catch (e) {
      console.error("SSR loader failed to fetch from DB:", e);
      return defaultPortfolioData;
    }
  },
);

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      return await getPortfolioServerData();
    } catch {
      return defaultPortfolioData;
    }
  },
  head: () => ({
    meta: [
      { title: "Surajit Sahoo — AI/ML Engineer" },
      {
        name: "description",
        content:
          "Cinematic portfolio of Surajit Sahoo — AI/ML engineer building intelligent systems across ML, deep learning, NLP, and computer vision.",
      },
      { property: "og:title", content: "Surajit Sahoo — AI/ML Engineer" },
      {
        property: "og:description",
        content:
          "Cinematic portfolio of Surajit Sahoo — AI/ML engineer building intelligent systems.",
      },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  const initialData = Route.useLoaderData();
  return <Portfolio initialData={initialData} />;
}
