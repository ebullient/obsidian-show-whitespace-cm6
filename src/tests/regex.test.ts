import { describe, expect, it } from "vitest";

/** Matches lines ending in two or more spaces (Markdown hard line break syntax). */
const HARD_BREAK_RE = / {2,}$/;

/** Matches trailing spaces or tabs at the end of a line. */
const TRAILING_WS_RE = /[ \t]+$/;

/** Matches two or more consecutive spaces within a line. */
const CONSECUTIVE_RE = / {2,}/g;

describe("HARD_BREAK_RE", () => {
    it("matches a line ending in exactly two spaces", () => {
        expect(HARD_BREAK_RE.test("hello  ")).toBe(true);
    });

    it("matches a line ending in three or more spaces", () => {
        expect(HARD_BREAK_RE.test("hello   ")).toBe(true);
    });

    it("does not match a line ending in one space", () => {
        expect(HARD_BREAK_RE.test("hello ")).toBe(false);
    });

    it("does not match a line with no trailing spaces", () => {
        expect(HARD_BREAK_RE.test("hello")).toBe(false);
    });

    it("does not match internal double spaces (not at end)", () => {
        expect(HARD_BREAK_RE.test("hello  world")).toBe(false);
    });
});

describe("TRAILING_WS_RE", () => {
    it("matches trailing spaces", () => {
        expect(TRAILING_WS_RE.test("hello   ")).toBe(true);
    });

    it("matches trailing tabs", () => {
        expect(TRAILING_WS_RE.test("hello\t")).toBe(true);
    });

    it("does not match when line has no trailing whitespace", () => {
        expect(TRAILING_WS_RE.test("hello")).toBe(false);
    });

    it("captures the correct match range", () => {
        const match = TRAILING_WS_RE.exec("ab  cd   ");
        expect(match).not.toBeNull();
        expect(match?.[0]).toBe("   ");
        expect(match?.index).toBe(6);
    });
});

describe("CONSECUTIVE_RE", () => {
    it("matches two consecutive spaces within a line", () => {
        expect("hello  world".match(CONSECUTIVE_RE)).not.toBeNull();
    });

    it("does not match a single space", () => {
        expect("hello world".match(CONSECUTIVE_RE)).toBeNull();
    });

    it("matches multiple runs of consecutive spaces", () => {
        const matches = "a  b   c".match(CONSECUTIVE_RE);
        expect(matches).toHaveLength(2);
    });
});
