import { describe, expect, it } from "vitest";
import { en } from "../i18n/en";
import { getTranslate } from "../i18n/index";

describe("getTranslate", () => {
    it("returns English for 'en'", () => {
        expect(getTranslate("en")).toBe(en);
    });

    it("falls back to English for an unknown language code", () => {
        expect(getTranslate("zz")).toBe(en);
        expect(getTranslate("ja")).toBe(en);
        expect(getTranslate("")).toBe(en);
    });

    it("returned translation has all required top-level keys", () => {
        const t = getTranslate("en");
        const required = [
            "saveSettings",
            "suppressPluginStyles",
            "markersSection",
            "showLineEndings",
            "showHardLineBreaks",
            "showTrailingWhitespace",
            "showConsecutiveWhitespace",
            "structuralSection",
            "showBlockquoteMarkers",
            "highlightListMarkers",
            "spaceContextsSection",
            "showFrontmatterWhitespace",
            "showTableWhitespace",
            "showCodeBlockWhitespace",
            "showAllCodeBlockWhitespace",
            "showAllWhitespace",
        ] as const;
        for (const key of required) {
            expect(t, `missing key: ${key}`).toHaveProperty(key);
        }
    });

    it("each marker section entry has name and desc", () => {
        const t = getTranslate("en");
        const markerKeys = [
            "showLineEndings",
            "showHardLineBreaks",
            "showTrailingWhitespace",
            "showConsecutiveWhitespace",
        ] as const;
        for (const key of markerKeys) {
            expect(t[key]).toHaveProperty("name");
            expect(t[key]).toHaveProperty("desc");
        }
    });
});
