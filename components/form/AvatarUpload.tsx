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
	rounded?: boolean;
};

export type FileWithPreview = {
	preview: string;
} & File;

export const AvatarUpload: React.FC<Props> = (props) => {
	const {
		placeholderImageUrl = 'https://cdn.evental.app/images/default-avatar.jpg',
		files,
		setFiles,
		rounded = true
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
								<div className="inline-block relative" key={`${i}-${file.name}`}>
									<img
										className={classNames(
											'object-cover object-center w-32 h-32 border shadow-sm border-gray-300 bg-gray-200',
											rounded ? 'rounded-full' : 'rounded-md'
										)}
										src={file.preview}
										alt="profile"
									/>
									<div className="bg-black/50 w-10 h-10 rounded-full cursor-pointer absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 flex items-center justify-center text-white">
										<FontAwesomeIcon size="lg" icon={faCamera} />
									</div>
								</div>
							))
						) : (
							<div className="inline-block relative">
								<img
									alt="avatar"
									className={classNames(
										'object-cover object-center w-32 h-32 border shadow-sm border-gray-300 bg-gray-200',
										rounded ? 'rounded-full' : 'rounded-md'
									)}
									src={placeholderImageUrl}
								/>
								<div className="bg-black/50 w-10 h-10 rounded-full cursor-pointer absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 flex items-center justify-center text-white">
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
