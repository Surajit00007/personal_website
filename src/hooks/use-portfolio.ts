import { useQuery } from "@tanstack/react-query";
import { defaultPortfolioData, type PortfolioData } from "@/lib/portfolio-data";

function withDefaultPreviewProjects(data: PortfolioData): PortfolioData {
  const defaultPreviewProjects = defaultPortfolioData.personalProjects.filter(
    (project) => project.liveUrl || project.previewImage,
  );
  const personalProjects = data.personalProjects
    .filter(
      (project) =>
        project.title !== "Swallet App — Expense Tracker" &&
        project.repo !== "https://github.com/Surajit00007/Swallet",
    )
    .map((project) => {
      const defaultProject = defaultPreviewProjects.find(
        (candidate) =>
          candidate.title === project.title || (project.repo && candidate.repo === project.repo),
      );

      return defaultProject?.previewImage
        ? {
            ...project,
            image: defaultProject.image,
            previewUrl: project.previewUrl ?? defaultProject.previewUrl,
            previewImage: project.previewImage ?? defaultProject.previewImage,
          }
        : project;
    });
  const missingProjects = defaultPreviewProjects.filter(
    (defaultProject) =>
      !personalProjects.some(
        (project) =>
          project.title === defaultProject.title ||
          (defaultProject.repo && project.repo === defaultProject.repo) ||
          (defaultProject.liveUrl && project.liveUrl === defaultProject.liveUrl),
      ),
  );

  return missingProjects.length ||
    personalProjects.length !== data.personalProjects.length ||
    personalProjects.some((project, index) => project !== data.personalProjects[index])
    ? { ...data, personalProjects: [...missingProjects, ...personalProjects] }
    : data;
}

function getLocalData(fallback: PortfolioData): PortfolioData {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("portfolio_cached_data");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object" && parsed.bio) {
          return withDefaultPreviewProjects(parsed as PortfolioData);
        }
      }
    } catch {}
  }
  return withDefaultPreviewProjects(fallback);
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
          const freshData = withDefaultPreviewProjects(json.data as PortfolioData);
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
    initialData: initialData ? withDefaultPreviewProjects(initialData) : undefined,
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
