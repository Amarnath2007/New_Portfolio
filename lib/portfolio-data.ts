import fs from "fs";
import path from "path";

export interface SkillCategory {
  id: string;
  num: string;
  title: string;
  icon: string;
  skills: string[];
}

export interface Achievement {
  id: string;
  title: string;
  event_name: string;
  description: string;
  position_award: string;
  date: string;
  category: string;
  icon?: string;
  image?: string;
  proof_document?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  description: string;
  issue_date: string;
  file_url: string;
  original_link?: string;
}

export interface Project {
  id: string;
  letter: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  tags: string[];
  download?: string;
  contactSource?: boolean;
  topProject?: boolean;
  image?: string;
  github?: string;
  demo?: string;
}

export interface PortfolioData {
  skills: SkillCategory[];
  achievements: Achievement[];
  certifications: Certification[];
  projects: Project[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const PUBLISHED_FILE = path.join(DATA_DIR, "portfolio-published.json");
const DRAFT_FILE = path.join(DATA_DIR, "portfolio-draft.json");

export function getPortfolioData(preview = false): PortfolioData {
  try {
    const isDev = process.env.NODE_ENV === "development";
    // In production or on Vercel, always use published data
    const targetFile = (preview && isDev && fs.existsSync(DRAFT_FILE)) ? DRAFT_FILE : PUBLISHED_FILE;

    if (fs.existsSync(targetFile)) {
      const raw = fs.readFileSync(targetFile, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading portfolio data:", err);
  }

  // Fallback to published file if draft fails
  if (fs.existsSync(PUBLISHED_FILE)) {
    try {
      const raw = fs.readFileSync(PUBLISHED_FILE, "utf-8");
      return JSON.parse(raw);
    } catch (e) {
      console.error("Error reading published fallback:", e);
    }
  }

  return {
    skills: [],
    achievements: [],
    certifications: [],
    projects: [],
  };
}

export function getDraftPortfolioData(): PortfolioData {
  if (fs.existsSync(DRAFT_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DRAFT_FILE, "utf-8"));
    } catch (e) {
      console.error("Error reading draft:", e);
    }
  }
  return getPortfolioData(false);
}

export function getPublishedPortfolioData(): PortfolioData {
  return getPortfolioData(false);
}

export function saveDraftPortfolioData(data: PortfolioData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DRAFT_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function revertDraftToPublished(): void {
  if (fs.existsSync(PUBLISHED_FILE)) {
    const raw = fs.readFileSync(PUBLISHED_FILE, "utf-8");
    fs.writeFileSync(DRAFT_FILE, raw, "utf-8");
  }
}

export function validatePortfolioData(data: PortfolioData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!Array.isArray(data.skills)) {
    errors.push("Skills must be an array");
  } else {
    data.skills.forEach((cat, idx) => {
      if (!cat.title?.trim()) errors.push(`Skill category #${idx + 1} is missing a title`);
      if (!Array.isArray(cat.skills) || cat.skills.length === 0) {
        errors.push(`Skill category "${cat.title || idx + 1}" must contain at least one skill`);
      }
    });
  }

  if (!Array.isArray(data.achievements)) {
    errors.push("Achievements must be an array");
  } else {
    data.achievements.forEach((ach, idx) => {
      if (!ach.title?.trim()) errors.push(`Achievement #${idx + 1} is missing a title`);
      if (!ach.description?.trim()) errors.push(`Achievement "${ach.title || idx + 1}" is missing a description`);
    });
  }

  if (!Array.isArray(data.certifications)) {
    errors.push("Certifications must be an array");
  } else {
    data.certifications.forEach((cert, idx) => {
      if (!cert.title?.trim()) errors.push(`Certification #${idx + 1} is missing a title`);
      if (!cert.issuer?.trim()) errors.push(`Certification "${cert.title || idx + 1}" is missing an issuer`);
    });
  }

  if (!Array.isArray(data.projects)) {
    errors.push("Projects must be an array");
  } else {
    data.projects.forEach((proj, idx) => {
      if (!proj.title?.trim()) errors.push(`Project #${idx + 1} is missing a title`);
      if (!proj.description?.trim()) errors.push(`Project "${proj.title || idx + 1}" is missing a description`);
    });
  }

  return { valid: errors.length === 0, errors };
}

export interface DiffItem {
  section: "skills" | "achievements" | "certifications" | "projects";
  action: "added" | "modified" | "deleted";
  identifier: string;
  details: string;
}

export function computeDiff(draft: PortfolioData, published: PortfolioData): DiffItem[] {
  const diffs: DiffItem[] = [];

  // Skills Categories
  const pubSkillsMap = new Map(published.skills.map((s) => [s.id, s]));
  const draftSkillsMap = new Map(draft.skills.map((s) => [s.id, s]));

  for (const s of draft.skills) {
    if (!pubSkillsMap.has(s.id)) {
      diffs.push({
        section: "skills",
        action: "added",
        identifier: s.title,
        details: `New skill category with ${s.skills.length} skills (${s.skills.slice(0, 3).join(", ")}...)`,
      });
    } else {
      const pub = pubSkillsMap.get(s.id)!;
      if (JSON.stringify(pub) !== JSON.stringify(s)) {
        diffs.push({
          section: "skills",
          action: "modified",
          identifier: s.title,
          details: `Skills modified (${s.skills.length} items)`,
        });
      }
    }
  }

  for (const s of published.skills) {
    if (!draftSkillsMap.has(s.id)) {
      diffs.push({
        section: "skills",
        action: "deleted",
        identifier: s.title,
        details: `Removed skill category`,
      });
    }
  }

  // Achievements
  const pubAchMap = new Map(published.achievements.map((a) => [a.id, a]));
  const draftAchMap = new Map(draft.achievements.map((a) => [a.id, a]));

  for (const a of draft.achievements) {
    if (!pubAchMap.has(a.id)) {
      diffs.push({
        section: "achievements",
        action: "added",
        identifier: a.title,
        details: `New achievement: ${a.position_award || a.event_name}`,
      });
    } else {
      const pub = pubAchMap.get(a.id)!;
      if (JSON.stringify(pub) !== JSON.stringify(a)) {
        diffs.push({
          section: "achievements",
          action: "modified",
          identifier: a.title,
          details: `Updated details or image/proof`,
        });
      }
    }
  }

  for (const a of published.achievements) {
    if (!draftAchMap.has(a.id)) {
      diffs.push({
        section: "achievements",
        action: "deleted",
        identifier: a.title,
        details: `Deleted achievement`,
      });
    }
  }

  // Certifications
  const pubCertMap = new Map(published.certifications.map((c) => [c.id, c]));
  const draftCertMap = new Map(draft.certifications.map((c) => [c.id, c]));

  for (const c of draft.certifications) {
    if (!pubCertMap.has(c.id)) {
      diffs.push({
        section: "certifications",
        action: "added",
        identifier: c.title,
        details: `New certificate from ${c.issuer}`,
      });
    } else {
      const pub = pubCertMap.get(c.id)!;
      if (JSON.stringify(pub) !== JSON.stringify(c)) {
        diffs.push({
          section: "certifications",
          action: "modified",
          identifier: c.title,
          details: `Updated certificate credentials/file`,
        });
      }
    }
  }

  for (const c of published.certifications) {
    if (!draftCertMap.has(c.id)) {
      diffs.push({
        section: "certifications",
        action: "deleted",
        identifier: c.title,
        details: `Deleted certificate`,
      });
    }
  }

  // Projects
  const pubProjMap = new Map(published.projects.map((p) => [p.id, p]));
  const draftProjMap = new Map(draft.projects.map((p) => [p.id, p]));

  for (const p of draft.projects) {
    if (!pubProjMap.has(p.id)) {
      diffs.push({
        section: "projects",
        action: "added",
        identifier: p.title,
        details: `New project (${p.subtitle || p.tags.join(", ")})`,
      });
    } else {
      const pub = pubProjMap.get(p.id)!;
      if (JSON.stringify(pub) !== JSON.stringify(p)) {
        diffs.push({
          section: "projects",
          action: "modified",
          identifier: p.title,
          details: `Updated project metadata, tags, or links`,
        });
      }
    }
  }

  for (const p of published.projects) {
    if (!draftProjMap.has(p.id)) {
      diffs.push({
        section: "projects",
        action: "deleted",
        identifier: p.title,
        details: `Deleted project`,
      });
    }
  }

  return diffs;
}
