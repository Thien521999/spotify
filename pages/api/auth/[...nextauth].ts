import NextAuth, { CallbacksOptions } from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import { scopes, spotifyApi } from '../../../config/spotify';
import { ExtendedToken, TokenError } from '../../../types';

//   account: {
//     provider: 'spotify',
//     type: 'oauth',
//     providerAccountId: '31a6qifzdhrwj3423lumy5wbnh4m',
//     access_token: 'BQDU3m6HhbsRNi67S6EKQXRTinKns1d1YxaUQNfWCabUgX9vazg4xnOg5ONQooM1sEFZ4-8cM1WTkIBfe9G-aLd9ldRYRCiJbXo7IYeOT5E0uMEPlp6XreJWX1LGnV0Smv9aCiq84Q0Cd6UPU3T86g_C7M0bYZ5Tm4PidcNaj4iIXJUgr1ofmBbzaoiLHC8k10fpNE5qlfE89J6iIGWwkNsw3vVas85fG1PO6foxBnP3xsXzdrjblo62a_NFocWYcV11',
//     token_type: 'Bearer',
//     expires_at: 1661736413,
//     refresh_token: 'AQAuzSQfYdqWqFkwHHPXuRs5oaubV0twYY6h91bHlA2diszrq8cZ8cT9Ac_r_msgfHML2uX2PH03zd3yCSL8voUbzgLQwFhHMKqUEMEDH5qK3DOvk6hGbJQCLbBFyBpWNB0',
//     scope: 'playlist-read-private playlist-read-collaborative streaming user-modify-playback-state user-library-read user-follow-read user-read-playback-state user-read-currently-playing user-read-email user-read-recently-played user-read-private user-top-read'
//   },
//   user: {
//     id: '31a6qifzdhrwj3423lumy5wbnh4m',
//     name: 'Martin Tran',
//     email: 'martin.tran@legato.co',
//     image: undefined
//   }
// }

const refreshAccessToken = async (token: ExtendedToken): Promise<ExtendedToken> => {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedTokens } = await spotifyApi.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token || token.refreshToken,
      accessTokenExpiresAt: Date.now() + refreshedTokens.expires_in * 1000,
    };
  } catch (error) {
    console.error(error);

    return {
      ...token,
      error: TokenError.RefreshAccessTokenError,
    };
  }
};

const jwtCallback: CallbacksOptions['jwt'] = async ({
  token,
  account,
  user,
}) => {
  let extendedToken: ExtendedToken;

  // User logs in for the first time
  if (account && user) {
    extendedToken = {
      ...token,
      user,
      accessToken: account.access_token as string,
      refreshToken: account.request_token as string,
      accessTokenExpiresAt: (account.expires_at as number) * 1000, // converted to ms
    };

    return extendedToken;
  }

  // Subsequent requests to check auth sessions
  if (Date.now() + 5000 < (token as ExtendedToken).accessTokenExpiresAt) {
    return token;
  }

  // Access token has expired, refresh it
  return await refreshAccessToken(token as ExtendedToken);
};

const sessionCallback: CallbacksOptions['session'] = async ({
  session,
  token,
}) => {
  session.accessToken = (token as ExtendedToken).accessToken;
  session.error = (token as ExtendedToken).error;

  return session;
};

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: {
        url: 'https://accounts.spotify.com/authorize',
        params: {
          scope: scopes,
        },
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt: jwtCallback,
    session: sessionCallback,
  },
});
