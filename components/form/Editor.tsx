import React, { useCallback } from 'react';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faBold,
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
import { faBar, faCodeBlock } from '../../icons';
import { Link } from '@tiptap/extension-link';
import { LinkDialog } from '../radix/components/LinkDialog';

const MenuBar: React.FC<{ editor: Editor | null; setLink: (link: string) => void }> = (props) => {
	const { editor, setLink } = props;

	if (!editor) {
		return null;
	}

	return (
		<div className="space-x-3 mb-2 pb-1 border-b border-gray-300">
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleBold().run()}
				className={editor.isActive('bold') ? 'text-primary' : ''}
			>
				<FontAwesomeIcon size="lg" icon={faBold} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleItalic().run()}
				className={editor.isActive('italic') ? 'text-primary' : ''}
			>
				<FontAwesomeIcon size="lg" icon={faItalic} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleStrike().run()}
				className={editor.isActive('strike') ? 'text-primary' : ''}
			>
				<FontAwesomeIcon size="lg" icon={faStrikethrough} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleCode().run()}
				className={editor.isActive('code') ? 'text-primary' : ''}
			>
				<FontAwesomeIcon size="lg" icon={faCode} />
			</button>
			<button type="button" onClick={() => editor.chain().focus().unsetAllMarks().run()}>
				<FontAwesomeIcon size="lg" icon={faEraser} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className={editor.isActive('bulletList') ? 'text-primary' : ''}
			>
				<FontAwesomeIcon size="lg" icon={faList} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				className={editor.isActive('orderedList') ? 'text-primary' : ''}
			>
				<FontAwesomeIcon size="lg" icon={faListOl} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleCodeBlock().run()}
				className={editor.isActive('codeBlock') ? 'text-primary' : ''}
			>
				<FontAwesomeIcon size="lg" icon={faCodeBlock} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleBlockquote().run()}
				className={editor.isActive('blockquote') ? 'text-primary' : ''}
			>
				<FontAwesomeIcon size="lg" icon={faQuoteLeft} />
			</button>
			<button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
				<FontAwesomeIcon size="lg" icon={faBar} />
			</button>
			<button type="button" onClick={() => editor.chain().focus().undo().run()}>
				<FontAwesomeIcon size="lg" icon={faRotateLeft} />
			</button>
			<button type="button" onClick={() => editor.chain().focus().redo().run()}>
				<FontAwesomeIcon size="lg" icon={faRotateRight} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().unsetLink().run()}
				disabled={!editor.isActive('link')}
				className={'cursor-pointer'}
			>
				<FontAwesomeIcon size="lg" icon={faLinkSlash} />
			</button>
			<LinkDialog onSubmit={setLink} editor={editor}>
				<button type="button" className={editor.isActive('link') ? 'text-primary' : ''}>
					<FontAwesomeIcon size="lg" icon={faLink} />
				</button>
			</LinkDialog>
		</div>
	);
};

export const StyledEditor: React.FC<{ onChange: (val: string) => void; content: string }> = (
	props
) => {
	const { onChange, content } = props;

	const editor = useEditor({
		extensions: [
			StarterKit,
			Link.configure({
				openOnClick: false
			})
		],
		content,
		onUpdate({ editor }) {
			onChange(editor.getHTML());
		}
	});

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
		<div className="px-3 py-2 rounded border border-gray-300 shadow-sm focus:outline-none min-h-[300px]">
			<MenuBar editor={editor} setLink={setLink} />
			<article className="prose focus:outline-none prose-a:text-primary">
				<EditorContent editor={editor} />
			</article>
		</div>
	);
};
