import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface TherapistStatusState {
  isOnline: boolean;
  setIsOnline: (isOnline: boolean) => void;
  toggleOnlineStatus: () => void;
}

export const useTherapistStatusStore = create<TherapistStatusState>()(
  persist(
    (set, get) => ({
      isOnline: true,
      setIsOnline: (isOnline: boolean) => set({ isOnline }),
      toggleOnlineStatus: () => set({ isOnline: !get().isOnline }),
    }),
    {
      name: 'therapysync-therapist-status-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
