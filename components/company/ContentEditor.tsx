"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import { Extension } from "@tiptap/core";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Undo,
  Redo,
  Palette,
  Type,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Quote,
  Code as CodeIcon,
  Minus,
  Table as TableIcon,
  CheckSquare,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Image as ImageIcon,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface ContentEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const FONT_SIZES = [
  { label: "10px", value: "10px" },
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "24px", value: "24px" },
  { label: "28px", value: "28px" },
  { label: "32px", value: "32px" },
];

const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => {
              const fontSize = element.style.fontSize;
              return fontSize ? fontSize : null;
            },
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize: null }).run();
        },
    };
  },
});

export function ContentEditor({ content, onChange }: ContentEditorProps) {
  const [colorOpen, setColorOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageOpen, setImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [highlightColor, setHighlightColor] = useState("#ffff00");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: "bg-gray-100 p-4 rounded font-mono text-sm",
          },
        },
      }),
      TextStyle,
      Color,
      FontSize,
      Underline,
      Code,
      CodeBlock,
      HorizontalRule,
      Highlight.configure({
        multicolor: true,
      }),
      Subscript,
      Superscript,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse border border-gray-300 w-full my-4",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-gray-300 bg-gray-100 px-4 py-2 font-bold",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-300 px-4 py-2",
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: "list-none pl-0 my-4",
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "flex items-start my-2",
        },
      }),
      Placeholder.configure({
        placeholder:
          "기업 소개, 제품 설명, 회사 문화 등을 자유롭게 작성해주세요",
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-4",
        },
      }),
      Dropcursor,
      Gapcursor,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    if (!editor) return;

    const updateColor = () => {
      const color = editor.getAttributes("textStyle").color;
      if (color) {
        setSelectedColor(color);
      }
    };

    const updateLink = () => {
      if (editor.isActive("link")) {
        const href = editor.getAttributes("link").href;
        setLinkUrl(href || "");
      } else {
        setLinkUrl("");
      }
    };

    editor.on("selectionUpdate", () => {
      updateColor();
      updateLink();
    });
    editor.on("update", () => {
      updateColor();
      updateLink();
    });

    return () => {
      editor.off("selectionUpdate", updateColor);
      editor.off("update", updateColor);
    };
  }, [editor]);

  const handleLinkSubmit = () => {
    if (!editor || !linkUrl.trim()) {
      return;
    }

    const url = linkUrl.trim().startsWith("http")
      ? linkUrl.trim()
      : `https://${linkUrl.trim()}`;

    if (editor.isActive("link")) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    } else {
      const selectedText = editor.state.selection.content().size > 0
        ? editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to
          )
        : url;
      editor.chain().focus().insertContent(`<a href="${url}">${selectedText}</a>`).run();
    }
    setLinkUrl("");
    setLinkOpen(false);
  };

  const handleImageSubmit = () => {
    if (!editor || !imageUrl.trim()) {
      return;
    }

    const url = imageUrl.trim();
    editor.chain().focus().setImage({ src: url }).run();
    setImageUrl("");
    setImageOpen(false);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg bg-white">
      <div className="border-b p-2 flex gap-1 flex-wrap bg-gray-50 overflow-x-auto">
        {/* 텍스트 스타일 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-gray-200" : ""}
          title="굵게"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-gray-200" : ""}
          title="기울임"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "bg-gray-200" : ""}
          title="밑줄"
        >
          <UnderlineIcon className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "bg-gray-200" : ""}
          title="취소선"
        >
          <Strikethrough className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "bg-gray-200" : ""}
          title="인라인 코드"
        >
          <CodeIcon className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={editor.isActive("subscript") ? "bg-gray-200" : ""}
          title="아래첨자"
        >
          <SubscriptIcon className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={editor.isActive("superscript") ? "bg-gray-200" : ""}
          title="위첨자"
        >
          <SuperscriptIcon className="w-4 h-4" />
        </Button>
        <Popover open={colorOpen} onOpenChange={setColorOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={
                editor.isActive("textStyle") &&
                editor.getAttributes("textStyle").color
                  ? "bg-gray-200"
                  : ""
              }
              title="텍스트 색상"
            >
              <Palette className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="space-y-3">
              <div className="text-sm font-medium">글씨색</div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => {
                    setSelectedColor(e.target.value);
                    editor.chain().focus().setColor(e.target.value).run();
                  }}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => {
                    const color = e.target.value;
                    setSelectedColor(color);
                    if (/^#[0-9A-F]{6}$/i.test(color)) {
                      editor.chain().focus().setColor(color).run();
                    }
                  }}
                  placeholder="#000000"
                  className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="pt-2 border-t">
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().unsetColor().run();
                    setColorOpen(false);
                    setSelectedColor("#000000");
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  기본색으로
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={
                editor.getAttributes("textStyle").fontSize ? "bg-gray-200" : ""
              }
              title="글씨 크기"
            >
              <Type className="w-4 h-4 mr-1" />
              <span className="text-xs">
                {editor.getAttributes("textStyle").fontSize || "크기"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3">
            <div className="space-y-2">
              <div className="text-sm font-medium mb-2">글씨 크기</div>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().unsetFontSize().run();
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm hover:bg-gray-100 ${
                    !editor.getAttributes("textStyle").fontSize
                      ? "bg-gray-100"
                      : ""
                  }`}
                >
                  기본
                </button>
                {FONT_SIZES.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => {
                      editor.chain().focus().setFontSize(size.value).run();
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 ${
                      editor.getAttributes("textStyle").fontSize === size.value
                        ? "bg-gray-100"
                        : ""
                    }`}
                    style={{ fontSize: size.value }}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={editor.isActive("highlight") ? "bg-gray-200" : ""}
              title="하이라이트"
            >
              <Highlighter className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="space-y-3">
              <div className="text-sm font-medium">하이라이트 색상</div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={highlightColor}
                  onChange={(e) => {
                    setHighlightColor(e.target.value);
                    editor.chain().focus().toggleHighlight({ color: e.target.value }).run();
                  }}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={highlightColor}
                  onChange={(e) => {
                    const color = e.target.value;
                    setHighlightColor(color);
                    if (/^#[0-9A-F]{6}$/i.test(color)) {
                      editor.chain().focus().toggleHighlight({ color }).run();
                    }
                  }}
                  placeholder="#ffff00"
                  className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    editor.chain().focus().toggleHighlight().run();
                  }}
                  className="flex-1"
                >
                  {editor.isActive("highlight") ? "제거" : "적용"}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        {/* 제목 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
          }
          title="제목 1"
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
          }
          title="제목 2"
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
          }
          title="제목 3"
        >
          <Heading3 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={
            editor.isActive("heading", { level: 4 }) ? "bg-gray-200" : ""
          }
          title="제목 4"
        >
          <Heading4 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={
            editor.isActive("heading", { level: 5 }) ? "bg-gray-200" : ""
          }
          title="제목 5"
        >
          <Heading5 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={
            editor.isActive("heading", { level: 6 }) ? "bg-gray-200" : ""
          }
          title="제목 6"
        >
          <Heading6 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "bg-gray-200" : ""}
          title="인용구"
        >
          <Quote className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "bg-gray-200" : ""}
          title="코드 블록"
        >
          <CodeIcon className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        {/* 리스트 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
          title="순서 없는 목록"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
          title="순서 있는 목록"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={editor.isActive("taskList") ? "bg-gray-200" : ""}
          title="체크리스트"
        >
          <CheckSquare className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        {/* 정렬 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={
            editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
          }
          title="왼쪽 정렬"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
          }
          title="가운데 정렬"
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={
            editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
          }
          title="오른쪽 정렬"
        >
          <AlignRight className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            editor.isActive({ textAlign: "justify" }) ? "bg-gray-200" : ""
          }
          title="양쪽 정렬"
        >
          <AlignJustify className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        {/* 링크 및 이미지 */}
        <Popover open={linkOpen} onOpenChange={setLinkOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                if (editor.isActive("link")) {
                  const href = editor.getAttributes("link").href;
                  setLinkUrl(href || "");
                } else {
                  setLinkUrl("");
                }
              }}
              className={editor.isActive("link") ? "bg-gray-200" : ""}
              title="링크"
            >
              <LinkIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3">
            <div className="space-y-3">
              <div className="text-sm font-medium">링크 추가/수정</div>
              <Input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleLinkSubmit();
                  }
                }}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleLinkSubmit}
                  className="flex-1"
                >
                  {editor.isActive("link") ? "수정" : "추가"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    editor.chain().focus().unsetLink().run();
                    setLinkUrl("");
                    setLinkOpen(false);
                  }}
                  disabled={!editor.isActive("link")}
                  className="flex-1"
                >
                  제거
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Popover open={imageOpen} onOpenChange={setImageOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              title="이미지"
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3">
            <div className="space-y-3">
              <div className="text-sm font-medium">이미지 추가</div>
              <Input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleImageSubmit();
                  }
                }}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleImageSubmit}
                  className="flex-1"
                  disabled={!imageUrl.trim()}
                >
                  추가
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setImageUrl("");
                    setImageOpen(false);
                  }}
                  className="flex-1"
                >
                  취소
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="구분선"
        >
          <Minus className="w-4 h-4" />
        </Button>
        {/* 표 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={editor.isActive("table") ? "bg-gray-200" : ""}
              title="표"
            >
              <TableIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3">
            <div className="space-y-2">
              <div className="text-sm font-medium mb-2">표 삽입</div>
              <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: 25 }).map((_, i) => {
                  const row = Math.floor(i / 5);
                  const col = i % 5;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        editor
                          .chain()
                          .focus()
                          .insertTable({
                            rows: row + 1,
                            cols: col + 1,
                            withHeaderRow: true,
                          })
                          .run();
                      }}
                      className="w-6 h-6 border border-gray-300 hover:bg-blue-100 rounded"
                    />
                  );
                })}
              </div>
              {editor.isActive("table") && (
                <div className="pt-2 border-t space-y-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().addColumnBefore().run()}
                    className="w-full"
                  >
                    열 앞에 추가
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().addColumnAfter().run()}
                    className="w-full"
                  >
                    열 뒤에 추가
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().deleteColumn().run()}
                    className="w-full"
                  >
                    열 삭제
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().addRowBefore().run()}
                    className="w-full"
                  >
                    행 앞에 추가
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                    className="w-full"
                  >
                    행 뒤에 추가
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().deleteRow().run()}
                    className="w-full"
                  >
                    행 삭제
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => editor.chain().focus().deleteTable().run()}
                    className="w-full"
                  >
                    표 삭제
                  </Button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        {/* 실행 취소/다시 실행 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="실행 취소"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="다시 실행"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>
      <div className="prose prose-sm max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror_prose]:max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
