import type { Extension, Range } from "@codemirror/state";
import {
    Decoration,
    type DecorationSet,
    type EditorView,
    WidgetType,
} from "@codemirror/view";
import type { SWSettings } from "./@types/settings";
import { createWhitespacePlugin } from "./debounce-util";

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

function buildDecorations(
    view: EditorView,
    showLineEndings: boolean,
    showHardLineBreaks: boolean,
    showUnicodeWhitespace: boolean,
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

                // Unicode whitespace: mark inline, shown on all lines including
                // the cursor line (these aren't at the line end, no reason to hide).
                if (showUnicodeWhitespace) {
                    for (const match of line.text.matchAll(UNICODE_SPACE_RE)) {
                        const mFrom = line.from + (match.index ?? 0);
                        widgets.push(
                            Decoration.mark({
                                class: "swcm6-unicode-space",
                            }).range(mFrom, mFrom + match[0].length),
                        );
                    }
                }

                // Line-end markers: skip the cursor line to avoid crowding the
                // insertion point. Marks above are added first so the array
                // stays sorted (inline positions < line.to).
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

export function markersExtension(settings: SWSettings): Extension {
    const { showLineEndings, showHardLineBreaks, showUnicodeWhitespace } =
        settings;
    return createWhitespacePlugin((view) =>
        buildDecorations(
            view,
            showLineEndings,
            showHardLineBreaks,
            showUnicodeWhitespace,
        ),
    );
}
