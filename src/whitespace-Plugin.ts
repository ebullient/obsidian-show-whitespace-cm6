import { Plugin, debounce } from "obsidian";
import {
    highlightTrailingWhitespace,
    highlightWhitespace,
} from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { SWSettings, SWVersion } from "./@types/settings";
import { ShowWhitespaceSettingsTab } from "./whitespace-SettingsTab";

export const DEFAULT_SETTINGS: SWSettings = {
    version: {
        major: 0,
        minor: 0,
        patch: 0,
    },
    disablePluginStyles: false,
    showBlockquoteMarkers: false,
    showCodeblockWhitespace: false,
    showAllWhitespace: false,
    outlineListMarkers: false,
};

export class ShowWhitespacePlugin extends Plugin {
    /** CodeMirror 6 extensions. Tracked via array to allow for dynamic updates. */
    private cmExtension: Extension[] = [];
    settings: SWSettings;
    classList: string[] = [];

    async onload(): Promise<void> {
        console.info(
            "loading Show Whitespace (SW-CM6) v" + this.manifest.version,
        );

        await this.loadSettings();
        this.addSettingTab(new ShowWhitespaceSettingsTab(this.app, this));

        document.body.classList.add(this.manifest.id);
        this.initClasses();

        this.cmExtension.push(highlightWhitespace());
        this.cmExtension.push(highlightTrailingWhitespace());
        this.registerEditorExtension(this.cmExtension);
    }

    initClasses(): void {
        this.classList = [];
        if (this.settings.disablePluginStyles) {
            this.classList.push("swcm6-nix-plugin-styles");
        }
        if (this.settings.showBlockquoteMarkers) {
            this.classList.push("swcm6-show-blockquote-markers");
        }
        if (this.settings.showCodeblockWhitespace) {
            this.classList.push("swcm6-show-codeblock-whitespace");
        }
        if (this.settings.showAllWhitespace) {
            this.classList.push("swcm6-show-all-whitespace");
        }
        if (this.settings.outlineListMarkers) {
            this.classList.push("swcm6-outline-list-markers");
        }
        document.body.classList.add(...this.classList);
    }

    removeClasses(): void {
        document.body.classList.remove(...this.classList);
    }

    onunload(): void {
        console.log("(SW-CM6) unloading Show Whitespace");
        document.body.classList.add(this.manifest.id);
        this.removeClasses();
    }

    async handleConfigFileChange() {
        await super.handleConfigFileChange();
        this.onExternalSettingsChange();
    }

    public onExternalSettingsChange = debounce(async () => {
            this.removeClasses();
            this.initClasses();
            console.debug("(SW-CM6) external settings changed");
        }, 2000, true);

    async loadSettings(): Promise<void> {
        if (!this.settings) {
            const options = await this.loadData();
            this.settings = Object.assign({}, DEFAULT_SETTINGS, options);

            // check settings version, adapt if necessary
            const version = toVersion(this.manifest.version);
            if (compareVersion(version, this.settings.version) != 0) {
                this.settings.version = version;
                await this.saveSettings();
            }
        }
    }

    async updateSettings(newSettings: SWSettings): Promise<void> {
        this.settings = Object.assign({}, this.settings, newSettings);
        await this.saveSettings();
        this.removeClasses();
        this.initClasses();
        console.log("(SW-CM6) settings and classes updated");
    }

    async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
    }
}

function compareVersion(v1: SWVersion, v2: SWVersion): number {
    if (v1.major === v2.major) {
        if (v1.minor === v2.minor) {
            return v1.patch - v2.patch;
        }
        return v1.minor - v2.minor;
    }
    return v1.major - v2.major;
}
function toVersion(version: string): SWVersion {
    const v = version.split(".");
    return {
        major: Number(v[0]),
        minor: Number(v[1]),
        patch: Number(v[2]),
    };
}
