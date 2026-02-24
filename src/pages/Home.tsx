import { useEffect, useState } from 'react';
import { screentimeApi, formatDuration, formatDate } from '../services/screentimeApi';
import type { Summary, AppRanking, TrendPoint } from '../types/screentime';

function Home() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [topApps, setTopApps] = useState<AppRanking[]>([]);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch summary
        const summaryData = await screentimeApi.getSummary();
        setSummary(summaryData);

        // Fetch top 5 apps
        const rankingsData = await screentimeApi.getRankings({ limit: 5 });
        setTopApps(rankingsData);

        // Fetch last 7 days trends
        const trendsData = await screentimeApi.getTrends({
          granularity: 'daily',
          // Get last 7 days
        });
        setTrends(trendsData.slice(-7));
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('加载数据失败，请确保后端服务正在运行');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          屏幕使用时间分析
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">总应用数</div>
            <div className="text-3xl font-bold text-blue-600">{summary.totalApps}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">总使用时长</div>
            <div className="text-3xl font-bold text-green-600">
              {Math.floor(summary.totalDurationMS / 3600000)}小时
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">活跃天数</div>
            <div className="text-3xl font-bold text-purple-600">{summary.activeDays}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">日均使用</div>
            <div className="text-3xl font-bold text-orange-600">
              {(summary.avgDailyDuration / 3600000).toFixed(1)}小时
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="text-sm text-gray-500">
            数据时间范围: {formatDate(summary.dateRange.start)} 至 {formatDate(summary.dateRange.end)}
          </div>
        </div>

        {/* Top App */}
        {summary.topApp && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow mb-6 text-white">
            <div className="text-sm opacity-90 mb-2">最常用应用</div>
            <div className="text-2xl font-bold mb-1">{summary.topApp}</div>
            <div className="text-lg opacity-90">
              {formatDuration(summary.topAppDurationMS)}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 5 Apps */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Top 5 应用</h2>
            <div className="space-y-3">
              {topApps.map((app) => (
                <div key={app.packageID} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{app.appName}</div>
                    <div className="text-sm text-gray-500">{app.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-blue-600">
                      {formatDuration(app.totalDurationMS)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {app.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Trends */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4">最近7天趋势</h2>
            <div className="space-y-2">
              {trends.map((point) => (
                <div key={point.date} className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">{formatDate(point.date)}</div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min((point.value / 10) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-sm font-medium text-gray-800 w-16 text-right">
                      {point.value.toFixed(1)}h
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">总启动次数</div>
            <div className="text-2xl font-bold text-gray-800">
              {summary.totalLaunches.toLocaleString()}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">总通知数</div>
            <div className="text-2xl font-bold text-gray-800">
              {summary.totalNotifications.toLocaleString()}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">平均每日启动</div>
            <div className="text-2xl font-bold text-gray-800">
              {Math.floor(summary.totalLaunches / summary.activeDays)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
