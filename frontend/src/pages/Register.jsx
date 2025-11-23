import React from 'react';
import { Users, Wallet, Image, BarChart3 } from 'lucide-react';
import RegisterForm from '../components/Login/RegisterForm';
import FloatingNode from '../components/Login/FloatingNode';

const Register = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* 背景动画效果 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-1/4 left-1/4 animate-pulse-slow" />
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl bottom-1/4 right-1/4 animate-pulse-slow delay-1000" />
      </div>

      {/* 星空效果 */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* 浮动节点 */}
      <FloatingNode
        icon={<Users />}
        label="USER"
        position="top-left"
        color="blue"
      />
      <FloatingNode
        icon={<Wallet />}
        label="BALANCE"
        position="top-right"
        color="green"
      />
      <FloatingNode
        icon={<Image />}
        label="NFT"
        position="bottom-left"
        color="purple"
      />
      <FloatingNode
        icon={<BarChart3 />}
        label="DASHBOARD"
        position="bottom-right"
        color="orange"
      />

      {/* 注册表单 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
