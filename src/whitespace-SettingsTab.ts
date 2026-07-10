import { type App, getLanguage, PluginSettingTab, Setting } from "obsidian";
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

    display(): void {
        void this.plugin.loadSettings().then(() => this.reset());
    }

    async reset(): Promise<void> {
        this.newSettings = JSON.parse(
            JSON.stringify(this.plugin.settings),
        ) as SWSettings;
        this.drawElements();
    }

    private toggle(key: keyof SWSettings, name: string, desc: string): void {
        new Setting(this.containerEl)
            .setName(name)
            .setDesc(desc)
            .addToggle((toggle) =>
                toggle
                    .setValue(this.newSettings[key] as boolean)
                    .onChange(async (value) => {
                        (this.newSettings[key] as boolean) = value;
                        this.drawElements();
                    }),
            );
    }

    drawElements(): void {
        const id = this.plugin.manifest.id;
        const lang = getLanguage();
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
                    .onClick(async () => {
                        await this.reset();
                        console.debug("(SW-CM6) Configuration reset");
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

        this.toggle(
            "disablePluginStyles",
            i18n.suppressPluginStyles.name,
            i18n.suppressPluginStyles.desc,
        );

        // ── Markers ──────────────────────────────────────────────────────────
        new Setting(this.containerEl)
            .setHeading()
            .setName(i18n.markersSection.name);
        this.containerEl.createEl("p", { text: i18n.markersSection.desc });

        this.toggle(
            "showLineEndings",
            i18n.showLineEndings.name,
            i18n.showLineEndings.desc,
        );
        this.toggle(
            "showHardLineBreaks",
            i18n.showHardLineBreaks.name,
            i18n.showHardLineBreaks.desc,
        );
        this.toggle(
            "showUnicodeWhitespace",
            i18n.showUnicodeWhitespace.name,
            i18n.showUnicodeWhitespace.desc,
        );

        // ── Structural ────────────────────────────────────────────────────────
        new Setting(this.containerEl)
            .setHeading()
            .setName(i18n.structuralSection.name);

        this.toggle(
            "outlineListMarkers",
            i18n.highlightListMarkers.name,
            i18n.highlightListMarkers.desc,
        );

        // ── Space dot contexts ────────────────────────────────────────────────
        new Setting(this.containerEl)
            .setHeading()
            .setName(i18n.spaceContextsSection.name);
        this.containerEl.createEl("p", {
            text: i18n.spaceContextsSection.desc,
        });

        this.toggle(
            "showFrontmatterWhitespace",
            i18n.showFrontmatterWhitespace.name,
            i18n.showFrontmatterWhitespace.desc,
        );
        this.toggle(
            "showTableWhitespace",
            i18n.showTableWhitespace.name,
            i18n.showTableWhitespace.desc,
        );
        this.toggle(
            "showCodeblockWhitespace",
            i18n.showCodeBlockWhitespace.name,
            i18n.showCodeBlockWhitespace.desc,
        );
        this.toggle(
            "showAllCodeblockWhitespace",
            i18n.showAllCodeBlockWhitespace.name,
            i18n.showAllCodeBlockWhitespace.desc,
        );
        this.toggle(
            "showAllWhitespace",
            i18n.showAllWhitespace.name,
            i18n.showAllWhitespace.desc,
        );
    }

    /** Save on exit */
    hide(): void {
        void this.save();
    }
}
