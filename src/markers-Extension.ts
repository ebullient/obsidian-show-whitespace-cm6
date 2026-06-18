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
    const { showLineEndings, showHardLineBreaks } = settings;
    return createWhitespacePlugin((view) =>
        buildDecorations(view, showLineEndings, showHardLineBreaks),
    );
}
