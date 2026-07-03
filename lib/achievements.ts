/**
 * Static, versioned achievement definitions (mirrors lib/learning-content.ts).
 * Unlock logic is pure functions over a Stats snapshot — inherently code, not
 * data — so these live here rather than as DB rows.
 */

export interface Stats {
  lessonsCompleted: number;
  perfectQuizzes: number;
  allCoursesComplete: boolean;
  beginnerComplete: boolean;
  learningStreak: number;
  accountsCount: number;
  goalsCount: number;
  goalCompleted: boolean;
  debtsCount: number;
  budgetCategoriesCount: number;
  healthScore: number;
}

export type AchievementIcon =
  | "sprout"
  | "flame"
  | "trophy"
  | "target"
  | "graduation-cap"
  | "wallet"
  | "piggy-bank"
  | "shield"
  | "star"
  | "book-open";

export interface AchievementDef {
  key: string;
  title: string;
  description: string;
  icon: AchievementIcon;
  xpReward: number;
  check: (s: Stats) => boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    key: "first_lesson",
    title: "First Lesson",
    description: "Complete your first Learning Center lesson.",
    icon: "sprout",
    xpReward: 25,
    check: (s) => s.lessonsCompleted >= 1,
  },
  {
    key: "dedicated_learner",
    title: "Dedicated Learner",
    description: "Complete 5 lessons.",
    icon: "book-open",
    xpReward: 50,
    check: (s) => s.lessonsCompleted >= 5,
  },
  {
    key: "financial_scholar",
    title: "Financial Scholar",
    description: "Complete every course in the Learning Center.",
    icon: "graduation-cap",
    xpReward: 150,
    check: (s) => s.allCoursesComplete,
  },
  {
    key: "beginner_graduate",
    title: "Beginner Graduate",
    description: "Finish every Beginner-level course.",
    icon: "graduation-cap",
    xpReward: 75,
    check: (s) => s.beginnerComplete,
  },
  {
    key: "quiz_whiz",
    title: "Quiz Whiz",
    description: "Score 100% on a lesson quiz.",
    icon: "star",
    xpReward: 30,
    check: (s) => s.perfectQuizzes >= 1,
  },
  {
    key: "streak_3",
    title: "3-Day Streak",
    description: "Complete lessons on 3 consecutive days.",
    icon: "flame",
    xpReward: 40,
    check: (s) => s.learningStreak >= 3,
  },
  {
    key: "streak_7",
    title: "Week Warrior",
    description: "Complete lessons on 7 consecutive days.",
    icon: "flame",
    xpReward: 100,
    check: (s) => s.learningStreak >= 7,
  },
  {
    key: "getting_started",
    title: "Getting Started",
    description: "Add your first financial account.",
    icon: "wallet",
    xpReward: 20,
    check: (s) => s.accountsCount >= 1,
  },
  {
    key: "goal_setter",
    title: "Goal Setter",
    description: "Create your first savings goal.",
    icon: "target",
    xpReward: 20,
    check: (s) => s.goalsCount >= 1,
  },
  {
    key: "goal_crusher",
    title: "Goal Crusher",
    description: "Fully fund a savings goal.",
    icon: "trophy",
    xpReward: 75,
    check: (s) => s.goalCompleted,
  },
  {
    key: "debt_tracked",
    title: "On the Radar",
    description: "Add a debt to start your payoff plan.",
    icon: "shield",
    xpReward: 20,
    check: (s) => s.debtsCount >= 1,
  },
  {
    key: "budget_builder",
    title: "Budget Builder",
    description: "Create your first budget category.",
    icon: "piggy-bank",
    xpReward: 20,
    check: (s) => s.budgetCategoriesCount >= 1,
  },
  {
    key: "financially_fit",
    title: "Financially Fit",
    description: "Reach a Financial Health Score of 70 or higher.",
    icon: "shield",
    xpReward: 60,
    check: (s) => s.healthScore >= 70,
  },
  {
    key: "money_master",
    title: "Money Master",
    description: "Reach a Financial Health Score of 85 or higher.",
    icon: "trophy",
    xpReward: 100,
    check: (s) => s.healthScore >= 85,
  },
];
