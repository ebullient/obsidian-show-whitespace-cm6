import {
    EditorSelection,
    EditorState,
    type Extension,
} from "@codemirror/state";
import { highlightWhitespace } from "@codemirror/view";
import { type Command, debounce, Plugin } from "obsidian";
import type { SWSettings } from "./@types/settings";
import { consecutiveWhitespaceExtension } from "./consecutiveWhitespace-Extension";
import { hardLineBreaksExtension } from "./hardLineBreaks-Extension";
import { lineEndingsExtension } from "./lineEndings-Extension";
import { trailingWhitespaceExtension } from "./trailingWhitespace-Extension";
import { ShowWhitespaceSettingsTab } from "./whitespace-SettingsTab";

// Obsidian's setEphemeralState can dispatch a selection that points beyond the
// document end when switching to Source mode, causing a CM6 RangeError crash.
// This filter clamps any out-of-bounds selection to a safe position before
// CM6 validates it.
const clampSelectionFilter = EditorState.transactionFilter.of((tr) => {
    if (!tr.selection) return tr;
    const maxPos = tr.newDoc.length;
    const needsFix = tr.selection.ranges.some(
        (r) => r.anchor > maxPos || r.head > maxPos,
    );
    if (!needsFix) return tr;
    return {
        changes: tr.changes,
        selection: EditorSelection.create(
            tr.selection.ranges.map((r) =>
                EditorSelection.range(
                    Math.min(r.anchor, maxPos),
                    Math.min(r.head, maxPos),
                ),
            ),
            tr.selection.mainIndex,
        ),
        effects: tr.effects,
        scrollIntoView: tr.scrollIntoView,
    };
});

export const DEFAULT_SETTINGS: SWSettings = {
    disablePluginStyles: false,
    enabled: true,
    // Markers
    showLineEndings: true,
    showHardLineBreaks: true,
    showTrailingWhitespace: true,
    showConsecutiveWhitespace: true,
    // Structural
    outlineListMarkers: false,
    showBlockquoteMarkers: false,
    // Space dot contexts
    showAllCodeblockWhitespace: false,
    showAllWhitespace: false,
    showCodeblockWhitespace: false,
    showFrontmatterWhitespace: true,
    showTableWhitespace: true,
};

export class ShowWhitespacePlugin extends Plugin {
    /** CodeMirror 6 extensions. Tracked via array to allow for dynamic updates. */
    private cmExtension: Extension[] = [];
    settings: SWSettings;
    classList: string[] = [];

    async onload(): Promise<void> {
        console.debug(
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
            callback: async () => this.toggleExtension(),
        };
        this.addCommand(markToggle);
    }

    handleExtension(): void {
        console.debug(
            "(SW-CM6) cmExtensionEnabled",
            this.settings.cmExtensionEnabled,
        );
        this.cmExtension.length = 0;
        // Always active: prevents Obsidian's setEphemeralState crash on Source mode entry
        this.cmExtension.push(clampSelectionFilter);
        if (this.settings.enabled) {
            if (this.settings.cmExtensionEnabled) {
                this.cmExtension.push(highlightWhitespace());
            }
            if (this.settings.showLineEndings) {
                this.cmExtension.push(lineEndingsExtension());
            }
            if (this.settings.showHardLineBreaks) {
                this.cmExtension.push(hardLineBreaksExtension());
            }
            if (this.settings.showTrailingWhitespace) {
                this.cmExtension.push(trailingWhitespaceExtension());
            }
            if (this.settings.showConsecutiveWhitespace) {
                this.cmExtension.push(consecutiveWhitespaceExtension());
            }
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
            if (this.settings.showTrailingWhitespace) {
                this.classList.push("swcm6-show-trailing-whitespace");
            }
            if (this.settings.showConsecutiveWhitespace) {
                this.classList.push("swcm6-show-consecutive-whitespace");
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
        activeDocument.body.addClasses(this.classList);
    }

    removeClasses(): void {
        activeDocument.body.removeClasses(this.classList);
    }

    onunload(): void {
        console.debug("(SW-CM6) unloading Show Whitespace");
        this.removeClasses();
    }

    async handleConfigFileChange() {
        await super.handleConfigFileChange();
        this.onExternalSettingsChange();
    }

    public onExternalSettingsChange = debounce(
        async () => {
            const externalData = (await this.loadData()) as Partial<SWSettings>;
            const externalSettings: SWSettings = Object.assign(
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

    async toggleExtension(): Promise<void> {
        this.settings.enabled = !this.settings.enabled;
        await this.updateSettings(this.settings);
    }

    async loadSettings(): Promise<void> {
        if (!this.settings) {
            const options = (await this.loadData()) as Partial<SWSettings>;
            this.settings = Object.assign({}, DEFAULT_SETTINGS, options);
            this.computeCMExtensionEnabled(this.settings);
            console.debug("settings loaded", this.settings);
        }
    }

    computeCMExtensionEnabled(settings: SWSettings) {
        settings.cmExtensionEnabled =
            settings.enabled &&
            (settings.showAllWhitespace ||
                settings.showFrontmatterWhitespace ||
                settings.showCodeblockWhitespace ||
                settings.showAllCodeblockWhitespace ||
                settings.showTableWhitespace);
    }

    applySettings(newSettings: SWSettings): void {
        const wasEnabled = this.settings.enabled;
        const wasCMExtensionEnabled = this.settings.cmExtensionEnabled;
        const wasShowLineEndings = this.settings.showLineEndings;
        const wasShowHardLineBreaks = this.settings.showHardLineBreaks;
        const wasShowTrailingWhitespace = this.settings.showTrailingWhitespace;
        const wasShowConsecutiveWhitespace =
            this.settings.showConsecutiveWhitespace;
        this.settings = newSettings;

        if (
            wasEnabled !== this.settings.enabled ||
            wasCMExtensionEnabled !== this.settings.cmExtensionEnabled ||
            wasShowLineEndings !== this.settings.showLineEndings ||
            wasShowHardLineBreaks !== this.settings.showHardLineBreaks ||
            wasShowTrailingWhitespace !==
                this.settings.showTrailingWhitespace ||
            wasShowConsecutiveWhitespace !==
                this.settings.showConsecutiveWhitespace
        ) {
            this.handleExtension();
        }
        this.updateClasses();
    }

    async updateSettings(newSettings: SWSettings): Promise<void> {
        const mergedSettings = Object.assign({}, this.settings, newSettings);
        this.computeCMExtensionEnabled(mergedSettings);
        this.applySettings(mergedSettings);
        await this.saveSettings();
        console.debug("(SW-CM6) settings and classes updated", this.settings);
    }

    async saveSettings(): Promise<void> {
        // cmExtensionEnabled is computed — don't persist it
        const { cmExtensionEnabled: _derived, ...dataToSave } = this.settings;
        await this.saveData(dataToSave);
    }
}
