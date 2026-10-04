import fs from 'node:fs';
import vscode, { type Disposable } from 'vscode';

import { ENCODING, EXTENSION_NAME, VERSION, WORKBENCH_PATH_FILE } from '../utils/constants';
import { getWorkbenchHtmlPath } from '../utils/patchTargets';
import { vsHelp } from '../utils/vsHelp';
import { WorkbenchPatch } from './WorkbenchPatch';
import { createPatch, type BackgroundConfig } from './PatchGenerator';

type BackgroundSettings = vscode.WorkspaceConfiguration & BackgroundConfig & { enabled: boolean };

export class Background implements Disposable {
    private readonly workbenchFile = new WorkbenchPatch(getWorkbenchHtmlPath());
    private configurationListener?: Disposable;

    public get config(): BackgroundSettings {
        return vscode.workspace.getConfiguration('background') as BackgroundSettings;
    }

    private async recordWorkbenchPath(): Promise<void> {
        if (!fs.existsSync(WORKBENCH_PATH_FILE)) {
            await fs.promises.writeFile(WORKBENCH_PATH_FILE, this.workbenchFile.filePath, ENCODING);
        }
    }

    private async onConfigurationChanged(): Promise<void> {
        if (!this.config.enabled) {
            if (await this.workbenchFile.hasPatched()) {
                await vsHelp.reload({
                    message: 'The background image will be disabled.',
                    btnReload: 'Disable and Reload',
                    beforeReload: () => this.uninstall()
                });
            }
            return;
        }

        await vsHelp.reload({
            message: 'The background image settings changed.',
            btnReload: 'Apply and Reload',
            beforeReload: () => this.applyPatch()
        });
    }

    public async setup(): Promise<void> {
        await this.recordWorkbenchPath();

        const hasCurrentPatch = await this.workbenchFile.hasCurrentPatch();
        const hasImage = Boolean(this.config.image?.trim());
        if (this.config.enabled && !hasCurrentPatch && hasImage) {
            vscode.window
                .showInformationMessage(`Background Image ${VERSION} is ready to apply.`, {
                    title: 'Apply and Reload',
                    action: async () => {
                        if (await this.applyPatch()) {
                            await vsHelp.reload();
                        }
                    }
                })
                .then(choice => choice?.action());
        }

        this.configurationListener = vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration(EXTENSION_NAME)) {
                void this.onConfigurationChanged();
            }
        });
    }

    public async applyPatch(): Promise<boolean> {
        if (!this.config.enabled) {
            return true;
        }

        const patch = createPatch(this.config);
        return patch ? this.workbenchFile.apply(patch) : this.workbenchFile.restore();
    }

    public async uninstall(): Promise<boolean> {
        return this.workbenchFile.restore();
    }

    public dispose(): void {
        this.configurationListener?.dispose();
    }
}
