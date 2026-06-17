import React from 'react';

export const Card = ({ children, className = '', hoverEffect = true }) => {
  return (
    <div className={`rounded-xl p-6 glass-panel ${hoverEffect ? 'glass-panel-hover' : ''} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return <div className={`mb-4 border-b border-white/5 pb-3 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className = '' }) => {
  return <h3 className={`text-lg font-bold text-white tracking-tight ${className}`}>{children}</h3>;
};

export const CardBody = ({ children, className = '' }) => {
  return <div className={`${className}`}>{children}</div>;
};
