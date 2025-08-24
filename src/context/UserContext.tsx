import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import type { UserWithModality } from '../../types/databaseTypes';
import { UserAuth } from './AuthContext';

export type UserContextValue = {
  userInfo: UserWithModality | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserWithModality | null>>;
  modalities: {
    id: number;
    name: string;
  }[];
};

const UserContext = createContext<UserContextValue | null>(null);

// ========================================

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userInfo, setUserInfo] = useState<UserWithModality | null>(null);
  const [modalities, setModalities] = useState<{ id: number; name: string }[]>(
    []
  );

  const { session } = UserAuth();

  useEffect(() => {
    if (session?.user.id) {
      getUserInfo(session.user.id);
    }
  }, [session?.user.id]);

  const getUserInfo = async (uid: string) => {
    const { data, error } = await supabase
      .from('users')
      .select(
        `id,
        name_kanji,
        name_kana,
        employee_number,
        technologist_number,
        hire_date,
        modality_id, 
        created_at,
        updated_at,
        modality:modalities!users_modality_id_fkey ( id, name )`
      )
      .eq('id', uid)
      .single();
    if (data) {
      setUserInfo(data as UserWithModality);
      // console.log('data', data);
    } else {
      console.error(error);
    }
  };
  // console.log('userInfo', userInfo);

  useEffect(() => {
    supabase
      .from('modalities')
      .select('id, name')
      .then(({ data }) => {
        setModalities(data ?? []);
      });
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, modalities }}>
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
