import { Provider } from 'next-auth/providers';
import DiscordProvider from 'next-auth/providers/discord';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import RedditProvider from 'next-auth/providers/reddit';
import SpotifyProvider from 'next-auth/providers/spotify';
import TwitchProvider from 'next-auth/providers/twitch';
import TwitterProvider from 'next-auth/providers/twitter';

export const providers: Provider[] = [];

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
	providers.push(
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET
		})
	);
}

if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
	providers.push(
		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET,
			authorization: { params: { scope: 'identify guilds email' } }
		})
	);
}

if (process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET) {
	providers.push(
		TwitterProvider({
			clientId: process.env.TWITTER_CLIENT_ID,
			clientSecret: process.env.TWITTER_CLIENT_SECRET,
			version: '2.0', // opt-in to Twitter OAuth 2.0
			authorization: {
				params: {
					scope: 'tweet.read users.read follows.read like.read list.read block.read offline.access'
				}
			}
		})
	);
}

if (process.env.TWITCH_CLIENT_ID && process.env.TWITCH_CLIENT_SECRET) {
	providers.push(
		TwitchProvider({
			clientId: process.env.TWITCH_CLIENT_ID,
			clientSecret: process.env.TWITCH_CLIENT_SECRET,
			authorization: {
				params: { scope: 'openid user:read:email user:read:follows' }
			}
		})
	);
}

if (process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET) {
	providers.push(
		SpotifyProvider({
			clientId: process.env.SPOTIFY_CLIENT_ID,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
			authorization: {
				params: {
					scope: 'user-read-email user-library-read user-top-read user-read-currently-playing'
				}
			}
		})
	);
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
	providers.push(
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			authorization: {
				params: { scope: 'openid email profile https://www.googleapis.com/auth/youtube.readonly' }
			}
		})
	);
}

if (process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET) {
	providers.push(
		RedditProvider({
			clientId: process.env.REDDIT_CLIENT_ID,
			clientSecret: process.env.REDDIT_CLIENT_SECRET,
			authorization: {
				url: 'https://www.reddit.com/api/v1/authorize?response_type=code&duration=permanent',
				params: { scope: 'identity mysubreddits read' }
			}
		})
	);
}
