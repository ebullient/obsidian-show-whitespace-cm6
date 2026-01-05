import { type App, PluginSettingTab, Setting } from "obsidian";
import type { SWSettings } from "./@types/settings";
import { getTranslate } from "./i18n";
import type ShowWhitespacePlugin from "./main";

export class ShowWhitespaceSettingsTab extends PluginSettingTab {
    plugin: ShowWhitespacePlugin;
    newSettings: SWSettings;
    saveButton: HTMLElement;

    constructor(app: App, plugin: ShowWhitespacePlugin) {
        super(app, plugin);
        this.plugin = plugin;
        this.icon = "eye";
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
        const lang = window.localStorage.getItem("language");
        const i18n = getTranslate(lang);
        const name = i18n.manifestName || this.plugin.manifest.name;

        this.containerEl.empty();
        this.containerEl.addClass(id);
        new Setting(this.containerEl).setHeading().setName(name);

        new Setting(this.containerEl)
            .setName(i18n.saveSettings.name)
            .setClass(`${id}-save-reset`)
            .addButton((button) =>
                button
                    .setIcon("reset")
                    .setTooltip(i18n.saveSettings.resetBtn.tooltip)
                    .onClick(() => {
                        this.reset();
                        console.log("(SW-CM6) Configuration reset");
                    }),
            )
            .addButton((button) => {
                button
                    .setIcon("save")
                    .setTooltip(i18n.saveSettings.saveBtn.tooltip)
                    .onClick(async () => {
                        await this.save();
                    });
                this.saveButton = button.buttonEl;
            });

        new Setting(this.containerEl)
            .setName(i18n.suppressPluginStyles.name)
            .setDesc(i18n.suppressPluginStyles.desc)
            .addToggle((toggle) =>
                toggle
                    .setValue(this.newSettings.disablePluginStyles)
                    .onChange(async (value) => {
                        const redraw =
                            value !== this.newSettings.disablePluginStyles;
                        this.newSettings.disablePluginStyles = value;
                        if (redraw) {
                            this.drawElements();
                        }
                    }),
            );

        new Setting(this.containerEl)
            .setName(i18n.showBlockquoteMarkers.name)
            .setDesc(i18n.showBlockquoteMarkers.desc)
            .addToggle((toggle) =>
                toggle
                    .setValue(this.newSettings.showBlockquoteMarkers)
                    .onChange(async (value) => {
                        const redraw =
                            value !== this.newSettings.showBlockquoteMarkers;
                        this.newSettings.showBlockquoteMarkers = value;
                        if (redraw) {
                            this.drawElements();
                        }
                    }),
            );

        new Setting(this.containerEl)
            .setName(i18n.highlightListMarkers.name)
            .setDesc(i18n.highlightListMarkers.desc)
            .addToggle((toggle) =>
                toggle
                    .setValue(this.newSettings.outlineListMarkers)
                    .onChange(async (value) => {
                        const redraw =
                            value !== this.newSettings.outlineListMarkers;
                        this.newSettings.outlineListMarkers = value;
                        if (redraw) {
                            this.drawElements();
                        }
                    }),
            );

        new Setting(this.containerEl).setHeading().setName(i18n.block2.name);

        this.containerEl.createEl("p", {
            text: i18n.block2.desc,
        });

        new Setting(this.containerEl)
            .setName(i18n.showAllWhitespace.name)
            .setDesc(i18n.showAllWhitespace.desc)
            .addToggle((toggle) =>
                toggle
                    .setValue(this.newSettings.showAllWhitespace)
                    .onChange(async (value) => {
                        const redraw =
                            value !== this.newSettings.showAllWhitespace;
                        this.newSettings.showAllWhitespace = value;
                        if (redraw) {
                            this.drawElements();
                        }
                    }),
            );

        new Setting(this.containerEl)
            .setName(i18n.showLineEndings.name)
            .setDesc(i18n.showLineEndings.desc)
            .addToggle((toggle) =>
                toggle
                    .setValue(this.newSettings.showLineEndings)
                    .onChange(async (value) => {
                        const redraw =
                            value !== this.newSettings.showLineEndings;
                        this.newSettings.showLineEndings = value;
                        if (redraw) {
                            this.drawElements();
                        }
                    }),
            );

        new Setting(this.containerEl).setHeading().setName(i18n.block3.name);

        this.containerEl.createEl("p", {
            text: i18n.block3.desc,
        });

        new Setting(this.containerEl)
            .setName(i18n.showFrontmatterWhitespace.name)
            .setDesc(i18n.showFrontmatterWhitespace.desc)
            .addToggle((toggle) =>
                toggle
                    .setValue(this.newSettings.showFrontmatterWhitespace)
                    .onChange(async (v) => {
                        const value = v || this.newSettings.showAllWhitespace;
                        const redraw =
                            value !==
                            this.newSettings.showFrontmatterWhitespace;
                        this.newSettings.showFrontmatterWhitespace = value;
                        if (redraw) {
                            this.drawElements();
                        }
                    }),
            );

        new Setting(this.containerEl)
            .setName(i18n.showTableWhitespace.name)
            .setDesc(i18n.showTableWhitespace.desc)
            .addToggle((toggle) =>
                toggle
                    .setValue(this.newSettings.showTableWhitespace)
                    .onChange(async (v) => {
                        const value = v || this.newSettings.showAllWhitespace;
                        const redraw =
                            value !== this.newSettings.showTableWhitespace;
                        this.newSettings.showTableWhitespace = value;
                        if (redraw) {
                            this.drawElements();
                        }
                    }),
            );

        new Setting(this.containerEl)
            .setName(i18n.showCodeBlockWhitespace.name)
            .setDesc(i18n.showCodeBlockWhitespace.desc)
            .addToggle((toggle) =>
                toggle
                    .setValue(this.newSettings.showCodeblockWhitespace)
                    .onChange(async (v) => {
                        const value =
                            v || this.newSettings.showAllCodeblockWhitespace;
                        const redraw =
                            value !== this.newSettings.showCodeblockWhitespace;
                        this.newSettings.showCodeblockWhitespace = value;
                        if (redraw) {
                            this.drawElements();
                        }
                    }),
            );

        new Setting(this.containerEl)
            .setName(i18n.showAllCodeBlockWhitespace.name)
            .setDesc(i18n.showAllCodeBlockWhitespace.desc)
            .addToggle((toggle) =>
                toggle
                    .setValue(this.newSettings.showAllCodeblockWhitespace)
                    .onChange(async (value) => {
                        const redraw =
                            value !==
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
