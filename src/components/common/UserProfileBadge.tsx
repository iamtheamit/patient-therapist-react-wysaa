import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';

interface UserProfileBadgeProps {
  defaultName?: string;
  defaultEmail?: string;
  defaultAvatar?: string;
  showDivider?: boolean;
  /** When provided, drives the avatar ring color: green for online, amber for offline */
  status?: 'online' | 'offline';
}

export const UserProfileBadge: React.FC<UserProfileBadgeProps> = ({
  defaultName = 'User',
  defaultEmail = 'user@example.com',
  defaultAvatar,
  showDivider = true,
  status,
}) => {
  const user = useAuthStore((state: AuthState) => state.user);

  const name = user?.name || defaultName;
  const email = user?.email || defaultEmail;
  const avatarUrl = user?.avatarUrl || defaultAvatar;
  const initial = name ? name.charAt(0).toUpperCase() : 'U';

  const ringClass =
    status === 'online'
      ? 'ring-2 ring-emerald-500 ring-offset-1'
      : status === 'offline'
        ? 'ring-2 ring-amber-400 ring-offset-1'
        : 'ring-2 ring-[#c3c6d6] ring-offset-1';

  return (
    <div
      className={`flex items-center gap-3 ${
        showDivider ? 'pl-5 border-l border-[#c3c6d6]/50' : ''
      }`}
    >
      {avatarUrl ? (
        <img
          alt={name}
          className={`w-10 h-10 rounded-full object-cover shadow-sm shrink-0 transition-all duration-300 ease-in-out ${ringClass}`}
          src={avatarUrl}
        />
      ) : (
        <div
          className={`w-10 h-10 rounded-full bg-[#0052cc] text-white font-bold text-sm flex items-center justify-center shadow-sm shrink-0 transition-all duration-300 ease-in-out ${ringClass}`}
        >
          {initial}
        </div>
      )}
      <div className="flex flex-col text-left">
        <span className="text-sm font-heading font-bold text-[#191c1e]">{name}</span>
        <span className="text-xs text-[#434654]">{email}</span>
      </div>
    </div>
  );
};
