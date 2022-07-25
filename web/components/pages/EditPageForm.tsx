import { zodResolver } from '@hookform/resolvers/zod';
import * as Prisma from '@prisma/client';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { EditPagePayload, EditPageSchema, copy } from '@eventalapp/shared/utils';

import { useEditPage } from '../../hooks/mutations/useEditPage';
import { LoadingInner } from '../error/LoadingInner';
import { StyledEditor } from '../form/Editor';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { HelpTooltip } from '../primitives/HelpTooltip';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';
import Switch from '../primitives/Switch';

type Props = { eid: string; pid: string; page: Prisma.EventPage } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
>;

export const EditPageForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { page, eid, pid } = props;
	const { editPageMutation } = useEditPage(String(eid), String(pid));

	const {
		register,
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<EditPagePayload>({
		defaultValues: {
			name: page?.name ?? undefined,
			body: page?.body ?? undefined,
			topLevel: page?.topLevel ?? false
		},
		resolver: zodResolver(EditPageSchema)
	});

	if (!page) return null;

	return (
		<form
			onSubmit={handleSubmit((data) => {
				editPageMutation.mutate(data);
			})}
		>
			<div className="mt-5 flex w-full flex-row">
				<div className="mb-5 flex-1">
					<Label htmlFor="name">Name *</Label>
					<Input placeholder="Room 415" {...register('name')} />
					{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
				</div>

				<div className="ml-5 flex-initial">
					<Label htmlFor="topLevel">
						Top Level Page
						<HelpTooltip message={copy.tooltip.topLevel} />
					</Label>
					<Controller
						control={control}
						name="topLevel"
						render={({ field }) => (
							<Switch
								checked={field.value}
								onCheckedChange={(checked) => {
									field.onChange(checked);
								}}
							/>
						)}
					/>
					{errors.topLevel?.message && <ErrorMessage>{errors.topLevel?.message}</ErrorMessage>}
				</div>
			</div>

			<div className="mt-5 flex w-full flex-col">
				<div className="mb-5">
					<Label htmlFor="body">Description</Label>
					<Controller
						control={control}
						name="body"
						render={({ field }) => (
							<StyledEditor
								imageUpload
								onChange={(value) => {
									field.onChange(value);
								}}
								content={field.value || ''}
							/>
						)}
					/>
					{errors.body?.message && <ErrorMessage>{errors.body?.message}</ErrorMessage>}
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button
					className="ml-4"
					type="submit"
					variant="primary"
					padding="medium"
					disabled={editPageMutation.isLoading}
				>
					{editPageMutation.isLoading ? <LoadingInner /> : 'Save'}
				</Button>
			</div>
		</form>
	);
};
