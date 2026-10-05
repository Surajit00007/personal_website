import { useQuery } from "@tanstack/react-query";
import { defaultPortfolioData, type PortfolioData } from "@/lib/portfolio-data";

function getLocalData(fallback: PortfolioData): PortfolioData {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("portfolio_cached_data");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object" && parsed.bio) {
          return parsed as PortfolioData;
        }
      }
    } catch {}
  }
  return fallback;
}

export function usePortfolio(initialData?: PortfolioData) {
  const query = useQuery({
    queryKey: ["portfolio-data"],
    queryFn: async (): Promise<PortfolioData> => {
      try {
        const res = await fetch("/api/portfolio", {
          cache: "no-store",
          headers: {
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
          },
        });
        if (!res.ok) {
          return getLocalData(initialData ?? defaultPortfolioData);
        }
        const json = await res.json();
        if (json.data) {
          const freshData = json.data as PortfolioData;
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("portfolio_cached_data", JSON.stringify(freshData));
            } catch {}
          }
          return freshData;
        }
        return getLocalData(initialData ?? defaultPortfolioData);
      } catch (err) {
        console.warn(
          "Failed to fetch live portfolio data from /api/portfolio, using fallback:",
          err,
        );
        return getLocalData(initialData ?? defaultPortfolioData);
      }
    },
    initialData: initialData,
    placeholderData: () => getLocalData(initialData ?? defaultPortfolioData),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  return {
    data: query.data ?? getLocalData(initialData ?? defaultPortfolioData),
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
