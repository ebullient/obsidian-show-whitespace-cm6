export interface SWSettings {
    disablePluginStyles: boolean;
    enabled: boolean;
    // Markers
    showLineEndings: boolean;
    showHardLineBreaks: boolean;
    // Structural
    showBlockquoteMarkers: boolean;
    outlineListMarkers: boolean;
    // Space dot contexts (CSS only — driven by cmExtensionEnabled)
    showFrontmatterWhitespace: boolean;
    showTableWhitespace: boolean;
    showCodeblockWhitespace: boolean;
    showAllCodeblockWhitespace: boolean;
    showAllWhitespace: boolean;
    // Computed — not persisted
    cmExtensionEnabled?: boolean;
}

declare module "obsidian" {
    interface Plugin {
        onConfigFileChange: () => void;
        handleConfigFileChange(): Promise<void>;
    }
}
