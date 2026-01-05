import type { Extension } from "@codemirror/state";
import {
    highlightTrailingWhitespace,
    highlightWhitespace,
} from "@codemirror/view";
import { type Command, debounce, Plugin } from "obsidian";
import type { SWSettings } from "./@types/settings";
import { ShowWhitespaceSettingsTab } from "./whitespace-SettingsTab";

export const DEFAULT_SETTINGS: SWSettings = {
    disablePluginStyles: false,
    enabled: true,
    outlineListMarkers: false,
    showAllCodeblockWhitespace: false,
    showAllWhitespace: false,
    showBlockquoteMarkers: false,
    showCodeblockWhitespace: false,
    showFrontmatterWhitespace: true,
    showLineEndings: true,
    showTableWhitespace: true,
};

export class ShowWhitespacePlugin extends Plugin {
    /** CodeMirror 6 extensions. Tracked via array to allow for dynamic updates. */
    private cmExtension: Extension[] = [];
    settings: SWSettings;
    classList: string[] = [];

    async onload(): Promise<void> {
        console.info(
            `loading Show Whitespace (SW-CM6) v${this.manifest.version}`,
        );

        await this.loadSettings();
        this.addSettingTab(new ShowWhitespaceSettingsTab(this.app, this));
        this.initClasses();

        this.registerEditorExtension(this.cmExtension);
        this.handleExtension();

        const markToggle: Command = {
            id: "whitespace-toggle",
            name: "Toggle Show Whitespace",
            icon: "eye",
            callback: async () => this.toggleExtension(this),
        };
        this.addCommand(markToggle);
    }

    handleExtension(): void {
        console.log(
            "(SW-CM6) cmExtensionEnabled",
            this.settings.cmExtensionEnabled,
        );
        this.cmExtension.length = 0;
        if (this.settings.cmExtensionEnabled) {
            this.cmExtension.push(highlightWhitespace());
            this.cmExtension.push(highlightTrailingWhitespace());
        }
        this.app.workspace.updateOptions();
    }

    updateClasses(): void {
        this.removeClasses();
        this.initClasses();
    }

    initClasses(): void {
        this.classList = [this.manifest.id];
        if (!this.settings.enabled || this.settings.disablePluginStyles) {
            this.classList.push("swcm6-nix-plugin-styles");
        }
        if (this.settings.enabled) {
            if (this.settings.showBlockquoteMarkers) {
                this.classList.push("swcm6-show-blockquote-markers");
            }
            if (this.settings.showCodeblockWhitespace) {
                this.classList.push("swcm6-show-codeblock-whitespace");
            }
            if (this.settings.showAllCodeblockWhitespace) {
                this.classList.push("swcm6-show-all-codeblock-whitespace");
            }
            if (this.settings.showLineEndings) {
                this.classList.push("swcm6-show-line-endings");
            }
            if (this.settings.showFrontmatterWhitespace) {
                this.classList.push("swcm6-show-frontmatter-whitespace");
            }
            if (this.settings.showTableWhitespace) {
                this.classList.push("swcm6-show-table-whitespace");
            }
            if (this.settings.showAllWhitespace) {
                this.classList.push("swcm6-show-all-whitespace");
            }
            if (this.settings.outlineListMarkers) {
                this.classList.push("swcm6-outline-list-markers");
            }
        }
        document.body.addClasses(this.classList);
    }

    removeClasses(): void {
        document.body.removeClasses(this.classList);
    }

    onunload(): void {
        console.log("(SW-CM6) unloading Show Whitespace");
        this.removeClasses();
    }

    async handleConfigFileChange() {
        await super.handleConfigFileChange();
        this.onExternalSettingsChange();
    }

    public onExternalSettingsChange = debounce(
        async () => {
            const externalData = await this.loadData();
            const externalSettings = Object.assign(
                {},
                DEFAULT_SETTINGS,
                externalData,
            );
            this.computeCMExtensionEnabled(externalSettings);

            // Check if any setting actually changed
            const hasChanges = (
                Object.keys(externalSettings) as Array<keyof SWSettings>
            ).some((key) => this.settings[key] !== externalSettings[key]);

            if (!hasChanges) {
                console.debug(
                    "(SW-CM6) external settings unchanged, skipping update",
                );
                return;
            }

            this.applySettings(externalSettings);
            console.debug("(SW-CM6) external settings changed");
        },
        2000,
        true,
    );

    async toggleExtension(plugin: ShowWhitespacePlugin): Promise<void> {
        plugin.settings.enabled = !plugin.settings.enabled;
        plugin.updateSettings(this.settings);
    }

    async loadSettings(): Promise<void> {
        if (!this.settings) {
            const options = await this.loadData();
            this.settings = Object.assign({}, DEFAULT_SETTINGS, options);
            this.computeCMExtensionEnabled(this.settings);
            console.debug("settings loaded", this.settings);
        }
    }

    computeCMExtensionEnabled(settings: SWSettings) {
        // CM extensions should be enabled if any whitespace visualization is on
        settings.cmExtensionEnabled =
            settings.enabled &&
            (settings.showLineEndings ||
                settings.showFrontmatterWhitespace ||
                settings.showCodeblockWhitespace ||
                settings.showAllCodeblockWhitespace ||
                settings.showTableWhitespace ||
                settings.showAllWhitespace);
    }

    applySettings(newSettings: SWSettings): void {
        const wasCMExtensionEnabled = this.settings.cmExtensionEnabled;
        this.settings = newSettings;

        // Only update extensions if the CM extension state changed
        if (wasCMExtensionEnabled !== this.settings.cmExtensionEnabled) {
            this.handleExtension();
        }
        this.updateClasses();
    }

    async updateSettings(newSettings: SWSettings): Promise<void> {
        const mergedSettings = Object.assign({}, this.settings, newSettings);
        this.computeCMExtensionEnabled(mergedSettings);
        this.applySettings(mergedSettings);
        await this.saveSettings();
        console.log("(SW-CM6) settings and classes updated", this.settings);
    }

    async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
    }
}
