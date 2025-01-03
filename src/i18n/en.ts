
export const en = {
    manifestName: "Show Whitespace",

    block1: {
        name: "Show Whitespace",
    },
    saveSettings: {
        name: "Save settings",
        resetBtn: {
            tooltip: "Reset to previously saved (or generated) values"
        },
        saveBtn: {
            tooltip: "Save current values"
        },
    },
    suppressPluginStyles: {
        name: "Suppress plugin styles",
        desc: "Disable the plugin's default styles. " +
            "You will need to provide your own CSS snippets to customize the appearance of whitespace.",
    },
    showBlockquoteMarkers: {
        name: "Show blockquote markers",
        desc: "Always display the leading '>' for blockquotes in Live Preview mode.",
    },
    highlightListMarkers: {
        name: "Highlight List Markers",
        desc: "Add a visual style to the space reserved by list markers (e.g., '-', '1.').",
    },

    block2: {
        name: "Whitespace",
        desc: "By default, this plugin will show leading and trailing whitespace " +
            "including marks for line endings, hard breaks, and tabs.",
    },
    showAllWhitespace: {
        name: "Show all whitespace",
        desc: "Display markers for all whitespace characters, including those between words.",
    },
    showConsecutiveWhitespace: {
        name: "Show consecutive whitespace",
        desc: "Display markers only for multiple consecutive whitespace characters between words (included in 'Show All Whitespace').",
    },
    showLineEndings: {
        name: "Show line endings",
        desc: "Display markers for line endings (different from hard line breaks).",
    },

    block3: {
        name: "Content types",
        desc: "The following settings allow you to enable or disable the display of whitespace characters within the document. " +
            "Unless otherwise noted, the appearance of whitespace follows the settings above.",
    },
    showFrontmatterWhitespace: {
        name: "Show frontmatter whitespace",
        desc: "Display whitespace characters in YAML frontmatter (properties).",
    },
    showTableWhitespace: {
        name: "Show table whitespace",
        desc: "Display leading or trailing whitespace characters in tables.",
    },
    showCodeBlockWhitespace: {
        name: "Show code block whitespace",
        desc: "Display leading/trailing whitespace characters in code blocks (included in 'Show All Code Block Whitespace')",
    },
    showAllCodeBlockWhitespace: {
        name: "Show all code block whitespace",
        desc: "Display all whitespace characters in code blocks, making them look more like a code editor. " +
            "This will override the settings above.",
    },
};
