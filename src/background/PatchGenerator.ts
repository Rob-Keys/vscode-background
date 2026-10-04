import { homedir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import vscode from 'vscode';

/** The single image shown behind the VS Code workbench. */
export type BackgroundConfig = {
    image: string;
};

function resolveImage(image: string): string {
    image = image.trim();
    if (!image || /^https:/i.test(image)) {
        return image;
    }

    if (image.startsWith('~/')) {
        image = path.join(homedir(), image.slice(2));
    }
    image = image.replace(/\$\{(\w+)\}|\$(\w+)/g, (match, braced, plain) => {
        const value = process.env[braced ?? plain];
        return value ?? match;
    });

    try {
        const fileUrl = image.startsWith('file:') ? image : pathToFileURL(path.resolve(image)).href;
        return vscode.Uri.parse(fileUrl.replace(/^file:\/\//, 'vscode-file://vscode-app')).toString();
    } catch {
        return '';
    }
}

export function createPatch(config: BackgroundConfig): string {
    const image = resolveImage(config.image);
    if (!image) {
        return '';
    }

    const css = `
        body {
            background-image: url(${JSON.stringify(image)});
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
        }
    `;
    return `const style = document.createElement('style'); style.textContent = ${JSON.stringify(css)}; document.head.appendChild(style);`;
}
