import {
    type App,
    getLanguage,
    PluginSettingTab,
    type Setting,
    type SettingDefinitionItem,
} from "obsidian";
import type { SWSettings } from "./@types/settings";
import { getTranslate } from "./i18n";
import type ShowWhitespacePlugin from "./main";

export class ShowWhitespaceSettingsTab extends PluginSettingTab {
    plugin: ShowWhitespacePlugin;

    constructor(app: App, plugin: ShowWhitespacePlugin) {
        super(app, plugin);
        this.plugin = plugin;
        this.icon = "eye";
    }

    getControlValue(key: string): unknown {
        return this.plugin.settings[key as keyof SWSettings];
    }

    async setControlValue(key: string, value: unknown): Promise<void> {
        await this.plugin.updateSettings({
            ...this.plugin.settings,
            [key]: value,
        });
    }

    getSettingDefinitions(): SettingDefinitionItem[] {
        const lang = getLanguage();
        const i18n = getTranslate(lang);

        return [
            {
                name: i18n.suppressPluginStyles.name,
                desc: i18n.suppressPluginStyles.desc,
                control: { type: "toggle", key: "disablePluginStyles" },
            },
            {
                name: i18n.showSourceOnlyWhitespace.name,
                desc: i18n.showSourceOnlyWhitespace.desc,
                control: {
                    type: "toggle",
                    key: "showSourceOnlyWhitespace",
                },
            },
            {
                type: "group",
                heading: i18n.markersSection.name,
                items: [
                    {
                        name: "",
                        searchable: false,
                        render: (setting: Setting) => {
                            setting.descEl.setText(i18n.markersSection.desc);
                        },
                    },
                    {
                        name: i18n.showLineEndings.name,
                        desc: i18n.showLineEndings.desc,
                        control: { type: "toggle", key: "showLineEndings" },
                    },
                    {
                        name: i18n.showHardLineBreaks.name,
                        desc: i18n.showHardLineBreaks.desc,
                        control: {
                            type: "toggle",
                            key: "showHardLineBreaks",
                        },
                    },
                    {
                        name: i18n.showUnicodeWhitespace.name,
                        desc: i18n.showUnicodeWhitespace.desc,
                        control: {
                            type: "toggle",
                            key: "showUnicodeWhitespace",
                        },
                    },
                    {
                        name: i18n.highlightListMarkers.name,
                        desc: i18n.highlightListMarkers.desc,
                        control: { type: "toggle", key: "outlineListMarkers" },
                    },
                ],
            },

            {
                type: "group",
                heading: i18n.spaceContextsSection.name,
                items: [
                    {
                        name: "",
                        searchable: false,
                        render: (setting: Setting) => {
                            setting.descEl.setText(
                                i18n.spaceContextsSection.desc,
                            );
                        },
                    },
                    {
                        name: i18n.showFrontmatterWhitespace.name,
                        desc: i18n.showFrontmatterWhitespace.desc,
                        control: {
                            type: "toggle",
                            key: "showFrontmatterWhitespace",
                        },
                    },
                    {
                        name: i18n.showTableWhitespace.name,
                        desc: i18n.showTableWhitespace.desc,
                        control: {
                            type: "toggle",
                            key: "showTableWhitespace",
                        },
                    },
                    {
                        name: i18n.showCodeBlockWhitespace.name,
                        desc: i18n.showCodeBlockWhitespace.desc,
                        control: {
                            type: "toggle",
                            key: "showCodeblockWhitespace",
                        },
                    },
                    {
                        name: i18n.showAllCodeBlockWhitespace.name,
                        desc: i18n.showAllCodeBlockWhitespace.desc,
                        control: {
                            type: "toggle",
                            key: "showAllCodeblockWhitespace",
                        },
                    },
                    {
                        name: i18n.showAllWhitespace.name,
                        desc: i18n.showAllWhitespace.desc,
                        control: {
                            type: "toggle",
                            key: "showAllWhitespace",
                        },
                    },
                ],
            },
        ];
    }
}
