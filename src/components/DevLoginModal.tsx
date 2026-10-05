import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, Terminal, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface DevLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DevLoginModal({ open, onOpenChange, onSuccess }: DevLoginModalProps) {
  const [username, setUsername] = useState("surajit");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter the admin password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_auth",
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("portfolio_dev_auth", "true");
          sessionStorage.setItem("portfolio_dev_pass", password.trim());
        }
        toast.success("Dev Mode Unlocked! Welcome back, Surajit.");
        onOpenChange(false);
        setPassword("");
        onSuccess();
      } else {
        setError(json.error || "Invalid password or credentials.");
      }
    } catch (err) {
      console.error("Login verification error:", err);
      setError("Network or server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border/80 bg-background/95 backdrop-blur-2xl shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2 text-accent">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/30 bg-accent/10">
              <Terminal className="h-5 w-5 text-accent" />
            </div>
            <DialogTitle className="font-mono text-base uppercase tracking-wider text-foreground">
              Developer Mode Authentication
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Enter the admin credentials to access the live Neon Database Control Center.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Username
            </label>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-border bg-foreground/[0.03] font-mono text-sm focus-visible:ring-accent"
              autoComplete="off"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <span className="font-mono text-[10px] text-muted-foreground/60">Protected</span>
            </div>
            <div className="relative">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-border bg-foreground/[0.03] font-mono text-sm focus-visible:ring-accent pr-10"
                autoComplete="current-password"
                autoFocus
              />
              <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground/50" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest hover:bg-accent/90 transition-all duration-300 shadow-lg shadow-accent/20 cursor-pointer"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
                  Verifying...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Unlock Dev Dashboard
                </span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
