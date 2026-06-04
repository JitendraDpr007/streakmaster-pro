export interface InterviewRound {
  name: string;
  duration: string;
  focus: string;
  tips: string;
}

export interface CompBand {
  level: string;
  base: string;
  stock: string;
  bonus: string;
  total: string;
}

export interface PrepWeek {
  week: number;
  theme: string;
  tasks: string[];
}

export interface CompanyPack {
  slug: string;
  company: string;
  logo: string;
  tagline: string;
  role: string;
  difficulty: "BRUTAL" | "HARD" | "MEDIUM";
  hireBar: string;
  loop: InterviewRound[];
  topTopics: { topic: string; weight: number }[];
  topQuestions: string[];
  comp: CompBand[];
  prepPlan: PrepWeek[];
  insiderTips: string[];
  recentlyAsked: string[];
  totalQuestions: number;
  mix: [number, number, number];
}

export const COMPANY_PACKS: CompanyPack[] = [
  {
    slug: "google",
    company: "Google",
    logo: "🔵",
    tagline: "Algorithmic depth + Googleyness. No shortcuts.",
    role: "SDE-2 / L4",
    difficulty: "BRUTAL",
    hireBar: "Top 3% — clean code, optimal solution, communicates trade-offs.",
    loop: [
      { name: "Phone Screen", duration: "45 min", focus: "1 medium DSA + 1 follow-up", tips: "Talk through your approach BEFORE coding. They score communication." },
      { name: "Coding Round 1", duration: "45 min", focus: "Arrays / Strings / Hashing", tips: "Always state brute force first, then optimize. State complexity." },
      { name: "Coding Round 2", duration: "45 min", focus: "Trees / Graphs / DP", tips: "Drawing on the whiteboard wins. Edge cases earn the offer." },
      { name: "System Design", duration: "45 min", focus: "Scale to billions — YouTube, Maps, Drive", tips: "Start with reqs → API → data model → scale. CAP, sharding, caching." },
      { name: "Googleyness & Leadership", duration: "45 min", focus: "Behavioral + values", tips: "STAR method. Show humility + bias for action. Reference real impact." },
    ],
    topTopics: [
      { topic: "Graphs (BFS/DFS/Dijkstra)", weight: 22 },
      { topic: "Dynamic Programming", weight: 18 },
      { topic: "Trees & Tries", weight: 15 },
      { topic: "Heaps / Priority Queue", weight: 12 },
      { topic: "System Design", weight: 20 },
      { topic: "Sliding Window", weight: 13 },
    ],
    topQuestions: [
      "Word Ladder II — shortest transformation sequences",
      "Number of Islands (BFS variant)",
      "LRU Cache — design from scratch",
      "Snake & Ladders shortest path",
      "Design Google Docs (collaborative editing)",
      "Median of Two Sorted Arrays",
      "Trapping Rain Water — 2 pointer + stack",
      "Course Schedule II (Topological sort)",
      "Design YouTube — video upload pipeline",
      "Robot Room Cleaner (backtracking)",
    ],
    comp: [
      { level: "L3 (SDE-1)", base: "₹32L", stock: "₹18L/yr", bonus: "15%", total: "₹55L" },
      { level: "L4 (SDE-2)", base: "₹45L", stock: "₹32L/yr", bonus: "18%", total: "₹85L" },
      { level: "L5 (Senior)", base: "₹62L", stock: "₹58L/yr", bonus: "20%", total: "₹1.35Cr" },
      { level: "L6 (Staff)", base: "₹85L", stock: "₹1.1Cr/yr", bonus: "22%", total: "₹2.1Cr" },
    ],
    prepPlan: [
      { week: 1, theme: "Arrays, Hashing, 2-pointer", tasks: ["20 Easy/Med problems", "Re-implement HashMap", "Sliding Window patterns"] },
      { week: 2, theme: "Trees & Graphs", tasks: ["BFS, DFS, Topo sort", "Dijkstra, Union Find", "10 Med + 5 Hard"] },
      { week: 3, theme: "DP & Backtracking", tasks: ["1D/2D DP", "Knapsack variants", "N-Queens, Sudoku"] },
      { week: 4, theme: "System Design + Mock", tasks: ["Design URL Shortener, Drive", "2 mocks/week", "Behavioral STAR stories x6"] },
    ],
    insiderTips: [
      "Googleyness = humility + collaboration. NEVER say 'I' — say 'we'.",
      "They have a hire/no-hire committee — even 1 weak signal sinks you. Be consistent.",
      "Always ask clarifying questions for 2-3 min. Silence = red flag.",
      "Last 5 min: ask thoughtful questions about the team's roadmap, not perks.",
    ],
    recentlyAsked: [
      "Kth largest element in stream (Heap)",
      "Design a parking lot",
      "LFU Cache",
      "Word break II",
      "Serialize/Deserialize Binary Tree",
    ],
    totalQuestions: 45,
    mix: [10, 22, 13],
  },
  {
    slug: "uber",
    company: "Uber",
    logo: "🚗",
    tagline: "Backend depth + real-world scale. Maps, payments, surge.",
    role: "Backend Engineer II",
    difficulty: "HARD",
    hireBar: "Strong CS fundamentals + production system reasoning.",
    loop: [
      { name: "Recruiter Screen", duration: "30 min", focus: "Background + motivation", tips: "Be specific about why Uber — mention a product feature you love." },
      { name: "Technical Phone", duration: "60 min", focus: "1 hard DSA in CoderPad", tips: "Optimize for readability. They paste your code into review tools." },
      { name: "Onsite Coding x2", duration: "60 min each", focus: "Graphs, design data structures", tips: "Expect a follow-up that 10x's the input size." },
      { name: "System Design", duration: "60 min", focus: "Design Uber Eats / Surge / Driver Match", tips: "Talk about geohashing, S2 cells, Kafka events." },
      { name: "Hiring Manager / Bar Raiser", duration: "45 min", focus: "Ownership + ambiguity", tips: "Show how you debugged a production incident end-to-end." },
    ],
    topTopics: [
      { topic: "Graph algorithms (shortest path)", weight: 25 },
      { topic: "Concurrency / Threading", weight: 18 },
      { topic: "Heaps / Sorted Structures", weight: 14 },
      { topic: "System Design (geo, payments)", weight: 28 },
      { topic: "OOP Design", weight: 15 },
    ],
    topQuestions: [
      "Design Uber — driver-rider matching",
      "Design surge pricing system",
      "Find K nearest drivers (heap + geo)",
      "Sliding Window Maximum",
      "Design rate limiter (Token Bucket)",
      "LRU Cache (thread-safe)",
      "Meeting Rooms II",
      "Design ETA service (Dijkstra at scale)",
      "Split the bill (graph + greedy)",
      "Producer-Consumer with bounded queue",
    ],
    comp: [
      { level: "L4 (E2)", base: "₹28L", stock: "₹14L/yr", bonus: "12%", total: "₹46L" },
      { level: "L5a (E3)", base: "₹38L", stock: "₹22L/yr", bonus: "15%", total: "₹65L" },
      { level: "L5b (Senior)", base: "₹52L", stock: "₹38L/yr", bonus: "18%", total: "₹98L" },
      { level: "L6 (Staff)", base: "₹70L", stock: "₹65L/yr", bonus: "20%", total: "₹1.55Cr" },
    ],
    prepPlan: [
      { week: 1, theme: "Graphs deep dive", tasks: ["Dijkstra, A*, BFS variants", "15 graph problems", "Geo-hashing notes"] },
      { week: 2, theme: "Concurrency & Design", tasks: ["Threads, locks, semaphores", "Producer-Consumer", "OOP: Parking lot, Splitwise"] },
      { week: 3, theme: "System Design", tasks: ["Design Uber, ETA, Surge", "Kafka basics", "Cassandra vs Postgres trade-offs"] },
      { week: 4, theme: "Behavioral + Mock", tasks: ["Ownership stories x5", "3 mock interviews", "Review past PRs aloud"] },
    ],
    insiderTips: [
      "Uber loves the geo question. Always mention S2 / H3 / geohashing.",
      "Bar Raiser asks 'tell me about a time you owned a failure'. Have it ready.",
      "Code in the language you're strongest in — they don't care if it's Go, Java, or Python.",
    ],
    recentlyAsked: [
      "Design Uber Eats restaurant search",
      "Reconstruct itinerary (Eulerian path)",
      "Min Cost to Connect All Points (MST)",
      "Design distributed task scheduler",
    ],
    totalQuestions: 30,
    mix: [8, 16, 6],
  },
  {
    slug: "atlassian",
    company: "Atlassian",
    logo: "🟦",
    tagline: "Fullstack craft. Values-driven. Async-friendly.",
    role: "Software Engineer (Fullstack)",
    difficulty: "HARD",
    hireBar: "Strong fullstack + clear communicator + values fit.",
    loop: [
      { name: "Recruiter Chat", duration: "30 min", focus: "Background + values intro", tips: "Read their 5 values BEFORE the call. Reference one." },
      { name: "Technical Screen", duration: "60 min", focus: "1 medium DSA + 1 system question", tips: "Pair-programming style — ask questions, think aloud." },
      { name: "Values Interview", duration: "60 min", focus: "Open Company, No Bullshit, Build with Heart", tips: "STAR stories explicitly mapping to each value." },
      { name: "Craft (Coding)", duration: "90 min", focus: "Real-world bug fix in their codebase style", tips: "Tests matter. Write them first if you can." },
      { name: "Design / Architecture", duration: "60 min", focus: "Design Jira board / Confluence search", tips: "Front-end + back-end + DB. Show full stack." },
    ],
    topTopics: [
      { topic: "REST / GraphQL APIs", weight: 22 },
      { topic: "React + State Management", weight: 18 },
      { topic: "DSA (Trees, Strings)", weight: 20 },
      { topic: "Database Design", weight: 15 },
      { topic: "System Design", weight: 15 },
      { topic: "Testing & Code Quality", weight: 10 },
    ],
    topQuestions: [
      "Design Jira — issue tracking schema",
      "Implement debounced search bar (React)",
      "Group anagrams",
      "Design Confluence collaborative editor",
      "Word frequency in a stream",
      "Implement auto-complete with Trie",
      "Find duplicate subtrees",
      "Design notifications service",
      "Validate BST",
      "Build a tag input component",
    ],
    comp: [
      { level: "P3", base: "₹26L", stock: "₹12L/yr", bonus: "10%", total: "₹40L" },
      { level: "P4 (Senior)", base: "₹38L", stock: "₹25L/yr", bonus: "12%", total: "₹66L" },
      { level: "P5 (Principal)", base: "₹55L", stock: "₹45L/yr", bonus: "15%", total: "₹1.05Cr" },
    ],
    prepPlan: [
      { week: 1, theme: "DSA refresh", tasks: ["Trees, Tries, Strings", "15 medium problems"] },
      { week: 2, theme: "Frontend craft", tasks: ["Debounce, throttle", "Build autocomplete", "React hooks deep dive"] },
      { week: 3, theme: "Backend + DB", tasks: ["REST API design", "SQL joins + indexes", "Design Jira schema"] },
      { week: 4, theme: "Values + Mocks", tasks: ["Map STAR to 5 values", "2 mocks", "Read Atlassian engineering blog"] },
    ],
    insiderTips: [
      "Values round is REAL. They reject brilliant engineers who don't fit.",
      "Atlassian is async-first. Mention async docs / RFCs in your stories.",
      "They love candidates who write tests — bring it up unprompted.",
    ],
    recentlyAsked: [
      "Design a Kanban board (frontend + API)",
      "Reverse linked list in groups of k",
      "Schema for multi-tenant SaaS",
    ],
    totalQuestions: 25,
    mix: [10, 12, 3],
  },
  {
    slug: "razorpay",
    company: "Razorpay",
    logo: "💳",
    tagline: "Payments engineering. Reliability first. India-scale.",
    role: "SDE-1 / SDE-2",
    difficulty: "MEDIUM",
    hireBar: "Solid fundamentals + curiosity about payments domain.",
    loop: [
      { name: "Online Assessment", duration: "90 min", focus: "2 DSA problems + MCQs", tips: "MCQs cover DBMS, OS, Networks. Don't skip." },
      { name: "Tech Round 1", duration: "60 min", focus: "DSA + DBMS", tips: "Indexes, transactions, isolation levels come up often." },
      { name: "Tech Round 2", duration: "60 min", focus: "LLD / OOP design", tips: "Design Splitwise / Payment Gateway / BookMyShow." },
      { name: "HLD / System Design", duration: "60 min", focus: "Design payment system / webhooks", tips: "Idempotency keys, retries, at-least-once delivery." },
      { name: "Hiring Manager", duration: "45 min", focus: "Culture + ownership", tips: "Razorpay loves builders. Show side projects." },
    ],
    topTopics: [
      { topic: "DSA (Arrays, Strings, DP)", weight: 25 },
      { topic: "DBMS (Transactions, Indexes)", weight: 18 },
      { topic: "LLD / OOP Design", weight: 22 },
      { topic: "System Design", weight: 20 },
      { topic: "Operating Systems", weight: 15 },
    ],
    topQuestions: [
      "Design a Payment Gateway",
      "Design Webhook delivery system (retries + idempotency)",
      "Splitwise — design + algorithm",
      "Longest Substring Without Repeating Characters",
      "Producer-Consumer using semaphores",
      "Design rate limiter for APIs",
      "ACID properties — when does isolation fail?",
      "Inventory management — concurrent decrements",
      "Design UPI flow",
      "Coin Change variations",
    ],
    comp: [
      { level: "SDE-1", base: "₹22L", stock: "₹4L/yr", bonus: "10%", total: "₹28L" },
      { level: "SDE-2", base: "₹32L", stock: "₹8L/yr", bonus: "12%", total: "₹44L" },
      { level: "SDE-3 (Senior)", base: "₹48L", stock: "₹15L/yr", bonus: "15%", total: "₹68L" },
      { level: "Staff", base: "₹70L", stock: "₹28L/yr", bonus: "18%", total: "₹1.1Cr" },
    ],
    prepPlan: [
      { week: 1, theme: "DSA + DBMS", tasks: ["20 medium DSA", "Transactions, normalization, indexes"] },
      { week: 2, theme: "LLD", tasks: ["Splitwise, BookMyShow, Parking Lot", "SOLID principles deep dive"] },
      { week: 3, theme: "HLD (Payments focus)", tasks: ["Design payment gateway", "Webhooks, idempotency", "Kafka basics"] },
      { week: 4, theme: "Mock + behavioral", tasks: ["2 mocks", "Read Razorpay engineering blog", "Build a tiny payment demo"] },
    ],
    insiderTips: [
      "Read the Razorpay engineering blog — they ask about real problems they solved.",
      "Idempotency is the magic word. Mention it in every system design answer.",
      "They prefer pragmatic over perfect. Ship-it mindset wins.",
    ],
    recentlyAsked: [
      "Design refund flow with partial refunds",
      "LRU Cache",
      "Detect cycle in linked list",
      "Design subscription billing",
    ],
    totalQuestions: 28,
    mix: [9, 13, 6],
  },
  {
    slug: "confluent",
    company: "Confluent",
    logo: "🌊",
    tagline: "Kafka & streaming. Distributed systems heaven.",
    role: "Software Engineer",
    difficulty: "HARD",
    hireBar: "Distributed systems fluency + strong CS.",
    loop: [
      { name: "Recruiter Call", duration: "30 min", focus: "Streaming background", tips: "Know basic Kafka — topics, partitions, consumer groups." },
      { name: "Tech Screen", duration: "60 min", focus: "DSA (hard)", tips: "Often a hard problem — focus on optimality." },
      { name: "Distributed Systems", duration: "60 min", focus: "Design Kafka / log replication", tips: "Talk about ISR, leader election, exactly-once." },
      { name: "Coding Onsite x2", duration: "60 min each", focus: "Concurrency + advanced DSA", tips: "Multi-threading questions are common." },
      { name: "Behavioral", duration: "45 min", focus: "Collaboration + ambiguity", tips: "Show distributed-team experience." },
    ],
    topTopics: [
      { topic: "Distributed Systems (Kafka)", weight: 30 },
      { topic: "Concurrency", weight: 20 },
      { topic: "DSA (Hard)", weight: 22 },
      { topic: "OS / Networks", weight: 13 },
      { topic: "System Design", weight: 15 },
    ],
    topQuestions: [
      "Design Kafka from scratch",
      "Implement consistent hashing",
      "Exactly-once delivery — how?",
      "Leader election with Raft",
      "Producer-consumer with backpressure",
      "Sliding window rate limiter",
      "Design distributed log",
      "Merge K sorted streams",
    ],
    comp: [
      { level: "L4", base: "₹38L", stock: "₹22L/yr", bonus: "12%", total: "₹65L" },
      { level: "L5 (Senior)", base: "₹55L", stock: "₹45L/yr", bonus: "15%", total: "₹1.05Cr" },
      { level: "L6 (Staff)", base: "₹80L", stock: "₹85L/yr", bonus: "18%", total: "₹1.8Cr" },
    ],
    prepPlan: [
      { week: 1, theme: "Kafka deep dive", tasks: ["Read Designing Data-Intensive Apps ch 3,5,7,9", "Set up Kafka locally"] },
      { week: 2, theme: "Concurrency + DSA", tasks: ["Threads, locks, atomics", "10 hard problems"] },
      { week: 3, theme: "System Design", tasks: ["Design Kafka, log, queue", "Raft, Paxos basics"] },
      { week: 4, theme: "Mocks", tasks: ["3 system design mocks", "1 behavioral mock"] },
    ],
    insiderTips: [
      "DDIA (Designing Data-Intensive Apps) is required reading. They quote it.",
      "If you've never used Kafka, build a tiny producer-consumer demo before applying.",
      "They love depth over breadth. Pick one distributed system and know it cold.",
    ],
    recentlyAsked: [
      "Design exactly-once semantics for Kafka",
      "LFU Cache",
      "Implement a distributed counter",
    ],
    totalQuestions: 22,
    mix: [4, 10, 8],
  },
  {
    slug: "databricks",
    company: "Databricks",
    logo: "🧱",
    tagline: "Spark, ML, and big data infrastructure.",
    role: "Software Engineer",
    difficulty: "HARD",
    hireBar: "Strong DSA + systems + bonus for Spark/ML.",
    loop: [
      { name: "OA", duration: "90 min", focus: "2-3 DSA problems", tips: "Time-boxed. Focus on correctness over optimization first." },
      { name: "Tech Screen", duration: "60 min", focus: "Hard DSA", tips: "Walk through complexity. They probe deeply." },
      { name: "System Design", duration: "60 min", focus: "Design Spark / data pipeline", tips: "Talk about partitioning, shuffle, lazy evaluation." },
      { name: "Coding Deep Dive", duration: "60 min", focus: "Real bug in distributed code", tips: "Read carefully. Often a concurrency trap." },
      { name: "Hiring Manager", duration: "45 min", focus: "Ownership + scale stories", tips: "Mention any data/ML project, even hobby ones." },
    ],
    topTopics: [
      { topic: "DSA (Hard)", weight: 28 },
      { topic: "Distributed Compute", weight: 22 },
      { topic: "System Design", weight: 20 },
      { topic: "SQL / Data Modeling", weight: 15 },
      { topic: "Concurrency", weight: 15 },
    ],
    topQuestions: [
      "Design Spark job scheduler",
      "Merge intervals",
      "Word count at scale (MapReduce)",
      "Design data lake",
      "Top K frequent elements",
      "Implement distributed cache",
      "Skyline problem",
      "Design SQL query optimizer (basics)",
    ],
    comp: [
      { level: "L3", base: "₹35L", stock: "₹20L/yr", bonus: "10%", total: "₹58L" },
      { level: "L4 (Senior)", base: "₹50L", stock: "₹40L/yr", bonus: "12%", total: "₹95L" },
      { level: "L5 (Staff)", base: "₹72L", stock: "₹75L/yr", bonus: "15%", total: "₹1.6Cr" },
    ],
    prepPlan: [
      { week: 1, theme: "DSA hard", tasks: ["20 hard problems", "Focus on intervals, heaps, DP"] },
      { week: 2, theme: "Spark basics", tasks: ["RDD vs DataFrame", "Partitioning, shuffles"] },
      { week: 3, theme: "System Design", tasks: ["Design data pipeline", "Lambda vs Kappa architecture"] },
      { week: 4, theme: "Mocks + behavioral", tasks: ["2 mocks", "Ownership stories"] },
    ],
    insiderTips: [
      "Databricks loves candidates with even small Spark/PySpark experience.",
      "Their bar is closer to Google than typical Indian tech — prep accordingly.",
      "Mention the Lakehouse architecture in system design — bonus points.",
    ],
    recentlyAsked: [
      "Design Delta Lake (ACID on data lake)",
      "Sliding Window Median",
      "Implement parallel merge sort",
    ],
    totalQuestions: 24,
    mix: [5, 11, 8],
  },
  {
    slug: "flipkart",
    company: "Flipkart",
    logo: "🛒",
    tagline: "E-commerce at India scale. Big Billion Days engineering.",
    role: "SDE-2 / SDE-3",
    difficulty: "MEDIUM",
    hireBar: "Strong DSA + LLD + India-scale system thinking.",
    loop: [
      { name: "OA", duration: "90 min", focus: "2 DSA (med-hard)", tips: "Often graph or DP. Practice on HackerEarth-style platforms." },
      { name: "DSA Round 1", duration: "60 min", focus: "Arrays / Strings / Trees", tips: "Optimize, then optimize again." },
      { name: "DSA Round 2", duration: "60 min", focus: "Graphs / DP", tips: "Edge cases. Always handle empty input." },
      { name: "LLD", duration: "60 min", focus: "Design Cart / Inventory / Wallet", tips: "SOLID, design patterns. Draw class diagrams." },
      { name: "HLD", duration: "60 min", focus: "Design BBD-scale flash sale", tips: "Caching, sharding, queue-based decoupling." },
      { name: "Hiring Manager", duration: "45 min", focus: "Behavioral", tips: "Ownership + execution speed stories." },
    ],
    topTopics: [
      { topic: "DSA (Trees, DP, Graphs)", weight: 30 },
      { topic: "LLD / OOP", weight: 22 },
      { topic: "HLD", weight: 20 },
      { topic: "DBMS", weight: 15 },
      { topic: "Behavioral", weight: 13 },
    ],
    topQuestions: [
      "Design Flipkart Cart",
      "Design BBD flash sale (handling 10M concurrent users)",
      "Design Inventory Service",
      "Word Break",
      "Min Cost Path in Matrix",
      "LRU Cache",
      "Design Wallet (transactions)",
      "Trapping Rain Water",
      "N-th Catalan Number",
    ],
    comp: [
      { level: "SDE-2", base: "₹30L", stock: "₹6L/yr", bonus: "12%", total: "₹40L" },
      { level: "SDE-3", base: "₹45L", stock: "₹12L/yr", bonus: "15%", total: "₹62L" },
      { level: "SDE-4 (Staff)", base: "₹65L", stock: "₹25L/yr", bonus: "18%", total: "₹95L" },
    ],
    prepPlan: [
      { week: 1, theme: "DSA core", tasks: ["Trees, graphs, DP", "20 medium problems"] },
      { week: 2, theme: "LLD", tasks: ["Cart, Wallet, BookMyShow", "Design patterns: Strategy, Observer, Factory"] },
      { week: 3, theme: "HLD", tasks: ["Design flash sale", "Caching strategies, sharding"] },
      { week: 4, theme: "Mock + behavioral", tasks: ["2 mocks", "Read Flipkart tech blog"] },
    ],
    insiderTips: [
      "Flash sale system design is iconic at Flipkart. Master it.",
      "LLD round is brutal — practice 10+ LLD problems before applying.",
      "They value execution speed. Talk about shipping fast in stories.",
    ],
    recentlyAsked: [
      "Design Flipkart Plus subscription",
      "Word Ladder",
      "Design notification service",
    ],
    totalQuestions: 32,
    mix: [10, 16, 6],
  },
];

export function getPack(slug: string) {
  return COMPANY_PACKS.find((p) => p.slug === slug);
}
