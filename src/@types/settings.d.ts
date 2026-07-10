export interface SWSettings {
    disablePluginStyles: boolean;
    enabled: boolean;
    // Markers
    showLineEndings: boolean;
    showHardLineBreaks: boolean;
    showUnicodeWhitespace: boolean;
    // Structural
    outlineListMarkers: boolean;
    // Space dot contexts
    showFrontmatterWhitespace: boolean;
    showTableWhitespace: boolean;
    showCodeblockWhitespace: boolean;
    showAllCodeblockWhitespace: boolean;
    showAllWhitespace: boolean;
    showSourceOnlyWhitespace: boolean;
}

declare module "obsidian" {
    interface Plugin {
        onConfigFileChange: () => void;
        handleConfigFileChange(): Promise<void>;
    }
}
