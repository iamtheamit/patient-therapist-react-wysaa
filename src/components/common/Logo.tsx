import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  to?: string;
  subtitle?: string;
  className?: string;
  iconSize?: string;
  textSize?: string;
}

export const Logo: React.FC<LogoProps> = ({
  to,
  subtitle,
  className = '',
  iconSize = 'text-3xl',
  textSize = 'text-2xl',
}) => {
  const content = (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      <span className={`material-symbols-outlined text-[#005eb8] ${iconSize}`}>psychology</span>
      <div className="flex flex-col text-left">
        <span className={`font-heading ${textSize} font-bold text-[#005eb8] leading-none`}>
          TherapySync
        </span>
        {subtitle && (
          <span className="text-[10px] font-bold text-[#51606f] uppercase tracking-wider mt-1">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
};

export default Logo;
