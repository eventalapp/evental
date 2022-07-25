import {
	faBold,
	faCamera,
	faCode,
	faEraser,
	faItalic,
	faLink,
	faLinkSlash,
	faList,
	faListOl,
	faQuoteLeft,
	faRotateLeft,
	faRotateRight,
	faStrikethrough
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useCallback, useEffect, useState } from 'react';

import { faBar, faCodeBlock } from '@eventalapp/shared/utils/icons';

import { LinkDialog } from '../primitives/LinkDialog';
import Tooltip from '../primitives/Tooltip';
import { ImageUploadDialog } from './ImageUploadDialog';

const MenuBar: React.FC<{
	editor: Editor | null;
	setLink: (link: string) => void;
	addImage: (image?: string) => void;
	imageUpload: boolean;
}> = (props) => {
	const { editor, setLink, addImage, imageUpload } = props;
	const [isMac, setIsMac] = useState(false);

	useEffect(() => {
		if (navigator) {
			setIsMac(navigator.userAgent.indexOf('Mac') > -1);
		}
	}, []);

	if (!editor) {
		return null;
	}

	return (
		<div className="mb-2 space-x-2 border-b border-gray-300 px-2 pb-2 text-gray-600 md:space-x-3.5">
			<Tooltip side={'top'} message={`Bold (${isMac ? 'Cmd + B' : 'Ctrl + B'})`}>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={editor.isActive('bold') ? 'text-primary' : ''}
				>
					<FontAwesomeIcon size="lg" icon={faBold} />
				</button>
			</Tooltip>

			<Tooltip side={'top'} message={`Italicize (${isMac ? 'Cmd + I' : 'Ctrl + I'})`}>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={editor.isActive('italic') ? 'text-primary' : ''}
				>
					<FontAwesomeIcon size="lg" icon={faItalic} />
				</button>
			</Tooltip>

			<Tooltip
				side={'top'}
				message={`Strikethrough (${isMac ? 'Cmd + Shift + X' : 'Ctrl + Shift + X'})`}
			>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleStrike().run()}
					className={editor.isActive('strike') ? 'text-primary' : ''}
				>
					<FontAwesomeIcon size="lg" icon={faStrikethrough} />
				</button>
			</Tooltip>

			<Tooltip side={'top'} message={`Code (${isMac ? 'Cmd + E' : 'Ctrl + E'})`}>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleCode().run()}
					className={editor.isActive('code') ? 'text-primary' : ''}
				>
					<FontAwesomeIcon size="lg" icon={faCode} />
				</button>
			</Tooltip>

			<Tooltip side={'top'} message={`Reset Selected Text`}>
				<button type="button" onClick={() => editor.chain().focus().unsetAllMarks().run()}>
					<FontAwesomeIcon size="lg" icon={faEraser} />
				</button>
			</Tooltip>

			<Tooltip
				side={'top'}
				message={`Bullet List (${isMac ? 'Cmd + Shift + 8' : 'Control + Shift + 8'})`}
			>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={editor.isActive('bulletList') ? 'text-primary' : ''}
				>
					<FontAwesomeIcon size="lg" icon={faList} />
				</button>
			</Tooltip>

			<Tooltip
				side={'top'}
				message={`Ordered List (${isMac ? 'Cmd + Shift + 7' : 'Control + Shift + 7'})`}
			>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={editor.isActive('orderedList') ? 'text-primary' : ''}
				>
					<FontAwesomeIcon size="lg" icon={faListOl} />
				</button>
			</Tooltip>

			<Tooltip
				side={'top'}
				message={`Code Block (${isMac ? 'Cmd + Alt + C' : 'Control + Alt + C'})`}
			>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					className={editor.isActive('codeBlock') ? 'text-primary' : ''}
				>
					<FontAwesomeIcon size="lg" icon={faCodeBlock} />
				</button>
			</Tooltip>

			<Tooltip
				side={'top'}
				message={`Blockquote (${isMac ? 'Cmd + Shift + B' : 'Ctrl + Shift + B'})`}
			>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					className={editor.isActive('blockquote') ? 'text-primary' : ''}
				>
					<FontAwesomeIcon size="lg" icon={faQuoteLeft} />
				</button>
			</Tooltip>

			<Tooltip side={'top'} message={`Horizontal Rule`}>
				<button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
					<FontAwesomeIcon size="lg" icon={faBar} />
				</button>
			</Tooltip>

			<Tooltip side={'top'} message={`Undo (${isMac ? 'Cmd + Z' : 'Ctrl + Z'})`}>
				<button type="button" onClick={() => editor.chain().focus().undo().run()}>
					<FontAwesomeIcon size="lg" icon={faRotateLeft} />
				</button>
			</Tooltip>

			<Tooltip side={'top'} message={`Redo (${isMac ? 'Cmd + Shift + Z' : 'Control + Shift + Z'})`}>
				<button type="button" onClick={() => editor.chain().focus().redo().run()}>
					<FontAwesomeIcon size="lg" icon={faRotateRight} />
				</button>
			</Tooltip>

			{imageUpload && (
				<div className="inline-block">
					<ImageUploadDialog onSubmit={addImage} editor={editor}>
						<div>
							<Tooltip side={'top'} message={`Image`}>
								<button type="button">
									<FontAwesomeIcon size="lg" icon={faCamera} />
								</button>
							</Tooltip>
						</div>
					</ImageUploadDialog>
				</div>
			)}

			<div className="inline-block">
				<Tooltip side={'top'} message={`Unlink`}>
					<button
						type="button"
						onClick={() => editor.chain().focus().unsetLink().run()}
						disabled={!editor.isActive('link')}
						className={'cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300'}
					>
						<FontAwesomeIcon size="lg" icon={faLinkSlash} />
					</button>
				</Tooltip>
			</div>

			<LinkDialog onSubmit={setLink} editor={editor}>
				<div className="inline-block">
					<Tooltip side={'top'} message={`Link`}>
						<button type="button" className={editor.isActive('link') ? 'text-primary' : ''}>
							<FontAwesomeIcon size="lg" icon={faLink} />
						</button>
					</Tooltip>
				</div>
			</LinkDialog>
		</div>
	);
};

export const StyledEditor: React.FC<{
	onChange: (val: string) => void;
	content: string;
	imageUpload?: boolean;
}> = (props) => {
	const { onChange, content, imageUpload = false } = props;

	const editor = useEditor({
		extensions: [
			StarterKit,
			...(imageUpload ? [Image] : []),
			Link.configure({
				openOnClick: false
			})
		],
		content,
		onUpdate({ editor }) {
			onChange(editor.getHTML());
		}
	});

	const addImage = useCallback(
		(url) => {
			if (url) {
				editor?.chain().focus().setImage({ src: url }).run();
			}
		},
		[editor]
	);

	const setLink = useCallback(
		(link: string) => {
			if (link === null) {
				return;
			}

			if (link === '') {
				editor?.chain().focus().extendMarkRange('link').unsetLink().run();

				return;
			}

			editor?.chain().focus().extendMarkRange('link').setLink({ href: link }).run();
		},
		[editor]
	);

	if (!editor) {
		return null;
	}

	return (
		<div className="rounded border border-gray-300 py-2 px-3 shadow-sm focus:outline-none">
			<MenuBar editor={editor} setLink={setLink} addImage={addImage} imageUpload={imageUpload} />
			<article className="prose focus:outline-none prose-a:text-primary">
				<EditorContent editor={editor} />
			</article>
		</div>
	);
};
