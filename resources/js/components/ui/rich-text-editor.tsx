import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    List, ListOrdered, Quote, Code, Minus,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Heading1, Heading2, Heading3, Undo, Redo,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    className?: string;
    minHeight?: number;
}

interface ToolbarButtonProps {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
}

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            title={title}
            disabled={disabled}
            onClick={onClick}
            className={cn(
                'flex size-8 items-center justify-center rounded-md text-sm transition-colors',
                active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                disabled && 'pointer-events-none opacity-40',
            )}
        >
            {children}
        </button>
    );
}

function ToolbarDivider() {
    return <div className="mx-1 h-5 w-px bg-border" />;
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder = 'Tulis konten artikel di sini...',
    className,
    minHeight = 320,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder }),
            CharacterCount,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none px-4 py-3',
                style: `min-height: ${minHeight}px`,
            },
        },
    });

    if (!editor) return null;

    const wordCount = editor.storage.characterCount?.words() ?? 0;
    const charCount = editor.storage.characterCount?.characters() ?? 0;

    return (
        <div className={cn('overflow-hidden rounded-xl border bg-background', className)}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 px-2 py-1.5">
                {/* History */}
                <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                    <Undo className="size-3.5" />
                </ToolbarButton>
                <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                    <Redo className="size-3.5" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Headings */}
                <ToolbarButton title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })}>
                    <Heading1 className="size-3.5" />
                </ToolbarButton>
                <ToolbarButton title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
                    <Heading2 className="size-3.5" />
                </ToolbarButton>
                <ToolbarButton title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}>
                    <Heading3 className="size-3.5" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Formatting */}
                <ToolbarButton title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
                    <Bold className="size-3.5" />
                </ToolbarButton>
                <ToolbarButton title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
                    <Italic className="size-3.5" />
                </ToolbarButton>
                <ToolbarButton title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')}>
                    <UnderlineIcon className="size-3.5" />
                </ToolbarButton>
                <ToolbarButton title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')}>
                    <Strikethrough className="size-3.5" />
                </ToolbarButton>
                <ToolbarButton title="Inline code" onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')}>
                    <Code className="size-3.5" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Alignment */}
                <ToolbarButton title="Align Left" onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })}>
                    <AlignLeft className="size-3.5" />
                </ToolbarButton>
                <ToolbarButton title="Align Center" onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })}>
                    <AlignCenter className="size-3.5" />
                </ToolbarButton>
                <ToolbarButton title="Align Right" onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })}>
                    <AlignRight className="size-3.5" />
                </ToolbarButton>
                <ToolbarButton title="Justify" onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })}>
                    <AlignJustify className="size-3.5" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Lists */}
                <ToolbarButton title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
                    <List className="size-3.5" />
                </ToolbarButton>
                <ToolbarButton title="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
                    <ListOrdered className="size-3.5" />
                </ToolbarButton>
                <ToolbarButton title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>
                    <Quote className="size-3.5" />
                </ToolbarButton>
                <ToolbarButton title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                    <Minus className="size-3.5" />
                </ToolbarButton>
            </div>

            {/* Editor area */}
            <EditorContent editor={editor} />

            {/* Word / char count */}
            <div className="flex items-center justify-end gap-3 border-t bg-muted/20 px-4 py-1.5 text-xs text-muted-foreground">
                <span>{wordCount} kata</span>
                <span>·</span>
                <span>{charCount} karakter</span>
            </div>
        </div>
    );
}
