<!-- 中英文切换 -->
<div align="right">

**English**

</div>
<!-- 中英文切换 end -->

<!-- 封面区域 -->
<div align="center">

![logo](./images/logo.png)

<h1><b>vscode-background</b></h1>

### Bring background images to your [Visual Studio Code](https://code.visualstudio.com)

`fullscreen`, `editor`, `sidebar`, `auxiliarybar`, `panel`, `carousel`, `custom images/styles`...

[GitHub](https://github.com/shalldie/vscode-background) | [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=shalldie.background)

[![Version](https://img.shields.io/badge/version-3.0.1-blue?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=shalldie.background)
[![Stars](https://img.shields.io/github/stars/shalldie/vscode-background?logo=github&style=flat-square)](https://github.com/shalldie/vscode-background)
[![Build Status](https://img.shields.io/github/actions/workflow/status/shalldie/vscode-background/ci.yml?branch=master&label=build&style=flat-square)](https://github.com/shalldie/vscode-background/actions)
[![License](https://img.shields.io/github/license/shalldie/vscode-background?style=flat-square)](https://github.com/shalldie/vscode-background)

Multiple sections, `editor`, `sidebar`, `auxiliarybar`, `panel`

`fullscreen`

</div>

</div>

<!-- 封面区域 end -->

## Installation

There are 2 ways to install this extension:

1. Install from [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=shalldie.background).
2. Search `shalldie.background` from vscode.

## Custom

User defined requirements can be met by changing the configuration(`settings.json`).

[what's `settings.json`](https://code.visualstudio.com/docs/getstarted/settings#_settingsjson) | [where?](https://github.com/shalldie/vscode-background/issues/274)

## Config

### Global Config

| Name                 |   Type    | Default | Description                             |
| :------------------- | :-------: | :-----: | :-------------------------------------- |
| `background.enabled` | `Boolean` | `true`  | Whether to enable background extension. |

### Editor Section Config

Edit `background.editor` to config editor section.

| Name       |    Type    |   Default    | Description                                                          |
| :--------- | :--------: | :----------: | :------------------------------------------------------------------- |
| `useFront` | `boolean`  |    `true`    | Place the image above or below the code.                             |
| `style`    |  `object`  |     `{}`     | Custom style for images. [MDN Reference][mdn-css]                    |
| `styles`   | `object[]` |     `[]`     | Custom style for each image individually.                            |
| `images`   | `string[]` |     `[]`     | Custom images, supports online and local images, as well as folders. |
| `interval` |  `number`  |     `0`      | Seconds of interval for carousel, default `0` to disabled.           |
| `random`   | `boolean`  |   `false`    | Whether to randomly display images.                                  |

[mdn-css]: https://developer.mozilla.org/docs/Web/CSS

example:

```json
{
  "background.editor": {
    "useFront": true,
    "style": {
      "background-position": "100% 100%",
      "background-size": "auto",
      "opacity": 0.6
    },
    "styles": [],
    // `images` supports online and local images, as well as folders.
    "images": [
      // online images, only `https` is allowed.
      "https://hostname/online.jpg",
      // local images
      "file:///local/path/img.jpeg",
      "/home/xie/downloads/img.gif",
      "C:/Users/xie/img.bmp",
      "D:\\downloads\\images\\img.webp",
      // `~` and environment variables are supported in local paths
      "~/Pictures/img.png",
      "${HOME}/Pictures/img.png",
      // local folders
      "/home/xie/images",
      // data URL
      "data:image/*;base64,<base64-data>"
    ],
    "interval": 0,
    "random": false
  }
}
```

### Fullscreen, Sidebar, Auxiliarybar, Panel Section Config

Edit `background.fullscreen`, `background.sidebar`, `background.auxiliarybar`, `background.panel` to config these sections.

| Name       |    Type    | Default  | Description                                                                              |
| :--------- | :--------: | :------: | :--------------------------------------------------------------------------------------- |
| `images`   | `string[]` |   `[]`   | Custom images, supports online and local images, as well as folders.                     |
| `opacity`  |  `number`  |  `0.1`   | Opacity of the images, alias to [opacity][mdn-opacity], `0.1 ~ 0.3` recommended.         |
| `size`     |  `string`  | `cover`  | Alias to [background-size][mdn-background-size], `cover` to self-adaption (recommended). |
| `position` |  `string`  | `center` | Alias to [background-position][mdn-background-position], default `center`.               |
| `styles`   | `object[]` |   `[]`   | Custom style for each image individually.                                               |
| `interval` |  `number`  |   `0`    | Seconds of interval for carousel, default `0` to disabled.                               |
| `random`   | `boolean`  | `false`  | Whether to randomly display images.                                                      |

[mdn-opacity]: https://developer.mozilla.org/docs/Web/CSS/opacity
[mdn-background-size]: https://developer.mozilla.org/docs/Web/CSS/background-size
[mdn-background-position]: https://developer.mozilla.org/docs/Web/CSS/background-position

example:

```json
{
  "background.fullscreen": {
    // `images` supports online and local images, as well as folders.
    "images": [
      // online images, only `https` is allowed.
      "https://hostname/online.jpg",
      // local images
      "file:///local/path/img.jpeg",
      "/home/xie/downloads/img.gif",
      "C:/Users/xie/img.bmp",
      "D:\\downloads\\images\\img.webp",
      // `~` and environment variables are supported in local paths
      "~/Pictures/img.png",
      "${HOME}/Pictures/img.png",
      // local folders
      "/home/xie/images",
      // data URL
      "data:image/*;base64,<base64-data>"
    ],
    "opacity": 0.1,
    "size": "cover",
    "position": "center",
    "styles": [],
    "interval": 0,
    "random": false
  },
  // `sidebar` and `panel` have the same config as `fullscreen`
  "background.sidebar": {},
  "background.panel": {}
}
```

## Quick Command

Click the 「Background」 button on the right-bottom of statusbar, all commands of `background` will appear:

## Common Issues

> **This extension works by editing the vscode's html file.**

If VS Code updates or the extension stops applying backgrounds, run `Background: Enable and apply the background` again.

## Uninstall

Use `Background: Uninstall the extension` from the Command Palette, or uninstall it from Extensions.

## Share Your Images

We share background images [here](https://github.com/shalldie/vscode-background/issues/106).

## LICENSE

MIT
