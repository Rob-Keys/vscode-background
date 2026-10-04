import fs from 'node:fs';
import path from 'node:path';

import { vsc } from './vsc';

// VS Code 安装根目录
// appRoot 示例：'/Applications/Visual Studio Code.app/Contents/Resources/app'
// See https://code.visualstudio.com/api/references/vscode-api#env
const appRoot = vsc?.env.appRoot ?? '';

/**
 * workbench.html 文件路径
 */
export function getWorkbenchHtmlPath() {
    if (vsc?.env.appHost === 'desktop') {
        // vscode
        const browserPath = path.join(appRoot, 'out/vs/code/electron-browser/workbench/workbench.html');
        // some version of Cursor use electron-sandbox
        const sandboxPath = path.join(appRoot, 'out/vs/code/electron-sandbox/workbench/workbench.html');
        return fs.existsSync(browserPath) ? browserPath : sandboxPath;
    }
    // code-server / web
    return path.join(appRoot, 'out/vs/code/browser/workbench/workbench.html');
}
