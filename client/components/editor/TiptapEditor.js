import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import styles from "./TiptapEditor.module.css";
import Button from "@/components/ui/Button/Button";

const Toolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className={styles.toolbar}>
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? styles.isActive : ""}
        size="small"
        variant="secondary"
      >
        Bold
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? styles.isActive : ""}
        size="small"
        variant="secondary"
      >
        Italic
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? styles.isActive : ""}
        size="small"
        variant="secondary"
      >
        Strike
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? styles.isActive : ""}
        size="small"
        variant="secondary"
      >
        List
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? styles.isActive : ""}
        size="small"
        variant="secondary"
      >
        1. List
      </Button>
    </div>
  );
};

/**
 * Basic Tiptap Editor component
 * @param {object} props
 * @param {string} props.value - Editor initial content
 * @param {function} props.onChange - Callback when content changes
 */
export default function TiptapEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,

    // Prevent immediate rendering to avoid flicker
    immediatelyRender: false,

    // Update parent component on content change
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className={styles.editorContainer}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className={styles.editorContent} />
    </div>
  );
}
