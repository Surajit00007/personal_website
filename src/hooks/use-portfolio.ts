import { useQuery } from "@tanstack/react-query";
import { defaultPortfolioData, type PortfolioData } from "@/lib/portfolio-data";

export function usePortfolio(initialData?: PortfolioData) {
  const query = useQuery({
    queryKey: ["portfolio-data"],
    queryFn: async (): Promise<PortfolioData> => {
      try {
        const res = await fetch("/api/portfolio");
        if (!res.ok) {
          return defaultPortfolioData;
        }
        const json = await res.json();
        return (json.data as PortfolioData) || defaultPortfolioData;
      } catch (err) {
        console.warn(
          "Failed to fetch live portfolio data from /api/portfolio, using fallback:",
          err,
        );
        return defaultPortfolioData;
      }
    },
    initialData: initialData ?? defaultPortfolioData,
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
    refetchOnWindowFocus: false,
  });

  return {
    data: query.data ?? defaultPortfolioData,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
