import { homedir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import vscode from 'vscode';

/** The single image shown behind the VS Code workbench. */
export type BackgroundConfig = {
    image: string;
};

// VS Code reports the intentional workbench.html edit as an integrity failure.
// Keep the warning scoped to that notification; other notifications remain visible.
const integrityWarningTranslations = [
    'installation appears to be corrupt. Please reinstall.',
    'je pravděpodobně poškozená. Proveďte prosím přeinstalaci.',
    'Installation ist offenbar beschädigt. Führen Sie eine Neuinstallation durch.',
    'parece estar dañada. Vuelva a instalar.',
    'semble être endommagée. Effectuez une réinstallation.',
    'sembra danneggiata. Reinstallare.',
    'インストールが壊れている可能性があります。再インストールしてください。',
    '설치가 손상된 것 같습니다. 다시 설치하세요.',
    'prawdopodobnie jest uszkodzona. Spróbuj zainstalować ponownie.',
    'parece estar corrompida. Reinstale-o.',
    'ïñstællætïøñ æppëærs tø þë çørrµpt. Plëæsë rëïñstæll.',
    'повреждена. Повторите установку.',
    'yüklemeniz bozuk gibi görünüyor. Lütfen yeniden yükleyin.',
    '安装似乎损坏。请重新安装。',
    '安裝似乎已損毀。請重新安裝。'
];

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

    const backgroundCss = `
        [id='workbench.parts.editor'] {
            background-image: url(${JSON.stringify(image)});
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }

        [id='workbench.parts.editor'] .monaco-editor-background {
            background-color: transparent !important;
        }

        [id='workbench.parts.editor'] > .content {
            background-color: transparent !important;
        }
    `;
    const integrityWarningCss = integrityWarningTranslations
        .map(translation => `.notification-toast-container:has([aria-label*='${translation}']) { display: none; }`)
        .join('\n');
    const css = `${backgroundCss}\n${integrityWarningCss}`;
    return `const style = document.createElement('style'); style.textContent = ${JSON.stringify(css)}; document.head.appendChild(style);`;
}
