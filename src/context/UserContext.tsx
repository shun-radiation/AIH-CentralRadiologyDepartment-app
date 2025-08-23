import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import type { UserType } from '../../types/databaseTypes';
import { UserAuth } from './AuthContext';

export type UserContextValue = {
  userInfo: UserType | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserType | null>>;
};

const UserContext = createContext<UserContextValue | null>(null);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userInfo, setUserInfo] = useState<UserType | null>(null);

  const { session } = UserAuth();

  useEffect(() => {
    if (session?.user.id) {
      getUserInfo(session.user.id);
    }
  }, [session?.user.id]);

  const getUserInfo = async (uid: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', uid)
      .single();
    if (data) {
      setUserInfo(data as UserType);
      // console.log('data', data);
    } else {
      console.error(error);
    }
  };
  // console.log('userInfo', userInfo);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserInfo = (): UserContextValue => {
  const ctx = useContext(UserContext);
  if (!ctx)
    throw new Error('useUserInfo must be used within <UserContextProvider>');
  return ctx;
};
