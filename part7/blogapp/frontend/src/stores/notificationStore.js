import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  notification: null,
  setNotification: (message, type = 'success', timeout = 5000) => {
    set({ notification: { message, type } });
    setTimeout(() => {
      set({ notification: null });
    }, timeout);
  },
}));

export default useNotificationStore;