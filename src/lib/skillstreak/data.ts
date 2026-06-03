export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type Category = "DSA" | "SQL" | "System Design" | "Behavioral" | "Resume Tips";

export interface Question {
  id: string;
  category: Category;
  subcategory: string;
  title: string;
  difficulty: Difficulty;
  xp: number;
  companies: string[];
  story: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  whyOthersWrong: string;
  complexity?: string;
  interviewTip: string;
  followup: string;
  similar?: string[];
  icon: string;
}

export const CATEGORY_ICON: Record<Category, string> = {
  DSA: "🧠",
  SQL: "🗄️",
  "System Design": "⚙️",
  Behavioral: "💬",
  "Resume Tips": "📄",
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

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    category: "DSA",
    subcategory: "Arrays · Sliding Window",
    title: "Two Sum — The Classic",
    difficulty: "EASY",
    xp: 20,
    companies: ["Google", "Amazon", "Flipkart"],
    icon: "🧠",
    story:
      "You're a new SDE at Razorpay. A customer service ticket comes in — two suspicious transactions sum to a fraud threshold. Write the function that flags them instantly.",
    question:
      "Given nums = [2, 7, 11, 15] and target = 9, return indices of the two numbers that add up to target.",
    options: ["[0,1]", "[1,2]", "[0,2]", "[2,3]"],
    correctIndex: 0,
    explanation:
      "HashMap approach: for each number, check if complement (target − num) exists in map. If yes, return both indices. If no, store current number with its index. Single pass = O(n) time, O(n) space.",
    whyOthersWrong:
      "[1,2] = 7+11=18 ≠ 9. [0,2] = 2+11=13 ≠ 9. [2,3] = 11+15=26 ≠ 9.",
    complexity: "O(n) time | O(n) space",
    interviewTip:
      "Always clarify: can the same element be used twice? Can there be multiple answers? Shows the interviewer you think about edge cases.",
    followup: "What if the array is sorted? Can you do O(1) space?",
    similar: ["3Sum", "Two Sum II — Sorted Input"],
  },
  {
    id: "q2",
    category: "SQL",
    subcategory: "Aggregation · Window Functions",
    title: "Duplicate Emails — Classic Dedup",
    difficulty: "MEDIUM",
    xp: 35,
    companies: ["Uber", "Atlassian", "Walmart Labs"],
    icon: "🗄️",
    story:
      "You're on Swiggy's data team. Users are getting double OTPs — turned out duplicate emails exist in the DB. Your manager needs a query in the next 5 minutes.",
    question: "Table: Users(id, email). Find all emails that appear more than once.",
    options: [
      "SELECT email FROM Users WHERE COUNT(email) > 1",
      "SELECT email FROM Users GROUP BY email HAVING COUNT(*) > 1",
      "SELECT DISTINCT email FROM Users",
      "SELECT email FROM Users ORDER BY email LIMIT 10",
    ],
    correctIndex: 1,
    explanation:
      "GROUP BY collapses rows with the same email. HAVING filters groups (like WHERE but for aggregates). COUNT(*) > 1 means the group has more than one row = duplicate.",
    whyOthersWrong:
      "A: WHERE can't use aggregate functions directly. C: DISTINCT shows unique emails — opposite of what we want. D: just ordering, no dedup logic.",
    complexity: "O(n) scan + hash grouping",
    interviewTip:
      "Follow up: how to DELETE duplicates keeping only the lowest id? Use DELETE with a self-join or CTE with ROW_NUMBER().",
    followup: "Write a query to keep only one row per duplicate email (the one with lowest id).",
    similar: ["Nth Highest Salary", "Consecutive Numbers"],
  },
  {
    id: "q3",
    category: "System Design",
    subcategory: "Rate Limiting · Consistent Hashing",
    title: "Rate Limiter at Scale",
    difficulty: "HARD",
    xp: 75,
    companies: ["Uber", "Google", "Confluent", "Razorpay"],
    icon: "⚙️",
    story:
      "It's IPL final night. You're on-call at Hotstar. 5 crore concurrent users. A bot farm is hitting your stream API 1000 times/second from 50 IPs. Your naive rate limiter just crashed. The CTO is on Slack. Go.",
    question:
      "Which rate limiting algorithm best handles bursty traffic while protecting your API at distributed scale?",
    options: [
      "Fixed Window Counter — simple counter resets every minute",
      "Token Bucket — tokens refill at fixed rate, bursts allowed up to bucket size",
      "Sliding Window Log — store timestamp of every request",
      "Database counter — SELECT then UPDATE on every request",
    ],
    correctIndex: 1,
    explanation:
      "Token Bucket is ideal: tokens accumulate at a fixed rate (refill rate). Each request costs 1 token. Burst traffic is absorbed if the bucket has tokens. Implement with Redis: bucket = key, DECR atomically via a Lua script. Distributed because Redis is shared across all your API server instances.",
    whyOthersWrong:
      "Fixed Window: boundary burst problem — 2× traffic possible at the window edge. Sliding Window Log: memory intensive, stores every request timestamp. DB counter: network round-trip per request = too slow, race conditions without transactions.",
    complexity: "O(1) per request with Redis Lua",
    interviewTip:
      "Always mention: where does the state live? (Redis, not in-memory). What happens if Redis goes down? (fail open vs fail closed). This shows production thinking.",
    followup: "How would you implement per-user AND per-IP rate limiting simultaneously?",
    similar: ["Design Distributed Cache", "Design URL Shortener"],
  },
];

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
