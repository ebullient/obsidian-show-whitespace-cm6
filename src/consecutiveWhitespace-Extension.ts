import {
    Decoration,
    type DecorationSet,
    type EditorView,
    MatchDecorator,
    ViewPlugin,
    type ViewUpdate,
} from "@codemirror/view";
import { DEBOUNCE_MS, triggerRebuild } from "./debounce-util";

const consecutiveDeco = Decoration.mark({ class: "cm-consecutiveSpace" });

const consecutiveDecorator = new MatchDecorator({
    regexp: / {2,}/g,
    decoration: consecutiveDeco,
});

// Hoisted to module level so the identity is stable across handleExtension() calls.
// CM6 uses extension identity (===) when reconfiguring compartments; a new identity
// on every call would tear down all editor plugin instances on every settings toggle.
const consecutivePlugin = ViewPlugin.fromClass(
    class {
        decorations: DecorationSet;
        isTyping = false;
        timer: ReturnType<typeof setTimeout> | null = null;

        constructor(view: EditorView) {
            this.decorations = consecutiveDecorator.createDeco(view);
        }

        update(update: ViewUpdate) {
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

            if (hasRebuild || update.viewportChanged) {
                this.decorations = consecutiveDecorator.createDeco(update.view);
            }
        }

        destroy() {
            if (this.timer) clearTimeout(this.timer);
        }
    },
    { decorations: (v) => v.decorations },
);

export function consecutiveWhitespaceExtension() {
    return consecutivePlugin;
}
