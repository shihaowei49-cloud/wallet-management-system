import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Download } from 'lucide-react';
import { formatAddress } from '../utils/format';
import { exportToCSV } from '../utils/export';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  // TODO: 替换为真实 API 调用
  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);

  const fetchProjectAndTasks = async () => {
    // Mock数据
    const mockProject = {
      id: id,
      name: 'zkSync Era',
      chain: 'zkSync',
      type: 'L2',
      status: 'claimed',
      notes: '已发放空投，平均每钱包700 ZK',
    };

    const mockTasks = [
      {
        id: '1',
        projectId: id,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        walletLabel: '主号1',
        status: 'done',
        scoreEstimate: 850,
        comment: '完成所有任务，积分较高',
      },
      {
        id: '2',
        projectId: id,
        walletAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
        walletLabel: '工人-A',
        status: 'done',
        scoreEstimate: 650,
        comment: '基础任务已完成',
      },
      {
        id: '3',
        projectId: id,
        walletAddress: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
        walletLabel: '工人-B',
        status: 'in_progress',
        scoreEstimate: 400,
        comment: '还差几个高级任务',
      },
      {
        id: '4',
        projectId: id,
        walletAddress: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
        walletLabel: '备用钱包',
        status: 'not_started',
        scoreEstimate: 0,
        comment: '',
      },
    ];

    setTimeout(() => {
      setProject(mockProject);
      setTasks(mockTasks);
      setLoading(false);
    }, 300);
  };

  const handleTaskUpdate = (taskId, field, value) => {
    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, [field]: value } : task))
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    // TODO: 调用 API 批量更新任务
    console.log('Saving tasks:', tasks);
    setHasChanges(false);
    alert('任务已保存');
  };

  const handleExport = () => {
    const exportData = tasks.map((task) => ({
      钱包标签: task.walletLabel,
      钱包地址: task.walletAddress,
      状态: getStatusLabel(task.status),
      预估积分: task.scoreEstimate || 0,
      备注: task.comment || '',
    }));

    exportToCSV(exportData, {
      filename: `${project.name}-任务列表-${new Date().toISOString().split('T')[0]}.csv`,
      includeHeaders: true,
    });
  };

  const getStatusLabel = (status) => {
    const labels = {
      not_started: '未开始',
      in_progress: '进行中',
      done: '已完成',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      not_started: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      done: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCompletionStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const notStarted = tasks.filter((t) => t.status === 'not_started').length;
    const totalScore = tasks.reduce((sum, t) => sum + (t.scoreEstimate || 0), 0);

    return { total, completed, inProgress, notStarted, totalScore };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">项目不存在</div>
      </div>
    );
  }

  const stats = getCompletionStats();

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/projects')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.notes}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Download className="w-5 h-5" />
            <span>导出CSV</span>
          </button>
          {hasChanges && (
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-5 h-5" />
              <span>保存更改</span>
            </button>
          )}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">总钱包数</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">已完成</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">进行中</p>
          <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">预估总积分</p>
          <p className="text-2xl font-bold text-purple-600">
            {stats.totalScore.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 任务表格 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                钱包
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                地址
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                预估积分
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                备注
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {task.walletLabel}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-gray-600">
                    {formatAddress(task.walletAddress)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={task.status}
                    onChange={(e) => handleTaskUpdate(task.id, 'status', e.target.value)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                      task.status
                    )}`}
                  >
                    <option value="not_started">未开始</option>
                    <option value="in_progress">进行中</option>
                    <option value="done">已完成</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={task.scoreEstimate || ''}
                    onChange={(e) =>
                      handleTaskUpdate(task.id, 'scoreEstimate', parseInt(e.target.value) || 0)
                    }
                    className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={task.comment || ''}
                    onChange={(e) => handleTaskUpdate(task.id, 'comment', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="添加备注..."
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm text-yellow-800">您有未保存的更改</span>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium"
          >
            保存更改
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
