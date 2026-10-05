import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Save,
  RotateCcw,
  LogOut,
  X,
  Plus,
  Trash2,
  Database,
  Code,
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Award,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  defaultPortfolioData,
  type PortfolioData,
  type BioData,
  type InternshipItem,
  type ProjectItem,
  type CertItem,
} from "@/lib/portfolio-data";

interface DevDashboardProps {
  initialData?: PortfolioData;
  onClose: () => void;
  onLogout: () => void;
}

export function DevDashboard({ initialData, onClose, onLogout }: DevDashboardProps) {
  const queryClient = useQueryClient();
  const [data, setData] = useState<PortfolioData>(initialData ?? defaultPortfolioData);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [activeTab, setActiveTab] = useState("bio");

  // Raw JSON editor state
  const [rawJsonSection, setRawJsonSection] = useState<string>("all");
  const [rawJsonText, setRawJsonText] = useState<string>("");
  const [rawJsonError, setRawJsonError] = useState<string>("");

  // New skill input state
  const [newSkillText, setNewSkillText] = useState("");

  // Sync with initialData if it updates
  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  // Update raw JSON text when switching raw section or data
  useEffect(() => {
    if (rawJsonSection === "all") {
      setRawJsonText(JSON.stringify(data, null, 2));
    } else if (rawJsonSection === "bio") {
      setRawJsonText(JSON.stringify(data.bio, null, 2));
    } else if (rawJsonSection === "skills") {
      setRawJsonText(JSON.stringify(data.skills, null, 2));
    } else if (rawJsonSection === "internships") {
      setRawJsonText(JSON.stringify(data.internships, null, 2));
    } else if (rawJsonSection === "academic_projects") {
      setRawJsonText(JSON.stringify(data.academicProjects, null, 2));
    } else if (rawJsonSection === "personal_projects") {
      setRawJsonText(JSON.stringify(data.personalProjects, null, 2));
    } else if (rawJsonSection === "certs") {
      setRawJsonText(JSON.stringify(data.certs, null, 2));
    }
    setRawJsonError("");
  }, [rawJsonSection, data]);

  const getPassword = (): string => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("portfolio_dev_pass") || "26122004";
    }
    return "26122004";
  };

  // ─── SAVE TO NEON DB ────────────────────────────────────────────────────────
  const saveAllToNeon = async (updatedData: PortfolioData = data) => {
    setIsSaving(true);
    const toastId = toast.loading("Saving changes to Neon PostgreSQL database...");

    try {
      const password = getPassword();
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_all",
          password,
          data: updatedData,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update Neon DB");
      }

      // Update state and TanStack Query Cache in real-time
      const returnedData = (json.data as PortfolioData) || updatedData;
      setData(returnedData);
      queryClient.setQueryData(["portfolio-data"], returnedData);
      await queryClient.invalidateQueries({ queryKey: ["portfolio-data"] });

      toast.success("Saved to Neon DB in real-time!", { id: toastId });
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to save changes", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const saveSectionToNeon = async (sectionKey: string, sectionData: unknown) => {
    setIsSaving(true);
    const toastId = toast.loading(`Saving ${sectionKey} to Neon DB...`);

    try {
      const password = getPassword();
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_section",
          password,
          section: sectionKey,
          data: sectionData,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update section");
      }

      const returnedData = (json.data as PortfolioData) || data;
      setData(returnedData);
      queryClient.setQueryData(["portfolio-data"], returnedData);
      await queryClient.invalidateQueries({ queryKey: ["portfolio-data"] });

      toast.success(`${sectionKey} updated in Neon DB!`, { id: toastId });
    } catch (err) {
      console.error("Section save error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to save section", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeedDefaults = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset all data to default values in Neon DB? This will overwrite existing customized entries.",
      )
    ) {
      return;
    }

    setIsSeeding(true);
    const toastId = toast.loading("Seeding default portfolio data to Neon DB...");

    try {
      const password = getPassword();
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "seed",
          password,
          data: defaultPortfolioData,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to seed database");
      }

      setData(defaultPortfolioData);
      queryClient.setQueryData(["portfolio-data"], defaultPortfolioData);
      await queryClient.invalidateQueries({ queryKey: ["portfolio-data"] });

      toast.success("Neon DB reset to latest defaults successfully!", { id: toastId });
    } catch (err) {
      console.error("Seed error:", err);
      toast.error(err instanceof Error ? err.message : "Seed failed", { id: toastId });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleDiscard = async () => {
    if (window.confirm("Discard unsaved local changes and reload from Neon DB?")) {
      try {
        const res = await fetch("/api/portfolio");
        const json = await res.json();
        if (json.data) {
          setData(json.data);
          toast.info("Reverted to latest data from Neon DB.");
        }
      } catch {
        toast.error("Failed to refresh data from server.");
      }
    }
  };

  // ─── SECTION EDITORS ────────────────────────────────────────────────────────

  // Bio Updates
  const updateBio = (field: keyof BioData, value: unknown) => {
    setData((prev) => ({
      ...prev,
      bio: { ...prev.bio, [field]: value },
    }));
  };

  const updateEducation = (field: keyof BioData["education"], value: unknown) => {
    setData((prev) => ({
      ...prev,
      bio: {
        ...prev.bio,
        education: { ...prev.bio.education, [field]: value },
      },
    }));
  };

  // Skills
  const addSkill = () => {
    if (!newSkillText.trim()) return;
    const trimmed = newSkillText.trim();
    if (!data.skills.includes(trimmed)) {
      setData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
      setNewSkillText("");
    }
  };

  const removeSkill = (index: number) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // Internships
  const updateInternship = (index: number, field: keyof InternshipItem, value: unknown) => {
    setData((prev) => {
      const updated = [...prev.internships];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, internships: updated };
    });
  };

  const addInternship = () => {
    const newItem: InternshipItem = {
      role: "New Role",
      org: "Organization Name",
      tag: "Tag",
      period: "Month Year – Month Year",
      duration: "3 mos",
      type: "Remote / Onsite",
      logo: "/highradius.png",
      points: ["Key achievement or responsibility."],
    };
    setData((prev) => ({ ...prev, internships: [newItem, ...prev.internships] }));
    toast.info("Added new internship. Edit details below and click Save.");
  };

  const removeInternship = (index: number) => {
    if (window.confirm("Delete this internship entry?")) {
      setData((prev) => ({
        ...prev,
        internships: prev.internships.filter((_, i) => i !== index),
      }));
    }
  };

  const moveInternship = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= data.internships.length) return;
    setData((prev) => {
      const copy = [...prev.internships];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return { ...prev, internships: copy };
    });
  };

  // Projects
  const updateProject = (
    type: "academicProjects" | "personalProjects",
    index: number,
    field: keyof ProjectItem,
    value: unknown,
  ) => {
    setData((prev) => {
      const list = [...prev[type]];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [type]: list };
    });
  };

  const addProject = (type: "academicProjects" | "personalProjects") => {
    const newProj: ProjectItem = {
      title: "New Project Title",
      sub: "Short Subtitle / Tech Spec",
      date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      desc: "Detailed project description.",
      tags: ["Python", "AI", "ML"],
      repo: "https://github.com/Surajit00007/",
      image: "chatbotAgent",
    };
    setData((prev) => ({ ...prev, [type]: [newProj, ...prev[type]] }));
    toast.info(`Added new ${type === "academicProjects" ? "academic" : "personal"} project.`);
  };

  const removeProject = (type: "academicProjects" | "personalProjects", index: number) => {
    if (window.confirm("Delete this project?")) {
      setData((prev) => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index),
      }));
    }
  };

  const moveProject = (
    type: "academicProjects" | "personalProjects",
    index: number,
    direction: "up" | "down",
  ) => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= data[type].length) return;
    setData((prev) => {
      const copy = [...prev[type]];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return { ...prev, [type]: copy };
    });
  };

  // Certificates
  const updateCert = (index: number, field: keyof CertItem, value: unknown) => {
    setData((prev) => {
      const copy = [...prev.certs];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, certs: copy };
    });
  };

  const addCert = () => {
    const newCert: CertItem = {
      title: "Certificate Title",
      issuer: "Issuing Organization",
      date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg",
      points: ["Key topic covered."],
    };
    setData((prev) => ({ ...prev, certs: [newCert, ...prev.certs] }));
    toast.info("Added certificate.");
  };

  const removeCert = (index: number) => {
    if (window.confirm("Delete this certificate?")) {
      setData((prev) => ({
        ...prev,
        certs: prev.certs.filter((_, i) => i !== index),
      }));
    }
  };

  // Apply Raw JSON
  const handleApplyRawJson = () => {
    try {
      setRawJsonError("");
      const parsed = JSON.parse(rawJsonText);

      if (rawJsonSection === "all") {
        setData(parsed as PortfolioData);
        saveAllToNeon(parsed as PortfolioData);
      } else if (rawJsonSection === "bio") {
        setData((prev) => ({ ...prev, bio: parsed }));
        saveSectionToNeon("bio", parsed);
      } else if (rawJsonSection === "skills") {
        setData((prev) => ({ ...prev, skills: parsed }));
        saveSectionToNeon("skills", parsed);
      } else if (rawJsonSection === "internships") {
        setData((prev) => ({ ...prev, internships: parsed }));
        saveSectionToNeon("internships", parsed);
      } else if (rawJsonSection === "academic_projects") {
        setData((prev) => ({ ...prev, academicProjects: parsed }));
        saveSectionToNeon("academic_projects", parsed);
      } else if (rawJsonSection === "personal_projects") {
        setData((prev) => ({ ...prev, personalProjects: parsed }));
        saveSectionToNeon("personal_projects", parsed);
      } else if (rawJsonSection === "certs") {
        setData((prev) => ({ ...prev, certs: parsed }));
        saveSectionToNeon("certs", parsed);
      }
    } catch (err) {
      setRawJsonError(err instanceof Error ? err.message : "Invalid JSON syntax");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl text-foreground overflow-hidden">
      {/* ── Top Bar ── */}
      <header className="flex flex-wrap items-center justify-between border-b border-border/70 px-4 py-3 sm:px-6 bg-card/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/40 bg-accent/15 text-accent shadow-sm shadow-accent/20">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-sm sm:text-base font-bold uppercase tracking-wider text-foreground">
                Neon DB Dev Dashboard
              </h1>
              <Badge
                variant="outline"
                className="border-accent/40 bg-accent/10 font-mono text-[10px] text-accent"
              >
                LIVE
              </Badge>
            </div>
            <p className="hidden sm:block font-mono text-[11px] text-muted-foreground">
              Real-time PostgreSQL schema editor & data sync
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDiscard}
            disabled={isSaving}
            className="border-border font-mono text-xs hover:border-foreground/40 cursor-pointer"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            <span className="hidden sm:inline">Discard</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSeedDefaults}
            disabled={isSeeding || isSaving}
            className="border-border text-xs font-mono hover:text-accent hover:border-accent cursor-pointer"
            title="Reset database to default data"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            <span className="hidden md:inline">Reset Defaults</span>
          </Button>

          <Button
            size="sm"
            onClick={() => saveAllToNeon()}
            disabled={isSaving}
            className="bg-accent text-accent-foreground font-mono text-xs uppercase tracking-wider hover:bg-accent/90 shadow-md shadow-accent/25 cursor-pointer"
          >
            {isSaving ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
                Saving...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Save className="h-3.5 w-3.5" />
                Save All
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-muted-foreground hover:text-destructive font-mono text-xs cursor-pointer"
            title="Log out and lock dev mode"
          >
            <LogOut className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Lock</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer rounded-full h-8 w-8"
            title="Close Dev Mode"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* ── Main Area with Tabs ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="overflow-x-auto pb-1">
              <TabsList className="bg-foreground/[0.04] border border-border/80 p-1 font-mono text-xs">
                <TabsTrigger
                  value="bio"
                  className="gap-1.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  <User className="h-3.5 w-3.5" />
                  Bio & Links
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="gap-1.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  Education
                </TabsTrigger>
                <TabsTrigger
                  value="skills"
                  className="gap-1.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  <Layers className="h-3.5 w-3.5" />
                  Skills ({data.skills.length})
                </TabsTrigger>
                <TabsTrigger
                  value="internships"
                  className="gap-1.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  Internships ({data.internships.length})
                </TabsTrigger>
                <TabsTrigger
                  value="academic_projects"
                  className="gap-1.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  <FolderGit2 className="h-3.5 w-3.5" />
                  Academic ({data.academicProjects.length})
                </TabsTrigger>
                <TabsTrigger
                  value="personal_projects"
                  className="gap-1.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  <FolderGit2 className="h-3.5 w-3.5" />
                  Personal ({data.personalProjects.length})
                </TabsTrigger>
                <TabsTrigger
                  value="certs"
                  className="gap-1.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  <Award className="h-3.5 w-3.5" />
                  Certs ({data.certs.length})
                </TabsTrigger>
                <TabsTrigger
                  value="raw_json"
                  className="gap-1.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  <Code className="h-3.5 w-3.5" />
                  Raw JSON / SQL
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ── TAB 1: BIO & LINKS ── */}
            <TabsContent value="bio" className="space-y-6">
              <Card className="border-border/80 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-mono text-base uppercase tracking-wider text-foreground">
                        Profile & Identity
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Updates your headline, role statement, contact details, and social profiles.
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => saveSectionToNeon("bio", data.bio)}
                      disabled={isSaving}
                      className="bg-accent/90 text-accent-foreground font-mono text-xs cursor-pointer"
                    >
                      Save Bio
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-mono text-xs text-muted-foreground">Full Name</label>
                      <Input
                        value={data.bio.name}
                        onChange={(e) => updateBio("name", e.target.value)}
                        className="bg-foreground/[0.03]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-xs text-muted-foreground">
                        Contact Email
                      </label>
                      <Input
                        value={data.bio.email}
                        onChange={(e) => updateBio("email", e.target.value)}
                        className="bg-foreground/[0.03]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-xs text-muted-foreground">
                      Role / Headline Description
                    </label>
                    <Textarea
                      rows={3}
                      value={data.bio.role}
                      onChange={(e) => updateBio("role", e.target.value)}
                      className="bg-foreground/[0.03] font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-xs text-muted-foreground">
                      Interests Summary
                    </label>
                    <Textarea
                      rows={2}
                      value={data.bio.interests}
                      onChange={(e) => updateBio("interests", e.target.value)}
                      className="bg-foreground/[0.03] font-mono text-xs"
                    />
                  </div>

                  <div className="border-t border-border/60 pt-4">
                    <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
                      Social & Resource Links
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[11px] text-muted-foreground">
                          LinkedIn URL
                        </label>
                        <Input
                          value={data.bio.linkedin}
                          onChange={(e) => updateBio("linkedin", e.target.value)}
                          className="bg-foreground/[0.03]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-mono text-[11px] text-muted-foreground">
                          GitHub URL
                        </label>
                        <Input
                          value={data.bio.github}
                          onChange={(e) => updateBio("github", e.target.value)}
                          className="bg-foreground/[0.03]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-mono text-[11px] text-muted-foreground">
                          Instagram URL
                        </label>
                        <Input
                          value={data.bio.instagram}
                          onChange={(e) => updateBio("instagram", e.target.value)}
                          className="bg-foreground/[0.03]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-mono text-[11px] text-muted-foreground">
                          Portfolio URL
                        </label>
                        <Input
                          value={data.bio.portfolio}
                          onChange={(e) => updateBio("portfolio", e.target.value)}
                          className="bg-foreground/[0.03]"
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="font-mono text-[11px] text-muted-foreground">
                          Resume PDF URL / Path
                        </label>
                        <Input
                          value={data.bio.resume}
                          onChange={(e) => updateBio("resume", e.target.value)}
                          className="bg-foreground/[0.03]"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── TAB 2: EDUCATION ── */}
            <TabsContent value="education" className="space-y-6">
              <Card className="border-border/80 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-mono text-base uppercase tracking-wider text-foreground">
                        Academic Credentials & Education
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Degree, university, graduation timeline, GPA, and coursework.
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => saveSectionToNeon("bio", data.bio)}
                      disabled={isSaving}
                      className="bg-accent/90 text-accent-foreground font-mono text-xs cursor-pointer"
                    >
                      Save Education
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-mono text-xs text-muted-foreground">
                        Degree Program
                      </label>
                      <Input
                        value={data.bio.education.degree}
                        onChange={(e) => updateEducation("degree", e.target.value)}
                        className="bg-foreground/[0.03]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-xs text-muted-foreground">
                        University / Institution
                      </label>
                      <Input
                        value={data.bio.education.school}
                        onChange={(e) => updateEducation("school", e.target.value)}
                        className="bg-foreground/[0.03]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-xs text-muted-foreground">
                        Graduation Year / Status
                      </label>
                      <Input
                        value={data.bio.education.year}
                        onChange={(e) => updateEducation("year", e.target.value)}
                        className="bg-foreground/[0.03]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-mono text-xs text-muted-foreground">GPA Score</label>
                      <Input
                        value={data.bio.education.gpa}
                        onChange={(e) => updateEducation("gpa", e.target.value)}
                        className="bg-foreground/[0.03]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="font-mono text-xs text-muted-foreground">
                      Coursework (comma-separated list)
                    </label>
                    <Textarea
                      rows={3}
                      value={data.bio.education.coursework.join(", ")}
                      onChange={(e) => {
                        const items = e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        updateEducation("coursework", items);
                      }}
                      className="bg-foreground/[0.03] font-mono text-xs"
                      placeholder="DSA in JAVA, Machine Learning, Deep Learning, Algorithm Analysis"
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {data.bio.education.coursework.map((course, idx) => (
                        <Badge key={idx} variant="secondary" className="font-mono text-[10px]">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── TAB 3: SKILLS ── */}
            <TabsContent value="skills" className="space-y-6">
              <Card className="border-border/80 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-mono text-base uppercase tracking-wider text-foreground">
                        Technical Skills Matrix
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Add, remove, or bulk edit the skills highlighted across your portfolio.
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => saveSectionToNeon("skills", data.skills)}
                      disabled={isSaving}
                      className="bg-accent/90 text-accent-foreground font-mono text-xs cursor-pointer"
                    >
                      Save Skills
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Quick Add Form */}
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add new skill (e.g. PyTorch, Kubernetes, LangChain)..."
                      value={newSkillText}
                      onChange={(e) => setNewSkillText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      className="bg-foreground/[0.03] font-mono text-sm max-w-md"
                    />
                    <Button
                      onClick={addSkill}
                      size="sm"
                      className="bg-accent text-accent-foreground cursor-pointer"
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" />
                      Add Skill
                    </Button>
                  </div>

                  {/* Skills Chips */}
                  <div className="rounded-xl border border-border/60 bg-foreground/[0.02] p-4">
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="group inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-foreground/[0.04] px-3 py-1 font-mono text-xs text-foreground transition-colors hover:border-destructive/50"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="rounded-full text-muted-foreground/60 transition-colors group-hover:text-destructive cursor-pointer hover:bg-destructive/10 p-0.5"
                            title="Remove skill"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bulk edit */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs text-muted-foreground">
                      Bulk Edit (comma separated)
                    </label>
                    <Textarea
                      rows={3}
                      value={data.skills.join(", ")}
                      onChange={(e) => {
                        const skills = e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        setData((prev) => ({ ...prev, skills }));
                      }}
                      className="bg-foreground/[0.03] font-mono text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── TAB 4: INTERNSHIPS ── */}
            <TabsContent value="internships" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-mono text-base font-bold uppercase tracking-wider text-foreground">
                    Work Experience & Internships
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Chronological work history displayed in the experience timeline.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={addInternship}
                    size="sm"
                    variant="outline"
                    className="border-border text-xs font-mono cursor-pointer"
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Add Internship
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => saveSectionToNeon("internships", data.internships)}
                    disabled={isSaving}
                    className="bg-accent/90 text-accent-foreground font-mono text-xs cursor-pointer"
                  >
                    Save Internships
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {data.internships.map((internship, index) => (
                  <Card
                    key={index}
                    className="border-border/80 bg-card/60 backdrop-blur-sm relative group"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 font-mono text-xs text-accent font-bold">
                            {index + 1}
                          </span>
                          <CardTitle className="font-mono text-sm uppercase tracking-wider text-foreground">
                            {internship.role || "Untitled Role"} — {internship.org}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={index === 0}
                            onClick={() => moveInternship(index, "up")}
                            className="h-7 w-7 text-muted-foreground cursor-pointer"
                            title="Move Up"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={index === data.internships.length - 1}
                            onClick={() => moveInternship(index, "down")}
                            className="h-7 w-7 text-muted-foreground cursor-pointer"
                            title="Move Down"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeInternship(index)}
                            className="h-7 w-7 text-destructive hover:bg-destructive/10 cursor-pointer"
                            title="Delete Internship"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="font-mono text-[11px] text-muted-foreground">
                            Role Title
                          </label>
                          <Input
                            value={internship.role}
                            onChange={(e) => updateInternship(index, "role", e.target.value)}
                            className="bg-foreground/[0.03] text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[11px] text-muted-foreground">
                            Company / Organization
                          </label>
                          <Input
                            value={internship.org}
                            onChange={(e) => updateInternship(index, "org", e.target.value)}
                            className="bg-foreground/[0.03] text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[11px] text-muted-foreground">
                            Tag / Short Badge
                          </label>
                          <Input
                            value={internship.tag}
                            onChange={(e) => updateInternship(index, "tag", e.target.value)}
                            className="bg-foreground/[0.03] text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[11px] text-muted-foreground">
                            Period
                          </label>
                          <Input
                            value={internship.period}
                            onChange={(e) => updateInternship(index, "period", e.target.value)}
                            className="bg-foreground/[0.03] text-xs"
                            placeholder="Jul 2026 – Sep 2026"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[11px] text-muted-foreground">
                            Duration
                          </label>
                          <Input
                            value={internship.duration}
                            onChange={(e) => updateInternship(index, "duration", e.target.value)}
                            className="bg-foreground/[0.03] text-xs"
                            placeholder="3 mos"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[11px] text-muted-foreground">
                            Type & Location
                          </label>
                          <Input
                            value={internship.type}
                            onChange={(e) => updateInternship(index, "type", e.target.value)}
                            className="bg-foreground/[0.03] text-xs"
                            placeholder="Onsite · Hyderabad"
                          />
                        </div>
                        <div className="space-y-1 md:col-span-3">
                          <label className="font-mono text-[11px] text-muted-foreground">
                            Logo Path / URL
                          </label>
                          <Input
                            value={internship.logo}
                            onChange={(e) => updateInternship(index, "logo", e.target.value)}
                            className="bg-foreground/[0.03] text-xs"
                            placeholder="/highradius.png"
                          />
                        </div>
                      </div>

                      {/* Bullet points */}
                      <div className="space-y-2 border-t border-border/50 pt-3">
                        <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                          Key Achievements / Responsibilities (One per line)
                        </label>
                        <Textarea
                          rows={4}
                          value={internship.points.join("\n")}
                          onChange={(e) => {
                            const points = e.target.value
                              .split("\n")
                              .filter((p) => p.trim() !== "");
                            updateInternship(index, "points", points);
                          }}
                          className="bg-foreground/[0.03] font-mono text-xs"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* ── TAB 5: ACADEMIC PROJECTS ── */}
            <TabsContent value="academic_projects" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-mono text-base font-bold uppercase tracking-wider text-foreground">
                    Academic Research & Coursework Projects
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    ML/DL transformers, price prediction models, research papers, etc.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => addProject("academicProjects")}
                    size="sm"
                    variant="outline"
                    className="border-border text-xs font-mono cursor-pointer"
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Add Academic Project
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => saveSectionToNeon("academic_projects", data.academicProjects)}
                    disabled={isSaving}
                    className="bg-accent/90 text-accent-foreground font-mono text-xs cursor-pointer"
                  >
                    Save Academic Projects
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {data.academicProjects.map((project, index) => (
                  <Card key={index} className="border-border/80 bg-card/60 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 font-mono text-xs text-accent font-bold">
                            {index + 1}
                          </span>
                          <CardTitle className="font-mono text-sm uppercase tracking-wider text-foreground">
                            {project.title}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={index === 0}
                            onClick={() => moveProject("academicProjects", index, "up")}
                            className="h-7 w-7 text-muted-foreground cursor-pointer"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={index === data.academicProjects.length - 1}
                            onClick={() => moveProject("academicProjects", index, "down")}
                            className="h-7 w-7 text-muted-foreground cursor-pointer"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProject("academicProjects", index)}
                            className="h-7 w-7 text-destructive hover:bg-destructive/10 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="font-mono text-[11px] text-muted-foreground">
                            Title
                          </label>
                          <Input
                            value={project.title}
                            onChange={(e) =>
                              updateProject("academicProjects", index, "title", e.target.value)
                            }
                            className="bg-foreground/[0.03] text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[11px] text-muted-foreground">
                            Subtitle / Architecture
                          </label>
                          <Input
                            value={project.sub}
                            onChange={(e) =>
                              updateProject("academicProjects", index, "sub", e.target.value)
                            }
                            className="bg-foreground/[0.03] text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[11px] text-muted-foreground">
                            Date
                          </label>
                          <Input
                            value={project.date}
                            onChange={(e) =>
                              updateProject("academicProjects", index, "date", e.target.value)
                            }
                            className="bg-foreground/[0.03] text-xs"
                          />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="font-mono text-[11px] text-muted-foreground">
                            GitHub Repo URL
                          </label>
                          <Input
                            value={project.repo}
                            onChange={(e) =>
                              updateProject("academicProjects", index, "repo", e.target.value)
                            }
                            className="bg-foreground/[0.03] text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[11px] text-muted-foreground">
                            Image Key / URL
                          </label>
                          <Input
                            value={project.image}
                            onChange={(e) =>
                              updateProject("academicProjects", index, "image", e.target.value)
                            }
                            className="bg-foreground/[0.03] text-xs"
                            placeholder="chatbotAgent / agriForecast / url"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[11px] text-muted-foreground">
                          Description
                        </label>
                        <Textarea
                          rows={3}
                          value={project.desc}
                          onChange={(e) =>
                            updateProject("academicProjects", index, "desc", e.target.value)
                          }
                          className="bg-foreground/[0.03] font-mono text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[11px] text-muted-foreground">
                          Tags (comma-separated)
                        </label>
                        <Input
                          value={project.tags.join(", ")}
                          onChange={(e) => {
                            const tags = e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean);
                            updateProject("academicProjects", index, "tags", tags);
                          }}
                          className="bg-foreground/[0.03] text-xs"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* ── TAB 6: PERSONAL PROJECTS ── */}
            <TabsContent value="personal_projects" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-mono text-base font-bold uppercase tracking-wider text-foreground">
                    Personal & Engineering Builds
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Side projects, tools, hackathon builds, and apps.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => addProject("personalProjects")}
                    size="sm"
                    variant="outline"
                    className="border-border text-xs font-mono cursor-pointer"
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Add Personal Project
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => saveSectionToNeon("personal_projects", data.personalProjects)}
                    disabled={isSaving}
                    className="bg-accent/90 text-accent-foreground font-mono text-xs cursor-pointer"
                  >
                    Save Personal Projects
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {data.personalProjects.map((project, index) => (
                  <Card key={index} className="border-border/80 bg-card/60 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 font-mono text-xs text-accent font-bold">
                            {index + 1}
                          </span>
                          <CardTitle className="font-mono text-sm uppercase tracking-wider text-foreground">
                            {project.title}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={index === 0}
                            onClick={() => moveProject("personalProjects", index, "up")}
                            className="h-7 w-7 text-muted-foreground cursor-pointer"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={index === data.personalProjects.length - 1}
                            onClick={() => moveProject("personalProjects", index, "down")}
                            className="h-7 w-7 text-muted-foreground cursor-pointer"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProject("personalProjects", index)}
                            className="h-7 w-7 text-destructive hover:bg-destructive/10 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="font-mono text-[11px] text-muted-foreground">
                            Title
                          </label>
                          <Input
                            value={project.title}
                            onChange={(e) =>
                              updateProject("personalProjects", index, "title", e.target.value)
                            }
                            className="bg-foreground/[0.03] text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[11px] text-muted-foreground">
                            Subtitle / Architecture
                          </label>
                          <Input
                            value={project.sub}
                            onChange={(e) =>
                              updateProject("personalProjects", index, "sub", e.target.value)
                            }
                            className="bg-foreground/[0.03] text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[11px] text-muted-foreground">
                            Date
                          </label>
                          <Input
                            value={project.date}
                            onChange={(e) =>
                              updateProject("personalProjects", index, "date", e.target.value)
                            }
                            className="bg-foreground/[0.03] text-xs"
                          />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="font-mono text-[11px] text-muted-foreground">
                            GitHub Repo URL
                          </label>
                          <Input
                            value={project.repo}
                            onChange={(e) =>
                              updateProject("personalProjects", index, "repo", e.target.value)
                            }
                            className="bg-foreground/[0.03] text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[11px] text-muted-foreground">
                            Image Key / URL
                          </label>
                          <Input
                            value={project.image}
                            onChange={(e) =>
                              updateProject("personalProjects", index, "image", e.target.value)
                            }
                            className="bg-foreground/[0.03] text-xs"
                            placeholder="localLlm / expenseTracker / smartLight"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[11px] text-muted-foreground">
                          Description
                        </label>
                        <Textarea
                          rows={3}
                          value={project.desc}
                          onChange={(e) =>
                            updateProject("personalProjects", index, "desc", e.target.value)
                          }
                          className="bg-foreground/[0.03] font-mono text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[11px] text-muted-foreground">
                          Tags (comma-separated)
                        </label>
                        <Input
                          value={project.tags.join(", ")}
                          onChange={(e) => {
                            const tags = e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean);
                            updateProject("personalProjects", index, "tags", tags);
                          }}
                          className="bg-foreground/[0.03] text-xs"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* ── TAB 7: CERTIFICATES ── */}
            <TabsContent value="certs" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-mono text-base font-bold uppercase tracking-wider text-foreground">
                    Certifications & Badges
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Cloud credentials, AI specializations, and professional badges.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={addCert}
                    size="sm"
                    variant="outline"
                    className="border-border text-xs font-mono cursor-pointer"
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Add Certificate
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => saveSectionToNeon("certs", data.certs)}
                    disabled={isSaving}
                    className="bg-accent/90 text-accent-foreground font-mono text-xs cursor-pointer"
                  >
                    Save Certs
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {data.certs.map((cert, index) => (
                  <Card key={index} className="border-border/80 bg-card/60 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 font-mono text-xs text-accent font-bold">
                            {index + 1}
                          </span>
                          <CardTitle className="font-mono text-sm uppercase tracking-wider text-foreground">
                            {cert.title} — {cert.issuer}
                          </CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCert(index)}
                          className="h-7 w-7 text-destructive hover:bg-destructive/10 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="font-mono text-[11px] text-muted-foreground">
                            Title
                          </label>
                          <Input
                            value={cert.title}
                            onChange={(e) => updateCert(index, "title", e.target.value)}
                            className="bg-foreground/[0.03] text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[11px] text-muted-foreground">
                            Issuer
                          </label>
                          <Input
                            value={cert.issuer}
                            onChange={(e) => updateCert(index, "issuer", e.target.value)}
                            className="bg-foreground/[0.03] text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-mono text-[11px] text-muted-foreground">
                            Date
                          </label>
                          <Input
                            value={cert.date}
                            onChange={(e) => updateCert(index, "date", e.target.value)}
                            className="bg-foreground/[0.03] text-xs"
                          />
                        </div>
                        <div className="space-y-1 md:col-span-3">
                          <label className="font-mono text-[11px] text-muted-foreground">
                            Logo URL / Icon Path
                          </label>
                          <Input
                            value={cert.logo}
                            onChange={(e) => updateCert(index, "logo", e.target.value)}
                            className="bg-foreground/[0.03] text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[11px] text-muted-foreground">
                          Bullet Points (one per line)
                        </label>
                        <Textarea
                          rows={3}
                          value={cert.points.join("\n")}
                          onChange={(e) => {
                            const points = e.target.value
                              .split("\n")
                              .filter((p) => p.trim() !== "");
                            updateCert(index, "points", points);
                          }}
                          className="bg-foreground/[0.03] font-mono text-xs"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* ── TAB 8: RAW JSON / DIRECT DATABASE ACCESS ── */}
            <TabsContent value="raw_json" className="space-y-6">
              <Card className="border-border/80 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardTitle className="font-mono text-base uppercase tracking-wider text-foreground">
                        Direct Database JSON Editor
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Inspect or push raw JSON structures straight into the Neon Postgres{" "}
                        <code className="font-mono text-accent">portfolio_sections</code> table.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={rawJsonSection}
                        onChange={(e) => setRawJsonSection(e.target.value)}
                        className="rounded-md border border-border bg-card px-2.5 py-1.5 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                      >
                        <option value="all">ALL SECTIONS (Full Database Dump)</option>
                        <option value="bio">bio</option>
                        <option value="skills">skills</option>
                        <option value="internships">internships</option>
                        <option value="academic_projects">academic_projects</option>
                        <option value="personal_projects">personal_projects</option>
                        <option value="certs">certs</option>
                      </select>
                      <Button
                        size="sm"
                        onClick={handleApplyRawJson}
                        disabled={isSaving}
                        className="bg-accent text-accent-foreground font-mono text-xs cursor-pointer shadow-sm shadow-accent/20"
                      >
                        <Save className="mr-1.5 h-3.5 w-3.5" />
                        Push to Neon
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {rawJsonError && (
                    <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{rawJsonError}</span>
                    </div>
                  )}

                  <Textarea
                    rows={18}
                    value={rawJsonText}
                    onChange={(e) => {
                      setRawJsonText(e.target.value);
                      setRawJsonError("");
                    }}
                    className="font-mono text-xs leading-relaxed bg-foreground/[0.02] border-border/80 focus:border-accent"
                    spellCheck={false}
                  />
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span>
                      Target table: <strong className="text-foreground">portfolio_sections</strong>{" "}
                      in Neon
                    </span>
                    <span>Format: Valid JSON Object or Array</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
