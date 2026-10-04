import { randomUUID } from 'node:crypto';
import fs, { constants as fsConstants } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sudo from '@vscode/sudo-prompt';

import { BACKGROUND_VER, ENCODING, VERSION } from '../utils/constants';
import { vsc } from '../utils/vsc';

export class WorkbenchPatch {
    constructor(public filePath: string) {}

    private getContent(): Promise<string> {
        return fs.promises.readFile(this.filePath, ENCODING);
    }

    public async hasPatched(): Promise<boolean> {
        return (await this.getContent()).includes(BACKGROUND_VER);
    }

    public async hasCurrentPatch(): Promise<boolean> {
        return (await this.getContent()).includes(`${BACKGROUND_VER}.${VERSION}`);
    }

    public async apply(patchContent: string): Promise<boolean> {
        try {
            const curContent = await this.getContent();
            let content = this.cleanPatches(curContent);

            // workbench.html 的 CSP 默认不含 'unsafe-inline'，内联 script 会被拦截，需主动注入
            content = content.replace(/(script-src)(\s)/, `$1 'unsafe-inline'$2`);

            // 将 patch 脚本内联到 HTML
            content = content.replace(
                '</html>',
                [
                    `<!-- vscode-background-start ${BACKGROUND_VER}.${VERSION} -->`,
                    `<script>${patchContent}</script>`,
                    '<!-- vscode-background-end -->',
                    '</html>'
                ].join('\n')
            );

            if (curContent === content) {
                return true;
            }

            return await this.write(content);
        } catch {
            return false;
        }
    }

    private cleanPatches(content: string): string {
        content = content.replace(/(script-src) 'unsafe-inline'/, '$1');
        return content.replace(/<!-- vscode-background-start[\s\S]*?<!-- vscode-background-end -->\n?/g, '');
    }

    private async save(content: string): Promise<boolean> {
        try {
            if (fs.existsSync(this.filePath)) {
                await fs.promises.access(this.filePath, fsConstants.W_OK);
            }
            await fs.promises.writeFile(this.filePath, content, ENCODING);
            return true;
        } catch (error: any) {
            const vscodeApi = vsc;
            if (!vscodeApi) {
                return false;
            }

            const retry = 'Retry with Admin/Sudo';
            if ((await vscodeApi.window.showErrorMessage(error.message, retry)) !== retry) {
                return false;
            }

            const tempFilePath = path.join(tmpdir(), `vscode-background-${randomUUID()}.temp`);
            await fs.promises.writeFile(tempFilePath, content, ENCODING);
            try {
                const command = process.platform === 'win32' ? 'move /Y' : 'mv -f';
                await new Promise<void>((resolve, reject) => {
                    sudo.exec(`${command} "${tempFilePath}" "${this.filePath}"`, { name: 'Background Image' }, error =>
                        error ? reject(error) : resolve()
                    );
                });
                return true;
            } catch (error: any) {
                vscodeApi.window.showErrorMessage(error.message, { title: 'Common Issue' }).then(confirm => {
                    if (confirm) {
                        const link = 'https://github.com/Rob-Keys/vscode-background/issues';
                        vscodeApi.env.openExternal(vscodeApi.Uri.parse(link));
                    }
                });
                return false;
            } finally {
                await fs.promises.rm(tempFilePath, { force: true });
            }
        }
    }

    private write(content: string): Promise<boolean> {
        return content.trim() ? this.save(content) : Promise.resolve(false);
    }

    public async restore(): Promise<boolean> {
        try {
            const current = await this.getContent();
            const clean = this.cleanPatches(current);
            return current === clean ? true : await this.write(clean);
        } catch {
            return false;
        }
    }
}
