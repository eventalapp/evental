import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { UseEditPageMutationData } from '../../hooks/mutations/useEditPageMutation';
import { UsePageQueryData } from '../../hooks/queries/usePageQuery';
import { copy } from '../../utils/const';
import { EditPagePayload, EditPageSchema } from '../../utils/schemas';
import { HelpTooltip } from '../HelpTooltip';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../form/Button';
import { StyledEditor } from '../form/Editor';
import { ErrorMessage } from '../form/ErrorMessage';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import Switch from '../radix/components/Switch';

type Props = { eid: string } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
> &
	UsePageQueryData &
	UseEditPageMutationData;

export const EditPageForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { page, editPageMutation } = props;

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
			<div className="mt-5 mt-3 flex w-full flex-row">
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
					{editPageMutation.isLoading ? <LoadingInner /> : 'Edit Page'}
				</Button>
			</div>
		</form>
	);
};
