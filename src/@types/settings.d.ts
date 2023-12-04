export type SWVersion = {
    major: number;
    minor: number;
    patch: number;
};

export interface SWSettings {
    version: SWVersion;
    disablePluginStyles: boolean;
    showBlockquoteMarkers: boolean;
    showCodeblockWhitespace: boolean;
    showAllWhitespace: boolean;
    outlineListMarkers: boolean;
}
