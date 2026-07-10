export const en = {
    manifestName: "Show Whitespace",

    saveSettings: {
        name: "Save settings",
        resetBtn: {
            tooltip: "Reset to previously saved (or generated) values",
        },
        saveBtn: {
            tooltip: "Save current values",
        },
    },
    suppressPluginStyles: {
        name: "Suppress plugin styles",
        desc:
            "Disable the plugin's default styles. " +
            "You will need to provide your own CSS snippets to customize the appearance of whitespace.",
    },

    markersSection: {
        name: "Markers",
        desc: "Character markers appended or overlaid by the CM6 extension. Each is fully independent.",
    },
    showLineEndings: {
        name: "Line endings (¬)",
        desc: "Show a pilcrow at the end of every line.",
    },
    showHardLineBreaks: {
        name: "Hard line breaks (↲)",
        desc: "Show a return marker on lines ending in two or more spaces — the Markdown hard line break syntax.",
    },
    showUnicodeWhitespace: {
        name: "Unicode whitespace",
        desc: "Highlight non-breaking spaces and other Unicode whitespace characters (NBSP, thin space, etc.) that are visually indistinguishable from regular spaces.",
    },

    structuralSection: {
        name: "Structural",
    },
    highlightListMarkers: {
        name: "Highlight list markers",
        desc: "Add a visual style to the space reserved by list markers (e.g., '-', '1.').",
    },

    spaceContextsSection: {
        name: "Space dot contexts",
        desc: "Show a dot for each space character within the selected contexts. All toggles are independent.",
    },
    showFrontmatterWhitespace: {
        name: "Frontmatter",
        desc: "Show space dots in YAML frontmatter (properties).",
    },
    showTableWhitespace: {
        name: "Tables",
        desc: "Show space dots in table cells.",
    },
    showCodeBlockWhitespace: {
        name: "Code blocks (leading/trailing only)",
        desc: "Show space dots for leading and trailing spaces in code blocks.",
    },
    showAllCodeBlockWhitespace: {
        name: "Code blocks (all spaces)",
        desc: "Show space dots for every space in code blocks, making them look more like a code editor.",
    },
    showAllWhitespace: {
        name: "Everywhere",
        desc: "Show space dots for all spaces in the document, including between words.",
    },
    showSourceOnlyWhitespace: {
        name: "Source mode only",
        desc: "Only show whitespace highlighting in Source mode, hiding it in Live Preview.",
    },
};
