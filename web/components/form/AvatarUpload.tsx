import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import Dropzone from 'react-dropzone';
import { toast } from 'react-toastify';

type Props = {
	placeholderImageUrl?: string;
	files: FileWithPreview[];
	setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
};

export type FileWithPreview = {
	preview: string;
} & File;

export const AvatarUpload: React.FC<Props> = (props) => {
	const {
		placeholderImageUrl = 'https://cdn.evental.app/images/default-avatar.jpg',
		files,
		setFiles
	} = props;

	useEffect(() => {
		return () => {
			files.forEach((file) => URL.revokeObjectURL(file.preview));
		};
	}, []);

	return (
		<div>
			<Dropzone
				maxFiles={1}
				accept={{ 'image/*': ['.jpeg', '.png'] }}
				onDropRejected={(errors) => {
					toast.error(errors[0].errors[0].message);
				}}
				onDrop={(files: File[]) => {
					files.map((file) =>
						Object.assign(file, {
							preview: URL.createObjectURL(file)
						})
					);

					setFiles(files as FileWithPreview[]);
				}}
			>
				{({ getRootProps, getInputProps }) => (
					<div
						{...getRootProps({ className: 'object-cover object-center w-32 h-32 cursor-pointer' })}
						data-tip="Add image"
					>
						<input {...getInputProps()} />
						{files && Object.keys(files).length !== 0 ? (
							files.map((file, i) => (
								<div className="relative inline-block" key={`${i}-${file.name}`}>
									<img
										className={classNames(
											'h-32 w-32 rounded-md border border-gray-300 bg-gray-200 object-cover object-center shadow-sm'
										)}
										src={file.preview}
										alt="profile"
									/>
									<div className="absolute right-1/2 bottom-1/2 flex h-10 w-10 translate-x-1/2 translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white">
										<FontAwesomeIcon size="lg" icon={faCamera} />
									</div>
								</div>
							))
						) : (
							<div className="relative inline-block">
								<img
									alt="avatar"
									className={classNames(
										'h-32 w-32 rounded-md border border-gray-300 bg-gray-200 object-cover object-center shadow-sm'
									)}
									src={placeholderImageUrl}
								/>
								<div className="absolute right-1/2 bottom-1/2 flex h-10 w-10 translate-x-1/2 translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white">
									<FontAwesomeIcon size="lg" icon={faCamera} />
								</div>
							</div>
						)}
					</div>
				)}
			</Dropzone>
		</div>
	);
};

export default AvatarUpload;
