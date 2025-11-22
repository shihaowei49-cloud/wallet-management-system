import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Users, Wallet, Image, DollarSign } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock数据
  const mockChartData = [
    { name: '一月', 用户: 400, 余额: 2400, NFT: 200 },
    { name: '二月', 用户: 300, 余额: 1398, NFT: 210 },
    { name: '三月', 用户: 200, 余额: 9800, NFT: 290 },
    { name: '四月', 用户: 278, 余额: 3908, NFT: 200 },
    { name: '五月', 用户: 189, 余额: 4800, NFT: 281 },
    { name: '六月', 用户: 239, 余额: 3800, NFT: 350 },
  ];

  const StatCard = ({ icon: Icon, title, value, change, color, bgColor }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          <div className="flex items-center mt-2 space-x-1">
            {change > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(change)}%
            </span>
            <span className="text-sm text-gray-500">vs 上月</span>
          </div>
        </div>
        <div className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-7 h-7 ${color}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">数据看板</h1>
        <p className="text-gray-600 mt-1">系统总览和关键指标</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="总用户数"
          value="1,234"
          change={12.5}
          color="text-blue-500"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={Wallet}
          title="总余额"
          value="$123,456"
          change={8.2}
          color="text-green-500"
          bgColor="bg-green-50"
        />
        <StatCard
          icon={Image}
          title="NFT 总数"
          value="5,678"
          change={-3.1}
          color="text-purple-500"
          bgColor="bg-purple-50"
        />
        <StatCard
          icon={DollarSign}
          title="总交易额"
          value="$789,012"
          change={15.3}
          color="text-orange-500"
          bgColor="bg-orange-50"
        />
      </div>

      {/* 图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 柱状图 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">月度统计</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="用户" fill="#3b82f6" />
              <Bar dataKey="NFT" fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 折线图 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">余额趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="余额" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 最近活动 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">最近活动</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">新用户注册</p>
                  <p className="text-xs text-gray-500">2 分钟前</p>
                </div>
              </div>
              <span className="text-sm text-gray-600">user_{item}@example.com</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
