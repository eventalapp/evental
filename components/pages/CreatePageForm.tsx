import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { UseCreatePageMutationData } from '../../hooks/mutations/useCreatePageMutation';
import { CreatePagePayload, CreatePageSchema } from '../../utils/schemas';
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
	UseCreatePageMutationData;

export const CreatePageForm: React.FC<Props> = (props) => {
	const router = useRouter();

	const { createPageMutation } = props;

	const {
		register,
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<CreatePagePayload>({
		defaultValues: { topLevel: false },
		resolver: zodResolver(CreatePageSchema)
	});

	return (
		<form
			onSubmit={handleSubmit((data) => {
				createPageMutation.mutate(data);
			})}
		>
			<div className="flex flex-row w-full mt-5">
				<div className="mb-5 flex-1">
					<Label htmlFor="name">Name *</Label>
					<Input placeholder="Event Map" {...register('name')} />
					{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
				</div>

				<div className="flex-initial ml-5">
					<Label htmlFor="topLevel">Top Level Page</Label>
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

			<div className="mb-5">
				<Label htmlFor="body">Body</Label>
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

			<div className="flex flex-row justify-end">
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button
					type="submit"
					className="ml-4"
					variant="primary"
					padding="medium"
					disabled={createPageMutation.isLoading}
				>
					{createPageMutation.isLoading ? <LoadingInner /> : 'Create Page'}
				</Button>
			</div>
		</form>
	);
};
