
import React, { useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, Heading1, Heading2, Heading3, 
  Quote, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, 
  Undo, Redo, Minus, Type
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const isInternalUpdate = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isInternalUpdate.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      isInternalUpdate.current = true;
      onChange(editorRef.current.innerHTML);
      setTimeout(() => isInternalUpdate.current = false, 0);
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
        editorRef.current.focus();
        handleInput();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        execCommand('insertImage', base64String);
      };
      reader.readAsDataURL(file);
    }
    // Reset file input to allow uploading the same file again
    if(e.target) e.target.value = '';
  };

  const ToolbarButton: React.FC<{ 
    icon: React.ReactNode, 
    command?: string, 
    value?: string, 
    title?: string,
    onClick?: () => void
  }> = ({ icon, command, value, title, onClick }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent focus loss
        if (onClick) {
          onClick();
        } else if (command) {
          execCommand(command, value);
        }
      }}
      className="p-2 text-gray-600 hover:text-brand-copper hover:bg-gray-100 rounded-sm transition"
      title={title}
    >
      {icon}
    </button>
  );

  return (
    <div className="border border-gray-200 rounded-sm bg-white overflow-hidden flex flex-col h-[600px]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-1">
          <ToolbarButton icon={<Undo className="w-4 h-4" />} command="undo" title="Undo" />
          <ToolbarButton icon={<Redo className="w-4 h-4" />} command="redo" title="Redo" />
        </div>
        
        <div className="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-1">
          <ToolbarButton icon={<Heading1 className="w-4 h-4" />} command="formatBlock" value="H2" title="Heading 1" />
          <ToolbarButton icon={<Heading2 className="w-4 h-4" />} command="formatBlock" value="H3" title="Heading 2" />
          <ToolbarButton icon={<Heading3 className="w-4 h-4" />} command="formatBlock" value="H4" title="Heading 3" />
          <ToolbarButton icon={<Type className="w-4 h-4" />} command="formatBlock" value="P" title="Paragraph" />
        </div>

        <div className="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-1">
          <ToolbarButton icon={<Bold className="w-4 h-4" />} command="bold" title="Bold" />
          <ToolbarButton icon={<Italic className="w-4 h-4" />} command="italic" title="Italic" />
          <ToolbarButton icon={<Underline className="w-4 h-4" />} command="underline" title="Underline" />
        </div>

        <div className="flex items-center space-x-1 border-r border-gray-300 pr-2 mr-1">
          <ToolbarButton icon={<List className="w-4 h-4" />} command="insertUnorderedList" title="Bullet List" />
          <ToolbarButton icon={<ListOrdered className="w-4 h-4" />} command="insertOrderedList" title="Numbered List" />
          <ToolbarButton icon={<Quote className="w-4 h-4" />} command="formatBlock" value="BLOCKQUOTE" title="Quote" />
        </div>

        <div className="flex items-center space-x-1">
          <ToolbarButton icon={<Minus className="w-4 h-4" />} command="insertHorizontalRule" title="Section Break" />
          <ToolbarButton 
            icon={<LinkIcon className="w-4 h-4" />} 
            title="Link"
            onClick={() => {
              const url = prompt('Enter link URL:');
              if (url) execCommand('createLink', url);
            }}
          />
          <ToolbarButton 
            icon={<ImageIcon className="w-4 h-4" />} 
            title="Image"
            onClick={() => imageInputRef.current?.click()}
          />
          <input 
            type="file" 
            ref={imageInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      {/* Editable Area */}
      <div 
        className="flex-grow p-8 overflow-y-auto outline-none prose prose-slate max-w-none focus:bg-gray-50/30 transition"
        contentEditable
        ref={editorRef}
        onInput={handleInput}
        style={{ minHeight: '300px' }}
      />
      
      <div className="bg-gray-50 px-4 py-2 text-[10px] text-gray-400 border-t border-gray-100 flex justify-between">
        <span>WYSIWYG Mode Active</span>
        <span>HTML/Rich Text</span>
      </div>
    </div>
  );
};

export default RichTextEditor;
