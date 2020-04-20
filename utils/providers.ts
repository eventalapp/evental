import { Provider } from 'next-auth/providers';
import GoogleProvider from 'next-auth/providers/google';

export const providers: Provider[] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
	providers.push(
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			authorization: {
				params: { scope: 'openid email profile' }
			}
		})
	);
}
