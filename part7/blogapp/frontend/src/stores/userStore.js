import { create } from 'zustand';
import blogService from '../services/blogs';
import loginService from '../services/login';
import persistentUser from '../services/persistentUser';  
const getInitialUser = () => {
  const user = persistentUser.getUser()
  if (!user) return null
  blogService.setToken(user.token)
  return user
}

const useUserStore = create((set) => ({
  user: getInitialUser(),
  login: async (credentials) => {
    const user = await loginService.login(credentials);
    persistentUser.saveUser(user);
    blogService.setToken(user.token);
    set({ user });
  },
  logout: () => {
   persistentUser.removeUser();
    blogService.setToken(null);
    set({ user: null });
  },
}));

export default useUserStore;