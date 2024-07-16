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
                "Enable to remove plugin styles. You will need to define your own snippet to customize the appearance of whitespace",
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
            .setName("Always show blockquote markers")
            .setDesc("Show the leading > for blockquotes in Live Preview")
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
            .setName("Show all whitespace characters in code blocks")
            .setDesc(
                "Add a marker for all whitespace characters in code blocks (included in Show all whitespace)",
            )
            .addToggle((toggle) =>
                toggle
                    .setValue(this.newSettings.showCodeblockWhitespace)
                    .onChange(async (value) => {
                        value = value || this.newSettings.showAllWhitespace;
                        const redraw =
                            value != this.newSettings.showCodeblockWhitespace;
                        this.newSettings.showCodeblockWhitespace = value;
                        if (redraw) {
                            this.drawElements();
                        }
                    }),
            );

        new Setting(this.containerEl)
            .setName("Show consecutive whitespace")
            .setDesc(
                "Add markers for multiple whitespace characters between words",
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
            .setName("Show all whitespace characters")
            .setDesc(
                "Add a marker for all whitespace characters, even those between words",
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
            .setName("Outline list markers")
            .setDesc(
                "Add a style to the space reserved by list markers (e.g. ' -' or ' 1.')",
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
    }

    /** Save on exit */
    hide(): void {
        this.save();
    }
}
