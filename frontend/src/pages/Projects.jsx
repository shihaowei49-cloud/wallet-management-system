import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Filter, X } from 'lucide-react';
import { formatDate } from '../utils/format';

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    chain: '',
    type: 'DeFi',
    status: 'ongoing',
    notes: '',
  });

  // TODO: 替换为真实 API 调用
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    // Mock数据
    const mockProjects = [
      {
        id: '1',
        name: 'zkSync Era',
        chain: 'zkSync',
        type: 'L2',
        status: 'claimed',
        notes: '已发放空投，平均每钱包700 ZK',
        taskCount: 25,
        completedCount: 25,
        createdAt: '2024-01-10T00:00:00Z',
      },
      {
        id: '2',
        name: 'Blast',
        chain: 'Blast',
        type: 'L2',
        status: 'tge_pending',
        notes: 'TGE预计Q4，积分已开始计算',
        taskCount: 15,
        completedCount: 12,
        createdAt: '2024-02-15T00:00:00Z',
      },
      {
        id: '3',
        name: 'Hyperliquid',
        chain: 'Arbitrum',
        type: 'DeFi',
        status: 'ongoing',
        notes: '交易挖矿中，建议保持日均交互',
        taskCount: 20,
        completedCount: 8,
        createdAt: '2024-03-01T00:00:00Z',
      },
      {
        id: '4',
        name: 'Pudgy Penguins',
        chain: 'Ethereum',
        type: 'NFT',
        status: 'ongoing',
        notes: '持有NFT参与社区活动',
        taskCount: 10,
        completedCount: 5,
        createdAt: '2024-02-20T00:00:00Z',
      },
      {
        id: '5',
        name: 'MEME Season 2',
        chain: 'Ethereum',
        type: 'Meme',
        status: 'ended',
        notes: '第二季已结束',
        taskCount: 8,
        completedCount: 8,
        createdAt: '2024-01-05T00:00:00Z',
      },
    ];

    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 300);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesType = selectedType === 'all' || project.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  const handleEdit = (project) => {
    setEditingProject(project);
    setEditForm({
      name: project.name,
      chain: project.chain,
      type: project.type,
      status: project.status,
      notes: project.notes || '',
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    // TODO: 调用 API 更新项目
    const updatedProjects = projects.map((p) =>
      p.id === editingProject.id
        ? {
            ...p,
            name: editForm.name,
            chain: editForm.chain,
            type: editForm.type,
            status: editForm.status,
            notes: editForm.notes,
            updatedAt: new Date().toISOString(),
          }
        : p
    );
    setProjects(updatedProjects);
    setShowEditModal(false);
    setEditingProject(null);
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`确定要删除项目 "${project.name}" 吗？这将同时删除所有相关任务。`)) {
      return;
    }
    // TODO: 调用 API 删除项目
    setProjects(projects.filter((p) => p.id !== project.id));
  };

  const getStatusBadge = (status) => {
    const config = {
      ongoing: { label: '进行中', color: 'bg-blue-100 text-blue-800' },
      ended: { label: '已结束', color: 'bg-gray-100 text-gray-800' },
      claimed: { label: '已领取', color: 'bg-green-100 text-green-800' },
      tge_pending: { label: 'TGE待定', color: 'bg-yellow-100 text-yellow-800' },
    };
    const { label, color } = config[status] || config.ongoing;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
        {label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const colors = {
      DeFi: 'bg-purple-100 text-purple-800',
      NFT: 'bg-pink-100 text-pink-800',
      L2: 'bg-cyan-100 text-cyan-800',
      Meme: 'bg-orange-100 text-orange-800',
      Pump: 'bg-red-100 text-red-800',
      Other: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[type]}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">项目管理</h1>
          <p className="text-gray-600 mt-1">管理空投项目和任务进度</p>
        </div>
        <button
          onClick={() => {
            setEditingProject(null);
            setEditForm({
              name: '',
              chain: '',
              type: 'DeFi',
              status: 'ongoing',
              notes: '',
            });
            setShowEditModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>新建项目</span>
        </button>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部类型</option>
            <option value="DeFi">DeFi</option>
            <option value="NFT">NFT</option>
            <option value="L2">L2</option>
            <option value="Meme">Meme</option>
            <option value="Pump">Pump</option>
            <option value="Other">其他</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部状态</option>
            <option value="ongoing">进行中</option>
            <option value="tge_pending">TGE待定</option>
            <option value="claimed">已领取</option>
            <option value="ended">已结束</option>
          </select>
        </div>
      </div>

      {/* 项目列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500">加载中...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">暂无项目</div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {project.name}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    {getTypeBadge(project.type)}
                    {getStatusBadge(project.status)}
                  </div>
                  <p className="text-sm text-gray-600">链: {project.chain}</p>
                </div>
              </div>

              {project.notes && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.notes}</p>
              )}

              {/* 任务进度 */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">任务进度</span>
                  <span className="font-medium text-gray-900">
                    {project.completedCount} / {project.taskCount}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${(project.completedCount / project.taskCount) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  <span>查看任务</span>
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-gray-600 hover:text-gray-900 p-1"
                    title="编辑"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project)}
                    className="text-red-600 hover:text-red-900 p-1"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 编辑/添加项目模态框 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingProject ? '编辑项目' : '新建项目'}
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  项目名称 *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例如：zkSync Era"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">链 *</label>
                <input
                  type="text"
                  value={editForm.chain}
                  onChange={(e) => setEditForm({ ...editForm, chain: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例如：Ethereum, BSC, zkSync"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  类型 *
                </label>
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DeFi">DeFi</option>
                  <option value="NFT">NFT</option>
                  <option value="L2">L2</option>
                  <option value="Meme">Meme</option>
                  <option value="Pump">Pump</option>
                  <option value="Other">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  状态 *
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ongoing">进行中</option>
                  <option value="tge_pending">TGE待定</option>
                  <option value="claimed">已领取</option>
                  <option value="ended">已结束</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="项目备注信息..."
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                disabled={!editForm.name || !editForm.chain}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
