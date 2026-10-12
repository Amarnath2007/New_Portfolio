"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Trophy,
  BadgeCheck,
  FolderGit2,
  Eye,
  RotateCcw,
  UploadCloud,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  X,
  Upload,
  FileText,
  ImageIcon,
  ExternalLink,
  Loader2,
  GitCommit,
  Sparkles,
  Save,
  HelpCircle,
  Layout,
  Database,
  Smartphone,
  Brain,
  Terminal,
  Cpu,
  Globe,
  Server,
  Wrench,
  Shield,
  Zap,
  Layers,
  Award,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CertificateModal, { CertificateModalData } from "../CertificateModal";
import {
  PortfolioData,
  SkillCategory,
  Achievement,
  AchievementCategory,
  AchievementEntry,
  FIXED_ACHIEVEMENT_CATEGORIES,
  Certification,
  Project,
  DiffItem,
} from "@/lib/portfolio-data";
import {
  parseGoogleDriveUrl,
  extractGoogleDriveFileId,
  resolveDisplayImageUrl,
} from "@/lib/google-drive";

const AVAILABLE_ICONS = [
  "Code2",
  "Layout",
  "Database",
  "Smartphone",
  "Brain",
  "Sparkles",
  "Terminal",
  "Cpu",
  "Globe",
  "Server",
  "Wrench",
  "Shield",
  "Zap",
  "Layers",
  "Award",
  "Trophy",
];

export default function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState<"skills" | "achievements" | "certifications" | "projects" | "publish">("skills");
  const [data, setData] = useState<PortfolioData | null>(null);
  const [publishedData, setPublishedData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [diffs, setDiffs] = useState<DiffItem[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Modals
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<any>(null);

  const [revertModalOpen, setRevertModalOpen] = useState(false);
  const [reverting, setReverting] = useState(false);

  // Preview Modal for testing certificate viewer
  const [testCertModal, setTestCertModal] = useState<CertificateModalData | null>(null);

  // Item Edit / Add Modals
  const [editingSkillCategory, setEditingSkillCategory] = useState<{ item: SkillCategory; isNew: boolean } | null>(null);
  
  // Achievements State (4 fixed parent categories & their entries)
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>("intercollege");
  const [editingEntry, setEditingEntry] = useState<{
    categoryKey: string;
    categoryTitle: string;
    entry: AchievementEntry;
    isNew: boolean;
  } | null>(null);
  const [editingCategoryOverview, setEditingCategoryOverview] = useState<AchievementCategory | null>(null);

  // Google Drive Verification State for Modals
  const [gdriveVerifyState, setGdriveVerifyState] = useState<{
    loading: boolean;
    accessible: boolean | null;
    fileType?: string;
    thumbnailUrl?: string;
    directImageUrl?: string;
    error?: string;
    hint?: string;
    message?: string;
  }>({ loading: false, accessible: null });

  const [editingCertification, setEditingCertification] = useState<{ item: Certification; isNew: boolean } | null>(null);
  const [editingProject, setEditingProject] = useState<{ item: Project; isNew: boolean } | null>(null);

  // File Upload state
  const [uploadingFile, setUploadingFile] = useState(false);

  // Fetch initial content
  const loadContent = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/content");
      if (!res.ok) throw new Error("Failed to load admin content");
      const json = await res.json();
      setData(json.draft);
      setPublishedData(json.published);
      setHasPendingChanges(json.hasPendingChanges);
      setDiffs(json.diffs || []);
    } catch (err: any) {
      showToast(err.message || "Could not fetch content", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Save draft locally to data/portfolio-draft.json
  const saveDraft = async (updatedData: PortfolioData, silent = false) => {
    try {
      setSaving(true);
      setData(updatedData);

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: updatedData }),
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.error || "Save failed");
      }

      setHasPendingChanges(resJson.hasPendingChanges);
      setDiffs(resJson.diffs || []);
      if (!silent) {
        showToast("Changes saved locally to draft file!", "success");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to save draft", "error");
    } finally {
      setSaving(false);
    }
  };

  // Revert draft to published
  const handleRevert = async () => {
    try {
      setReverting(true);
      const res = await fetch("/api/admin/revert", { method: "POST" });
      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error || "Revert failed");

      setData(resJson.data);
      setHasPendingChanges(false);
      setDiffs([]);
      setRevertModalOpen(false);
      showToast("Draft reverted back to published portfolio content.", "info");
    } catch (err: any) {
      showToast(err.message || "Failed to revert", "error");
    } finally {
      setReverting(false);
    }
  };

  // Publish workflow
  const handlePublish = async () => {
    try {
      setPublishing(true);
      setPublishResult(null);

      const res = await fetch("/api/admin/publish", { method: "POST" });
      const resJson = await res.json();

      if (!res.ok) {
        throw new Error(resJson.error || "Publish failed");
      }

      setPublishResult(resJson);
      setPublishedData(data);
      setHasPendingChanges(false);
      setDiffs([]);
      showToast("Portfolio published successfully!", "success");
    } catch (err: any) {
      setPublishResult({ success: false, error: err.message });
      showToast(err.message || "Publishing encountered an error", "error");
    } finally {
      setPublishing(false);
    }
  };

  // Upload file helper
  const handleFileUpload = async (file: File): Promise<{ url: string; fileName: string } | null> => {
    try {
      setUploadingFile(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.error || "File upload failed");
      }

      showToast(`Uploaded ${resJson.fileName} safely`, "success");
      return { url: resJson.url, fileName: resJson.fileName };
    } catch (err: any) {
      showToast(err.message || "File upload failed", "error");
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  // ==========================================
  // SKILLS ACTIONS
  // ==========================================
  const moveSkillCategory = (index: number, direction: "up" | "down") => {
    if (!data) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= data.skills.length) return;

    const newSkills = [...data.skills];
    const [moved] = newSkills.splice(index, 1);
    newSkills.splice(newIndex, 0, moved);

    // Re-index category numbers (01, 02, ...)
    const renumbered = newSkills.map((cat, i) => ({
      ...cat,
      num: String(i + 1).padStart(2, "0"),
    }));

    saveDraft({ ...data, skills: renumbered });
  };

  const deleteSkillCategory = (id: string) => {
    if (!data) return;
    if (!confirm("Are you sure you want to delete this entire skill category?")) return;
    const filtered = data.skills
      .filter((s) => s.id !== id)
      .map((cat, i) => ({ ...cat, num: String(i + 1).padStart(2, "0") }));
    saveDraft({ ...data, skills: filtered });
  };

  const saveSkillCategory = (cat: SkillCategory, isNew: boolean) => {
    if (!data) return;
    let newSkills = [...data.skills];
    if (isNew) {
      newSkills.push({
        ...cat,
        id: cat.id || `skill-cat-${Date.now()}`,
        num: String(newSkills.length + 1).padStart(2, "0"),
      });
    } else {
      newSkills = newSkills.map((s) => (s.id === cat.id ? cat : s));
    }
    saveDraft({ ...data, skills: newSkills });
    setEditingSkillCategory(null);
  };

  const addSkillToCategory = (catId: string, skillName: string) => {
    if (!data || !skillName.trim()) return;
    const updated = data.skills.map((c) => {
      if (c.id === catId) {
        if (c.skills.includes(skillName.trim())) return c;
        return { ...c, skills: [...c.skills, skillName.trim()] };
      }
      return c;
    });
    saveDraft({ ...data, skills: updated }, true);
  };

  const removeSkillFromCategory = (catId: string, skillIndex: number) => {
    if (!data) return;
    const updated = data.skills.map((c) => {
      if (c.id === catId) {
        const next = [...c.skills];
        next.splice(skillIndex, 1);
        return { ...c, skills: next };
      }
      return c;
    });
    saveDraft({ ...data, skills: updated }, true);
  };

  const moveSkillInsideCategory = (catId: string, index: number, direction: "left" | "right") => {
    if (!data) return;
    const targetCat = data.skills.find((c) => c.id === catId);
    if (!targetCat) return;

    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= targetCat.skills.length) return;

    const nextSkills = [...targetCat.skills];
    const [moved] = nextSkills.splice(index, 1);
    nextSkills.splice(targetIndex, 0, moved);

    const updated = data.skills.map((c) => (c.id === catId ? { ...c, skills: nextSkills } : c));
    saveDraft({ ...data, skills: updated }, true);
  };

  // ==========================================
  // GOOGLE DRIVE LINK VERIFICATION
  // ==========================================
  const verifyGoogleDriveLink = async (url: string) => {
    if (!url || !url.trim()) {
      setGdriveVerifyState({ loading: false, accessible: null });
      return;
    }
    const parsed = parseGoogleDriveUrl(url);
    if (!parsed.isGoogleDrive || !parsed.fileId) {
      setGdriveVerifyState({ loading: false, accessible: null });
      return;
    }

    try {
      setGdriveVerifyState({ loading: true, accessible: null });
      const res = await fetch(`/api/admin/verify-gdrive?url=${encodeURIComponent(url.trim())}`);
      if (res.ok) {
        const json = await res.json();
        setGdriveVerifyState({
          loading: false,
          accessible: json.accessible,
          fileType: json.fileType,
          thumbnailUrl: json.thumbnailUrl,
          directImageUrl: json.directImageUrl,
          error: json.error,
          hint: json.hint,
          message: json.message,
        });
      } else {
        setGdriveVerifyState({
          loading: false,
          accessible: false,
          error: `Verification error (${res.status})`,
          hint: "Make sure 'Anyone with the link' has Viewer access in Google Drive sharing settings.",
        });
      }
    } catch (err: any) {
      setGdriveVerifyState({
        loading: false,
        accessible: true,
        thumbnailUrl: parsed.thumbnailUrl || undefined,
        directImageUrl: parsed.directImageUrl || undefined,
        message: "Google Drive link format valid.",
      });
    }
  };

  // ==========================================
  // ACHIEVEMENTS ACTIONS (4 Fixed Categories & Entries)
  // ==========================================
  const saveCategoryEntry = (categoryKey: string, entry: AchievementEntry, isNew: boolean) => {
    if (!data) return;
    const newAchievements = data.achievements.map((cat) => {
      if (cat.category !== categoryKey && cat.id !== categoryKey) return cat;
      const currentEntries = Array.isArray(cat.entries) ? [...cat.entries] : [];
      let updatedEntries: AchievementEntry[];
      if (isNew) {
        updatedEntries = [...currentEntries, { ...entry, id: entry.id || `entry-${Date.now()}` }];
      } else {
        updatedEntries = currentEntries.map((e) => (e.id === entry.id ? entry : e));
      }
      return { ...cat, entries: updatedEntries };
    });
    saveDraft({ ...data, achievements: newAchievements });
    setEditingEntry(null);
    showToast(`Achievement entry ${isNew ? "added" : "updated"} successfully!`, "success");
  };

  const deleteCategoryEntry = (categoryKey: string, entryId: string) => {
    if (!data) return;
    if (!confirm("Are you sure you want to delete this achievement entry?")) return;
    const newAchievements = data.achievements.map((cat) => {
      if (cat.category !== categoryKey && cat.id !== categoryKey) return cat;
      const currentEntries = Array.isArray(cat.entries) ? cat.entries : [];
      return { ...cat, entries: currentEntries.filter((e) => e.id !== entryId) };
    });
    saveDraft({ ...data, achievements: newAchievements });
    showToast("Achievement entry deleted.", "info");
  };

  const moveCategoryEntry = (categoryKey: string, index: number, direction: "up" | "down") => {
    if (!data) return;
    const newAchievements = data.achievements.map((cat) => {
      if (cat.category !== categoryKey && cat.id !== categoryKey) return cat;
      const currentEntries = Array.isArray(cat.entries) ? [...cat.entries] : [];
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= currentEntries.length) return cat;
      const [moved] = currentEntries.splice(index, 1);
      currentEntries.splice(newIndex, 0, moved);
      return { ...cat, entries: currentEntries };
    });
    saveDraft({ ...data, achievements: newAchievements });
  };

  const saveCategoryOverview = (updatedCat: AchievementCategory) => {
    if (!data) return;
    const newAchievements = data.achievements.map((cat) => {
      if (cat.category === updatedCat.category || cat.id === updatedCat.id) {
        return { ...cat, ...updatedCat, entries: cat.entries || [] };
      }
      return cat;
    });
    saveDraft({ ...data, achievements: newAchievements });
    setEditingCategoryOverview(null);
    showToast("Category overview updated.", "success");
  };

  // ==========================================
  // CERTIFICATIONS ACTIONS
  // ==========================================
  const saveCertification = (item: Certification, isNew: boolean) => {
    if (!data) return;
    let newItems = [...data.certifications];
    if (isNew) {
      newItems.push({ ...item, id: item.id || `cert-${Date.now()}` });
    } else {
      newItems = newItems.map((c) => (c.id === item.id ? item : c));
    }
    saveDraft({ ...data, certifications: newItems });
    setEditingCertification(null);
  };

  const deleteCertification = (id: string) => {
    if (!data) return;
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    const filtered = data.certifications.filter((c) => c.id !== id);
    saveDraft({ ...data, certifications: filtered });
  };

  const moveCertification = (index: number, direction: "up" | "down") => {
    if (!data) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= data.certifications.length) return;
    const newItems = [...data.certifications];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(newIndex, 0, moved);
    saveDraft({ ...data, certifications: newItems });
  };

  // ==========================================
  // PROJECTS ACTIONS
  // ==========================================
  const saveProject = (item: Project, isNew: boolean) => {
    if (!data) return;
    let newItems = [...data.projects];
    if (isNew) {
      newItems.push({
        ...item,
        id: item.id || `proj-${Date.now()}`,
        letter: item.letter || (item.title ? item.title[0].toUpperCase() : "P"),
      });
    } else {
      newItems = newItems.map((p) => (p.id === item.id ? item : p));
    }
    saveDraft({ ...data, projects: newItems });
    setEditingProject(null);
  };

  const deleteProject = (id: string) => {
    if (!data) return;
    if (!confirm("Are you sure you want to delete this project?")) return;
    const filtered = data.projects.filter((p) => p.id !== id);
    saveDraft({ ...data, projects: filtered });
  };

  const moveProject = (index: number, direction: "up" | "down") => {
    if (!data) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= data.projects.length) return;
    const newItems = [...data.projects];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(newIndex, 0, moved);
    saveDraft({ ...data, projects: newItems });
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] text-[#F4F0E8] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 text-[#C7A46A] animate-spin mb-4" />
        <p className="text-[#A7A198] text-sm animate-pulse">Loading local admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F4F0E8] flex flex-col font-sans selection:bg-[#C7A46A]/20 selection:text-[#F4F0E8]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-[1000] px-5 py-3 rounded-xl border backdrop-blur-md shadow-2xl flex items-center gap-3 text-sm font-medium ${
              toast.type === "success"
                ? "bg-[#151517]/95 border-[#C7A46A]/60 text-[#F4F0E8]"
                : toast.type === "error"
                ? "bg-[#251010]/95 border-red-500/50 text-red-200"
                : "bg-[#151517]/95 border-[#302D28] text-[#F4F0E8]"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 size={18} className="text-[#C7A46A] shrink-0" />}
            {toast.type === "error" && <AlertTriangle size={18} className="text-red-400 shrink-0" />}
            {toast.type === "info" && <Sparkles size={18} className="text-[#C7A46A] shrink-0" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#151517]/90 backdrop-blur-md border-b border-[#302D28] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Branding & Status */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <span className="font-heading font-extrabold text-lg sm:text-xl text-[#F4F0E8] tracking-tight">
                Amarnath <span className="text-[#C7A46A]">B</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#C7A46A]/10 text-[#C7A46A] border border-[#C7A46A]/30">
                Local Admin
              </span>
            </div>

            {/* Changes indicator */}
            <div className="flex items-center gap-2 text-xs">
              {hasPendingChanges ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  {diffs.length} Pending Changes
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#202023] text-[#A7A198] border border-[#302D28]">
                  <CheckCircle2 size={12} className="text-[#C7A46A]" />
                  In Sync
                </span>
              )}
            </div>
          </div>

          {/* Right: Actions (Preview, Revert, Publish) */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end overflow-x-auto pb-1 md:pb-0">
            {/* Live Preview Button */}
            <a
              href="/?preview=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#202023] hover:bg-[#28282c] border border-[#302D28] text-xs font-semibold text-[#F4F0E8] hover:text-[#C7A46A] transition-all shrink-0"
              title="Preview pending changes in real website layout"
            >
              <Eye size={14} className="text-[#C7A46A]" />
              Preview Site
              <ExternalLink size={12} className="opacity-60" />
            </a>

            {/* Revert Button */}
            {hasPendingChanges && (
              <button
                type="button"
                onClick={() => setRevertModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#202023] hover:bg-red-950/30 border border-[#302D28] hover:border-red-500/40 text-xs font-semibold text-[#A7A198] hover:text-red-300 transition-all shrink-0"
                title="Discard all pending changes and revert to published version"
              >
                <RotateCcw size={13} />
                Discard
              </button>
            )}

            {/* Publish Button */}
            <button
              type="button"
              onClick={() => setPublishModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C7A46A] hover:bg-[#D8BC8A] text-[#151517] text-xs font-bold transition-all shadow-lg hover:shadow-[#C7A46A]/20 shrink-0"
            >
              <UploadCloud size={15} />
              Publish Live
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-grow">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-[#302D28] mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("skills")}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "skills"
                ? "bg-[#202023] text-[#C7A46A] border border-[#C7A46A]/40 shadow-sm"
                : "text-[#A7A198] hover:text-[#F4F0E8] hover:bg-[#151517]"
            }`}
          >
            <Code2 size={16} />
            Skills ({data.skills.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("achievements")}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "achievements"
                ? "bg-[#202023] text-[#C7A46A] border border-[#C7A46A]/40 shadow-sm"
                : "text-[#A7A198] hover:text-[#F4F0E8] hover:bg-[#151517]"
            }`}
          >
            <Trophy size={16} />
            Achievements ({data.achievements.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("certifications")}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "certifications"
                ? "bg-[#202023] text-[#C7A46A] border border-[#C7A46A]/40 shadow-sm"
                : "text-[#A7A198] hover:text-[#F4F0E8] hover:bg-[#151517]"
            }`}
          >
            <BadgeCheck size={16} />
            Certifications ({data.certifications.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "projects"
                ? "bg-[#202023] text-[#C7A46A] border border-[#C7A46A]/40 shadow-sm"
                : "text-[#A7A198] hover:text-[#F4F0E8] hover:bg-[#151517]"
            }`}
          >
            <FolderGit2 size={16} />
            Projects ({data.projects.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("publish")}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "publish"
                ? "bg-[#202023] text-[#C7A46A] border border-[#C7A46A]/40 shadow-sm"
                : "text-[#A7A198] hover:text-[#F4F0E8] hover:bg-[#151517]"
            }`}
          >
            <GitCommit size={16} />
            Publish & Diff ({diffs.length})
          </button>
        </div>

        {/* ========================================================================= */}
        {/* SECTION A: SKILLS */}
        {/* ========================================================================= */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#F4F0E8]">
                  Skills Management
                </h2>
                <p className="text-xs sm:text-sm text-[#A7A198] mt-1">
                  Manage skill categories, reorder items, and update technical expertise badges.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditingSkillCategory({
                    item: {
                      id: `skill-cat-${Date.now()}`,
                      num: String(data.skills.length + 1).padStart(2, "0"),
                      title: "",
                      icon: "Code2",
                      skills: [],
                    },
                    isNew: true,
                  })
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#202023] hover:bg-[#C7A46A] text-[#F4F0E8] hover:text-[#151517] border border-[#302D28] hover:border-[#C7A46A] text-xs sm:text-sm font-semibold transition-all shadow-md self-start sm:self-auto"
              >
                <Plus size={16} />
                Add Category
              </button>
            </div>

            {/* List of Skill Categories */}
            <div className="space-y-4">
              {data.skills.map((category, catIndex) => {
                return (
                  <div
                    key={category.id}
                    className="bg-[#151517] border border-[#302D28] rounded-2xl p-5 sm:p-6 transition-all hover:border-[#C7A46A]/30 shadow-lg"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#302D28]/70">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold text-[#C7A46A] px-2.5 py-1 rounded-md bg-[#202023] border border-[#302D28]">
                          {category.num}
                        </span>
                        <h3 className="font-heading font-bold text-base sm:text-lg text-[#F4F0E8]">
                          {category.title}
                        </h3>
                        <span className="text-[11px] text-[#A7A198] font-mono">
                          Icon: {category.icon}
                        </span>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => moveSkillCategory(catIndex, "up")}
                          disabled={catIndex === 0}
                          className="p-1.5 rounded-lg bg-[#202023] text-[#A7A198] hover:text-[#C7A46A] border border-[#302D28] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSkillCategory(catIndex, "down")}
                          disabled={catIndex === data.skills.length - 1}
                          className="p-1.5 rounded-lg bg-[#202023] text-[#A7A198] hover:text-[#C7A46A] border border-[#302D28] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingSkillCategory({ item: category, isNew: false })}
                          className="p-1.5 rounded-lg bg-[#202023] text-[#A7A198] hover:text-[#C7A46A] border border-[#302D28] transition-colors ml-2"
                          title="Edit Category Details"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSkillCategory(category.id)}
                          className="p-1.5 rounded-lg bg-[#202023] text-[#A7A198] hover:text-red-400 border border-[#302D28] transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Skill Badges */}
                    <div className="pt-4">
                      <p className="text-xs text-[#A7A198] mb-2.5 font-medium">Skills in this category:</p>
                      <div className="flex flex-wrap gap-2 items-center">
                        {category.skills.map((skill, skillIdx) => (
                          <div
                            key={skill}
                            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202023] border border-[#302D28] text-xs font-medium text-[#F4F0E8] hover:border-[#C7A46A]/50 transition-colors"
                          >
                            <span>{skill}</span>
                            <div className="flex items-center gap-1 ml-1 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => moveSkillInsideCategory(category.id, skillIdx, "left")}
                                disabled={skillIdx === 0}
                                className="hover:text-[#C7A46A] disabled:opacity-20"
                                title="Move left"
                              >
                                <ArrowLeft size={11} />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveSkillInsideCategory(category.id, skillIdx, "right")}
                                disabled={skillIdx === category.skills.length - 1}
                                className="hover:text-[#C7A46A] disabled:opacity-20"
                                title="Move right"
                              >
                                <ArrowRight size={11} />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeSkillFromCategory(category.id, skillIdx)}
                                className="hover:text-red-400 ml-0.5"
                                title="Delete skill"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Inline Quick Add Input */}
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const input = (e.currentTarget.elements.namedItem("newSkill") as HTMLInputElement);
                            if (input && input.value) {
                              addSkillToCategory(category.id, input.value);
                              input.value = "";
                            }
                          }}
                          className="flex items-center gap-1.5"
                        >
                          <input
                            name="newSkill"
                            placeholder="+ Add skill (Enter)"
                            className="px-2.5 py-1.5 rounded-lg bg-[#151517] border border-[#302D28] text-xs text-[#F4F0E8] placeholder:text-[#A7A198]/50 focus:outline-none focus:border-[#C7A46A] w-36"
                          />
                        </form>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION B: ACHIEVEMENTS (4 FIXED CATEGORIES ONLY) */}
        {/* ========================================================================= */}
        {activeTab === "achievements" && (() => {
          // Find the active category object
          const currentCategory =
            data.achievements.find(
              (c) => c.category === activeCategoryKey || c.id === activeCategoryKey
            ) || data.achievements[0];

          const categoryEntries = Array.isArray(currentCategory?.entries)
            ? currentCategory.entries
            : [];

          return (
            <div className="space-y-6">
              {/* Header Title & Intro */}
              <div className="pb-2">
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#F4F0E8]">
                  Achievements Architecture
                </h2>
                <p className="text-xs sm:text-sm text-[#A7A198] mt-1">
                  Manage individual competitions, awards, and certificates inside your four fixed portfolio categories.
                </p>
              </div>

              {/* Four Fixed Categories Selector Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {data.achievements.map((cat) => {
                  const isSelected =
                    (cat.category || cat.id) === (currentCategory?.category || currentCategory?.id);
                  const entryCount = Array.isArray(cat.entries) ? cat.entries.length : 0;
                  const IconComponent =
                    cat.category === "intercollege"
                      ? Trophy
                      : cat.category === "hackathon"
                      ? Zap
                      : Award;

                  return (
                    <button
                      key={cat.id || cat.category}
                      type="button"
                      onClick={() => setActiveCategoryKey(cat.category || cat.id)}
                      className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#202023] border-[#C7A46A] shadow-lg shadow-[#C7A46A]/10"
                          : "bg-[#151517] border-[#302D28] hover:border-[#C7A46A]/40 text-[#A7A198]"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center p-2 border ${
                            isSelected
                              ? "bg-[#C7A46A]/15 border-[#C7A46A]/40 text-[#C7A46A]"
                              : "bg-[#202023] border-[#302D28] text-[#A7A198]"
                          }`}
                        >
                          <IconComponent size={18} />
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                            isSelected
                              ? "bg-[#C7A46A] text-[#151517] border-[#C7A46A]"
                              : "bg-[#202023] text-[#A7A198] border-[#302D28]"
                          }`}
                        >
                          {entryCount} {entryCount === 1 ? "Entry" : "Entries"}
                        </span>
                      </div>
                      <div>
                        <h3
                          className={`font-heading font-bold text-sm sm:text-base ${
                            isSelected ? "text-[#F4F0E8]" : "text-[#F4F0E8]/80"
                          }`}
                        >
                          {cat.title}
                        </h3>
                        <p className="text-[11px] text-[#A7A198]/70 mt-0.5 truncate">
                          {cat.event_name || cat.position_award || "Category"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Category Header & Action Banner */}
              {currentCategory && (
                <div className="bg-[#151517] border border-[#302D28] rounded-2xl p-5 sm:p-6 shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#302D28]">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#C7A46A] uppercase tracking-wider mb-1">
                        <span>Category</span>
                        <span>•</span>
                        <span>{currentCategory.position_award || "4 Fixed Categories"}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#F4F0E8]">
                        {currentCategory.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#A7A198] mt-1 max-w-2xl">
                        {currentCategory.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingCategoryOverview(currentCategory)}
                        className="px-3.5 py-2.5 rounded-xl bg-[#202023] hover:bg-[#28282c] border border-[#302D28] hover:border-[#C7A46A]/50 text-[#A7A198] hover:text-[#F4F0E8] text-xs font-semibold transition-all flex items-center gap-2"
                        title="Edit Category Overview text & badge"
                      >
                        <Edit2 size={13} />
                        <span>Edit Overview</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setGdriveVerifyState({ loading: false, accessible: null });
                          setEditingEntry({
                            categoryKey: currentCategory.category || currentCategory.id,
                            categoryTitle: currentCategory.title,
                            entry: {
                              id: `entry-${Date.now()}`,
                              title: "",
                              event_name: "",
                              position_award: "",
                              date: "",
                              description: "",
                              certificate_url: "",
                              image: "",
                            },
                            isNew: true,
                          });
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D8BC8A] text-[#151517] text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95"
                      >
                        <Plus size={16} />
                        <span>Add Entry</span>
                      </button>
                    </div>
                  </div>

                  {/* Entries Grid inside this category */}
                  <div className="pt-6">
                    {categoryEntries.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {categoryEntries.map((entry, index) => {
                          const certUrl = entry.certificate_url || entry.proof_document || entry.image;
                          const gdrive = certUrl ? parseGoogleDriveUrl(certUrl) : null;
                          const thumbUrl = entry.image
                            ? resolveDisplayImageUrl(entry.image)
                            : gdrive?.isGoogleDrive
                            ? gdrive.thumbnailUrl || gdrive.directImageUrl
                            : null;

                          return (
                            <div
                              key={entry.id || index}
                              className="bg-[#202023] border border-[#302D28] rounded-2xl p-5 flex flex-col justify-between hover:border-[#C7A46A]/40 transition-all shadow-lg group"
                            >
                              <div>
                                {/* Card Header: Award Badge and Date */}
                                <div className="flex items-start justify-between gap-2 mb-3">
                                  <div className="w-8 h-8 rounded-lg bg-[#151517] border border-[#302D28] text-[#C7A46A] flex items-center justify-center p-1.5 shrink-0">
                                    <Award size={16} />
                                  </div>
                                  {entry.position_award && (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-[#C7A46A]/30 bg-[#C7A46A]/10 text-[#C7A46A] truncate max-w-[180px]">
                                      {entry.position_award}
                                    </span>
                                  )}
                                </div>

                                <h4 className="font-heading font-bold text-sm sm:text-base text-[#F4F0E8] mb-1 leading-snug">
                                  {entry.title}
                                </h4>
                                {entry.event_name && (
                                  <p className="text-xs font-semibold text-[#C7A46A] mb-1">
                                    {entry.event_name}
                                  </p>
                                )}
                                {entry.date && (
                                  <div className="flex items-center gap-1 text-[11px] text-[#A7A198]/70 mb-3">
                                    <Calendar size={11} />
                                    <span>{entry.date}</span>
                                  </div>
                                )}

                                {/* Thumbnail Preview */}
                                {thumbUrl ? (
                                  <div className="relative h-32 w-full mb-3 rounded-xl overflow-hidden bg-[#151517] border border-[#302D28] group/img">
                                    <img
                                      src={thumbUrl}
                                      alt={entry.title}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                    />
                                    {certUrl && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setTestCertModal({
                                            title: entry.title,
                                            issuer: currentCategory.title,
                                            description: entry.description,
                                            file_url: certUrl,
                                          })
                                        }
                                        className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-[#F4F0E8] font-semibold"
                                      >
                                        <Eye size={14} />
                                        <span>Test in Viewer</span>
                                      </button>
                                    )}
                                  </div>
                                ) : certUrl ? (
                                  <div className="p-2.5 mb-3 rounded-xl bg-[#151517] border border-[#302D28] flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 text-xs text-[#A7A198] truncate">
                                      <FileText size={14} className="text-[#C7A46A] shrink-0" />
                                      <span className="truncate">{certUrl}</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setTestCertModal({
                                          title: entry.title,
                                          issuer: currentCategory.title,
                                          description: entry.description,
                                          file_url: certUrl,
                                        })
                                      }
                                      className="text-[11px] text-[#C7A46A] hover:underline font-semibold shrink-0"
                                    >
                                      Test
                                    </button>
                                  </div>
                                ) : null}

                                <p className="text-[#A7A198] text-xs leading-relaxed line-clamp-3 mb-4">
                                  {entry.description}
                                </p>
                              </div>

                              {/* Actions Bottom Bar */}
                              <div className="pt-3 border-t border-[#302D28] flex items-center justify-between gap-2 mt-auto">
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      moveCategoryEntry(
                                        currentCategory.category || currentCategory.id,
                                        index,
                                        "up"
                                      )
                                    }
                                    disabled={index === 0}
                                    className="p-1.5 rounded-lg bg-[#151517] text-[#A7A198] hover:text-[#C7A46A] border border-[#302D28] disabled:opacity-30 disabled:pointer-events-none"
                                    title="Move Up"
                                  >
                                    <ArrowUp size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      moveCategoryEntry(
                                        currentCategory.category || currentCategory.id,
                                        index,
                                        "down"
                                      )
                                    }
                                    disabled={index === categoryEntries.length - 1}
                                    className="p-1.5 rounded-lg bg-[#151517] text-[#A7A198] hover:text-[#C7A46A] border border-[#302D28] disabled:opacity-30 disabled:pointer-events-none"
                                    title="Move Down"
                                  >
                                    <ArrowDown size={13} />
                                  </button>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setGdriveVerifyState({ loading: false, accessible: null });
                                      if (certUrl) verifyGoogleDriveLink(certUrl);
                                      setEditingEntry({
                                        categoryKey: currentCategory.category || currentCategory.id,
                                        categoryTitle: currentCategory.title,
                                        entry,
                                        isNew: false,
                                      });
                                    }}
                                    className="p-1.5 rounded-lg bg-[#151517] text-[#A7A198] hover:text-[#C7A46A] border border-[#302D28] transition-colors"
                                    title="Edit Entry"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteCategoryEntry(
                                        currentCategory.category || currentCategory.id,
                                        entry.id
                                      )
                                    }
                                    className="p-1.5 rounded-lg bg-[#151517] text-[#A7A198] hover:text-red-400 border border-[#302D28] transition-colors"
                                    title="Delete Entry"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-14 px-4 bg-[#202023] rounded-2xl border border-dashed border-[#302D28]">
                        <Trophy size={36} className="mx-auto mb-3 text-[#C7A46A] opacity-40" />
                        <h4 className="font-heading font-bold text-sm sm:text-base text-[#F4F0E8] mb-1">
                          No Entries in {currentCategory.title}
                        </h4>
                        <p className="text-xs text-[#A7A198] max-w-md mx-auto mb-5 leading-relaxed">
                          Add individual competitions, hackathons, and certifications inside this category without creating extra cards on your homepage.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setGdriveVerifyState({ loading: false, accessible: null });
                            setEditingEntry({
                              categoryKey: currentCategory.category || currentCategory.id,
                              categoryTitle: currentCategory.title,
                              entry: {
                                id: `entry-${Date.now()}`,
                                title: "",
                                event_name: "",
                                position_award: "",
                                date: "",
                                description: "",
                                certificate_url: "",
                                image: "",
                              },
                              isNew: true,
                            });
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D8BC8A] text-[#151517] text-xs font-bold transition-all shadow-md"
                        >
                          <Plus size={15} />
                          <span>Add First Entry</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ========================================================================= */}
        {/* SECTION C: CERTIFICATIONS */}
        {/* ========================================================================= */}
        {activeTab === "certifications" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#F4F0E8]">
                  Certifications Management
                </h2>
                <p className="text-xs sm:text-sm text-[#A7A198] mt-1">
                  Add, edit, upload PDF/image certificates, and test them with your custom certificate lightbox.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditingCertification({
                    item: {
                      id: `cert-${Date.now()}`,
                      title: "",
                      issuer: "",
                      description: "",
                      issue_date: new Date().getFullYear().toString(),
                      file_url: "",
                      original_link: "",
                    },
                    isNew: true,
                  })
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#202023] hover:bg-[#C7A46A] text-[#F4F0E8] hover:text-[#151517] border border-[#302D28] hover:border-[#C7A46A] text-xs sm:text-sm font-semibold transition-all shadow-md self-start sm:self-auto"
              >
                <Plus size={16} />
                Add Certificate
              </button>
            </div>

            {/* Certifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.certifications.map((cert, index) => (
                <div
                  key={cert.id}
                  className="bg-[#151517] border border-[#302D28] rounded-2xl p-6 flex flex-col justify-between hover:border-[#C7A46A]/40 transition-all shadow-xl group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#202023] border border-[#302D28] text-[#C7A46A] flex items-center justify-center p-2.5 mb-4">
                      <BadgeCheck size={20} />
                    </div>

                    <h3 className="font-heading font-bold text-base sm:text-lg text-[#F4F0E8] mb-1">
                      {cert.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#C7A46A] mb-1">
                      {cert.issuer}
                    </p>
                    {cert.issue_date && (
                      <p className="text-[11px] text-[#A7A198]/70 mb-3">
                        Issued: {cert.issue_date}
                      </p>
                    )}

                    <p className="text-[#A7A198] text-xs leading-relaxed line-clamp-3 mb-4">
                      {cert.description}
                    </p>

                    {/* Test Certificate Lightbox Viewer */}
                    {cert.file_url ? (
                      <button
                        type="button"
                        onClick={() =>
                          setTestCertModal({
                            title: cert.title,
                            issuer: cert.issuer,
                            description: cert.description,
                            file_url: cert.file_url,
                          })
                        }
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#202023] hover:bg-[#C7A46A]/15 text-[#F4F0E8] hover:text-[#C7A46A] border border-[#302D28] hover:border-[#C7A46A]/50 text-xs font-semibold transition-all mb-4"
                      >
                        <Eye size={13} />
                        Test in Custom Viewer
                      </button>
                    ) : (
                      <span className="block text-center text-[11px] text-[#A7A198]/60 italic mb-4">
                        No file or URL attached
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#302D28] flex items-center justify-between gap-2 mt-auto">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveCertification(index, "up")}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg bg-[#202023] text-[#A7A198] hover:text-[#C7A46A] border border-[#302D28] disabled:opacity-30 disabled:pointer-events-none"
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCertification(index, "down")}
                        disabled={index === data.certifications.length - 1}
                        className="p-1.5 rounded-lg bg-[#202023] text-[#A7A198] hover:text-[#C7A46A] border border-[#302D28] disabled:opacity-30 disabled:pointer-events-none"
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingCertification({ item: cert, isNew: false })}
                        className="p-1.5 rounded-lg bg-[#202023] text-[#A7A198] hover:text-[#C7A46A] border border-[#302D28] transition-colors"
                        title="Edit Certificate"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCertification(cert.id)}
                        className="p-1.5 rounded-lg bg-[#202023] text-[#A7A198] hover:text-red-400 border border-[#302D28] transition-colors"
                        title="Delete Certificate"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION D: PROJECTS */}
        {/* ========================================================================= */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#F4F0E8]">
                  Projects Management
                </h2>
                <p className="text-xs sm:text-sm text-[#A7A198] mt-1">
                  Manage portfolio projects, tech stacks, links, highlight bullets, and top project badges.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditingProject({
                    item: {
                      id: `proj-${Date.now()}`,
                      title: "",
                      subtitle: "Personal · 2026",
                      letter: "P",
                      description: "",
                      highlights: [],
                      tags: [],
                      topProject: false,
                      contactSource: false,
                      github: "",
                      demo: "",
                      download: "",
                      image: "",
                    },
                    isNew: true,
                  })
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#202023] hover:bg-[#C7A46A] text-[#F4F0E8] hover:text-[#151517] border border-[#302D28] hover:border-[#C7A46A] text-xs sm:text-sm font-semibold transition-all shadow-md self-start sm:self-auto"
              >
                <Plus size={16} />
                Add Project
              </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.projects.map((proj, index) => (
                <div
                  key={proj.id}
                  className="bg-[#151517] border border-[#302D28] rounded-2xl p-6 flex flex-col justify-between hover:border-[#C7A46A]/40 transition-all shadow-xl group"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#202023] border border-[#302D28] text-[#C7A46A] font-bold font-heading flex items-center justify-center text-lg">
                        {proj.letter || (proj.title ? proj.title[0] : "P")}
                      </div>
                      {proj.topProject && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-[#C7A46A]/40 bg-[#C7A46A]/15 text-[#C7A46A]">
                          Top Project
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading font-bold text-base sm:text-lg text-[#F4F0E8] mb-1">
                      {proj.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#C7A46A] mb-2">
                      {proj.subtitle}
                    </p>

                    {/* Image if available */}
                    {proj.image && (
                      <div className="relative h-28 w-full mb-3 rounded-xl overflow-hidden bg-[#202023] border border-[#302D28]">
                        <Image src={proj.image} alt={proj.title} fill className="object-cover" />
                      </div>
                    )}

                    <p className="text-[#A7A198] text-xs leading-relaxed line-clamp-2 mb-3">
                      {proj.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {proj.tags?.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#202023] text-[#A7A198] border border-[#302D28]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#302D28] flex items-center justify-between gap-2 mt-auto">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveProject(index, "up")}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg bg-[#202023] text-[#A7A198] hover:text-[#C7A46A] border border-[#302D28] disabled:opacity-30 disabled:pointer-events-none"
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveProject(index, "down")}
                        disabled={index === data.projects.length - 1}
                        className="p-1.5 rounded-lg bg-[#202023] text-[#A7A198] hover:text-[#C7A46A] border border-[#302D28] disabled:opacity-30 disabled:pointer-events-none"
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingProject({ item: proj, isNew: false })}
                        className="p-1.5 rounded-lg bg-[#202023] text-[#A7A198] hover:text-[#C7A46A] border border-[#302D28] transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProject(proj.id)}
                        className="p-1.5 rounded-lg bg-[#202023] text-[#A7A198] hover:text-red-400 border border-[#302D28] transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION E: PUBLISH & DIFF SUMMARY */}
        {/* ========================================================================= */}
        {activeTab === "publish" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#F4F0E8]">
                  Publish Status & Change Summary
                </h2>
                <p className="text-xs sm:text-sm text-[#A7A198] mt-1">
                  Inspect exact additions, modifications, and deletions between your local draft and published portfolio.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {hasPendingChanges && (
                  <button
                    type="button"
                    onClick={() => setRevertModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#202023] hover:bg-red-950/30 text-xs sm:text-sm font-semibold text-[#A7A198] hover:text-red-300 border border-[#302D28] transition-all"
                  >
                    Discard Changes
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPublishModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D8BC8A] text-[#151517] text-xs sm:text-sm font-bold transition-all shadow-lg hover:shadow-[#C7A46A]/20"
                >
                  Publish Now
                </button>
              </div>
            </div>

            {/* Diff Cards */}
            {diffs.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#151517] border border-[#302D28] text-center">
                <CheckCircle2 size={40} className="text-[#C7A46A] mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#F4F0E8] font-heading mb-1">
                  Everything is Published and in Sync!
                </h3>
                <p className="text-xs sm:text-sm text-[#A7A198] max-w-md mx-auto">
                  Your local draft matches the published portfolio repository. Any edits you make in the Skills, Achievements, Certifications, or Projects tabs will show up here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {diffs.map((diff, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#151517] border border-[#302D28] flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          diff.action === "added"
                            ? "bg-green-500/10 text-green-400 border border-green-500/30"
                            : diff.action === "modified"
                            ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                            : "bg-red-500/10 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {diff.action}
                      </span>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-[#F4F0E8]">
                          <span className="text-[#C7A46A] capitalize mr-1">[{diff.section}]</span>
                          {diff.identifier}
                        </p>
                        <p className="text-xs text-[#A7A198] mt-0.5">{diff.details}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* PUBLISH CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {publishModalOpen && (
          <div
            className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-[#0B0B0C]/90 backdrop-blur-md"
            onClick={() => !publishing && setPublishModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#151517] border border-[#302D28] rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => !publishing && setPublishModalOpen(false)}
                className="absolute top-5 right-5 text-[#A7A198] hover:text-[#F4F0E8]"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#C7A46A]/15 border border-[#C7A46A]/30 text-[#C7A46A] flex items-center justify-center">
                  <UploadCloud size={24} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-[#F4F0E8]">
                    Publish to Live Portfolio
                  </h3>
                  <p className="text-xs text-[#A7A198]">
                    Local Edit → Validate → Live Vercel Deployment
                  </p>
                </div>
              </div>

              {publishResult ? (
                <div className="space-y-4 py-2">
                  <div
                    className={`p-4 rounded-xl border ${
                      publishResult.success
                        ? "bg-green-500/10 border-green-500/30 text-green-200"
                        : "bg-red-500/10 border-red-500/30 text-red-200"
                    }`}
                  >
                    <p className="text-sm font-semibold">{publishResult.message || publishResult.error}</p>
                    {publishResult.gitInstruction && (
                      <div className="mt-2 text-xs font-mono bg-[#0B0B0C] p-2 rounded border border-[#302D28]">
                        Manual step: {publishResult.gitInstruction}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPublishResult(null);
                      setPublishModalOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#202023] hover:bg-[#C7A46A] text-[#F4F0E8] hover:text-[#151517] text-xs sm:text-sm font-semibold transition-all"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-[#A7A198] leading-relaxed">
                    This action validates your pending local draft changes, commits them to the project repository, and triggers an automated deployment to your live Vercel site.
                  </p>

                  <div className="p-3.5 rounded-xl bg-[#202023] border border-[#302D28] text-xs">
                    <span className="text-[#C7A46A] font-semibold">Changes summary: </span>
                    <span className="text-[#F4F0E8]">
                      {diffs.length > 0 ? `${diffs.length} item(s) pending publish` : "No modifications detected (will sync repository)"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="button"
                      disabled={publishing}
                      onClick={() => setPublishModalOpen(false)}
                      className="w-1/2 py-2.5 rounded-xl bg-[#202023] border border-[#302D28] text-[#A7A198] hover:text-[#F4F0E8] text-xs sm:text-sm font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={publishing}
                      onClick={handlePublish}
                      className="w-1/2 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D8BC8A] text-[#151517] text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      {publishing ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        "Confirm & Publish"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* REVERT CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {revertModalOpen && (
          <div
            className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-[#0B0B0C]/90 backdrop-blur-md"
            onClick={() => !reverting && setRevertModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#151517] border border-[#302D28] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
            >
              <h3 className="font-heading font-bold text-lg text-[#F4F0E8] mb-2">
                Discard Local Draft Changes?
              </h3>
              <p className="text-xs sm:text-sm text-[#A7A198] leading-relaxed mb-6">
                Are you sure you want to discard your saved local changes? This will restore your draft back to the currently published content. This cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={reverting}
                  onClick={() => setRevertModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-[#202023] border border-[#302D28] text-[#A7A198] text-xs font-semibold"
                >
                  Keep Changes
                </button>
                <button
                  type="button"
                  disabled={reverting}
                  onClick={handleRevert}
                  className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all"
                >
                  {reverting ? "Discarding..." : "Yes, Discard"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* EDIT SKILL CATEGORY MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {editingSkillCategory && (
          <div
            className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-[#0B0B0C]/90 backdrop-blur-md"
            onClick={() => setEditingSkillCategory(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#151517] border border-[#302D28] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
            >
              <h3 className="font-heading font-bold text-lg text-[#F4F0E8] mb-4">
                {editingSkillCategory.isNew ? "Add Skill Category" : "Edit Skill Category"}
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const title = (form.elements.namedItem("title") as HTMLInputElement).value;
                  const icon = (form.elements.namedItem("icon") as HTMLSelectElement).value;
                  saveSkillCategory(
                    {
                      ...editingSkillCategory.item,
                      title,
                      icon,
                    },
                    editingSkillCategory.isNew
                  );
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-[#A7A198] mb-1.5">
                    Category Title
                  </label>
                  <input
                    name="title"
                    defaultValue={editingSkillCategory.item.title}
                    required
                    placeholder="e.g. Programming, Cloud & DevOps"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#202023] border border-[#302D28] text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A7A198] mb-1.5">
                    Icon
                  </label>
                  <select
                    name="icon"
                    defaultValue={editingSkillCategory.item.icon || "Code2"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#202023] border border-[#302D28] text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingSkillCategory(null)}
                    className="w-1/2 py-2.5 rounded-xl bg-[#202023] border border-[#302D28] text-[#A7A198] text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D8BC8A] text-[#151517] text-xs font-bold transition-all shadow-md"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* EDIT ACHIEVEMENT MODAL */}
      {/* ========================================================================= */}
      {/* EDIT / ADD ACHIEVEMENT ENTRY MODAL (INSIDE FIXED CATEGORY) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {editingEntry && (
          <div
            className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-[#0B0B0C]/90 backdrop-blur-md overflow-y-auto"
            onClick={() => setEditingEntry(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#151517] border border-[#302D28] rounded-2xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative my-8"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[11px] font-bold text-[#C7A46A] uppercase tracking-wider">
                    {editingEntry.categoryTitle}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-[#F4F0E8] mt-0.5">
                    {editingEntry.isNew ? "Add Achievement Entry" : "Edit Achievement Entry"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="p-1.5 rounded-lg bg-[#202023] text-[#A7A198] hover:text-[#C7A46A] border border-[#302D28]"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = e.currentTarget;
                  const item: AchievementEntry = {
                    ...editingEntry.entry,
                    title: (f.elements.namedItem("title") as HTMLInputElement).value,
                    event_name: (f.elements.namedItem("event_name") as HTMLInputElement).value,
                    position_award: (f.elements.namedItem("position_award") as HTMLInputElement).value,
                    date: (f.elements.namedItem("date") as HTMLInputElement).value,
                    description: (f.elements.namedItem("description") as HTMLTextAreaElement).value,
                    certificate_url: (f.elements.namedItem("certificate_url") as HTMLInputElement).value,
                    image: (f.elements.namedItem("image") as HTMLInputElement).value,
                  };
                  saveCategoryEntry(editingEntry.categoryKey, item, editingEntry.isNew);
                }}
                className="space-y-4"
              >
                {/* Competition / Event Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#A7A198] mb-1">
                    Competition or Event Name *
                  </label>
                  <input
                    name="title"
                    defaultValue={editingEntry.entry.title}
                    required
                    placeholder="e.g. Web Debugging & Coding Contest, Smart India Hackathon"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#202023] border border-[#302D28] text-xs sm:text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>

                {/* Event Host / Organizer & Position/Award */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#A7A198] mb-1">
                      Organizer / Host College (Optional)
                    </label>
                    <input
                      name="event_name"
                      defaultValue={editingEntry.entry.event_name}
                      placeholder="e.g. PSG CAS, IIT Madras, Dept. Symposium"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#202023] border border-[#302D28] text-xs sm:text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#A7A198] mb-1">
                      Position, Prize, or Award
                    </label>
                    <input
                      name="position_award"
                      defaultValue={editingEntry.entry.position_award}
                      placeholder="e.g. 🏆 1st Prize, Winner, Finalist"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#202023] border border-[#302D28] text-xs sm:text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-[#A7A198] mb-1">
                    Date
                  </label>
                  <input
                    name="date"
                    defaultValue={editingEntry.entry.date}
                    placeholder="e.g. Feb 2025, 2024 - 2026"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#202023] border border-[#302D28] text-xs sm:text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-[#A7A198] mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingEntry.entry.description}
                    required
                    rows={3}
                    placeholder="Describe the challenge solved, competition scale, or key performance highlight..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#202023] border border-[#302D28] text-xs sm:text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>

                {/* Certificate / Google Drive Link */}
                <div className="bg-[#202023] p-4 rounded-xl border border-[#302D28] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#F4F0E8]">
                      Certificate / Proof (Google Drive Sharing Link or Upload)
                    </label>
                    <span className="text-[10px] text-[#C7A46A] font-semibold">
                      Google Drive Supported
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        id="entry-cert-url"
                        name="certificate_url"
                        defaultValue={editingEntry.entry.certificate_url || editingEntry.entry.proof_document}
                        placeholder="Paste Google Drive sharing link (e.g. https://drive.google.com/file/d/...)"
                        onChange={(e) => verifyGoogleDriveLink(e.target.value)}
                        onBlur={(e) => verifyGoogleDriveLink(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#151517] border border-[#302D28] text-xs text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const val = (document.getElementById("entry-cert-url") as HTMLInputElement)?.value;
                          verifyGoogleDriveLink(val);
                        }}
                        className="px-3 py-2 rounded-xl bg-[#151517] border border-[#302D28] hover:border-[#C7A46A] text-xs font-semibold text-[#F4F0E8] shrink-0"
                      >
                        Verify
                      </button>
                    </div>

                    {/* Hidden Image input */}
                    <input
                      type="hidden"
                      id="entry-image-url"
                      name="image"
                      defaultValue={editingEntry.entry.image}
                    />

                    {/* Direct File Upload button as alternative */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="file"
                        id="entry-file-upload"
                        className="hidden"
                        accept="image/*,application/pdf"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const res = await handleFileUpload(file);
                            if (res) {
                              const input = document.getElementById("entry-cert-url") as HTMLInputElement;
                              if (input) input.value = res.url;
                              const imgInput = document.getElementById("entry-image-url") as HTMLInputElement;
                              if (imgInput && file.type.startsWith("image/")) imgInput.value = res.url;
                              verifyGoogleDriveLink(res.url);
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        disabled={uploadingFile}
                        onClick={() => document.getElementById("entry-file-upload")?.click()}
                        className="px-3 py-1.5 rounded-lg bg-[#151517] hover:bg-[#28282c] border border-[#302D28] text-[11px] font-semibold text-[#A7A198] hover:text-[#F4F0E8] flex items-center gap-1.5"
                      >
                        {uploadingFile ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                        <span>Or upload file directly from PC</span>
                      </button>
                    </div>

                    {/* Verification / Preview Box */}
                    {gdriveVerifyState.loading && (
                      <div className="flex items-center gap-2 text-xs text-[#C7A46A] p-2.5 rounded-lg bg-[#151517]">
                        <Loader2 size={14} className="animate-spin" />
                        <span>Verifying Google Drive link accessibility...</span>
                      </div>
                    )}

                    {/* Restricted Warning */}
                    {gdriveVerifyState.accessible === false && (
                      <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-600/40 text-amber-200 text-xs space-y-1">
                        <div className="flex items-center gap-2 font-bold text-amber-400">
                          <AlertTriangle size={15} />
                          <span>Google Drive Sharing Permission Required</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          {gdriveVerifyState.hint ||
                            "This link is private or restricted. In Google Drive, click 'Share' on this file, change 'General access' from 'Restricted' to 'Anyone with the link' (Viewer), then save."}
                        </p>
                      </div>
                    )}

                    {/* Verified Preview Display */}
                    {(gdriveVerifyState.accessible || editingEntry.entry.certificate_url) && (
                      <div className="p-3 rounded-xl bg-[#151517] border border-[#302D28] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {gdriveVerifyState.thumbnailUrl || editingEntry.entry.image ? (
                            <img
                              src={gdriveVerifyState.thumbnailUrl || resolveDisplayImageUrl(editingEntry.entry.image)}
                              alt="Certificate preview"
                              className="w-12 h-12 rounded-lg object-cover border border-[#302D28]"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-[#202023] flex items-center justify-center text-[#C7A46A]">
                              <FileText size={20} />
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-semibold text-[#F4F0E8]">
                              {gdriveVerifyState.fileType === "pdf"
                                ? "PDF Document Verified"
                                : gdriveVerifyState.fileType === "image"
                                ? "Image Verified"
                                : "Certificate Ready"}
                            </p>
                            <p className="text-[11px] text-[#A7A198]">
                              Will display in your custom Certificate Viewer
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const val =
                              (document.getElementById("entry-cert-url") as HTMLInputElement)?.value ||
                              editingEntry.entry.certificate_url;
                            if (val) {
                              setTestCertModal({
                                title: (document.querySelector('input[name="title"]') as HTMLInputElement)?.value || "Certificate",
                                issuer: editingEntry.categoryTitle,
                                description: (document.querySelector('textarea[name="description"]') as HTMLTextAreaElement)?.value || "",
                                file_url: val,
                              });
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#202023] hover:bg-[#C7A46A] text-[#F4F0E8] hover:text-[#151517] border border-[#302D28] text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5"
                        >
                          <Eye size={12} />
                          <span>Test in Viewer</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingEntry(null)}
                    className="w-1/2 py-2.5 rounded-xl bg-[#202023] border border-[#302D28] text-[#A7A198] text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D8BC8A] text-[#151517] text-xs font-bold transition-all shadow-md"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* EDIT CATEGORY OVERVIEW MODAL (TWEAK BADGE & DESCRIPTION) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {editingCategoryOverview && (
          <div
            className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-[#0B0B0C]/90 backdrop-blur-md overflow-y-auto"
            onClick={() => setEditingCategoryOverview(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#151517] border border-[#302D28] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8"
            >
              <h3 className="font-heading font-bold text-lg text-[#F4F0E8] mb-1">
                Edit Category Overview
              </h3>
              <p className="text-xs text-[#A7A198] mb-4">
                Customize the high-level badge and description for <strong className="text-[#F4F0E8]">{editingCategoryOverview.title}</strong>.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = e.currentTarget;
                  const item: AchievementCategory = {
                    ...editingCategoryOverview,
                    position_award: (f.elements.namedItem("position_award") as HTMLInputElement).value,
                    event_name: (f.elements.namedItem("event_name") as HTMLInputElement).value,
                    description: (f.elements.namedItem("description") as HTMLTextAreaElement).value,
                  };
                  saveCategoryOverview(item);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-[#A7A198] mb-1">Category Name</label>
                  <input
                    value={editingCategoryOverview.title}
                    disabled
                    className="w-full px-3.5 py-2 rounded-xl bg-[#202023]/60 border border-[#302D28] text-xs text-[#A7A198] cursor-not-allowed"
                  />
                  <p className="text-[10px] text-[#A7A198]/60 mt-1">Fixed parent category name cannot be altered.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#A7A198] mb-1">Badge / Highlight</label>
                    <input
                      name="position_award"
                      defaultValue={editingCategoryOverview.position_award}
                      placeholder="e.g. 🏆 5+ Wins"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#202023] border border-[#302D28] text-xs sm:text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#A7A198] mb-1">Scope / Subtitle</label>
                    <input
                      name="event_name"
                      defaultValue={editingCategoryOverview.event_name}
                      placeholder="e.g. Various Institutions"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#202023] border border-[#302D28] text-xs sm:text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A7A198] mb-1">Category Description *</label>
                  <textarea
                    name="description"
                    defaultValue={editingCategoryOverview.description}
                    required
                    rows={3}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#202023] border border-[#302D28] text-xs sm:text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingCategoryOverview(null)}
                    className="w-1/2 py-2.5 rounded-xl bg-[#202023] border border-[#302D28] text-[#A7A198] text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D8BC8A] text-[#151517] text-xs font-bold transition-all shadow-md"
                  >
                    Save Overview
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* EDIT CERTIFICATION MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {editingCertification && (
          <div
            className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-[#0B0B0C]/90 backdrop-blur-md overflow-y-auto"
            onClick={() => setEditingCertification(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#151517] border border-[#302D28] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8"
            >
              <h3 className="font-heading font-bold text-lg text-[#F4F0E8] mb-4">
                {editingCertification.isNew ? "Add Certification" : "Edit Certification"}
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = e.currentTarget;
                  const item: Certification = {
                    ...editingCertification.item,
                    title: (f.elements.namedItem("title") as HTMLInputElement).value,
                    issuer: (f.elements.namedItem("issuer") as HTMLInputElement).value,
                    issue_date: (f.elements.namedItem("issue_date") as HTMLInputElement).value,
                    description: (f.elements.namedItem("description") as HTMLTextAreaElement).value,
                    file_url: (f.elements.namedItem("file_url") as HTMLInputElement).value,
                    original_link: (f.elements.namedItem("original_link") as HTMLInputElement).value,
                  };
                  saveCertification(item, editingCertification.isNew);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-[#A7A198] mb-1">
                    Certificate Title *
                  </label>
                  <input
                    name="title"
                    defaultValue={editingCertification.item.title}
                    required
                    placeholder="e.g. HDCA Programming Certificate"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#202023] border border-[#302D28] text-xs sm:text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#A7A198] mb-1">
                      Issuing Organization *
                    </label>
                    <input
                      name="issuer"
                      defaultValue={editingCertification.item.issuer}
                      required
                      placeholder="e.g. NPTEL, Udemy, CSC"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#202023] border border-[#302D28] text-xs sm:text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#A7A198] mb-1">
                      Issue Date
                    </label>
                    <input
                      name="issue_date"
                      defaultValue={editingCertification.item.issue_date}
                      placeholder="e.g. 2024 or Oct 2024"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#202023] border border-[#302D28] text-xs sm:text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A7A198] mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingCertification.item.description}
                    required
                    rows={3}
                    placeholder="Brief description of topics covered and credential details..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#202023] border border-[#302D28] text-xs sm:text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>

                {/* Certificate File or Google Drive Link */}
                <div className="bg-[#202023] p-4 rounded-xl border border-[#302D28] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#F4F0E8]">
                      Certificate Document (Google Drive Link or Upload)
                    </label>
                    <span className="text-[10px] text-[#C7A46A] font-semibold">
                      Google Drive Supported
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        id="cert-file-url"
                        name="file_url"
                        defaultValue={editingCertification.item.file_url}
                        placeholder="Paste Google Drive sharing link (e.g. https://drive.google.com/file/d/...) or URL"
                        onChange={(e) => verifyGoogleDriveLink(e.target.value)}
                        onBlur={(e) => verifyGoogleDriveLink(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#151517] border border-[#302D28] text-xs text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const val = (document.getElementById("cert-file-url") as HTMLInputElement)?.value;
                          verifyGoogleDriveLink(val);
                        }}
                        className="px-3 py-2 rounded-xl bg-[#151517] border border-[#302D28] hover:border-[#C7A46A] text-xs font-semibold text-[#F4F0E8] shrink-0"
                      >
                        Verify
                      </button>
                    </div>

                    {/* Direct File Upload button as alternative */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="file"
                        id="cert-file-upload"
                        className="hidden"
                        accept="application/pdf,image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const res = await handleFileUpload(file);
                            if (res) {
                              const input = document.getElementById("cert-file-url") as HTMLInputElement;
                              if (input) input.value = res.url;
                              verifyGoogleDriveLink(res.url);
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        disabled={uploadingFile}
                        onClick={() => document.getElementById("cert-file-upload")?.click()}
                        className="px-3 py-1.5 rounded-lg bg-[#151517] hover:bg-[#28282c] border border-[#302D28] text-[11px] font-semibold text-[#A7A198] hover:text-[#F4F0E8] flex items-center gap-1.5"
                      >
                        {uploadingFile ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                        <span>Or upload PDF/Image directly from PC</span>
                      </button>
                    </div>

                    {/* Verification / Loading */}
                    {gdriveVerifyState.loading && (
                      <div className="flex items-center gap-2 text-xs text-[#C7A46A] p-2.5 rounded-lg bg-[#151517]">
                        <Loader2 size={14} className="animate-spin" />
                        <span>Verifying Google Drive link accessibility...</span>
                      </div>
                    )}

                    {/* Restricted Warning */}
                    {gdriveVerifyState.accessible === false && (
                      <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-600/40 text-amber-200 text-xs space-y-1">
                        <div className="flex items-center gap-2 font-bold text-amber-400">
                          <AlertTriangle size={15} />
                          <span>Google Drive Sharing Permission Required</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          {gdriveVerifyState.hint ||
                            "This link is private or restricted. In Google Drive, click 'Share' on this file, change 'General access' from 'Restricted' to 'Anyone with the link' (Viewer), then save."}
                        </p>
                      </div>
                    )}

                    {/* Verified Preview Display */}
                    {(gdriveVerifyState.accessible || editingCertification.item.file_url) && (
                      <div className="p-3 rounded-xl bg-[#151517] border border-[#302D28] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {gdriveVerifyState.thumbnailUrl ? (
                            <img
                              src={gdriveVerifyState.thumbnailUrl}
                              alt="Certificate thumbnail"
                              className="w-12 h-12 rounded-lg object-cover border border-[#302D28]"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-[#202023] flex items-center justify-center text-[#C7A46A]">
                              <FileText size={20} />
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-semibold text-[#F4F0E8]">
                              {gdriveVerifyState.fileType === "pdf"
                                ? "PDF Certificate Ready"
                                : gdriveVerifyState.fileType === "image"
                                ? "Image Certificate Ready"
                                : "Certificate Document Ready"}
                            </p>
                            <p className="text-[11px] text-[#A7A198]">
                              Will display in your custom Certificate Viewer
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const val =
                              (document.getElementById("cert-file-url") as HTMLInputElement)?.value ||
                              editingCertification.item.file_url;
                            if (val) {
                              setTestCertModal({
                                title: (document.querySelector('input[name="title"]') as HTMLInputElement)?.value || "Certificate",
                                issuer: (document.querySelector('input[name="issuer"]') as HTMLInputElement)?.value || "Issuer",
                                description: (document.querySelector('textarea[name="description"]') as HTMLTextAreaElement)?.value || "",
                                file_url: val,
                              });
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#202023] hover:bg-[#C7A46A] text-[#F4F0E8] hover:text-[#151517] border border-[#302D28] text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5"
                        >
                          <Eye size={12} />
                          <span>Test in Custom Viewer</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A7A198] mb-1">
                    Original Certificate Link (Optional)
                  </label>
                  <input
                    name="original_link"
                    defaultValue={editingCertification.item.original_link}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#202023] border border-[#302D28] text-xs text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingCertification(null)}
                    className="w-1/2 py-2.5 rounded-xl bg-[#202023] border border-[#302D28] text-[#A7A198] text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D8BC8A] text-[#151517] text-xs font-bold transition-all shadow-md"
                  >
                    Save Certificate
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* EDIT PROJECT MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {editingProject && (
          <div
            className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-[#0B0B0C]/90 backdrop-blur-md overflow-y-auto"
            onClick={() => setEditingProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#151517] border border-[#302D28] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8"
            >
              <h3 className="font-heading font-bold text-lg text-[#F4F0E8] mb-4">
                {editingProject.isNew ? "Add Project" : "Edit Project"}
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = e.currentTarget;
                  const tagsRaw = (f.elements.namedItem("tags") as HTMLInputElement).value;
                  const highlightsRaw = (f.elements.namedItem("highlights") as HTMLTextAreaElement).value;

                  const item: Project = {
                    ...editingProject.item,
                    title: (f.elements.namedItem("title") as HTMLInputElement).value,
                    subtitle: (f.elements.namedItem("subtitle") as HTMLInputElement).value,
                    letter: (f.elements.namedItem("letter") as HTMLInputElement).value || (f.elements.namedItem("title") as HTMLInputElement).value[0]?.toUpperCase() || "P",
                    description: (f.elements.namedItem("description") as HTMLTextAreaElement).value,
                    tags: tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
                    highlights: highlightsRaw.split("\n").map((h) => h.trim()).filter(Boolean),
                    image: (f.elements.namedItem("image") as HTMLInputElement).value,
                    github: (f.elements.namedItem("github") as HTMLInputElement).value,
                    demo: (f.elements.namedItem("demo") as HTMLInputElement).value,
                    download: (f.elements.namedItem("download") as HTMLInputElement).value,
                    topProject: (f.elements.namedItem("topProject") as HTMLInputElement).checked,
                  };
                  saveProject(item, editingProject.isNew);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-[1fr_80px] gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#A7A198] mb-1">
                      Project Name *
                    </label>
                    <input
                      name="title"
                      defaultValue={editingProject.item.title}
                      required
                      placeholder="e.g. Tunic Music"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#202023] border border-[#302D28] text-xs sm:text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#A7A198] mb-1">
                      Letter
                    </label>
                    <input
                      name="letter"
                      defaultValue={editingProject.item.letter}
                      maxLength={2}
                      placeholder="T"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#202023] border border-[#302D28] text-xs sm:text-sm text-[#F4F0E8] text-center uppercase font-bold focus:outline-none focus:border-[#C7A46A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A7A198] mb-1">
                    Subtitle / Year
                  </label>
                  <input
                    name="subtitle"
                    defaultValue={editingProject.item.subtitle}
                    placeholder="e.g. Mobile App · 2026"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#202023] border border-[#302D28] text-xs sm:text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A7A198] mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingProject.item.description}
                    required
                    rows={2}
                    placeholder="High level overview of the project..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#202023] border border-[#302D28] text-xs sm:text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A7A198] mb-1">
                    Technologies / Tags (comma separated)
                  </label>
                  <input
                    name="tags"
                    defaultValue={editingProject.item.tags?.join(", ")}
                    placeholder="Flutter, Kotlin, Cloudinary"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#202023] border border-[#302D28] text-xs text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A7A198] mb-1">
                    Key Highlights (one per line)
                  </label>
                  <textarea
                    name="highlights"
                    defaultValue={editingProject.item.highlights?.join("\n")}
                    rows={2}
                    placeholder="Bullet point 1&#10;Bullet point 2"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#202023] border border-[#302D28] text-xs text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                  />
                </div>

                {/* Upload Image */}
                <div>
                  <label className="block text-xs font-semibold text-[#A7A198] mb-1">
                    Project Thumbnail / Image
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="proj-file-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const res = await handleFileUpload(file);
                          if (res) {
                            const input = document.getElementById("proj-image-url") as HTMLInputElement;
                            if (input) input.value = res.url;
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      disabled={uploadingFile}
                      onClick={() => document.getElementById("proj-file-upload")?.click()}
                      className="px-3.5 py-2 rounded-xl bg-[#202023] hover:bg-[#28282c] border border-[#302D28] text-xs font-semibold text-[#F4F0E8] flex items-center gap-2 shrink-0"
                    >
                      {uploadingFile ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      Upload Image
                    </button>
                    <input
                      id="proj-image-url"
                      name="image"
                      defaultValue={editingProject.item.image}
                      placeholder="/uploads/... or external URL"
                      className="w-full px-3 py-2 rounded-xl bg-[#202023] border border-[#302D28] text-xs text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#A7A198] mb-1">GitHub Link</label>
                    <input
                      name="github"
                      defaultValue={editingProject.item.github}
                      placeholder="https://github.com/..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#202023] border border-[#302D28] text-xs text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#A7A198] mb-1">Demo Link</label>
                    <input
                      name="demo"
                      defaultValue={editingProject.item.demo}
                      placeholder="https://..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#202023] border border-[#302D28] text-xs text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#A7A198] mb-1">Download APK</label>
                    <input
                      name="download"
                      defaultValue={editingProject.item.download}
                      placeholder="https://..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#202023] border border-[#302D28] text-xs text-[#F4F0E8] focus:outline-none focus:border-[#C7A46A]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="topProject"
                    name="topProject"
                    defaultChecked={editingProject.item.topProject}
                    className="rounded border-[#302D28] text-[#C7A46A] focus:ring-0 bg-[#202023]"
                  />
                  <label htmlFor="topProject" className="text-xs text-[#F4F0E8] font-medium cursor-pointer">
                    Feature as Top Project (gold badge)
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="w-1/2 py-2.5 rounded-xl bg-[#202023] border border-[#302D28] text-[#A7A198] text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-[#C7A46A] hover:bg-[#D8BC8A] text-[#151517] text-xs font-bold transition-all shadow-md"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* TEST CERTIFICATE LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      <CertificateModal
        cert={testCertModal}
        onClose={() => setTestCertModal(null)}
      />
    </div>
  );
}
