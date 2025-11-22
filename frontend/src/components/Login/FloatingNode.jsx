import React from 'react';

const FloatingNode = ({ icon, label, position, color = 'blue' }) => {
  const positionClasses = {
    'top-left': 'top-10 left-10',
    'top-right': 'top-10 right-10',
    'bottom-left': 'bottom-10 left-10',
    'bottom-right': 'bottom-10 right-10',
  };

  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    green: 'bg-green-500/20 text-green-400 border-green-500/50',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  };

  const glowColors = {
    blue: 'shadow-blue-500/50',
    green: 'shadow-green-500/50',
    purple: 'shadow-purple-500/50',
    orange: 'shadow-orange-500/50',
  };

  return (
    <div className={`absolute ${positionClasses[position]} animate-float`}>
      <div
        className={`
          relative flex flex-col items-center justify-center
          w-32 h-32 rounded-full border-2
          ${colorClasses[color]}
          backdrop-blur-sm
          transition-all duration-300
          hover:scale-110
          cursor-pointer
        `}
      >
        {/* 发光圆点 */}
        <div
          className={`
            absolute w-4 h-4 rounded-full
            ${color === 'blue' ? 'bg-blue-400' : ''}
            ${color === 'green' ? 'bg-green-400' : ''}
            ${color === 'purple' ? 'bg-purple-400' : ''}
            ${color === 'orange' ? 'bg-orange-400' : ''}
            animate-glow
            ${glowColors[color]}
            shadow-lg
          `}
          style={{
            boxShadow: `0 0 20px currentColor, 0 0 40px currentColor`,
          }}
        />

        {/* 图标 */}
        <div className="text-3xl mb-2 mt-8">
          {icon}
        </div>

        {/* 标签 */}
        <div className="text-xs font-semibold uppercase tracking-wider">
          {label}
        </div>
      </div>

      {/* 连接线动画 */}
      <div className="absolute top-1/2 left-1/2 w-px h-20 bg-gradient-to-b from-current to-transparent opacity-30" />
    </div>
  );
};

export default FloatingNode;
