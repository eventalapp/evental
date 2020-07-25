import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';

import { useNotificationPreferences } from '@eventalapp/shared/hooks';

import { UserNotificationPreferencesForm } from '../../components/authentication/UserNotificationPreferencesForm';
import Column from '../../components/layout/Column';
import { SettingsPageWrapper } from '../../components/layout/SettingsPageWrapper';
import { SettingsSidebarWrapper } from '../../components/layout/SettingsSidebarWrapper';
import { Heading } from '../../components/primitives/Heading';
import { Paragraph } from '../../components/primitives/Paragraph';

const NotificationsPage: NextPage = () => {
	const { data: notificationPreferences } = useNotificationPreferences();

	return (
		<SettingsPageWrapper>
			<NextSeo
				title="Notifications — Evental"
				description="Update your notification preferences"
				openGraph={{
					title: 'Notifications — Evental',
					description: 'Update your notification preferences',
					images: [
						{
							url: 'https://cdn.evental.app/images/logo.jpg',
							width: 389,
							height: 389,
							alt: 'Evental Logo Alt',
							type: 'image/jpeg'
						}
					]
				}}
			/>

			<SettingsSidebarWrapper>
				<Column variant="noMargin">
					<Heading className="mb-3">Notifications Page</Heading>
					<Paragraph className="text-gray-600">Update your notification preferences</Paragraph>

					{notificationPreferences && (
						<UserNotificationPreferencesForm notificationPreferences={notificationPreferences} />
					)}
				</Column>
			</SettingsSidebarWrapper>
		</SettingsPageWrapper>
	);
};

export default NotificationsPage;
