import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UseCreatePageMutationData } from '../../hooks/mutations/useCreatePageMutation';
import { Controller, useForm } from 'react-hook-form';
import { CreatePagePayload, CreatePageSchema } from '../../utils/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '../form/ErrorMessage';
import { useRouter } from 'next/router';
import { LoadingInner } from '../error/LoadingInner';
import { StyledEditor } from '../form/Editor';
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
		resolver: zodResolver(CreatePageSchema)
	});

	return (
		<form
			onSubmit={handleSubmit((data) => {
				createPageMutation.mutate(data);
			})}
		>
			<div className="flex flex-col w-full mt-5">
				<div className="mb-5">
					<Label htmlFor="name">Name *</Label>
					<Input placeholder="Room 415" {...register('name')} />
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

				<div className="mb-5">
					<Label htmlFor="body">Body</Label>
					<Controller
						control={control}
						name="body"
						render={({ field }) => (
							<StyledEditor
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
