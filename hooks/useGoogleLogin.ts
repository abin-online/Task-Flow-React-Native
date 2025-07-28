import { firebaseApp } from '@/config/firebase';
import { supabase } from '@/config/supabase';
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function useGoogleLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: Constants.expoConfig?.extra?.googleClientId,
    redirectUri: makeRedirectUri({ useProxy: true } as any),
    scopes: ['openid', 'profile', 'email'],
  });

  useEffect(() => {
    console.log('Google response:', response);

    const signInWithGoogle = async () => {
      if (response?.type !== 'success') return;

      try {
        setIsLoading(true);

        const { id_token } = response.authentication ?? {} as any;
        if (!id_token) throw new Error('Missing ID token from Google');

        const auth = getAuth(firebaseApp);
        const credential = GoogleAuthProvider.credential(id_token);
        const firebaseResult = await signInWithCredential(auth, credential);

        const user = firebaseResult.user;
        const token = await user.getIdToken();

        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token,
        });

        if (error) throw error;

        router.replace('/');
      } catch (err: any) {
        console.error('Login error:', err);
        Alert.alert('Login Failed', err.message ?? 'Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    signInWithGoogle();
  }, [response]);

  const handleGoogleLogin = async () => {
    try {
      console.log('Starting Google login...');
      const result = await promptAsync();
      console.log('promptAsync result:', result);
    } catch (error) {
      console.error('promptAsync error:', error);
      Alert.alert('Login Failed', 'Error initiating Google login.');
    }
  };

  return { handleGoogleLogin, isLoading, request };
}
