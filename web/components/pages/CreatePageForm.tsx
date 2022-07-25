import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { CreatePagePayload, CreatePageSchema, copy } from '@eventalapp/shared/utils';

import { useCreatePage } from '../../hooks/mutations/useCreatePage';
import { LoadingInner } from '../error/LoadingInner';
import { StyledEditor } from '../form/Editor';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { HelpTooltip } from '../primitives/HelpTooltip';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';
import Switch from '../primitives/Switch';

type Props = { eid: string } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
>;

export const CreatePageForm: React.FC<Props> = (props) => {
	const router = useRouter();

	const { eid } = props;
	const { createPageMutation } = useCreatePage(String(eid));

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
			<div className="mt-5 flex w-full flex-row">
				<div className="mb-5 flex-1">
					<Label htmlFor="name">Name *</Label>
					<Input placeholder="Event Map" {...register('name')} />
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
					{createPageMutation.isLoading ? <LoadingInner /> : 'Create'}
				</Button>
			</div>
		</form>
	);
};
