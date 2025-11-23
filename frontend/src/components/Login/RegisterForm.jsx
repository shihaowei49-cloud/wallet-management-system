import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Mail } from 'lucide-react';
import { authAPI } from '../../services/api';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // 清除错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = '请输入用户名';
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名至少3个字符';
    }

    if (!formData.email) {
      newErrors.email = '请输入邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }

    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少6个字符';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次密码不一致';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);

      // 注册成功，跳转到首页
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || '注册失败，请重试',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4">
          <span className="text-3xl font-bold text-white">W</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">创建账号</h1>
        <p className="text-gray-500 text-sm mt-2">注册您的钱包管理系统账号</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 用户名输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            用户名
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`
                block w-full pl-10 pr-3 py-3 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.username ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="至少3个字符"
            />
          </div>
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
        </div>

        {/* 邮箱输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            邮箱
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`
                block w-full pl-10 pr-3 py-3 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.email ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="your@email.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* 密码输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            密码
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`
                block w-full pl-10 pr-10 py-3 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.password ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="至少6个字符"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* 确认密码 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            确认密码
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`
                block w-full pl-10 pr-10 py-3 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="再次输入密码"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        {/* 提交错误 */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* 注册按钮 */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full py-3 px-4
            bg-gradient-to-r from-blue-500 to-blue-600
            text-white font-medium rounded-lg
            hover:from-blue-600 hover:to-blue-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            shadow-lg hover:shadow-xl
          "
        >
          {loading ? '注册中...' : '注册'}
        </button>
      </form>

      {/* 已有账号提示 */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          已有账号？{' '}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            立即登录
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
