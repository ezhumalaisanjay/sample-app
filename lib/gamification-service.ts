import { showNotification } from "./notifications";
import { addNotificationToCenter } from "./notification-service";

export interface Achievement {
  id: string;
  type: "points" | "badge" | "level";
  title: string;
  description: string;
  value: number | string;
  icon: string;
  timestamp: Date;
}

// Mock user data with achievements
const userData = {
  userId: "user123",
  points: 750,
  level: 3,
  badges: ["early_adopter", "first_post", "helpful"] as string[],
  achievements: [] as Achievement[],
};

// Define badge metadata with explicit type
const badgeMetadata = {
  early_adopter: {
    title: "Early Adopter",
    description: "Joined during the beta phase",
    icon: "award",
  },
  first_post: {
    title: "First Post",
    description: "Created your first post",
    icon: "message-square",
  },
  helpful: {
    title: "Helpful",
    description: "Received 10 thank you reactions",
    icon: "heart",
  },
  power_user: {
    title: "Power User",
    description: "Used the application for 30 consecutive days",
    icon: "zap",
  },
  problem_solver: {
    title: "Problem Solver",
    description: "Resolved 5 reported issues",
    icon: "check-circle",
  },
} as const;

type BadgeId = keyof typeof badgeMetadata;

// Define level thresholds
const levelThresholds = [
  { level: 1, points: 0, title: "Beginner" },
  { level: 2, points: 100, title: "Novice" },
  { level: 3, points: 500, title: "Intermediate" },
  { level: 4, points: 1000, title: "Advanced" },
  { level: 5, points: 2500, title: "Expert" },
  { level: 6, points: 5000, title: "Master" },
  { level: 7, points: 10000, title: "Grandmaster" },
];

// Function to add points and check for level ups
export async function addPoints(points: number): Promise<Achievement | null> {
  const previousLevel = userData.level;
  userData.points += points;

  // Check if user leveled up
  const newLevel = levelThresholds.find(
    (lt) => lt.points <= userData.points && lt.level > previousLevel
  );

  if (newLevel) {
    userData.level = newLevel.level;
    const achievement: Achievement = {
      id: `level_${newLevel.level}_${Date.now()}`,
      type: "level",
      title: `Level Up: ${newLevel.title}`,
      description: `Congratulations! You've reached level ${newLevel.level}`,
      value: newLevel.level,
      icon: "trending-up",
      timestamp: new Date(),
    };

    insertAchievement(achievement);

    showNotification(`🎉 Level Up! You've reached level ${newLevel.level}`, "success");
    addNotificationToCenter({
      id: achievement.id,
      title: achievement.title,
      message: achievement.description,
      timestamp: achievement.timestamp,
      type: "achievement",
      data: achievement,
      read: false,
    });

    return achievement;
  }

  // Just points, no level up
  const achievement: Achievement = {
    id: `points_${Date.now()}`,
    type: "points",
    title: "Points Earned",
    description: `You earned ${points} points`,
    value: points,
    icon: "plus-circle",
    timestamp: new Date(),
  };

  insertAchievement(achievement);

  showNotification(`🎮 You earned ${points} points!`, "info");
  addNotificationToCenter({
    id: achievement.id,
    title: achievement.title,
    message: achievement.description,
    timestamp: achievement.timestamp,
    type: "achievement",
    data: achievement,
    read: false,
  });

  return achievement;
}

// Function to award a badge
export async function awardBadge(badgeId: BadgeId): Promise<Achievement | null> {
  if (userData.badges.includes(badgeId)) {
    return null; // User already has this badge
  }

  const badge = badgeMetadata[badgeId];
  if (!badge) {
    return null; // Badge doesn't exist
  }

  userData.badges.push(badgeId);

  const achievement: Achievement = {
    id: `badge_${badgeId}_${Date.now()}`,
    type: "badge",
    title: `New Badge: ${badge.title}`,
    description: badge.description,
    value: badgeId,
    icon: badge.icon,
    timestamp: new Date(),
  };

  insertAchievement(achievement);

  showNotification(`🏆 New Badge! You earned the "${badge.title}" badge`, "success");
  addNotificationToCenter({
    id: achievement.id,
    title: achievement.title,
    message: achievement.description,
    timestamp: achievement.timestamp,
    type: "achievement",
    data: achievement,
    read: false,
  });

  return achievement;
}

// Function to insert achievements in sorted order
function insertAchievement(achievement: Achievement) {
  userData.achievements.push(achievement);
  userData.achievements.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// Function to get user achievements
export function getUserAchievements(): Achievement[] {
  return userData.achievements;
}

// Function to get user stats
export function getUserStats() {
  const currentLevel = levelThresholds.find((lt) => lt.level === userData.level) || levelThresholds[0];
  const nextLevel = levelThresholds.find((lt) => lt.level === userData.level + 1);

  let progress = 100;
  if (nextLevel) {
    const pointsForCurrentLevel = currentLevel.points;
    const pointsForNextLevel = nextLevel.points;
    const pointsNeeded = pointsForNextLevel - pointsForCurrentLevel;
    const pointsGained = userData.points - pointsForCurrentLevel;
    progress = Math.min(Math.floor((pointsGained / pointsNeeded) * 100), 100);
  }

  return {
    points: userData.points,
    level: userData.level,
    levelTitle: currentLevel.title,
    badges: userData.badges.map((id) => ({
      id,
      ...badgeMetadata[id as BadgeId], // Ensuring type safety
    })),
    progress,
  };
}

// Simulate user actions that would trigger achievements
export async function simulateUserAction(action: string): Promise<Achievement | null> {
  switch (action) {
    case "complete_task":
      return addPoints(50);
    case "daily_login":
      return addPoints(10);
    case "help_others":
      return awardBadge("helpful");
    case "power_user":
      return awardBadge("power_user");
    case "solve_problem":
      return awardBadge("problem_solver");
    default:
      return null;
  }
}
