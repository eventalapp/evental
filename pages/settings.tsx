import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Column from '../components/layout/Column';
import { Navigation } from '../components/navigation';
import PageWrapper from '../components/layout/PageWrapper';
import { UserSettingsForm } from '../components/UserSettingsForm';
import { useUser } from '../hooks/queries/useUser';
import { useImageUploadMutation } from '../hooks/mutations/useImageUploadMutation';
import { useEditUserMutation } from '../hooks/mutations/useEditUserMutation';
import { ssrGetUser } from '../utils/api';
import { PasswordlessUser } from '../utils/stripUserPassword';

type Props = {
	initialUser: PasswordlessUser | undefined;
};

const SettingsPage: NextPage<Props> = (props) => {
	const { initialUser } = props;
	const { user, isUserLoading } = useUser(initialUser);
	const { imageUploadMutation, imageUploadResponse } = useImageUploadMutation();
	const { editUserMutation } = useEditUserMutation(String(user?.id));

	return (
		<PageWrapper>
			<Head>
				<title>Settings</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl font-bold">Settings Page</h1>

				<UserSettingsForm
					user={user}
					imageUploadResponse={imageUploadResponse}
					imageUploadMutation={imageUploadMutation}
					editUserMutation={editUserMutation}
					isUserLoading={isUserLoading}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const initialUser = (await ssrGetUser(context.req)) ?? undefined;

	return {
		props: {
			initialUser
		}
	};
};

export default SettingsPage;
