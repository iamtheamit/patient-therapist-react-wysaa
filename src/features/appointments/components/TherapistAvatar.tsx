import React, { useState } from 'react';
import { getInitials } from '@/utils/formatters';

interface TherapistAvatarProps {
  url?: string;
  name: string;
  size?: string;
}

export const TherapistAvatar: React.FC<TherapistAvatarProps> = ({
  url,
  name,
  size = 'w-14 h-14',
}) => {
  const [hasError, setHasError] = useState(false);
  const initials = getInitials(name);

  if (!url || hasError) {
    return (
      <div
        className={`${size} rounded-full bg-gradient-to-br from-[#003d9b] to-[#0052cc] text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs shrink-0 select-none`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={url}
      alt=""
      onError={() => setHasError(true)}
      className={`${size} rounded-full object-cover border-2 border-white shadow-xs shrink-0`}
    />
  );
};

export default TherapistAvatar;
