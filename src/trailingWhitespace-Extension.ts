import type { Extension } from "@codemirror/state";
import {
    Decoration,
    type DecorationSet,
    type EditorView,
    ViewPlugin,
    type ViewUpdate,
} from "@codemirror/view";
import { DEBOUNCE_MS, triggerRebuild } from "./debounce-util";

const trailingWhitespaceDeco = Decoration.mark({ class: "cm-trailingSpace" });

function buildDecorations(view: EditorView): DecorationSet {
    try {
        const docLength = view.state.doc.length;
        if (docLength === 0) return Decoration.none;

        const ranges: ReturnType<typeof trailingWhitespaceDeco.range>[] = [];
        for (const { from, to } of view.visibleRanges) {
            let pos = Math.max(0, Math.min(from, docLength));
            const rangeEnd = Math.min(to, docLength);
            while (pos <= rangeEnd) {
                const line = view.state.doc.lineAt(pos);
                const match = /[ \t]+$/.exec(line.text);
                if (match) {
                    ranges.push(
                        trailingWhitespaceDeco.range(
                            line.from + match.index,
                            line.to,
                        ),
                    );
                }
                if (line.to >= rangeEnd) break;
                pos = line.to + 1;
            }
        }
        return Decoration.set(ranges, true);
    } catch {
        return Decoration.none;
    }
}

// Hoisted to module level so the identity is stable across handleExtension() calls.
// CM6 uses extension identity (===) when reconfiguring compartments; a new identity
// on every call would tear down all editor plugin instances on every settings toggle.
const trailingPlugin = ViewPlugin.fromClass(
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
                // Hide all markers immediately while the user is typing.
                // They reappear DEBOUNCE_MS after the last keystroke.
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

            // Still within the debounce window — keep hidden.
            if (this.isTyping) return;

            if (update.viewportChanged || hasRebuild) {
                this.decorations = buildDecorations(update.view);
            }
        }

        destroy(): void {
            if (this.timer) clearTimeout(this.timer);
        }
    },
    { decorations: (v) => v.decorations },
);

export function trailingWhitespaceExtension(): Extension {
    return trailingPlugin;
}
