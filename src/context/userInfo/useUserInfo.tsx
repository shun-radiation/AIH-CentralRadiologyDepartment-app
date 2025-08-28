import { createContext, useContext } from 'react';
import type { FormUser } from '../../../types/databaseTypes';

export type UserContextValue = {
  userInfo: FormUser | null;
  setUserInfo: React.Dispatch<React.SetStateAction<FormUser | null>>;
  modalities: {
    id: number;
    name: string;
  }[];
};

export const UserContext = createContext<UserContextValue | null>(null);

export const useUserInfo = (): UserContextValue => {
  const ctx = useContext(UserContext);
  if (!ctx)
    throw new Error('useUserInfo must be used within <UserContextProvider>');
  return ctx;
};
