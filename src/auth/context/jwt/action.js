import axios, { endpoints } from 'src/utils/axios';

import { setSession } from './utils';
import { STORAGE_KEY } from './constant';
// import { useLoginMutation } from 'src/services/auth';
// import { toast } from 'src/components/snackbar';

/** **************************************
 * Sign in
 *************************************** */

//   const [login, { isLoading: addonLoad }] = useLoginMutation();

// export const signInWithPassword = async ({ email, password }) => {
//   try {
//     const params = { email, password };

//     const res = await login().unwrap(); 
//     if(res.status) toast.success(res.messege)

//     const { accessToken } = res.token;

//     if (!accessToken) {
//       throw new Error('Access token not found in response');
//     }

//     setSession(accessToken);
//   } catch (error) {
//     console.error('Error during sign in:', error);
//     throw error;
//   }
// };

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({ email, password, firstName, lastName }) => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    // sessionStorage.setItem(STORAGE_KEY, accessToken);
    localStorage.setItem(STORAGE_KEY, accessToken);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
