# Obsidian: Show Whitespace
[![GitHub tag (Latest by date)](https://img.shields.io/github/v/tag/ebullient/obsidian-show-whitespace-cm6)](https://github.com/ebullient/obsidian-show-whitespace-cm6/releases) ![GitHub all releases](https://img.shields.io/github/downloads/ebullient/obsidian-show-whitespace-cm6/total?color=success) [![CC BY-SA 4.0][cc-by-sa-shield]][cc-by-sa]

This is a simple plugin to enable CodeMirror 6 extensions to highlight whitespace in both Source and Live Preview modes. 

## Features

- **Whitespace Visualization:** Displays leading and trailing whitespace in your notes.
- **Blockquote Identification:** Highlights the leading caret for blockquotes, making them easily distinguishable.
- **List marker whitespace:** Slight background applied to whitespace assigned to list markers (bullets or numbers)

Basic CSS styling provided by the plugin renders characters for whitespace at the beginning and ending of lines (not in the middle) for readability. 

## Look / Feel options

The plugin provides a few options to customize the look and feel of whitespace characters.

You can also completely disable the plugin's CSS and use your own.
1. Use the plugin setting to disable registration of style.css (this functions as a style settings plugin would)
2. Copy the plugin `style.css` into your own CSS snippet
3. Update styles as desired.

## Installation

To install:
1. Open `Settings` -> `Community Plugins`
2. Disable safe mode
3. **Browse** and search for "Show Whitespace"
4. Click install
5. Use the toggle on the community plugins tab to enable the plugin.

### Preview with Beta Reviewers Auto-update Tester (BRAT)

1. **Install BRAT**:
    - Open `Settings` -> `Community Plugins`.
    - Disable safe mode.
    - *Browse*, and search for "BRAT."
    - Install the latest version of **Obsidian 42 - BRAT**.
2. **Configure BRAT**:
    - Open BRAT settings (`Settings` -> `Obsidian 42 - BRAT`).
    - In the `Beta Plugin List` section, click `Add Beta Plugin`.
    - Specify this repository: `ebullient/obsidian-show-whitespace-cm6`.
3. **Enable the Plugin**:
    - Navigate to `Settings` -> `Community Plugins`.
    - Enable the plugin.

## For developers

Pull requests are both welcome and appreciated. 😀

## Support

Interested in supporting further development? Consider buying me a coffee!

[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" width="200px"/>](https://www.buymeacoffee.com/ebullient)

## Attribution

While this is a new implementation for CM6, styles and characters are inspired by behavior in VSCode and the original [Show Whitespace](https://github.com/deathau/cm-show-whitespace-obsidian) plugin by [death_au](https://github.com/deathau).

## License

This work is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License][cc-by-sa].

[![CC BY-SA 4.0](https://licensebuttons.net/l/by-sa/4.0/88x31.png)][cc-by-sa]

[cc-by-sa]: http://creativecommons.org/licenses/by-sa/4.0/
[cc-by-sa-image]: https://licensebuttons.net/l/by-sa/4.0/88x31.png
[cc-by-sa-shield]: https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg
