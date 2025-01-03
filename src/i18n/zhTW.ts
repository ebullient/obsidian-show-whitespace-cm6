export const zhTW = {
    manifestName: "顯示空白字元",

    block1: {
        name: "顯示空白字元",
    },
    saveSettings: {
        name: "儲存設定",
        resetBtn: {
            tooltip: "重設為先前儲存（或生成）的值"
        },
        saveBtn: {
            tooltip: "儲存當前值"
        },
    },
    suppressPluginStyles: {
        name: "禁用插件樣式",
        desc: "禁用插件的預設樣式。" +
            "您需要提供自己的 CSS 代碼片段來自訂空白字元的外觀。",
    },
    showBlockquoteMarkers: {
        name: "顯示引用標記",
        desc: "在實際預覽模式下始終顯示引用的前導 '>'。",
    },
    highlightListMarkers: {
        name: "高亮清单標記",
        desc: "為清单標記（例如 '-', '1.'）預留的空間添加視覺樣式。",
    },

    block2: {
        name: "空白字元",
        desc: "預設情況下，此插件將顯示前導和尾隨空白字元，" +
            "包括行尾、硬換行和製表符的標記。",
    },
    showAllWhitespace: {
        name: "顯示所有空白字元",
        desc: "顯示所有空白字元的標記，包括單詞之間的空白字元。",
    },
    showConsecutiveWhitespace: {
        name: "顯示連續空白字元",
        desc: "僅顯示單詞之間多個連續空白字元的標記（包含在“顯示所有空白字元”中）。",
    },
    showLineEndings: {
        name: "顯示行尾",
        desc: "顯示行尾的標記（不同於硬換行）。",
    },

    block3: {
        name: "內容類型",
        desc: "以下設定允許您啟用或禁用文件中空白字元的顯示。" +
            "除非另有說明，否則空白字元的外觀遵循上述設定。",
    },
    showFrontmatterWhitespace: {
        name: "顯示前言空白字元",
        desc: "在 YAML 前言（屬性）中顯示空白字元。",
    },
    showTableWhitespace: {
        name: "顯示表格空白字元",
        desc: "在表格中顯示前導或尾隨空白字元。",
    },
    showCodeBlockWhitespace: {
        name: "顯示程式碼區塊空白字元",
        desc: "在程式碼區塊中顯示前導/尾隨空白字元（包含在“顯示所有程式碼區塊空白字元”中）。",
    },
    showAllCodeBlockWhitespace: {
        name: "顯示所有程式碼區塊空白字元",
        desc: "顯示程式碼區塊中的所有空白字元，使其看起來更像程式碼編輯器。" +
            "這將覆蓋上述設定。",
    },
};
