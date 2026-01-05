export interface SWSettings {
    disablePluginStyles: boolean;
    showBlockquoteMarkers: boolean;
    showLineEndings: boolean;
    showFrontmatterWhitespace: boolean;
    showCodeblockWhitespace: boolean;
    showAllCodeblockWhitespace: boolean;
    showTableWhitespace: boolean;
    showAllWhitespace: boolean;
    outlineListMarkers: boolean;
    enabled: boolean;
    cmExtensionEnabled?: boolean; // Computed field - true if CM extensions should be active
}

declare module "obsidian" {
    interface Plugin {
        onConfigFileChange: () => void;
        handleConfigFileChange(): Promise<void>;
    }
}
