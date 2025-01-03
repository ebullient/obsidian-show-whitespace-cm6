export const zh = {
    manifestName: "显示空白字符",

    block1: {
        name: "显示空白字符",
    },
    saveSettings: {
        name: "保存设置",
        resetBtn: {
            tooltip: "重置为上一次保存的值"
        },
        saveBtn: {
            tooltip: "保存当前值"
        },
    },
    suppressPluginStyles: {
        name: "禁用插件样式",
        desc: "禁用插件的默认样式。" +
            "您需要提供自己的 CSS 代码片段来自定义空白字符的外观。",
    },
    showBlockquoteMarkers: {
        name: "显示引用标记",
        desc: "在实时阅览模式下始终显示引用的前导 '>'。",
    },
    highlightListMarkers: {
        name: "高亮列表标记",
        desc: "为列表标记（例如 '-', '1.'）预留的空间添加视觉样式。",
    },

    block2: {
        name: "空白字符",
        desc: "默认情况下，此插件将显示前导和尾随空白字符，" +
            "包括行尾、硬换行和制表符的标记。",
    },
    showAllWhitespace: {
        name: "显示所有空白字符",
        desc: "显示所有空白字符的标记，包括单词之间的空白字符。",
    },
    showConsecutiveWhitespace: {
        name: "显示连续空白字符",
        desc: "仅显示单词之间多个连续空白字符的标记（包含在“显示所有空白字符”中）。",
    },
    showLineEndings: {
        name: "显示行尾",
        desc: "显示行尾的标记（不同于硬换行）。",
    },

    block3: {
        name: "内容类型",
        desc: "以下设置允许您启用或禁用文档中空白字符的显示。" +
            "除非另有说明，否则空白字符的外观遵循上述设置。",
    },
    showFrontmatterWhitespace: {
        name: "显示前言空白字符",
        desc: "在 YAML 前言（属性）中显示空白字符。",
    },
    showTableWhitespace: {
        name: "显示表格空白字符",
        desc: "在表格中显示前导或尾随空白字符。",
    },
    showCodeBlockWhitespace: {
        name: "显示代码块空白字符",
        desc: "在代码块中显示前导/尾随空白字符（包含在“显示所有代码块空白字符”中）。",
    },
    showAllCodeBlockWhitespace: {
        name: "显示所有代码块空白字符",
        desc: "显示代码块中的所有空白字符，使其看起来更像代码编辑器。" +
            "这将覆盖上述设置。",
    },
};
