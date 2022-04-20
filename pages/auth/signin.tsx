import { GetServerSideProps, NextPage } from 'next';
import { BuiltInProviderType } from 'next-auth/providers';
import { ClientSafeProvider, getProviders, signIn } from 'next-auth/react';
import React from 'react';
import Column from '../../components/Column';
import { Navigation } from '../../components/Navigation';

const Providers: React.FC<SignInPageProps> = (props) => {
	const { providers } = props;

	if (providers) {
		return (
			<div className="flex flex-col">
				<span className="">Sign in using one of the following options.</span>

				<div className="grid grid-cols-4 gap-3.5 mt-4">
					{providers.google && (
						<button
							className="bg-gray-200 rounded-2xl p-2"
							onClick={() => signIn(providers.google.id, { callbackUrl: '/' })}
						>
							Google
						</button>
					)}
					{providers.discord && (
						<button
							className="bg-gray-200 rounded-2xl p-2"
							onClick={() => signIn(providers.discord.id, { callbackUrl: '/' })}
						>
							Discord
						</button>
					)}
					{providers.twitch && (
						<button
							className="bg-gray-200 rounded-2xl p-2"
							onClick={() => signIn(providers.twitch.id, { callbackUrl: '/' })}
						>
							Twitch
						</button>
					)}
					{providers.spotify && (
						<button
							className="bg-gray-200 rounded-2xl p-2"
							onClick={() => signIn(providers.spotify.id, { callbackUrl: '/' })}
						>
							Spotify
						</button>
					)}
					{providers.github && (
						<button
							className="bg-gray-200 rounded-2xl p-2"
							onClick={() => signIn(providers.github.id, { callbackUrl: '/' })}
						>
							Github
						</button>
					)}
				</div>
			</div>
		);
	}
	return null;
};

interface SignInPageProps {
	providers: Record<BuiltInProviderType, ClientSafeProvider> | null;
}

const SignInPage: NextPage<SignInPageProps> = (props) => {
	const { providers } = props;

	return (
		<>
			<Navigation />

			<Column>
				<div className="flex flex-col">
					<Providers providers={providers} />
				</div>
			</Column>
		</>
	);
};

export default SignInPage;

export const getServerSideProps: GetServerSideProps<SignInPageProps> = async () => {
	const providers = await getProviders();

	return {
		props: { providers }
	};
};
