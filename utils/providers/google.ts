import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';

export interface GoogleProfile extends Record<string, unknown> {
	aud: string;
	azp: string;
	email: string;
	email_verified: boolean;
	exp: number;
	family_name: string;
	given_name: string;
	hd: string;
	iat: number;
	iss: string;
	jti: string;
	name: string;
	nbf: number;
	picture: string;
	sub: string;
}

export default function Google<P extends GoogleProfile>(
	options: OAuthUserConfig<P>
): OAuthConfig<P> {
	return {
		id: 'google',
		name: 'Google',
		type: 'oauth',
		wellKnown: 'https://accounts.google.com/.well-known/openid-configuration',
		authorization: { params: { scope: 'openid email profile' } },
		idToken: true,
		checks: ['pkce', 'state'],
		profile(profile) {
			return {
				id: profile.sub,
				name: profile.name,
				email: profile.email,
				image: '/images/default-avatar.jpg'
			};
		},
		options
	};
}
