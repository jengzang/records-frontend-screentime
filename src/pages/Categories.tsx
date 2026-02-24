import { useEffect, useState } from 'react';
import { screentimeApi, formatDuration } from '../services/screentimeApi';
import type { CategoryStat } from '../types/screentime';

function Categories() {
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await screentimeApi.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('加载类别数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Social: 'bg-blue-500',
      Entertainment: 'bg-purple-500',
      Gaming: 'bg-red-500',
      Tools: 'bg-green-500',
      News: 'bg-yellow-500',
      Productivity: 'bg-indigo-500',
      Shopping: 'bg-pink-500',
      System: 'bg-gray-500',
      Other: 'bg-gray-400',
    };
    return colors[category] || 'bg-gray-400';
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      Social: '社交',
      Entertainment: '娱乐',
      Gaming: '游戏',
      Tools: '工具',
      News: '新闻',
      Productivity: '生产力',
      Shopping: '购物',
      System: '系统',
      Other: '其他',
    };
    return labels[category] || category;
  };

  const totalDuration = categories.reduce((sum, cat) => sum + cat.totalDurationMS, 0);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">类别统计</h1>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {categories.map((category) => (
            <div key={category.category} className="bg-white rounded-lg shadow overflow-hidden">
              <div className={`${getCategoryColor(category.category)} h-2`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {getCategoryLabel(category.category)}
                  </h3>
                  <span className="text-2xl font-bold text-gray-900">
                    {category.percentage.toFixed(1)}%
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">使用时长</span>
                    <span className="font-medium text-gray-900">
                      {formatDuration(category.totalDurationMS)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">应用数量</span>
                    <span className="font-medium text-gray-900">{category.appCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">启动次数</span>
                    <span className="font-medium text-gray-900">
                      {category.launchCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">通知数量</span>
                    <span className="font-medium text-gray-900">
                      {category.notificationCount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className={`${getCategoryColor(category.category)} h-2 rounded-full`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>

                {/* Top Apps */}
                {category.apps.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-2">主要应用</div>
                    <div className="flex flex-wrap gap-1">
                      {category.apps.slice(0, 5).map((app) => (
                        <span
                          key={app}
                          className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {app}
                        </span>
                      ))}
                      {category.apps.length > 5 && (
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                          +{category.apps.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-4">类别分布</h2>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.category} className="flex items-center">
                <div className="w-32 text-sm text-gray-700 font-medium">
                  {getCategoryLabel(category.category)}
                </div>
                <div className="flex-1 flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-8 mr-3">
                    <div
                      className={`${getCategoryColor(category.category)} h-8 rounded-full flex items-center justify-between px-3`}
                      style={{ width: `${category.percentage}%`, minWidth: '60px' }}
                    >
                      <span className="text-xs text-white font-medium">
                        {category.percentage.toFixed(1)}%
                      </span>
                      <span className="text-xs text-white">
                        {(category.totalDurationMS / 3600000).toFixed(0)}h
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">总类别数</div>
            <div className="text-2xl font-bold text-gray-800">{categories.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">总应用数</div>
            <div className="text-2xl font-bold text-gray-800">
              {categories.reduce((sum, cat) => sum + cat.appCount, 0)}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">总使用时长</div>
            <div className="text-2xl font-bold text-gray-800">
              {(totalDuration / 3600000).toFixed(0)}小时
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories;
