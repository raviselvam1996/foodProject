import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

// import axios, { endpoints } from 'src/utils/axios';

import { STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';
import { setSession } from './utils';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const { state, setState } = useSetState({
    user: null,
    loading: true,
  });

  const checkUserSession = useCallback(async (res) => {
    try {
      // const accessToken = sessionStorage.getItem(STORAGE_KEY);
      const accessToken = localStorage.getItem(STORAGE_KEY);

      if (accessToken) {
        setSession(accessToken);

        // const res = await axios.get(endpoints.auth.me);

        // const { user } = res.data;
        const user = res
        const response = localStorage.getItem('res');
        const resParse = res ?  user : JSON.parse(response);

        setState({ user: { ...resParse, accessToken }, loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;
  const roles = state?.user?.permissions;
  const permissions = (state?.user?.role === 'admin' || state?.user?.role === 'superadmin') ? ['order_management','menu_management','admin'] :  roles;
  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? 'admin',
            // permissions: state.user?.permissions ?? ['menu'],
            permissions:  permissions,
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
