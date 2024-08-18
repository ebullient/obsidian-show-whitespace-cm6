export type SWVersion = {
    major: number;
    minor: number;
    patch: number;
};

export interface SWSettings {
    version: SWVersion;
    disablePluginStyles: boolean;
    showBlockquoteMarkers: boolean;
    showExtraWhitespace: boolean;
    showLineEndings: boolean;
    showFrontmatterWhitespace: boolean;
    showCodeblockWhitespace: boolean;
    showAllCodeblockWhitespace: boolean;
    showTableWhitespace: boolean;
    showAllWhitespace: boolean;
    outlineListMarkers: boolean;
    enabled: boolean;
}

declare module "obsidian" {
    interface Plugin {
        onConfigFileChange: () => void;
        handleConfigFileChange(): Promise<void>;
    }
}
