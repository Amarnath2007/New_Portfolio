import fs from "fs";
import path from "path";

export interface SkillCategory {
  id: string;
  num: string;
  title: string;
  icon: string;
  skills: string[];
}

export interface AchievementEntry {
  id: string;
  title: string;              // Competition or event name
  event_name?: string;        // Optional organizer or institution
  position_award?: string;    // Position, prize, or award (e.g. 🏆 1st Prize, Winner)
  date?: string;              // Date (e.g. 2025 - 2026 or Feb 2025)
  description: string;        // Description of entry / challenge
  certificate_url?: string;   // Google Drive link or uploaded file URL
  image?: string;             // Thumbnail / preview URL
  proof_document?: string;    // Direct proof document URL
}

export interface AchievementCategory {
  id: string;
  title: string;
  event_name?: string;
  description: string;
  position_award?: string;
  date?: string;
  category: "intercollege" | "events" | "hackathon" | "participations" | string;
  icon?: string;
  image?: string;
  proof_document?: string;
  entries: AchievementEntry[];
}

export type Achievement = AchievementCategory;

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

export const FIXED_ACHIEVEMENT_CATEGORIES = [
  {
    id: "ach-1",
    category: "intercollege",
    title: "Inter-College Wins",
    subtitle: "Various Institutions",
    icon: "Trophy",
    defaultHighlight: "🏆5+ Wins",
    defaultDescription:
      "Successfully competed and secured top positions in symposiums and technical fests held at various reputed colleges.",
  },
  {
    id: "ach-2",
    category: "events",
    title: "College Wins",
    subtitle: "PSG CAS (Internal)",
    icon: "Award",
    defaultHighlight: "🏆5+ Wins",
    defaultDescription:
      "Consistent performance in intra-college events, spanning debugging, logic-building, and technical paper presentations.",
  },
  {
    id: "ach-3",
    category: "hackathon",
    title: "Hackathon Prizes",
    subtitle: "Innovation & Coding",
    icon: "Zap",
    defaultHighlight: "Podium Finishes",
    defaultDescription:
      "Building functional prototypes and solving real-world problems under pressure. Secured multiple podium finishes.",
  },
  {
    id: "ach-4",
    category: "participations",
    title: "Event Participations",
    subtitle: "Inside & Outside College",
    icon: "Award",
    defaultHighlight: "📜 Participations",
    defaultDescription:
      "Active participation across technical symposiums, workshops, coding contests, and conferences spanning multiple institutions.",
  },
] as const;

/**
 * Normalizes portfolio data to guarantee the four fixed achievement parent categories
 * exist with their individual entries preserved inside them.
 */
export function normalizePortfolioData(raw: PortfolioData): PortfolioData {
  const normalized: PortfolioData = {
    skills: Array.isArray(raw.skills) ? raw.skills : [],
    achievements: [],
    certifications: Array.isArray(raw.certifications) ? raw.certifications : [],
    projects: Array.isArray(raw.projects) ? raw.projects : [],
  };

  const rawAchs = Array.isArray(raw.achievements) ? raw.achievements : [];

  // Group any standalone entries by category if present
  const categoryEntriesMap = new Map<string, AchievementEntry[]>();
  FIXED_ACHIEVEMENT_CATEGORIES.forEach((cat) => {
    categoryEntriesMap.set(cat.category, []);
  });

  // Find existing category objects or standalone entries
  const existingCategoriesMap = new Map<string, any>();

  for (const item of rawAchs) {
    const catKey = item.category || "intercollege";
    const isParentCategory = FIXED_ACHIEVEMENT_CATEGORIES.some(
      (c) => c.id === item.id || (c.category === item.category && !item.entries)
    );

    if (isParentCategory && !existingCategoriesMap.has(catKey)) {
      existingCategoriesMap.set(catKey, item);
      if (Array.isArray(item.entries)) {
        categoryEntriesMap.get(catKey)?.push(...item.entries);
      }
    } else {
      // Standalone achievement entry - preserve it inside this category's entries!
      const entry: AchievementEntry = {
        id: item.id || `entry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: item.title || item.event_name || "Untitled Entry",
        event_name: item.event_name,
        position_award: item.position_award,
        date: item.date,
        description: item.description || "",
        certificate_url: item.proof_document || item.image || (item as any).certificate_url || "",
        image: item.image,
        proof_document: item.proof_document,
      };
      categoryEntriesMap.get(catKey)?.push(entry);
    }
  }

  // Construct the exactly four parent categories
  for (const def of FIXED_ACHIEVEMENT_CATEGORIES) {
    const existing = existingCategoriesMap.get(def.category);
    const entries = categoryEntriesMap.get(def.category) || [];

    normalized.achievements.push({
      id: def.id,
      category: def.category,
      title: def.title, // Fixed category title
      event_name: existing?.event_name || def.subtitle,
      description: existing?.description || def.defaultDescription,
      position_award: existing?.position_award || def.defaultHighlight,
      date: existing?.date || "2024 - 2026",
      icon: def.icon,
      image: existing?.image || "",
      proof_document: existing?.proof_document || "",
      entries,
    });
  }

  return normalized;
}

const DATA_DIR = path.join(process.cwd(), "data");
const PUBLISHED_FILE = path.join(DATA_DIR, "portfolio-published.json");
const DRAFT_FILE = path.join(DATA_DIR, "portfolio-draft.json");

export function getPortfolioData(preview = false): PortfolioData {
  try {
    const isDev = process.env.NODE_ENV === "development";
    const targetFile = preview && isDev && fs.existsSync(DRAFT_FILE) ? DRAFT_FILE : PUBLISHED_FILE;

    if (fs.existsSync(targetFile)) {
      const raw = fs.readFileSync(targetFile, "utf-8");
      return normalizePortfolioData(JSON.parse(raw));
    }
  } catch (err) {
    console.error("Error reading portfolio data:", err);
  }

  if (fs.existsSync(PUBLISHED_FILE)) {
    try {
      const raw = fs.readFileSync(PUBLISHED_FILE, "utf-8");
      return normalizePortfolioData(JSON.parse(raw));
    } catch (e) {
      console.error("Error reading published fallback:", e);
    }
  }

  return normalizePortfolioData({
    skills: [],
    achievements: [],
    certifications: [],
    projects: [],
  });
}

export function getDraftPortfolioData(): PortfolioData {
  if (fs.existsSync(DRAFT_FILE)) {
    try {
      return normalizePortfolioData(JSON.parse(fs.readFileSync(DRAFT_FILE, "utf-8")));
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
  const normalized = normalizePortfolioData(data);
  fs.writeFileSync(DRAFT_FILE, JSON.stringify(normalized, null, 2), "utf-8");
}

export function revertDraftToPublished(): void {
  if (fs.existsSync(PUBLISHED_FILE)) {
    const raw = fs.readFileSync(PUBLISHED_FILE, "utf-8");
    const normalized = normalizePortfolioData(JSON.parse(raw));
    fs.writeFileSync(DRAFT_FILE, JSON.stringify(normalized, null, 2), "utf-8");
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
    if (data.achievements.length !== 4) {
      errors.push("Achievements must contain exactly the 4 fixed categories");
    }
    data.achievements.forEach((ach) => {
      if (!ach.title?.trim()) errors.push(`Achievement category "${ach.id}" is missing a title`);
      if (Array.isArray(ach.entries)) {
        ach.entries.forEach((entry, eIdx) => {
          if (!entry.title?.trim()) {
            errors.push(`Entry #${eIdx + 1} in "${ach.title}" is missing a competition/event name`);
          }
        });
      }
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

  // Achievements & Category Entries
  const pubAchMap = new Map(published.achievements.map((a) => [a.category, a]));
  const draftAchMap = new Map(draft.achievements.map((a) => [a.category, a]));

  for (const a of draft.achievements) {
    const pub = pubAchMap.get(a.category);
    if (!pub) continue;

    // Check entry changes
    const draftEntries = Array.isArray(a.entries) ? a.entries : [];
    const pubEntries = Array.isArray(pub.entries) ? pub.entries : [];
    const pubEntryMap = new Map(pubEntries.map((e) => [e.id, e]));
    const draftEntryMap = new Map(draftEntries.map((e) => [e.id, e]));

    for (const entry of draftEntries) {
      if (!pubEntryMap.has(entry.id)) {
        diffs.push({
          section: "achievements",
          action: "added",
          identifier: `${a.title} → ${entry.title}`,
          details: `Added new entry (${entry.position_award || "Award"})`,
        });
      } else {
        const pubE = pubEntryMap.get(entry.id)!;
        if (JSON.stringify(pubE) !== JSON.stringify(entry)) {
          diffs.push({
            section: "achievements",
            action: "modified",
            identifier: `${a.title} → ${entry.title}`,
            details: `Updated entry details/proof`,
          });
        }
      }
    }

    for (const pubE of pubEntries) {
      if (!draftEntryMap.has(pubE.id)) {
        diffs.push({
          section: "achievements",
          action: "deleted",
          identifier: `${a.title} → ${pubE.title}`,
          details: `Deleted entry from ${a.title}`,
        });
      }
    }

    // Check category overview changes
    if (
      a.description !== pub.description ||
      a.position_award !== pub.position_award ||
      a.event_name !== pub.event_name
    ) {
      diffs.push({
        section: "achievements",
        action: "modified",
        identifier: a.title,
        details: `Updated category overview badge or description`,
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
