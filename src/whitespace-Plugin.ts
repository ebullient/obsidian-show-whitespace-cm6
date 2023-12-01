import { Plugin } from "obsidian";
import {
    highlightTrailingWhitespace,
    highlightWhitespace,
} from "@codemirror/view";
import { Extension } from "@codemirror/state";

export class ShowWhitespacePlugin extends Plugin {
    /** CodeMirror 6 extensions. Tracked via array to allow for dynamic updates. */
    private cmExtension: Extension[] = [];

    async onload(): Promise<void> {
        console.info("loading Show Whitespace (CM6) v" + this.manifest.version);

        this.cmExtension.push(highlightWhitespace());
        this.cmExtension.push(highlightTrailingWhitespace());
        this.registerEditorExtension(this.cmExtension);
    }

    onunload(): void {
        console.log("unloading Show Whitespace (CM6)");
    }
}
