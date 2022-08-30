import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { spotifyApi } from '../config/spotify';
import { ExtendedSession, TokenError } from '../types';

export const useSpotify = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    if (
      (session as ExtendedSession).error === TokenError.RefreshAccessTokenError
    ) {
      signIn();
    }

    spotifyApi.setAccessToken((session as ExtendedSession).accessToken)
  }, [session]);

  return spotifyApi
};
