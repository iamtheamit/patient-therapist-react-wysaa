import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useSessionBootstrap } from '@/features/auth/hooks/useSessionBootstrap';

const SessionContext = createContext<boolean>(false);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isBootstrapping = useSessionBootstrap();
  return <SessionContext.Provider value={isBootstrapping}>{children}</SessionContext.Provider>;
};

export const useIsBootstrapping = () => useContext(SessionContext);
export default SessionProvider;
