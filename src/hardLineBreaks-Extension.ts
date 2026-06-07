import type { Extension } from "@codemirror/state";
import {
    Decoration,
    type DecorationSet,
    type EditorView,
    ViewPlugin,
    type ViewUpdate,
    WidgetType,
} from "@codemirror/view";
import { DEBOUNCE_MS, triggerRebuild } from "./debounce-util";

/** Lines ending in two or more spaces are Markdown hard line breaks. */
const HARD_BREAK_RE = / {2,}$/;

class HardBreakWidget extends WidgetType {
    eq(_other: HardBreakWidget): boolean {
        return true;
    }

    toDOM(): HTMLElement {
        const el = document.createElement("span");
        el.className = "swcm6-hard-break-marker";
        el.setAttribute("aria-hidden", "true");
        return el;
    }

    ignoreEvent(): boolean {
        return true;
    }
}

function buildDecorations(view: EditorView): DecorationSet {
    try {
        const docLength = view.state.doc.length;
        if (docLength === 0) return Decoration.none;

        // Suppress marker on the cursor line so it doesn't crowd the insertion point.
        const head = Math.min(view.state.selection.main.head, docLength);
        const activeLineNum = view.state.doc.lineAt(head).number;

        const widgets: ReturnType<typeof Decoration.widget>[] = [];
        for (const { from, to } of view.visibleRanges) {
            let pos = Math.max(0, Math.min(from, docLength));
            const rangeEnd = Math.min(to, docLength);
            while (pos <= rangeEnd) {
                const line = view.state.doc.lineAt(pos);
                if (
                    line.number !== activeLineNum &&
                    HARD_BREAK_RE.test(line.text)
                ) {
                    widgets.push(
                        Decoration.widget({
                            widget: new HardBreakWidget(),
                            side: 1,
                        }).range(line.to),
                    );
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

// Hoisted to module level so the identity is stable across handleExtension() calls.
// CM6 uses extension identity (===) when reconfiguring compartments; a new identity
// on every call would tear down all editor plugin instances on every settings toggle.
const hardLineBreaksPlugin = ViewPlugin.fromClass(
    class {
        decorations: DecorationSet;
        isTyping = false;
        timer: ReturnType<typeof setTimeout> | null = null;

        constructor(view: EditorView) {
            this.decorations = buildDecorations(view);
        }

        update(update: ViewUpdate): void {
            const hasRebuild = update.transactions.some((tr) =>
                tr.effects.some((e) => e.is(triggerRebuild)),
            );

            if (update.docChanged) {
                this.isTyping = true;
                this.decorations = Decoration.none;
                const view = update.view;
                if (this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.isTyping = false;
                    this.timer = null;
                    try {
                        view.dispatch({ effects: triggerRebuild.of(null) });
                    } catch {
                        // view was destroyed before the debounce fired
                    }
                }, DEBOUNCE_MS);
                return;
            }

            if (this.isTyping) return;

            if (update.viewportChanged || update.selectionSet || hasRebuild) {
                this.decorations = buildDecorations(update.view);
            }
        }

        destroy(): void {
            if (this.timer) clearTimeout(this.timer);
        }
    },
    { decorations: (v) => v.decorations },
);

export function hardLineBreaksExtension(): Extension {
    return hardLineBreaksPlugin;
}
