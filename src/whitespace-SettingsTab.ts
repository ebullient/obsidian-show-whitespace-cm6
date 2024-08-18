import { App, PluginSettingTab, Setting } from "obsidian";
import ShowWhitespacePlugin from "./main";
import { SWSettings } from "./@types/settings";

export class ShowWhitespaceSettingsTab extends PluginSettingTab {
    plugin: ShowWhitespacePlugin;
    newSettings: SWSettings;
    saveButton: HTMLElement;

    constructor(app: App, plugin: ShowWhitespacePlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    async save() {
        await this.plugin.updateSettings(this.newSettings);
    }

    async display(): Promise<void> {
        await this.plugin.loadSettings();
        this.reset();
    }

    async reset(): Promise<void> {
        this.newSettings = JSON.parse(JSON.stringify(this.plugin.settings));
        this.drawElements();
    }

    drawElements(): void {
        const id = this.plugin.manifest.id;
        const name = this.plugin.manifest.name;

        this.containerEl.empty();
        this.containerEl.addClass(id);
        new Setting(this.containerEl).setHeading().setName(name);

        new Setting(this.containerEl)
            .setName("Save settings")
            .setClass(id + "-save-reset")
            .addButton((button) =>
                button
                    .setIcon("reset")
                    .setTooltip(
                        "Reset to previously saved (or generated) values",
                    )
                    .onClick(() => {
                        this.reset();
                        console.log("(SW-CM6) Configuration reset");
                    }),
            )
            .addButton((button) => {
                button
                    .setIcon("save")
                    .setTooltip("Save current values")
                    .onClick(async () => {
                        await this.save();
                    });
                this.saveButton = button.buttonEl;
            });

        new Setting(this.containerEl)
            .setName("Suppress plugin styles")
            .setDesc(
                "Disable the plugin's default styles. " +
                    "You will need to provide your own CSS snippets to customize the appearance of whitespace.",
            )
            .addToggle((toggle) =>
                toggle
                    .setValue(this.newSettings.disablePluginStyles)
                    .onChange(async (value) => {
                        const redraw =
                            value != this.newSettings.disablePluginStyles;
                        this.newSettings.disablePluginStyles = value;
                        if (redraw) {
                            this.drawElements();
                        }
                    }),
            );

        new Setting(this.containerEl)
            .setName("Show blockquote markers")
            .setDesc(
                "Always display the leading '>' for blockquotes in Live Preview mode.",
            )
            .addToggle((toggle) =>
                toggle
                    .setValue(this.newSettings.showBlockquoteMarkers)
                    .onChange(async (value) => {
                        const redraw =
                            value != this.newSettings.showBlockquoteMarkers;
                        this.newSettings.showBlockquoteMarkers = value;
                        if (redraw) {
                            this.drawElements();
                        }
                    }),
            );

        new Setting(this.containerEl)
            .setName("Highlight List Markers")
            .setDesc(
                "Add a visual style to the space reserved by list markers (e.g., '-', '1.').",
            )
            .addToggle((toggle) =>
                toggle
                    .setValue(this.newSettings.outlineListMarkers)
                    .onChange(async (value) => {
                        const redraw =
                            value != this.newSettings.outlineListMarkers;
                        this.newSettings.outlineListMarkers = value;
                        if (redraw) {
                            this.drawElements();
                        }
                    }),
            );

        new Setting(this.containerEl).setHeading().setName("Whitespace");

        this.containerEl.createEl("p", {
            text:
                "By default, this plugin will show leading and trailing whitespace " +
                "including marks for line endings, hard breaks, and tabs.",
        });

        new Setting(this.containerEl)
            .setName("Show all whitespace")
            .setDesc(
                "Display markers for all whitespace characters, including those between words.",
            )
            .addToggle((toggle) =>
                toggle
                    .setValue(this.newSettings.showAllWhitespace)
                    .onChange(async (value) => {
                        const redraw =
                            value != this.newSettings.showAllWhitespace;
                        this.newSettings.showAllWhitespace = value;
                        if (redraw) {
                            this.drawElements();
                        }
                    }),
            );

        new Setting(this.containerEl)
            .setName("Show consecutive whitespace")
            .setDesc(
                "Display markers only for multiple consecutive whitespace characters between words (included in 'Show All Whitespace').",
            )
            .addToggle((toggle) =>
                toggle
                    .setValue(this.newSettings.showExtraWhitespace)
                    .onChange(async (value) => {
                        value = value || this.newSettings.showAllWhitespace;
                        const redraw =
                            value != this.newSettings.showExtraWhitespace;
                        this.newSettings.showExtraWhitespace = value;
                        if (redraw) {
                            this.drawElements();
                        }
                    }),
            );

        new Setting(this.containerEl)
            .setName("Show line endings")
            .setDesc(
                "Display markers for line endings (different from hard line breaks).",
            )
            .addToggle((toggle) =>
                toggle
                    .setValue(this.newSettings.showLineEndings)
                    .onChange(async (value) => {
                        const redraw =
                            value != this.newSettings.showLineEndings;
                        this.newSettings.showLineEndings = value;
                        if (redraw) {
                            this.drawElements();
                        }
                    }),
            );

        new Setting(this.containerEl).setHeading().setName("Content types");

        this.containerEl.createEl("p", {
            text:
                "The following settings allow you to enable or disable the display of whitespace characters within the document. " +
                "Unless otherwise noted, the appearance of whitespace follows the settings above.",
        });

        new Setting(this.containerEl)
            .setName("Show frontmatter whitespace")
            .setDesc(
                "Display whitespace characters in YAML frontmatter (properties).",
            )
            .addToggle((toggle) =>
                toggle
                    .setValue(this.newSettings.showFrontmatterWhitespace)
                    .onChange(async (value) => {
                        value = value || this.newSettings.showAllWhitespace;
                        const redraw =
                            value != this.newSettings.showFrontmatterWhitespace;
                        this.newSettings.showFrontmatterWhitespace = value;
                        if (redraw) {
                            this.drawElements();
                        }
                    }),
            );

        new Setting(this.containerEl)
            .setName("Show table whitespace")
            .setDesc(
                "Display leading or trailing whitespace characters in tables.",
            )
            .addToggle((toggle) =>
                toggle
                    .setValue(this.newSettings.showTableWhitespace)
                    .onChange(async (value) => {
                        value = value || this.newSettings.showAllWhitespace;
                        const redraw =
                            value != this.newSettings.showTableWhitespace;
                        this.newSettings.showTableWhitespace = value;
                        if (redraw) {
                            this.drawElements();
                        }
                    }),
            );

        new Setting(this.containerEl)
            .setName("Show code block whitespace")
            .setDesc(
                "Display leading/trailing whitespace characters in code blocks (included in 'Show All Code Block Whitespace')",
            )
            .addToggle((toggle) =>
                toggle
                    .setValue(this.newSettings.showCodeblockWhitespace)
                    .onChange(async (value) => {
                        value =
                            value ||
                            this.newSettings.showAllCodeblockWhitespace;
                        const redraw =
                            value != this.newSettings.showCodeblockWhitespace;
                        this.newSettings.showCodeblockWhitespace = value;
                        if (redraw) {
                            this.drawElements();
                        }
                    }),
            );

        new Setting(this.containerEl)
            .setName("Show all code block whitespace")
            .setDesc(
                "Display all whitespace characters in code blocks, making them look more like a code editor. " +
                    "This will override the settings above.",
            )
            .addToggle((toggle) =>
                toggle
                    .setValue(this.newSettings.showAllCodeblockWhitespace)
                    .onChange(async (value) => {
                        const redraw =
                            value !=
                            this.newSettings.showAllCodeblockWhitespace;
                        this.newSettings.showAllCodeblockWhitespace = value;
                        if (redraw) {
                            this.drawElements();
                        }
                    }),
            );
    }

    /** Save on exit */
    hide(): void {
        this.save();
    }
}
