import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import type {
  AuthError,
  Session,
  User,
  WeakPassword,
} from '@supabase/supabase-js';

type SignUpResult =
  | { success: false; error: AuthError }
  | { success: true; data: { user: User | null; session: Session | null } };

export type SignInResult =
  | { success: false; error: AuthError }
  | {
      success: true;
      data: {
        user: User | null;
        session: Session | null;
        weakPassword?: WeakPassword;
      };
    };

export type AuthContextValue = {
  // undefined: 判定中 / null: 未ログイン / Session: ログイン中
  session: Session | null | undefined;
  signupNewUser: (email: string, password: string) => Promise<SignUpResult>;
  signinUser: (email: string, password: string) => Promise<SignInResult>;

  signout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  // Sign up ======================================================================
  // Sign up ======================================================================
  const signupNewUser = async (
    email: string,
    password: string
  ): Promise<SignUpResult> => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      console.error('there was a problem signing up:', error);
      return { success: false, error };
    }
    return { success: true, data };
  };

  // ================================================================================
  // ================================================================================

  // Sign in ======================================================================
  // Sign in ======================================================================

  const signinUser = async (
    email: string,
    password: string
  ): Promise<SignInResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.error('sign in error occurred:', error);
        return { success: false, error };
      }
      console.log('sign in success:', data);
      return { success: true, data };
    } catch (error) {
      console.error('an error occured:', error);
      return { success: false, error: error as AuthError };
    }
  };

  // ================================================================================
  // ================================================================================

  // Sign out ======================================================================
  // Sign out ======================================================================

  const signout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('there was an error:', error);
    }
  };
  // ================================================================================
  // ================================================================================

  useEffect(() => {
    // 起動時に現在のセッションを確認
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); // null or Session
    });
    // 以後の変化を監視
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, signupNewUser, signinUser, signout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  // 普段はこれで返す (nullでない場合)
  if (ctx) return ctx;

  // --- ここから HMR 対策（開発時のみ）-----------------------------
  // ファイル保存（Fast Refresh）のごく一瞬、Provider が再マウントされるため
  // useContext(AuthContext) が null になることがあります。
  // その瞬間に throw すると毎回クラッシュ→開発が辛いので、
  // DEV 環境だけは「準備中のダミー実装」を返して耐えます。
  if (import.meta.env.DEV) {
    // console.warn(
    //   '[UserAuth] Provider がまだ準備中です（HMR中の一時的な状態の可能性）'
    // );
    return {
      session: undefined, // "判定中" を意味する既存の設計どおり
      signupNewUser: async () => {
        throw new Error('AuthContext is not ready yet (DEV/HMR fallback)');
      },
      signinUser: async () => {
        throw new Error('AuthContext is not ready yet (DEV/HMR fallback)');
      },
      signout: async () => {
        /* no-op */
      },
    };
  }
  // --- ここまで HMR 対策 ------------------------------------------

  // 本番では今まで通り、Provider 付け忘れを確実に検知して落とす
  throw new Error('UserAuth must be used within AuthContextProvider');
};
