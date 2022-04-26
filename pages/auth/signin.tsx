import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetServerSideProps, NextPage } from 'next';
import { BuiltInProviderType } from 'next-auth/providers';
import { ClientSafeProvider, getProviders, signIn } from 'next-auth/react';
import React from 'react';
import { Button } from '../../components/form/Button';
import Column from '../../components/layout/Column';
import { Navigation } from '../../components/navigation';

const Providers: React.FC<SignInPageProps> = (props) => {
	const { providers } = props;

	if (providers) {
		return (
			<div>
				<h1 className="text-3xl mb-2 font-bold">Sign in</h1>
				<span className="mb-5 block	">Sign in using one of the following options.</span>
				<div className="flex flex-col items-center justify-center">
					<div className="flex flex-col w-72">
						{providers.google && (
							<Button
								variant="gradient"
								className="bg-gray-200 rounded-2xl p-2"
								onClick={() => signIn(providers.google.id, { callbackUrl: '/' })}
							>
								<FontAwesomeIcon fill="currentColor" className="mr-3" size="1x" icon={faGoogle} />
								Google
							</Button>
						)}
					</div>
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
