export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type Category = "DSA" | "SQL" | "System Design" | "Behavioral" | "Resume Tips";
export type QuestionType = "mcq" | "coding" | "sql" | "system_design";

export interface DesignSection {
  title: string;
  points: string[];
}

export interface Question {
  id: string;
  type: QuestionType;
  category: Category;
  subcategory: string;
  title: string;
  difficulty: Difficulty;
  xp: number;
  companies: string[];
  story: string;
  question: string;
  // MCQ
  options: string[];
  correctIndex: number;
  // Shared explanations
  explanation: string;
  whyOthersWrong: string;
  complexity?: string;
  interviewTip: string;
  followup: string;
  similar?: string[];
  icon: string;
  // Coding
  problemStatement?: string;
  leetcodeUrl?: string;
  gfgUrl?: string;
  // SQL
  sqlSchema?: string;
  sqlSeed?: string;
  sqlExpected?: { columns: string[]; rows: unknown[][] };
  // System Design
  requirements?: DesignSection[];
  hld?: DesignSection[];
  lld?: DesignSection[];
  tradeoffs?: DesignSection[];
}

export const CATEGORY_ICON: Record<Category, string> = {
  DSA: "🧠",
  SQL: "🗄️",
  "System Design": "⚙️",
  Behavioral: "💬",
  "Resume Tips": "📄",
};

export const TYPE_LABEL: Record<QuestionType, string> = {
  mcq: "Quick Quiz",
  coding: "Coding",
  sql: "SQL Lab",
  system_design: "System Design",
};

export const COMPANIES = [
  "Google",
  "Uber",
  "Atlassian",
  "Confluent",
  "Databricks",
  "Flipkart",
  "Razorpay",
  "Microsoft",
  "Adobe",
  "Walmart Labs",
];

export const QUESTIONS: Question[] = [];

export const ACHIEVEMENTS = [
  { id: "warrior", icon: "🔥", title: "7 Day Warrior", desc: "7 day streak" },
  { id: "diamond", icon: "💎", title: "Diamond Coder", desc: "50 problems solved" },
  { id: "speed", icon: "⚡", title: "Speed Demon", desc: "Answered in <10s" },
  { id: "top10", icon: "🏆", title: "Top 10%", desc: "Leaderboard rank" },
  { id: "sniper", icon: "🎯", title: "Sniper", desc: "10 correct in a row" },
  { id: "faang", icon: "🦁", title: "FAANG Ready", desc: "Complete a company pack" },
];

export const LEVELS = [
  { name: "Intern", min: 0, max: 500 },
  { name: "Junior", min: 500, max: 1500 },
  { name: "SDE-1", min: 1500, max: 3500 },
  { name: "SDE-2", min: 3500, max: 7000 },
  { name: "Senior", min: 7000, max: 15000 },
  { name: "Staff", min: 15000, max: 30000 },
  { name: "Principal", min: 30000, max: 60000 },
  { name: "Distinguished", min: 60000, max: Infinity },
];

export function levelFor(xp: number) {
  const idx = LEVELS.findIndex((l) => xp < l.max);
  const i = idx === -1 ? LEVELS.length - 1 : idx;
  return { ...LEVELS[i], index: i, next: LEVELS[Math.min(i + 1, LEVELS.length - 1)] };
}

export const LEADERBOARD = [
  { name: "Arjun S.", college: "IIT Bombay", xp: 12480, streak: 47 },
  { name: "Priya R.", college: "BITS Pilani", xp: 11320, streak: 39 },
  { name: "Karthik M.", college: "NIT Trichy", xp: 9870, streak: 28 },
  { name: "Sneha P.", college: "IIIT Hyderabad", xp: 8410, streak: 22 },
  { name: "Rohit K.", college: "DTU", xp: 7220, streak: 18 },
  { name: "Anika G.", college: "IIT Madras", xp: 6540, streak: 15 },
  { name: "Vikram J.", college: "VIT Vellore", xp: 5980, streak: 12 },
  { name: "Meera S.", college: "NSUT", xp: 5410, streak: 9 },
  { name: "Aditya N.", college: "IIT Delhi", xp: 4720, streak: 7 },
  { name: "Riya T.", college: "MNIT Jaipur", xp: 4180, streak: 6 },
];

export const ROADMAP = [
  { id: "arrays", title: "Arrays", status: "completed", progress: 100 },
  { id: "strings", title: "Strings", status: "completed", progress: 100 },
  { id: "hashing", title: "Hashing", status: "in_progress", progress: 60 },
  { id: "trees", title: "Trees", status: "in_progress", progress: 25 },
  { id: "graphs", title: "Graphs", status: "locked", progress: 0 },
  { id: "dp", title: "Dynamic Programming", status: "locked", progress: 0 },
  { id: "advanced", title: "Advanced", status: "locked", progress: 0 },
] as const;

export const PACKS = [
  { company: "Google", role: "SDE-2", questions: 45, topics: 12, progress: 32, mix: [10, 22, 13] },
  { company: "Uber", role: "Backend", questions: 30, topics: 8, progress: 18, mix: [8, 16, 6] },
  { company: "Atlassian", role: "Fullstack", questions: 25, topics: 7, progress: 8, mix: [10, 12, 3] },
  { company: "Razorpay", role: "SDE-1", questions: 28, topics: 9, progress: 0, mix: [9, 13, 6] },
];
