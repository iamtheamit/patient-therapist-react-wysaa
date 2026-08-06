import { create } from 'zustand';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

export interface UIState {
  // Modal State
  activeModal: string | null;
  modalData: Record<string, unknown> | null;
  openModal: (modalId: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;

  // Toast Notification Queue
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeModal: null,
  modalData: null,

  openModal: (modalId: string, data?: Record<string, unknown>) =>
    set({ activeModal: modalId, modalData: data || null }),

  closeModal: () => set({ activeModal: null, modalData: null }),

  toasts: [],

  addToast: (toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast: ToastNotification = { id, ...toast };

    set((state: UIState) => ({
      toasts: [...state.toasts, newToast],
    }));

    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        set((state: UIState) => ({
          toasts: state.toasts.filter((t: ToastNotification) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id: string) =>
    set((state: UIState) => ({
      toasts: state.toasts.filter((t: ToastNotification) => t.id !== id),
    })),
}));
