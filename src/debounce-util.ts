import { StateEffect } from "@codemirror/state";
import {
    Decoration,
    type DecorationSet,
    type EditorView,
    ViewPlugin,
    type ViewUpdate,
} from "@codemirror/view";

/** How long after the last keystroke before whitespace markers reappear (ms). */
export const DEBOUNCE_MS = 1000;

/**
 * Shared rebuild effect. All whitespace plugins share this effect so that
 * when the first debounce timer fires it rebuilds all active plugins in the
 * same transaction — all markers reappear in the same render frame.
 */
export const triggerRebuild = StateEffect.define<null>();

/**
 * Creates a ViewPlugin that calls buildDecorations on viewport/selection
 * changes and debounces rebuilds during typing so markers don't flicker.
 * Hoisted to module level by callers so extension identity is stable across
 * handleExtension() calls.
 */
export function createWhitespacePlugin(
    buildDecorations: (view: EditorView) => DecorationSet,
) {
    return ViewPlugin.fromClass(
        class {
            decorations: DecorationSet;
            isTyping = false;
            timer: ReturnType<typeof activeWindow.setTimeout> | null = null;

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
                    if (this.timer) activeWindow.clearTimeout(this.timer);
                    this.timer = activeWindow.setTimeout(() => {
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

                if (
                    update.viewportChanged ||
                    update.selectionSet ||
                    hasRebuild
                ) {
                    this.decorations = buildDecorations(update.view);
                }
            }

            destroy(): void {
                if (this.timer) activeWindow.clearTimeout(this.timer);
            }
        },
        { decorations: (v) => v.decorations },
    );
}
