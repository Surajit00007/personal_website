import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "@/components/Portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Surajit Sahoo — AI/ML Engineer" },
      { name: "description", content: "Cinematic portfolio of Surajit Sahoo — AI/ML engineer building intelligent systems across ML, deep learning, NLP, and computer vision." },
      { property: "og:title", content: "Surajit Sahoo — AI/ML Engineer" },
      { property: "og:description", content: "Cinematic portfolio of Surajit Sahoo — AI/ML engineer building intelligent systems." },
    ],
  }),
  component: Portfolio,
});
