/** Minimal stub of the Obsidian API for unit tests. */

export class Plugin {
    manifest = { id: "stub", name: "Stub", version: "0.0.0" };
    app = {};
}

export class PluginSettingTab {}

export class Setting {
    setName(_n: string) {
        return this;
    }
    setDesc(_d: string) {
        return this;
    }
    setHeading() {
        return this;
    }
    setClass(_c: string) {
        return this;
    }
    addToggle(
        _cb: (t: {
            setValue: (v: boolean) => typeof this;
            onChange: (cb: (v: boolean) => void) => typeof this;
        }) => void,
    ) {
        return this;
    }
    addButton(
        _cb: (b: {
            setIcon: (i: string) => typeof this;
            setTooltip: (t: string) => typeof this;
            onClick: (cb: () => void) => typeof this;
            buttonEl: HTMLElement;
        }) => void,
    ) {
        return this;
    }
}

export function debounce<T extends (...args: unknown[]) => unknown>(
    fn: T,
    _wait: number,
    _leading?: boolean,
): T {
    return fn;
}

export function getLanguage(): string {
    return "en";
}

export const activeDocument = {
    body: { addClasses: () => {}, removeClasses: () => {} },
};
