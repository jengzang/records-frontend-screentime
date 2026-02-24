import axios from 'axios';
import type {
  Summary,
  DailyStat,
  AppRanking,
  CategoryStat,
  HourlyStat,
  TrendPoint,
  AppDetail,
  Device,
  CrossDeviceComparison,
  WorkLifeBalance,
  DailyTotal,
  SwitchingPattern,
  AppEcosystem,
  HourlyAllocation,
  UserProfile,
} from '../types/screentime';

const API_BASE = 'http://localhost:8080/api/v1/screentime';

export const screentimeApi = {
  // Get overall summary
  getSummary: async (deviceId?: string): Promise<Summary> => {
    const response = await axios.get(`${API_BASE}/summary`, {
      params: deviceId ? { device: deviceId } : {},
    });
    return response.data;
  },

  // Get daily statistics
  getDailyStats: async (params?: {
    start?: string;
    end?: string;
    limit?: number;
    device?: string;
  }): Promise<DailyStat[]> => {
    const response = await axios.get(`${API_BASE}/daily`, { params });
    return response.data;
  },

  // Get app rankings
  getRankings: async (params?: {
    limit?: number;
    orderBy?: 'duration' | 'launches' | 'notifications';
    category?: string;
    device?: string;
  }): Promise<AppRanking[]> => {
    const response = await axios.get(`${API_BASE}/rankings`, { params });
    return response.data;
  },

  // Get category statistics
  getCategories: async (deviceId?: string): Promise<CategoryStat[]> => {
    const response = await axios.get(`${API_BASE}/categories`, {
      params: deviceId ? { device: deviceId } : {},
    });
    return response.data;
  },

  // Get hourly statistics
  getHourlyStats: async (params?: {
    start?: string;
    end?: string;
    device?: string;
  }): Promise<HourlyStat[]> => {
    const response = await axios.get(`${API_BASE}/hourly`, { params });
    return response.data;
  },

  // Get usage trends
  getTrends: async (params?: {
    granularity?: 'daily' | 'weekly' | 'monthly';
    start?: string;
    end?: string;
    device?: string;
  }): Promise<TrendPoint[]> => {
    const response = await axios.get(`${API_BASE}/trends`, { params });
    return response.data;
  },

  // Get app detail
  getAppDetail: async (packageId: string, deviceId?: string): Promise<AppDetail> => {
    const response = await axios.get(`${API_BASE}/app/${packageId}`, {
      params: deviceId ? { device: deviceId } : {},
    });
    return response.data;
  },

  // Device management
  listDevices: async (): Promise<Device[]> => {
    const response = await axios.get(`${API_BASE}/devices`);
    return response.data;
  },

  // Cross-device analysis
  getCrossDeviceComparison: async (): Promise<CrossDeviceComparison> => {
    const response = await axios.get(`${API_BASE}/cross-device/comparison`);
    return response.data;
  },

  getWorkLifeBalance: async (): Promise<WorkLifeBalance> => {
    const response = await axios.get(`${API_BASE}/cross-device/work-life-balance`);
    return response.data;
  },

  getTotalScreentime: async (params?: {
    start?: string;
    end?: string;
  }): Promise<DailyTotal[]> => {
    const response = await axios.get(`${API_BASE}/cross-device/total-screentime`, { params });
    return response.data;
  },

  getSwitchingPatterns: async (): Promise<SwitchingPattern[]> => {
    const response = await axios.get(`${API_BASE}/cross-device/switching-patterns`);
    return response.data;
  },

  getAppEcosystem: async (): Promise<AppEcosystem> => {
    const response = await axios.get(`${API_BASE}/cross-device/app-ecosystem`);
    return response.data;
  },

  getTimeAllocation: async (): Promise<HourlyAllocation[]> => {
    const response = await axios.get(`${API_BASE}/cross-device/time-allocation`);
    return response.data;
  },

  getUserProfile: async (): Promise<UserProfile> => {
    const response = await axios.get(`${API_BASE}/cross-device/user-profile`);
    return response.data;
  },
};

// Utility functions
export const formatDuration = (ms: number): string => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);

  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  }
  return `${minutes}分钟`;
};

export const formatDurationShort = (ms: number): string => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const formatDate = (dateStr: string): string => {
  // Convert YYYYMMDD to YYYY-MM-DD
  if (dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  }
  return dateStr;
};
