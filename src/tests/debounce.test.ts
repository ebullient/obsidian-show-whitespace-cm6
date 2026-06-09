import { describe, expect, it } from "vitest";
import { DEBOUNCE_MS } from "../debounce-util";

describe("DEBOUNCE_MS", () => {
    it("is at least 500ms so markers don't flicker during fast typing", () => {
        expect(DEBOUNCE_MS).toBeGreaterThanOrEqual(500);
    });

    it("is at most 2000ms so markers reappear in a reasonable time", () => {
        expect(DEBOUNCE_MS).toBeLessThanOrEqual(2000);
    });
});
