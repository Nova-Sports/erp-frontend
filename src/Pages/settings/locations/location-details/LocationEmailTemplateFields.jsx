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
  $createParagraphNode,
  $insertNodes,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import {
  $patchStyleText,
  $getSelectionStyleValueForProperty,
} from "@lexical/selection";
import { $createHeadingNode, HeadingNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";

export const LOCATION_EMAIL_TEMPLATE_MODULES = [
  {
    key: "quotes",
    templateType: "quotes",
    typeAliases: ["quotes", "quote"],
    label: "Quotes",
    subjectKey: "quoteEmailSubject",
    formatKey: "quoteEmailFormat",
    variables: {
      "Q-ID": " << Quote ID >> ",
      "CUSTOMER ID": " << Customer ID >> ",
      "CUSTOMER NAME": " << Customer Name >> ",
      "JOB NAME": " << Job Name >> ",
      "FIRST NAME": " << First Name >> ",
      "LAST NAME": " << Last Name >> ",
    },
  },
  {
    key: "approval",
    templateType: "approval",
    typeAliases: ["approval", "approvals"],
    label: "Order Approval",
    subjectKey: "approvalEmailSubject",
    formatKey: "approvalEmailFormat",
    sendPdfKey: "approvalSendPdf",
    ccSalesPersonKey: "approvalCcSalesPerson",
    sendEmailConfirmationKey: "approvalSendConfirmation",
    confirmationFormatKey: "approvalConfirmationTemplate",
    confirmationSubjectKey: "approvalConfirmationSubject",
    variables: {
      "W-ID": " << ID >> ",
      "CUSTOMER ID": " << Customer ID >> ",
      "CUSTOMER NAME": " << Customer Name >> ",
      "JOB NAME": " << Job Name >> ",
      "FIRST NAME": " << First Name >> ",
      "LAST NAME": " << Last Name >> ",
      "APPROVAL LINK": " << Approval Link >> ",
    },
  },
];

/* ══════════════════════════════════════════════════════════════════
   Lexical editor theme
   ══════════════════════════════════════════════════════════════════ */

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

/* ══════════════════════════════════════════════════════════════════
   Plugin: load initial HTML into the editor
   ══════════════════════════════════════════════════════════════════ */

function InitialHtmlPlugin({ html }) {
  const [editor] = useLexicalComposerContext();
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current || !html) return;
    didInit.current = true;
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      root.append(...nodes);
    });
  }, [editor, html]);

  return null;
}

/* ══════════════════════════════════════════════════════════════════
   Plugin: expose editor instance via ref
   ══════════════════════════════════════════════════════════════════ */

function EditorRefPlugin({ editorRef }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editorRef.current = editor;
  }, [editor, editorRef]);
  return null;
}

/* ══════════════════════════════════════════════════════════════════
   Toolbar
   ══════════════════════════════════════════════════════════════════ */

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

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
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

  const applyStyle = (style, value) => {
    editor.update(() => {
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

const makeLexicalConfig = () => ({
  namespace: "LocationEmailEditor",
  theme: editorTheme,
  onError: (err) => console.error("Lexical error:", err),
  nodes: [HeadingNode, ListNode, ListItemNode, LinkNode],
});

function RichEditor({ initialHtml, onChange, editorRef, minHeight = 200 }) {
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
    <LexicalComposer initialConfig={makeLexicalConfig()}>
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
        <InitialHtmlPlugin html={initialHtml} />
        <EditorRefPlugin editorRef={editorRef} />
      </div>
    </LexicalComposer>
  );
}

const getTemplateValue = (data, moduleConfig, field) => {
  const nestedTemplate =
    data?.moduleEmailTemplates?.[moduleConfig.key] ||
    data?.defaultEmailFormats?.[moduleConfig.key] ||
    data?.locationEmailTemplates?.[moduleConfig.key] ||
    {};

  const flatFieldKey =
    field === "subject"
      ? moduleConfig.subjectKey
      : field === "confirmationFormat"
        ? moduleConfig.confirmationFormatKey
        : field === "confirmationSubject"
          ? moduleConfig.confirmationSubjectKey
          : moduleConfig.formatKey;

  return nestedTemplate?.[field] || data?.[flatFieldKey] || "";
};

const getTemplateBooleanValue = (data, moduleConfig, field) => {
  const nestedTemplate =
    data?.moduleEmailTemplates?.[moduleConfig.key] ||
    data?.defaultEmailFormats?.[moduleConfig.key] ||
    data?.locationEmailTemplates?.[moduleConfig.key] ||
    {};

  const flatFieldKey =
    field === "sendPdf"
      ? moduleConfig.sendPdfKey
      : field === "sendConfirmation"
        ? moduleConfig.sendEmailConfirmationKey
        : moduleConfig.ccSalesPersonKey;

  if (typeof nestedTemplate?.[field] === "boolean")
    return nestedTemplate[field];
  if (typeof data?.[flatFieldKey] === "boolean") return data[flatFieldKey];
  return false;
};

export const buildLocationEmailTemplates = (data = {}) =>
  LOCATION_EMAIL_TEMPLATE_MODULES.reduce((accumulator, moduleConfig) => {
    accumulator[moduleConfig.key] = {
      subject: getTemplateValue(data, moduleConfig, "subject"),
      format: getTemplateValue(data, moduleConfig, "format"),
      ...(moduleConfig.confirmationFormatKey
        ? {
            confirmationFormat: getTemplateValue(
              data,
              moduleConfig,
              "confirmationFormat",
            ),
          }
        : {}),
      ...(moduleConfig.confirmationSubjectKey
        ? {
            confirmationSubject: getTemplateValue(
              data,
              moduleConfig,
              "confirmationSubject",
            ),
          }
        : {}),
      sendPdf: getTemplateBooleanValue(data, moduleConfig, "sendPdf"),
      ccSalesPerson: getTemplateBooleanValue(
        data,
        moduleConfig,
        "ccSalesPerson",
      ),
      sendConfirmation: getTemplateBooleanValue(
        data,
        moduleConfig,
        "sendConfirmation",
      ),
    };
    return accumulator;
  }, {});

export const withLocationEmailTemplateFields = (data = {}) => {
  const templates = buildLocationEmailTemplates(data);

  const flattenedTemplateFields = LOCATION_EMAIL_TEMPLATE_MODULES.reduce(
    (accumulator, moduleConfig) => {
      const next = {
        ...accumulator,
        [moduleConfig.subjectKey]: templates[moduleConfig.key].subject,
        [moduleConfig.formatKey]: templates[moduleConfig.key].format,
      };
      if (moduleConfig.sendPdfKey)
        next[moduleConfig.sendPdfKey] = templates[moduleConfig.key].sendPdf;
      if (moduleConfig.ccSalesPersonKey)
        next[moduleConfig.ccSalesPersonKey] =
          templates[moduleConfig.key].ccSalesPerson;
      if (moduleConfig.sendEmailConfirmationKey)
        next[moduleConfig.sendEmailConfirmationKey] =
          templates[moduleConfig.key].sendConfirmation;
      if (moduleConfig.confirmationFormatKey)
        next[moduleConfig.confirmationFormatKey] =
          templates[moduleConfig.key].confirmationFormat || "";
      if (moduleConfig.confirmationSubjectKey)
        next[moduleConfig.confirmationSubjectKey] =
          templates[moduleConfig.key].confirmationSubject || "";
      return next;
    },
    {},
  );

  return {
    ...data,
    ...flattenedTemplateFields,
    moduleEmailTemplates: templates,
    defaultEmailFormats: templates,
    locationEmailTemplates: templates,
  };
};

export const stripLocationTemplateFields = (data = {}) => {
  const updated = { ...data };
  delete updated.moduleEmailTemplates;
  delete updated.defaultEmailFormats;
  delete updated.locationEmailTemplates;
  LOCATION_EMAIL_TEMPLATE_MODULES.forEach((moduleConfig) => {
    delete updated[moduleConfig.subjectKey];
    delete updated[moduleConfig.formatKey];
    if (moduleConfig.sendPdfKey) delete updated[moduleConfig.sendPdfKey];
    if (moduleConfig.ccSalesPersonKey)
      delete updated[moduleConfig.ccSalesPersonKey];
    if (moduleConfig.sendEmailConfirmationKey)
      delete updated[moduleConfig.sendEmailConfirmationKey];
    if (moduleConfig.confirmationFormatKey)
      delete updated[moduleConfig.confirmationFormatKey];
    if (moduleConfig.confirmationSubjectKey)
      delete updated[moduleConfig.confirmationSubjectKey];
  });
  return updated;
};

const normalizeType = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const getModuleByTemplateType = (type) => {
  const normalizedType = normalizeType(type);
  return LOCATION_EMAIL_TEMPLATE_MODULES.find((moduleConfig) =>
    moduleConfig.typeAliases.some(
      (alias) => normalizeType(alias) === normalizedType,
    ),
  );
};

export const applyApiTemplatesToLocationData = (
  locationData = {},
  templates = [],
) => {
  const mergedData = withLocationEmailTemplateFields(locationData);
  const moduleEmailTemplates = buildLocationEmailTemplates(mergedData);

  (templates || []).forEach((templateRow) => {
    const matchedModule = getModuleByTemplateType(templateRow?.type);
    if (!matchedModule) return;

    moduleEmailTemplates[matchedModule.key] = {
      subject: templateRow?.subject || "",
      format: templateRow?.template || "",
      ...(matchedModule.confirmationFormatKey
        ? {
            confirmationFormat: templateRow?.approvalConfirmationTemplate || "",
          }
        : {}),
      ...(matchedModule.confirmationSubjectKey
        ? {
            confirmationSubject: templateRow?.approvalConfirmationSubject || "",
          }
        : {}),
      sendPdf: Boolean(templateRow?.sendPdf),
      ccSalesPerson: Boolean(templateRow?.ccSalesPerson),
      sendConfirmation: Boolean(templateRow?.sendConfirmation),
    };
  });

  return withLocationEmailTemplateFields({
    ...mergedData,
    moduleEmailTemplates,
  });
};

export const validateLocationEmailTemplates = (formData = {}) => {
  const templates = buildLocationEmailTemplates(formData);
  const errors = {};

  LOCATION_EMAIL_TEMPLATE_MODULES.forEach((moduleConfig) => {
    const tpl = templates[moduleConfig.key];
    if (!tpl?.sendConfirmation) return;

    const moduleErrors = {};
    if (
      moduleConfig.confirmationSubjectKey &&
      !tpl.confirmationSubject?.trim()
    ) {
      moduleErrors.confirmationSubject =
        "Approval Confirmation email subject is required when 'Send Confirmation' is enabled.";
    }
    if (
      moduleConfig.confirmationFormatKey &&
      !tpl.confirmationFormat?.replace(/<[^>]*>/g, "").trim()
    ) {
      moduleErrors.confirmationFormat =
        "Approval Confirmation email template is required when 'Send Confirmation' is enabled.";
    }
    if (Object.keys(moduleErrors).length)
      errors[moduleConfig.key] = moduleErrors;
  });

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const getTemplateApiPayloadList = (formData = {}) => {
  const templates = buildLocationEmailTemplates(formData);

  return LOCATION_EMAIL_TEMPLATE_MODULES.map((moduleConfig) => ({
    type: moduleConfig.templateType,
    subject: templates[moduleConfig.key]?.subject || "",
    template: templates[moduleConfig.key]?.format || "",
    ...(moduleConfig.confirmationFormatKey
      ? {
          approvalConfirmationTemplate:
            templates[moduleConfig.key]?.confirmationFormat || "",
        }
      : {}),
    ...(moduleConfig.confirmationSubjectKey
      ? {
          approvalConfirmationSubject:
            templates[moduleConfig.key]?.confirmationSubject || "",
        }
      : {}),
    sendPdf: Boolean(templates[moduleConfig.key]?.sendPdf),
    ccSalesPerson: Boolean(templates[moduleConfig.key]?.ccSalesPerson),
    sendConfirmation: Boolean(templates[moduleConfig.key]?.sendConfirmation),
  }));
};

/* ========================================================
   Main Component
   ======================================================== */

function LocationEmailTemplateFields({ formData, setFormData }) {
  const editorRef = useRef(null);
  const confirmationEditorRef = useRef(null);
  const [activeModule, setActiveModule] = useState(
    LOCATION_EMAIL_TEMPLATE_MODULES[0].key,
  );

  const emailTemplates = buildLocationEmailTemplates(formData);
  const activeModuleConfig = LOCATION_EMAIL_TEMPLATE_MODULES.find(
    (m) => m.key === activeModule,
  );

  const showSendPdf = Boolean(activeModuleConfig?.sendPdfKey);
  const showCcSalesPerson = Boolean(activeModuleConfig?.ccSalesPersonKey);
  const showSendConfirmation = Boolean(
    activeModuleConfig?.sendEmailConfirmationKey,
  );

  const activeTemplate = emailTemplates[activeModule];
  const confirmationErrors =
    showSendConfirmation && activeTemplate?.sendConfirmation
      ? {
          subject:
            activeModuleConfig?.confirmationSubjectKey &&
            !activeTemplate?.confirmationSubject?.trim(),
          format:
            activeModuleConfig?.confirmationFormatKey &&
            !activeTemplate?.confirmationFormat?.replace(/<[^>]*>/g, "").trim(),
        }
      : { subject: false, format: false };

  const updateTemplateField = (field, value) => {
    setFormData((prev) => {
      const cleaned = { ...prev };
      delete cleaned.moduleEmailTemplates;
      delete cleaned.defaultEmailFormats;
      delete cleaned.locationEmailTemplates;

      const mc = LOCATION_EMAIL_TEMPLATE_MODULES.find(
        (m) => m.key === activeModule,
      );
      if (!mc) return prev;

      const fieldKeyMap = {
        subject: mc.subjectKey,
        format: mc.formatKey,
        sendPdf: mc.sendPdfKey,
        ccSalesPerson: mc.ccSalesPersonKey,
        sendConfirmation: mc.sendEmailConfirmationKey,
        confirmationFormat: mc.confirmationFormatKey,
        confirmationSubject: mc.confirmationSubjectKey,
      };

      const fieldKey = fieldKeyMap[field];
      return fieldKey
        ? { ...cleaned, [fieldKey]: value }
        : { ...cleaned, [field]: value };
    });
  };

  const insertVariable = (variable, ref = editorRef) => {
    const editor = ref.current;
    if (!editor) return;
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertText(variable);
      }
    });
    editor.focus();
  };

  /* ---- render ---- */
  return (
    <div className="mt-4">
      <div className="border rounded-xl p-4 bg-gray-100">
        {/* Module tabs */}
        <div className="mb-4">
          <label className="block font-bold text-sm text-gray-700 mb-2">
            Default Module Email Templates
          </label>
          <div className="flex flex-wrap gap-0">
            {LOCATION_EMAIL_TEMPLATE_MODULES.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setActiveModule(m.key)}
                className={`px-3 py-1.5 text-sm font-medium first:rounded-l last:rounded-r transition-colors ${
                  activeModule === m.key
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:text-primary bg-white hover:bg-primary-light border border-gray-300"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subject */}
        <div className="mb-4">
          <label
            htmlFor={`${activeModule}-subject`}
            className="block text-sm text-gray-700 mb-1"
          >
            Subject
          </label>
          <input
            id={`${activeModule}-subject`}
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={emailTemplates[activeModule]?.subject || ""}
            onChange={(e) => updateTemplateField("subject", e.target.value)}
            placeholder={`Enter ${activeModuleConfig?.label} email subject`}
          />
        </div>

        {/* Checkboxes */}
        {(showSendPdf || showCcSalesPerson || showSendConfirmation) && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
            {showSendPdf && (
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer col-span-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-primary"
                  checked={emailTemplates[activeModule]?.sendPdf || false}
                  onChange={(e) =>
                    updateTemplateField("sendPdf", e.target.checked)
                  }
                />
                Send attachments
              </label>
            )}
            {showCcSalesPerson && (
              <label className="flex items-center gap-2 col-span-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-primary"
                  checked={emailTemplates[activeModule]?.ccSalesPerson || false}
                  onChange={(e) =>
                    updateTemplateField("ccSalesPerson", e.target.checked)
                  }
                />
                Send email to outside sales person
              </label>
            )}
            {showSendConfirmation && (
              <label className="flex items-center gap-2 col-span-3 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-primary"
                  checked={
                    emailTemplates[activeModule]?.sendConfirmation || false
                  }
                  onChange={(e) =>
                    updateTemplateField("sendConfirmation", e.target.checked)
                  }
                />
                Send Approval Confirmation Email
              </label>
            )}
          </div>
        )}

        {/* Variables bar */}
        <div className="flex items-start gap-3 bg-gray-200/70 rounded-lg p-2 px-3 mb-3">
          <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
            Variables
          </span>
          <div className="flex flex-wrap gap-1 pt-0.5">
            {Object.keys(activeModuleConfig?.variables || {}).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() =>
                  insertVariable(activeModuleConfig.variables[key])
                }
                className="bg-white text-xs font-bold px-2 py-1 rounded-full shadow-sm hover:bg-gray-50 border border-gray-200 transition-colors"
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Main editor — remount on tab change via key */}
        <RichEditor
          key={activeModule}
          initialHtml={emailTemplates[activeModule]?.format || ""}
          onChange={(html) => updateTemplateField("format", html)}
          editorRef={editorRef}
          minHeight={200}
        />

        {/* Confirmation section */}
        {showSendConfirmation &&
          emailTemplates[activeModule]?.sendConfirmation &&
          activeModuleConfig?.confirmationFormatKey && (
            <div className="mt-5 border rounded-xl p-4">
              <label className="block font-bold text-sm text-gray-700 mb-3">
                Approval Confirmation Email Template
              </label>

              {/* Confirmation subject */}
              <div className="mb-4">
                <label
                  htmlFor={`${activeModule}-confirmationSubject`}
                  className="block text-sm text-gray-700 mb-1"
                >
                  Confirmation Subject{" "}
                  {confirmationErrors.subject && (
                    <span className="text-danger font-normal ml-1">
                      (required)
                    </span>
                  )}
                </label>
                <input
                  id={`${activeModule}-confirmationSubject`}
                  type="text"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                    confirmationErrors.subject
                      ? "border-danger"
                      : "border-gray-300"
                  }`}
                  value={
                    emailTemplates[activeModule]?.confirmationSubject || ""
                  }
                  onChange={(e) =>
                    updateTemplateField("confirmationSubject", e.target.value)
                  }
                  placeholder="Enter confirmation email subject"
                />
                {confirmationErrors.subject && (
                  <p className="text-danger text-xs mt-1">
                    Confirmation subject is required when &quot;Send
                    Confirmation&quot; is enabled.
                  </p>
                )}
              </div>

              {/* Confirmation variables bar */}
              <div className="flex items-start gap-3 bg-gray-200/70 rounded-lg p-2 px-3 mb-3">
                <span className="text-sm font-bold text-gray-700 self-center whitespace-nowrap">
                  Variables
                </span>
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {Object.keys(activeModuleConfig?.variables || {}).map(
                    (key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          insertVariable(
                            activeModuleConfig.variables[key],
                            confirmationEditorRef,
                          )
                        }
                        className="bg-white text-xs font-bold px-2 py-1 rounded-full shadow-sm hover:bg-gray-50 border border-gray-200 transition-colors"
                      >
                        {key}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Confirmation editor */}
              <div
                className={
                  confirmationErrors.format
                    ? "ring-1 ring-danger rounded-lg"
                    : ""
                }
              >
                <RichEditor
                  key={`${activeModule}-confirmation`}
                  initialHtml={
                    emailTemplates[activeModule]?.confirmationFormat || ""
                  }
                  onChange={(html) =>
                    updateTemplateField("confirmationFormat", html)
                  }
                  editorRef={confirmationEditorRef}
                  minHeight={200}
                />
              </div>
              {confirmationErrors.format && (
                <p className="text-danger text-xs mt-1">
                  Confirmation template is required when &quot;Send
                  Confirmation&quot; is enabled.
                </p>
              )}
            </div>
          )}
      </div>
    </div>
  );
}

export default LocationEmailTemplateFields;
