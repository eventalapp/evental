import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

export const ImageUpload: React.FC<Props> = (props) => {
	const { placeholderImageUrl, files, setFiles } = props;

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
						{...getRootProps({
							className: 'object-cover object-center cursor-pointer'
						})}
						data-tip="Add image"
					>
						<input {...getInputProps()} />
						{files && Object.keys(files).length !== 0 ? (
							files.map((file, i) => (
								<div className="relative inline-block" key={`${i}-${file.name}`}>
									<img
										className="max-h-[300px] w-full border border-gray-200 bg-gray-200 object-cover object-center"
										src={file.preview}
										alt="File Preview"
									/>
									<div className="absolute right-1/2 bottom-1/2 flex h-10 w-10 translate-x-1/2 translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white">
										<FontAwesomeIcon size="lg" icon={faCamera} />
									</div>
								</div>
							))
						) : (
							<div className="relative inline-block">
								<img
									className="max-h-[300px] w-full border border-gray-200 bg-gray-200 object-cover object-center"
									src={placeholderImageUrl}
									alt=""
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

export default ImageUpload;
