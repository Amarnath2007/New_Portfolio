export interface SkillItem {
  name: string;
  icon: string; // Path relative to public, e.g. "/icons/python.svg"
  category?: string;
}

export interface SkillCategoryGroup {
  id: string;
  title: string;
  icon: string; // Lucide icon name
  skills: SkillItem[];
}

// 1. Development skills for Ticker 1 (Moving Left to Right - matching Image 2 order)
export const DEVELOPMENT_SKILLS_TICKER: SkillItem[] = [
  { name: "C", icon: "/icons/c.svg" },
  { name: "C++", icon: "/icons/cplusplus.svg" },
  { name: "Python", icon: "/icons/python.svg" },
  { name: "React", icon: "/icons/react.svg" },
  { name: "Next.js", icon: "/icons/nextjs.svg" },
  { name: "Flutter", icon: "/icons/flutter.svg" },
  { name: "Node.js", icon: "/icons/nodejs.svg" },
  { name: "Express", icon: "/icons/express.svg" },
  { name: "PostgreSQL", icon: "/icons/postgresql.svg" },
  { name: "Supabase", icon: "/icons/supabase.svg" },
  { name: "Java", icon: "/icons/java.svg" },
  { name: "HTML5", icon: "/icons/html5.svg" },
  { name: "CSS3", icon: "/icons/css3.svg" },
  { name: "JavaScript", icon: "/icons/javascript.svg" },
  { name: "Tailwind CSS", icon: "/icons/tailwindcss.svg" },
  { name: "SQL", icon: "/icons/sql.svg" },
  { name: "Kotlin", icon: "/icons/kotlin.svg" },
  { name: "Git", icon: "/icons/git.svg" },
  { name: "GitHub", icon: "/icons/github.svg" },
  { name: "VS Code", icon: "/icons/vscode.svg" },
];

// 2. AI Tools for Ticker 2 (Moving Right to Left - matching Image 2 order)
export const AI_TOOLS_TICKER: SkillItem[] = [
  { name: "ChatGPT", icon: "/icons/chatgpt.svg" },
  { name: "Claude", icon: "/icons/claude.svg" },
  { name: "Codex", icon: "/icons/codex.svg" },
  { name: "Gemini", icon: "/icons/gemini.svg" },
  { name: "Gamma", icon: "/icons/gamma.svg" },
  { name: "ElevenLabs", icon: "/icons/elevenlabs.svg" },
  { name: "NotebookLM", icon: "/icons/notebooklm.svg" },
  { name: "Antigravity", icon: "/icons/antigravity.svg" },
  { name: "Napkin AI", icon: "/icons/napkin.svg" },
  { name: "Canva", icon: "/icons/canva.svg" },
  { name: "Cursor", icon: "/icons/cursor.svg" },
  { name: "Replit", icon: "/icons/replit.svg" },
  { name: "Lovable", icon: "/icons/lovable.svg" },
];

// 3. Exact 7 Categories for the Dedicated /skills Page
export const ALL_SKILLS_CATEGORIES: SkillCategoryGroup[] = [
  {
    id: "programming-languages",
    title: "Programming Languages",
    icon: "Code2",
    skills: [
      { name: "C", icon: "/icons/c.svg" },
      { name: "C++", icon: "/icons/cplusplus.svg" },
      { name: "Python", icon: "/icons/python.svg" },
      { name: "Java", icon: "/icons/java.svg" },
    ],
  },
  {
    id: "frontend-development",
    title: "Frontend Development",
    icon: "Layout",
    skills: [
      { name: "HTML", icon: "/icons/html5.svg" },
      { name: "CSS", icon: "/icons/css3.svg" },
      { name: "JavaScript", icon: "/icons/javascript.svg" },
      { name: "React", icon: "/icons/react.svg" },
      { name: "Next.js", icon: "/icons/nextjs.svg" },
      { name: "Tailwind CSS", icon: "/icons/tailwindcss.svg" },
    ],
  },
  {
    id: "backend-development",
    title: "Backend Development",
    icon: "Server",
    skills: [
      { name: "Node.js", icon: "/icons/nodejs.svg" },
      { name: "Express", icon: "/icons/express.svg" },
      { name: "Supabase", icon: "/icons/supabase.svg" },
      { name: "File Handling", icon: "/icons/filehandling.svg" },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    icon: "Database",
    skills: [
      { name: "SQL", icon: "/icons/sql.svg" },
      { name: "PostgreSQL", icon: "/icons/postgresql.svg" },
      { name: "MySQL", icon: "/icons/mysql.svg" },
      { name: "Supabase", icon: "/icons/supabase.svg" },
      { name: "SQLite", icon: "/icons/sqlite.svg" },
    ],
  },
  {
    id: "mobile-development",
    title: "Mobile Development",
    icon: "Smartphone",
    skills: [
      { name: "Flutter", icon: "/icons/flutter.svg" },
      { name: "Kotlin", icon: "/icons/kotlin.svg" },
      { name: "Java", icon: "/icons/java.svg" },
    ],
  },
  {
    id: "tools-technologies",
    title: "Tools & Technologies",
    icon: "Wrench",
    skills: [
      { name: "Git", icon: "/icons/git.svg" },
      { name: "GitHub", icon: "/icons/github.svg" },
      { name: "VS Code", icon: "/icons/vscode.svg" },
      { name: "Problem Solving", icon: "/icons/problemsolving.svg" },
      { name: "Debugging", icon: "/icons/debugging.svg" },
      { name: "Data Structures", icon: "/icons/datastructures.svg" },
    ],
  },
  {
    id: "ai-tools",
    title: "AI Tools",
    icon: "Sparkles",
    skills: [
      { name: "ChatGPT", icon: "/icons/chatgpt.svg" },
      { name: "Claude", icon: "/icons/claude.svg" },
      { name: "Codex", icon: "/icons/codex.svg" },
      { name: "Gemini", icon: "/icons/gemini.svg" },
      { name: "Gamma", icon: "/icons/gamma.svg" },
      { name: "Antigravity", icon: "/icons/antigravity.svg" },
      { name: "ElevenLabs", icon: "/icons/elevenlabs.svg" },
      { name: "NotebookLM", icon: "/icons/notebooklm.svg" },
      { name: "Napkin AI", icon: "/icons/napkin.svg" },
      { name: "Canva", icon: "/icons/canva.svg" },
      { name: "Cursor", icon: "/icons/cursor.svg" },
      { name: "Replit", icon: "/icons/replit.svg" },
      { name: "Lovable", icon: "/icons/lovable.svg" },
    ],
  },
];
