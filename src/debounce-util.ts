import { StateEffect } from "@codemirror/state";

/** How long after the last keystroke before whitespace markers reappear (ms). */
export const DEBOUNCE_MS = 1000;

/**
 * Shared rebuild effect. All four whitespace plugins share this effect so that
 * when the first debounce timer fires it rebuilds all active plugins in the
 * same transaction — all markers reappear in the same render frame.
 */
export const triggerRebuild = StateEffect.define<null>();
