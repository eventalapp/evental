import { zodResolver } from '@hookform/resolvers/zod';
import * as Prisma from '@prisma/client';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';

import { EditEventMessagePayload, EditEventMessageSchema } from '@eventalapp/shared/utils';

import { useEditMessage } from '../../hooks/mutations/useEditMessage';
import { LoadingInner } from '../error/LoadingInner';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';
import { Textarea } from '../primitives/Textarea';

type Props = {
	eid: string;
	mid: string;
	message: Prisma.EventMessage;
} & DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const EditMessageForm: React.FC<Props> = (props) => {
	const router = useRouter();

	const { eid, mid, message } = props;
	const { editMessage } = useEditMessage(String(eid), String(mid));

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<EditEventMessagePayload>({
		defaultValues: {
			title: message.title,
			body: message.body
		},
		resolver: zodResolver(EditEventMessageSchema)
	});

	return (
		<form
			onSubmit={handleSubmit((data) => {
				editMessage.mutate(data);
			})}
		>
			<div className="my-5 grid grid-flow-row-dense grid-cols-4 gap-5">
				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="name">Title *</Label>
					<Input placeholder="Venue Updates" {...register('title')} />
					{errors.title?.message && <ErrorMessage>{errors.title?.message}</ErrorMessage>}
				</div>

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
					disabled={editMessage.isLoading}
				>
					{editMessage.isLoading ? <LoadingInner /> : 'Save'}
				</Button>
			</div>
		</form>
	);
};
