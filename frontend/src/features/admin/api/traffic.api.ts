import { adminApiClient, handleApiError, type ApiResponse } from '../../../core/api/client';

export interface TrafficTotals {
  totalViews: number;
  totalClicks: number;
  uniqueVisitors: number;
}

export interface TrafficPageStat {
  path: string;
  views: number;
  clicks: number;
  uniqueVisitors: number;
}

export interface TrafficDayStat {
  date: string;
  views: number;
  clicks: number;
  uniqueVisitors: number;
}

export interface TrafficClickTarget {
  target: string;
  count: number;
}

export interface TrafficSummary {
  range: { days: number; start: string; end: string };
  totals: TrafficTotals;
  topPages: TrafficPageStat[];
  dailyStats: TrafficDayStat[];
  topClickTargets: TrafficClickTarget[];
}

export const getTrafficSummary = async (days = 7): Promise<TrafficSummary> => {
  try {
    const response = await adminApiClient.get<ApiResponse<TrafficSummary>>('/admin/traffic/summary', {
      params: { days },
    });
    if (response.data.success && response.data.data) return response.data.data;
    throw new Error(response.data.message || 'Không thể tải dữ liệu traffic');
  } catch (error) {
    throw handleApiError(error);
  }
};
