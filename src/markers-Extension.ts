import type { Extension, Range } from "@codemirror/state";
import {
    Decoration,
    type DecorationSet,
    type EditorView,
    MatchDecorator,
    ViewPlugin,
    type ViewUpdate,
    WidgetType,
} from "@codemirror/view";
import type { SWSettings } from "./@types/settings";

/** Lines ending in two or more spaces are Markdown hard line breaks. */
const HARD_BREAK_RE = / {2,}$/;

/**
 * Visible-width Unicode whitespace other than U+0020 (regular space).
 * U+00A0  NO-BREAK SPACE
 * U+1680  OGHAM SPACE MARK
 * U+2000-U+200A  en quad through hair space
 * U+202F  NARROW NO-BREAK SPACE
 * U+205F  MEDIUM MATHEMATICAL SPACE
 * U+3000  IDEOGRAPHIC SPACE
 */
const UNICODE_SPACE_RE = /[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g;

// cm-highlightSpace/cm-highlightTab are what the existing CSS context
// selectors target (frontmatter, tables, code blocks).
const spaceDeco = Decoration.mark({ class: "cm-highlightSpace" });
const tabDeco = Decoration.mark({ class: "cm-highlightTab" });
const trailingDeco = Decoration.mark({ class: "cm-trailingSpace" });
const unicodeSpaceDeco = Decoration.mark({ class: "swcm6-unicode-space" });

const whitespaceMatcher = new MatchDecorator({
    regexp: /\t| /g,
    decoration: (match) => (match[0] === "\t" ? tabDeco : spaceDeco),
    boundary: /\S/,
});

const trailingMatcher = new MatchDecorator({
    regexp: /\s+$/g,
    decoration: trailingDeco,
});

const unicodeMatcher = new MatchDecorator({
    regexp: UNICODE_SPACE_RE,
    decoration: unicodeSpaceDeco,
});

/** Wraps a MatchDecorator in a ViewPlugin that keeps its decorations incrementally updated. */
function matcher(decorator: MatchDecorator): Extension {
    return ViewPlugin.fromClass(
        class {
            decorations: DecorationSet;
            constructor(view: EditorView) {
                this.decorations = decorator.createDeco(view);
            }
            update(update: ViewUpdate): void {
                this.decorations = decorator.updateDeco(
                    update,
                    this.decorations,
                );
            }
        },
        { decorations: (v) => v.decorations },
    );
}

class LineEndWidget extends WidgetType {
    eq(_other: LineEndWidget): boolean {
        return true;
    }
    toDOM(): HTMLElement {
        const el = createSpan();
        el.className = "swcm6-line-end-marker";
        el.setAttribute("aria-hidden", "true");
        return el;
    }
    ignoreEvent(): boolean {
        return true;
    }
}

class HardBreakWidget extends WidgetType {
    eq(_other: HardBreakWidget): boolean {
        return true;
    }
    toDOM(): HTMLElement {
        const el = createSpan();
        el.className = "swcm6-hard-break-marker";
        el.setAttribute("aria-hidden", "true");
        return el;
    }
    ignoreEvent(): boolean {
        return true;
    }
}

function buildWidgetDecorations(
    view: EditorView,
    showLineEndings: boolean,
    showHardLineBreaks: boolean,
): DecorationSet {
    try {
        const docLength = view.state.doc.length;
        if (docLength === 0) return Decoration.none;

        const head = Math.min(view.state.selection.main.head, docLength);
        const activeLineNum = view.state.doc.lineAt(head).number;

        const widgets: Range<Decoration>[] = [];
        for (const { from, to } of view.visibleRanges) {
            let pos = Math.max(0, Math.min(from, docLength));
            const rangeEnd = Math.min(to, docLength);
            while (pos <= rangeEnd) {
                const line = view.state.doc.lineAt(pos);

                // Line-end markers: skip the cursor line to avoid crowding the
                // insertion point.
                if (line.number !== activeLineNum) {
                    if (showHardLineBreaks && HARD_BREAK_RE.test(line.text)) {
                        widgets.push(
                            Decoration.widget({
                                widget: new HardBreakWidget(),
                                side: 1,
                            }).range(line.to),
                        );
                    } else if (showLineEndings) {
                        widgets.push(
                            Decoration.widget({
                                widget: new LineEndWidget(),
                                side: 1,
                            }).range(line.to),
                        );
                    }
                }

                if (line.to >= rangeEnd) break;
                pos = line.to + 1;
            }
        }
        return Decoration.set(widgets, true);
    } catch {
        return Decoration.none;
    }
}

function widgetPlugin(
    showLineEndings: boolean,
    showHardLineBreaks: boolean,
): Extension {
    return ViewPlugin.fromClass(
        class {
            decorations: DecorationSet;
            constructor(view: EditorView) {
                this.decorations = buildWidgetDecorations(
                    view,
                    showLineEndings,
                    showHardLineBreaks,
                );
            }
            update(update: ViewUpdate): void {
                if (
                    update.docChanged ||
                    update.selectionSet ||
                    update.viewportChanged
                ) {
                    this.decorations = buildWidgetDecorations(
                        update.view,
                        showLineEndings,
                        showHardLineBreaks,
                    );
                }
            }
        },
        { decorations: (v) => v.decorations },
    );
}

export function markersExtension(settings: SWSettings): Extension[] {
    const {
        showLineEndings,
        showHardLineBreaks,
        showUnicodeWhitespace,
        showAllWhitespace,
        showFrontmatterWhitespace,
        showCodeblockWhitespace,
        showAllCodeblockWhitespace,
        showTableWhitespace,
    } = settings;
    const showSpaces =
        showAllWhitespace ||
        showFrontmatterWhitespace ||
        showCodeblockWhitespace ||
        showAllCodeblockWhitespace ||
        showTableWhitespace;

    const extensions: Extension[] = [];
    if (showSpaces) {
        extensions.push(matcher(whitespaceMatcher), matcher(trailingMatcher));
    }
    if (showUnicodeWhitespace) {
        extensions.push(matcher(unicodeMatcher));
    }
    if (showLineEndings || showHardLineBreaks) {
        extensions.push(widgetPlugin(showLineEndings, showHardLineBreaks));
    }
    return extensions;
}
