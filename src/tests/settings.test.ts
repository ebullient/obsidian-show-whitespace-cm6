import { describe, expect, it } from "vitest";
import type { SWSettings } from "../@types/settings";
import {
    computeCMExtensionEnabled,
    DEFAULT_SETTINGS,
} from "../whitespace-Plugin";

function makeSettings(overrides: Partial<SWSettings> = {}): SWSettings {
    return { ...DEFAULT_SETTINGS, ...overrides };
}

describe("DEFAULT_SETTINGS", () => {
    it("has all required SWSettings keys", () => {
        const required: Array<keyof SWSettings> = [
            "disablePluginStyles",
            "enabled",
            "showLineEndings",
            "showHardLineBreaks",
            "showTrailingWhitespace",
            "showConsecutiveWhitespace",
            "showBlockquoteMarkers",
            "outlineListMarkers",
            "showFrontmatterWhitespace",
            "showTableWhitespace",
            "showCodeblockWhitespace",
            "showAllCodeblockWhitespace",
            "showAllWhitespace",
        ];
        for (const key of required) {
            expect(DEFAULT_SETTINGS, `missing key: ${key}`).toHaveProperty(key);
        }
    });

    it("does not persist cmExtensionEnabled", () => {
        expect(DEFAULT_SETTINGS).not.toHaveProperty("cmExtensionEnabled");
    });

    it("enables markers by default", () => {
        expect(DEFAULT_SETTINGS.showLineEndings).toBe(true);
        expect(DEFAULT_SETTINGS.showHardLineBreaks).toBe(true);
        expect(DEFAULT_SETTINGS.showTrailingWhitespace).toBe(true);
        expect(DEFAULT_SETTINGS.showConsecutiveWhitespace).toBe(true);
    });
});

describe("computeCMExtensionEnabled", () => {
    it("is true when showAllWhitespace is on", () => {
        const s = makeSettings({ showAllWhitespace: true });
        computeCMExtensionEnabled(s);
        expect(s.cmExtensionEnabled).toBe(true);
    });

    it("is true when showFrontmatterWhitespace is on", () => {
        const s = makeSettings({
            showAllWhitespace: false,
            showFrontmatterWhitespace: true,
            showTableWhitespace: false,
            showCodeblockWhitespace: false,
            showAllCodeblockWhitespace: false,
        });
        computeCMExtensionEnabled(s);
        expect(s.cmExtensionEnabled).toBe(true);
    });

    it("is true when showTableWhitespace is on", () => {
        const s = makeSettings({
            showAllWhitespace: false,
            showFrontmatterWhitespace: false,
            showTableWhitespace: true,
            showCodeblockWhitespace: false,
            showAllCodeblockWhitespace: false,
        });
        computeCMExtensionEnabled(s);
        expect(s.cmExtensionEnabled).toBe(true);
    });

    it("is false when all space-dot context settings are off", () => {
        const s = makeSettings({
            showAllWhitespace: false,
            showFrontmatterWhitespace: false,
            showTableWhitespace: false,
            showCodeblockWhitespace: false,
            showAllCodeblockWhitespace: false,
        });
        computeCMExtensionEnabled(s);
        expect(s.cmExtensionEnabled).toBe(false);
    });

    it("is false when plugin is disabled even if context settings are on", () => {
        const s = makeSettings({
            enabled: false,
            showAllWhitespace: true,
        });
        computeCMExtensionEnabled(s);
        expect(s.cmExtensionEnabled).toBe(false);
    });

    it("mutates the settings object in place", () => {
        const s = makeSettings({ showAllWhitespace: true });
        expect(s.cmExtensionEnabled).toBeUndefined();
        computeCMExtensionEnabled(s);
        expect(s.cmExtensionEnabled).toBeDefined();
    });
});
