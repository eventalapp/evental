import { zodResolver } from '@hookform/resolvers/zod';
import * as Prisma from '@prisma/client';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useEditNotificationPreferences } from '@eventalapp/shared/hooks';
import {
	NotificationPreferencePayload,
	NotificationPreferenceSchema
} from '@eventalapp/shared/utils';

import { LoadingInner } from '../error/LoadingInner';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { Label } from '../primitives/Label';
import Switch from '../primitives/Switch';

type Props = {
	notificationPreferences: Prisma.NotificationPreference;
} & DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const UserNotificationPreferencesForm: React.FC<Props> = (props) => {
	const { notificationPreferences } = props;

	const { mutate: editNotificationPreferences, isLoading: isEditNotificationPreferencesLoading } =
		useEditNotificationPreferences();

	const {
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<NotificationPreferencePayload>({
		defaultValues: {
			news: notificationPreferences.news ?? true,
			event: notificationPreferences.event ?? true,
			marketing: notificationPreferences.marketing ?? true
		},
		resolver: zodResolver(NotificationPreferenceSchema)
	});

	//TODO: impl react skeleton
	if (!notificationPreferences) return null;

	return (
		<form
			onSubmit={handleSubmit((data) => {
				editNotificationPreferences(data);
			})}
		>
			<div className="my-5 grid grid-flow-row-dense grid-cols-4 gap-5">
				<div className="col-span-4">
					<Label htmlFor="event">Event Notifications</Label>

					<Controller
						control={control}
						name="event"
						render={({ field }) => (
							<Switch
								checked={field.value}
								onCheckedChange={(checked) => {
									field.onChange(checked);
								}}
							/>
						)}
					/>

					{errors.event?.message && <ErrorMessage>{errors.event?.message}</ErrorMessage>}
				</div>
				<div className="col-span-4">
					<Label htmlFor="news">News Notifications</Label>

					<Controller
						control={control}
						name="news"
						render={({ field }) => (
							<Switch
								checked={field.value}
								onCheckedChange={(checked) => {
									field.onChange(checked);
								}}
							/>
						)}
					/>

					{errors.event?.message && <ErrorMessage>{errors.event?.message}</ErrorMessage>}
				</div>
				<div className="col-span-4">
					<Label htmlFor="marketing">Marketing Notifications</Label>

					<Controller
						control={control}
						name="marketing"
						render={({ field }) => (
							<Switch
								checked={field.value}
								onCheckedChange={(checked) => {
									field.onChange(checked);
								}}
							/>
						)}
					/>

					{errors.event?.message && <ErrorMessage>{errors.event?.message}</ErrorMessage>}
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button type="submit" variant="primary" className="ml-4" padding="medium">
					{isEditNotificationPreferencesLoading ? <LoadingInner /> : 'Save'}
				</Button>
			</div>
		</form>
	);
};
