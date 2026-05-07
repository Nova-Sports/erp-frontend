import { useCallback, useEffect, useRef, useState } from "react";

/* ── Lexical core ── */
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_LOW,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $setSelection,
  $isTextNode,
  $createParagraphNode,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import {
  $patchStyleText,
  $getSelectionStyleValueForProperty,
} from "@lexical/selection";
import { $createHeadingNode, HeadingNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";

const editorTheme = {
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "underline line-through",
  },
  heading: {
    h1: "text-3xl font-bold",
    h2: "text-2xl font-bold",
    h3: "text-xl font-bold",
    h4: "text-lg font-bold",
    h5: "text-base font-bold",
    h6: "text-sm font-bold",
  },
  paragraph: "mb-1",
};

const FONTS = [
  "",
  "Arial",
  "Courier New",
  "Georgia",
  "Times New Roman",
  "Verdana",
];
const HEADINGS = [
  { label: "Normal", value: "paragraph" },
  { label: "H1", value: "h1" },
  { label: "H2", value: "h2" },
  { label: "H3", value: "h3" },
  { label: "H4", value: "h4" },
  { label: "H5", value: "h5" },
  { label: "H6", value: "h6" },
];

/* ══════════════════════════════════════════════════════════════════
   Plugin: expose editor instance via ref
   ══════════════════════════════════════════════════════════════════ */

function EditorRefPlugin({ editorRef }) {
  if (!editorRef) return;
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editorRef.current = editor;
  }, [editor, editorRef]);
  return null;
}

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const savedSelectionRef = useRef(null);
  const [state, setState] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    blockType: "paragraph",
    fontFamily: "",
    fontColor: "#000000",
    bgColor: "#ffffff",
  });

  const syncToolbar = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;
    // Read all Lexical state values here, inside the editor read context,
    // before passing them to setState (which React may invoke asynchronously).
    const bold = selection.hasFormat("bold");
    const italic = selection.hasFormat("italic");
    const underline = selection.hasFormat("underline");
    const strikethrough = selection.hasFormat("strikethrough");
    const fontFamily = $getSelectionStyleValueForProperty(
      selection,
      "font-family",
      "",
    );
    const fontColor = $getSelectionStyleValueForProperty(
      selection,
      "color",
      "#000000",
    );
    const bgColor = $getSelectionStyleValueForProperty(
      selection,
      "background-color",
      "#ffffff",
    );
    setState((prev) => ({
      ...prev,
      bold,
      italic,
      underline,
      strikethrough,
      fontFamily,
      fontColor,
      bgColor,
    }));
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        editor.getEditorState().read(syncToolbar);
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor, syncToolbar]);

  const applyFormat = (fmt) => editor.dispatchCommand(FORMAT_TEXT_COMMAND, fmt);
  const applyAlign = (align) =>
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align);

  const applyHeading = (value) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      if (value === "paragraph") {
        $setBlocksType(selection, () => $createParagraphNode());
      } else {
        $setBlocksType(selection, () => $createHeadingNode(value));
      }
    });
  };

  const saveSelection = () => {
    editor.getEditorState().read(() => {
      const sel = $getSelection();
      savedSelectionRef.current = sel ? sel.clone() : null;
    });
  };

  const applyStyle = (style, value) => {
    editor.update(() => {
      if (savedSelectionRef.current) {
        $setSelection(savedSelectionRef.current);
        savedSelectionRef.current = null;
      }
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { [style]: value });
      }
    });
  };

  const clearFormatting = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      ["bold", "italic", "underline", "strikethrough"].forEach((fmt) => {
        if (selection.hasFormat(fmt))
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, fmt);
      });
      $patchStyleText(selection, {
        color: null,
        "background-color": null,
        "font-family": null,
      });
    });
  };

  const btn = (active, onClick, title, children) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`px-2 py-1 text-xs rounded transition-colors border ${
        active
          ? "bg-primary text-white border-primary"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 px-2 py-1.5 bg-gray-50 rounded-t-lg">
      <select
        value={state.fontFamily}
        onMouseDown={(e) => e.stopPropagation()}
        onChange={(e) => applyStyle("font-family", e.target.value || null)}
        className="text-xs border border-gray-300 rounded px-1 py-1 bg-white"
        title="Font family"
      >
        {FONTS.map((f) => (
          <option key={f} value={f}>
            {f || "Font"}
          </option>
        ))}
      </select>

      <select
        value={state.blockType}
        onMouseDown={(e) => e.stopPropagation()}
        onChange={(e) => applyHeading(e.target.value)}
        className="text-xs border border-gray-300 rounded px-1 py-1 bg-white"
        title="Heading"
      >
        {HEADINGS.map((h) => (
          <option key={h.value} value={h.value}>
            {h.label}
          </option>
        ))}
      </select>

      <div className="w-px h-5 bg-gray-300 mx-0.5" />
      {btn(state.bold, () => applyFormat("bold"), "Bold", <b>B</b>)}
      {btn(state.italic, () => applyFormat("italic"), "Italic", <i>I</i>)}
      {btn(
        state.underline,
        () => applyFormat("underline"),
        "Underline",
        <u>U</u>,
      )}
      {btn(
        state.strikethrough,
        () => applyFormat("strikethrough"),
        "Strikethrough",
        <s>S</s>,
      )}

      <div className="w-px h-5 bg-gray-300 mx-0.5" />

      <label
        title="Font color"
        className="flex items-center gap-0.5 cursor-pointer"
        onMouseDown={saveSelection}
      >
        <span className="text-xs text-gray-600">A</span>
        <input
          type="color"
          value={state.fontColor?.startsWith("#") ? state.fontColor : "#000000"}
          onChange={(e) => applyStyle("color", e.target.value)}
          className="w-5 h-5 p-0 border-0 rounded cursor-pointer"
        />
      </label>
      <label
        title="Background color"
        className="flex items-center gap-0.5 cursor-pointer"
        onMouseDown={saveSelection}
      >
        <span className="text-xs text-gray-600 bg-yellow-200 px-0.5 rounded">
          A
        </span>
        <input
          type="color"
          value={state.bgColor?.startsWith("#") ? state.bgColor : "#ffffff"}
          onChange={(e) => applyStyle("background-color", e.target.value)}
          className="w-5 h-5 p-0 border-0 rounded cursor-pointer"
        />
      </label>

      <div className="w-px h-5 bg-gray-300 mx-0.5" />
      {btn(
        false,
        () => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined),
        "Outdent",
        "⇤",
      )}
      {btn(
        false,
        () => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined),
        "Indent",
        "⇥",
      )}
      {btn(false, () => applyAlign("left"), "Align left", "≡L")}
      {btn(false, () => applyAlign("center"), "Align center", "≡C")}
      {btn(false, () => applyAlign("right"), "Align right", "≡R")}
      {btn(false, () => applyAlign("justify"), "Justify", "≡J")}
      <div className="w-px h-5 bg-gray-300 mx-0.5" />
      {btn(false, clearFormatting, "Clear formatting", "✕")}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   RichEditor — single Lexical editor instance
   ══════════════════════════════════════════════════════════════════ */

/**
 * Custom span → TextNode converter that preserves color, background-color,
 * and font-family (Lexical's built-in converter ignores these).
 */
function convertSpanWithInlineStyles(domNode) {
  const style = domNode.style;
  const color = style.color;
  const bgColor = style.backgroundColor;
  const fontFamily = style.fontFamily;
  const fontWeight = style.fontWeight;
  const textDecoration = style.textDecoration
    ? style.textDecoration.split(" ")
    : [];
  const fontStyle = style.fontStyle;
  const verticalAlign = style.verticalAlign;

  const hasBold = fontWeight === "700" || fontWeight === "bold";
  const hasStrikethrough = textDecoration.includes("line-through");
  const hasItalic = fontStyle === "italic";
  const hasUnderline = textDecoration.includes("underline");
  const hasInlineStyle = Boolean(color || bgColor || fontFamily);

  if (
    !hasBold &&
    !hasStrikethrough &&
    !hasItalic &&
    !hasUnderline &&
    !hasInlineStyle &&
    verticalAlign !== "sub" &&
    verticalAlign !== "super"
  ) {
    return null;
  }

  return {
    conversion: () => ({
      forChild: (lexicalNode) => {
        if (!$isTextNode(lexicalNode)) return lexicalNode;
        if (hasBold && !lexicalNode.hasFormat("bold"))
          lexicalNode.toggleFormat("bold");
        if (hasStrikethrough && !lexicalNode.hasFormat("strikethrough"))
          lexicalNode.toggleFormat("strikethrough");
        if (hasItalic && !lexicalNode.hasFormat("italic"))
          lexicalNode.toggleFormat("italic");
        if (hasUnderline && !lexicalNode.hasFormat("underline"))
          lexicalNode.toggleFormat("underline");
        if (verticalAlign === "sub" && !lexicalNode.hasFormat("subscript"))
          lexicalNode.toggleFormat("subscript");
        if (verticalAlign === "super" && !lexicalNode.hasFormat("superscript"))
          lexicalNode.toggleFormat("superscript");
        if (hasInlineStyle) {
          const parts = [];
          if (color) parts.push(`color: ${color}`);
          if (bgColor) parts.push(`background-color: ${bgColor}`);
          if (fontFamily) parts.push(`font-family: ${fontFamily}`);
          const styleStr = parts.join("; ");
          const existing = lexicalNode.getStyle();
          lexicalNode.setStyle(
            existing ? `${existing}; ${styleStr}` : styleStr,
          );
        }
        return lexicalNode;
      },
      node: null,
    }),
    priority: 1, // Override TextNode's default priority-0 span converter
  };
}

const makeLexicalConfig = (initialHtml) => ({
  namespace: "LocationEmailEditor",
  theme: editorTheme,
  onError: (err) => console.error("Lexical error:", err),
  nodes: [HeadingNode, ListNode, ListItemNode, LinkNode],
  html: {
    import: {
      span: convertSpanWithInlineStyles,
    },
  },
  editorState: initialHtml
    ? (editor) => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialHtml, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);
        $getRoot().append(...nodes);
      }
    : undefined,
});

export default function CTextEditor({
  initialHtml,
  onChange,
  editorRef,
  minHeight = 200,
}) {
  /* ========================= All States ========================= */

  /*  ========================= All Functions ========================= */

  /* ========================= All UseEffects ========================= */

  const handleChange = useCallback(
    (editorState, editor) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor, null);
        onChange(html);
      });
    },
    [onChange],
  );

  return (
    <LexicalComposer initialConfig={makeLexicalConfig(initialHtml)}>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <ToolbarPlugin />
        <div className="relative bg-white" style={{ minHeight }}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="outline-none px-3 py-2 text-sm"
                style={{ minHeight }}
              />
            }
            placeholder={
              <div className="absolute top-2 left-3 text-gray-400 text-sm pointer-events-none select-none">
                Enter email template…
              </div>
            }
            ErrorBoundary={({ children }) => children}
          />
        </div>
        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} ignoreSelectionChange />
        <EditorRefPlugin editorRef={editorRef} />
      </div>
    </LexicalComposer>
  );
}
