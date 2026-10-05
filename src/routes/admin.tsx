import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DevDashboard } from "@/components/DevDashboard";
import { DevLoginModal } from "@/components/DevLoginModal";
import { usePortfolio } from "@/hooks/use-portfolio";
import { Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin & Dev Mode — Surajit Sahoo" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const { data } = usePortfolio();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem("portfolio_dev_auth") === "true";
      setIsAuthenticated(isAuth);
      if (!isAuth) {
        setLoginModalOpen(true);
      }
    }
    setChecking(false);
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("portfolio_dev_auth");
      sessionStorage.removeItem("portfolio_dev_pass");
    }
    setIsAuthenticated(false);
    navigate({ to: "/" });
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground font-mono text-xs">
        Loading Dev Mode...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/40 bg-accent/10 text-accent mb-4">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="font-mono text-xl font-bold uppercase tracking-wider text-foreground">
          Protected Developer Console
        </h1>
        <p className="mt-2 max-w-sm text-xs text-muted-foreground">
          Authentication is required to view and edit live database parameters.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: "/" })}
            className="border-border font-mono text-xs cursor-pointer"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Site
          </Button>
          <Button
            size="sm"
            onClick={() => setLoginModalOpen(true)}
            className="bg-accent text-accent-foreground font-mono text-xs cursor-pointer"
          >
            Enter Password
          </Button>
        </div>

        <DevLoginModal
          open={loginModalOpen}
          onOpenChange={(open) => {
            setLoginModalOpen(open);
            if (!open && !isAuthenticated) {
              navigate({ to: "/" });
            }
          }}
          onSuccess={() => setIsAuthenticated(true)}
        />
      </div>
    );
  }

  return (
    <DevDashboard
      initialData={data}
      onClose={() => navigate({ to: "/" })}
      onLogout={handleLogout}
    />
  );
}
