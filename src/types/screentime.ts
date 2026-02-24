// Screentime TypeScript type definitions

export interface Summary {
  totalApps: number;
  totalDurationMS: number;
  activeDays: number;
  avgDailyDuration: number;
  totalLaunches: number;
  totalNotifications: number;
  topApp: string;
  topAppPackage: string;
  topAppDurationMS: number;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface DailyStat {
  date: string;
  totalDurationMS: number;
  uniqueApps: number;
  launchCount: number;
  notificationCount: number;
  topApp: string;
  topAppDurationMS: number;
}

export interface AppRanking {
  rank: number;
  appName: string;
  packageID: string;
  category: string;
  totalDurationMS: number;
  launchCount: number;
  notificationCount: number;
  percentage: number;
  activeDays: number;
  avgDailyDuration: number;
}

export interface CategoryStat {
  category: string;
  appCount: number;
  totalDurationMS: number;
  launchCount: number;
  notificationCount: number;
  percentage: number;
  apps: string[];
}

export interface HourlyStat {
  hour: number;
  launchCount: number;
  uniqueApps: number;
}

export interface TrendPoint {
  date: string;
  value: number; // in hours
}

export interface App {
  id: number;
  packageID: string;
  appName: string;
  category: string;
  firstSeen: string;
  lastSeen: string;
  totalDurationMS: number;
  totalLaunches: number;
  totalNotifications: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppDetail {
  app: App;
  dailyTrend: Array<{
    date: string;
    duration: number;
    launches: number;
  }>;
}

// Device types for multi-source support
export interface Device {
  id: string;
  name: string;
  type: 'phone' | 'computer';
  dbPath: string;
  dataFormat: string;
  isActive: boolean;
  createdAt: string;
  lastSync?: string;
  totalRecords: number;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  metadata?: string;
}

// Cross-device analysis types
export interface CrossDeviceComparison {
  phone: {
    totalDuration: number;
    avgDailyDuration: number;
    totalApps: number;
    activeDays: number;
    topApp: string;
  };
  computer: {
    totalDuration: number;
    avgDailyDuration: number;
    totalApps: number;
    activeDays: number;
    topApp: string;
  };
  total: {
    totalDuration: number;
    avgDailyDuration: number;
    phonePercentage: number;
    computerPercentage: number;
  };
  insights: string[];
}

export interface WorkLifeBalance {
  workDuration: number;
  lifeDuration: number;
  balanceScore: number;
  workPercentage: number;
  lifePercentage: number;
  recommendation: string;
  weekdayPattern: {
    workDuration: number;
    lifeDuration: number;
  };
  weekendPattern: {
    workDuration: number;
    lifeDuration: number;
  };
  insights: string[];
}

export interface DailyTotal {
  date: string;
  phoneDuration: number;
  computerDuration: number;
  totalDuration: number;
  totalHours: number;
}

export interface SwitchingPattern {
  date: string;
  phoneSessions: number;
  computerSessions: number;
  estimatedSwitches: number;
  dominantDevice: string;
}

export interface AppEcosystem {
  crossPlatformApps: string[];
  phoneOnlyApps: string[];
  computerOnlyApps: string[];
  totalApps: number;
  crossPlatformCount: number;
  insights: string[];
}

export interface HourlyAllocation {
  hour: number;
  phoneDuration: number;
  computerDuration: number;
  totalDuration: number;
  phonePercentage: number;
  computerPercentage: number;
}

export interface UserProfile {
  deviceDependency: string;
  workMode: string;
  entertainmentPref: string;
  productivityType: string;
  healthStatus: string;
  totalScreentime: number;
  recommendations: string[];
}
