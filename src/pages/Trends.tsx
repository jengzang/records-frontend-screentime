import { useEffect, useState } from 'react';
import { screentimeApi, formatDate } from '../services/screentimeApi';
import type { TrendPoint, DailyStat } from '../types/screentime';

function Trends() {
  const [dailyTrends, setDailyTrends] = useState<TrendPoint[]>([]);
  const [weeklyTrends, setWeeklyTrends] = useState<TrendPoint[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [granularity, setGranularity] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch trends based on granularity
        const trends = await screentimeApi.getTrends({ granularity });

        if (granularity === 'daily') {
          setDailyTrends(trends.slice(-30)); // Last 30 days
        } else if (granularity === 'weekly') {
          setWeeklyTrends(trends.slice(-12)); // Last 12 weeks
        }

        // Fetch daily stats for detailed view
        const stats = await screentimeApi.getDailyStats({ limit: 30 });
        setDailyStats(stats);
      } catch (err) {
        console.error('Failed to fetch trends:', err);
        setError('加载趋势数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [granularity]);

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

  const trends = granularity === 'daily' ? dailyTrends : weeklyTrends;
  const maxValue = Math.max(...trends.map(t => t.value), 1);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">趋势分析</h1>

        {/* Granularity Selector */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setGranularity('daily')}
              className={`px-4 py-2 rounded-md font-medium ${
                granularity === 'daily'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              每日
            </button>
            <button
              onClick={() => setGranularity('weekly')}
              className={`px-4 py-2 rounded-md font-medium ${
                granularity === 'weekly'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              每周
            </button>
            <button
              onClick={() => setGranularity('monthly')}
              className={`px-4 py-2 rounded-md font-medium ${
                granularity === 'monthly'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              每月
            </button>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            使用时长趋势 ({granularity === 'daily' ? '最近30天' : '最近12周'})
          </h2>
          <div className="space-y-2">
            {trends.map((point) => (
              <div key={point.date} className="flex items-center">
                <div className="w-24 text-sm text-gray-600 flex-shrink-0">
                  {formatDate(point.date)}
                </div>
                <div className="flex-1 flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-6 mr-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{
                        width: `${(point.value / maxValue) * 100}%`,
                        minWidth: point.value > 0 ? '30px' : '0',
                      }}
                    >
                      <span className="text-xs text-white font-medium">
                        {point.value.toFixed(1)}h
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Summary */}
        {granularity === 'daily' && trends.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500 mb-1">平均每日</div>
              <div className="text-2xl font-bold text-blue-600">
                {(trends.reduce((sum, t) => sum + t.value, 0) / trends.length).toFixed(1)}h
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500 mb-1">最高</div>
              <div className="text-2xl font-bold text-green-600">
                {Math.max(...trends.map(t => t.value)).toFixed(1)}h
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500 mb-1">最低</div>
              <div className="text-2xl font-bold text-orange-600">
                {Math.min(...trends.map(t => t.value)).toFixed(1)}h
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-500 mb-1">总计</div>
              <div className="text-2xl font-bold text-purple-600">
                {trends.reduce((sum, t) => sum + t.value, 0).toFixed(0)}h
              </div>
            </div>
          </div>
        )}

        {/* Daily Details Table */}
        {granularity === 'daily' && dailyStats.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">每日详情</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      日期
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      使用时长
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      应用数
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      启动次数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      最常用
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dailyStats.map((stat) => (
                    <tr key={stat.date} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(stat.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {(stat.totalDurationMS / 3600000).toFixed(1)}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {stat.uniqueApps}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {stat.launchCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stat.topApp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Trends;
