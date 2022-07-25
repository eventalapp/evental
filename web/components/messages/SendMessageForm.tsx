import { zodResolver } from '@hookform/resolvers/zod';
import * as Prisma from '@prisma/client';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
	SendEventMessagePayload,
	SendEventMessageSchema,
	capitalizeFirstLetter,
	copy
} from '@eventalapp/shared/utils';

import { useSendEvent } from '../../hooks/mutations/useSendEvent';
import { LoadingInner } from '../error/LoadingInner';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { HelpTooltip } from '../primitives/HelpTooltip';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';
import Select from '../primitives/Select';
import { Textarea } from '../primitives/Textarea';

type Props = { eid: string; roles: Prisma.EventRole[] } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
>;

export const SendMessageForm: React.FC<Props> = (props) => {
	const router = useRouter();

	const { eid, roles } = props;
	const { sendEventMessage } = useSendEvent(String(eid));

	const {
		register,
		handleSubmit,
		control,
		setValue,
		watch,
		formState: { errors }
	} = useForm<SendEventMessagePayload>({
		defaultValues: {
			sendType: Prisma.EventMessageSendType.EVERYONE,
			roleId: roles?.[0]?.id,
			eventId: String(eid)
		},
		resolver: zodResolver(SendEventMessageSchema)
	});

	const sendTypeWatcher = watch('sendType');

	return (
		<form
			onSubmit={handleSubmit((data) => {
				sendEventMessage.mutate(data);
			})}
		>
			<div className="my-5 grid grid-flow-row-dense grid-cols-4 gap-5">
				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="name">Title *</Label>
					<Input placeholder="Venue Updates" {...register('title')} />
					{errors.title?.message && <ErrorMessage>{errors.title?.message}</ErrorMessage>}
				</div>

				<div className="col-span-2 md:col-span-1">
					<Label htmlFor="sendType">
						Send Type
						<HelpTooltip message={copy.tooltip.sendType} />
					</Label>
					{Prisma.EventMessageSendType && (
						<div>
							<Controller
								control={control}
								name="sendType"
								render={({ field }) => (
									<Select
										options={Object.values(Prisma.EventMessageSendType).map((category) => ({
											label: capitalizeFirstLetter(category.toLowerCase().replace('_', ' ')),
											value: category
										}))}
										value={field.value}
										onValueChange={(value) => {
											setValue(
												'sendType',
												Prisma.EventMessageSendType[
													value as keyof typeof Prisma.EventMessageSendType
												]
											);
										}}
									/>
								)}
							/>
						</div>
					)}
					{errors.sendType?.message && <ErrorMessage>{errors.sendType?.message}</ErrorMessage>}
				</div>

				{sendTypeWatcher === Prisma.EventMessageSendType.ROLE && (
					<div className="col-span-2 md:col-span-1">
						<Label htmlFor="roleId">
							Role
							<HelpTooltip message={copy.tooltip.sendTypeRole} />
						</Label>

						{roles && (
							<Controller
								control={control}
								name="roleId"
								render={({ field }) => (
									<Select
										options={roles.map((role) => ({ label: role.name, value: role.id }))}
										value={field.value}
										onValueChange={(value) => {
											setValue('roleId', value);
										}}
									/>
								)}
							/>
						)}
						{errors.roleId?.message && <ErrorMessage>{errors.roleId?.message}</ErrorMessage>}
					</div>
				)}

				<div className="col-span-4">
					<Label htmlFor="body">Body</Label>
					<Textarea rows={5} placeholder="Message body" {...register('body')} />
					{errors.body?.message && <ErrorMessage>{errors.body?.message}</ErrorMessage>}
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button
					type="submit"
					className="ml-4"
					variant="primary"
					padding="medium"
					disabled={sendEventMessage.isLoading}
				>
					{sendEventMessage.isLoading ? <LoadingInner /> : 'Send'}
				</Button>
			</div>
		</form>
	);
};
