# Background Image for VS Code

Show one full-opacity image behind the VS Code workbench, including the editor, open tabs, sidebars, and panels.

## Configure

Set `background.image` to an HTTPS image URL or a local image path:

```json
{
  "background.image": "~/Pictures/code-background.jpg"
}
```

The image is centered and fills the window with `background-size: cover`. It stays fixed in place when you open or close sidebars and panels; they cover the portions of the image beneath them. Local paths support `~` and environment variables such as `${HOME}`. Leave `background.image` empty to remove it. When a setting changes, approve **Apply and Reload** when prompted, or run **Background: Enable and apply background image** from the Command Palette.

The image stays at full opacity behind the workbench. Editors, tabs, sidebars, and panels keep their normal VS Code backgrounds and cover it wherever they occupy the window.

## Commands

- **Background: Enable and apply background image** — install or reapply the workbench patch.
- **Background: Disable background image** — remove the patch and disable the extension.
- **Background: Uninstall Background Image** — restore the workbench and uninstall the extension.

VS Code updates may replace the patched workbench file. Run the enable command again to reapply the image.

## License

MIT
