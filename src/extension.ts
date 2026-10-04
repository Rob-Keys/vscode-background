import vscode from 'vscode';

import { Background } from './background/Background';
import { EXTENSION_ID } from './utils/constants';
import { vsHelp } from './utils/vsHelp';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    const background = new Background();

    context.subscriptions.push(background);
    await background.setup();

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.background.install', async () => {
            const wasEnabled = background.config.enabled;
            await background.config.update('enabled', true, true);
            if (wasEnabled && (await background.applyPatch())) {
                await vsHelp.reload();
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.background.disable', async () => {
            const wasEnabled = background.config.enabled;
            await background.config.update('enabled', false, true);
            if (!wasEnabled && (await background.uninstall())) {
                await vsHelp.reload();
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.background.uninstall', async () => {
            if (!(await background.uninstall())) {
                await vscode.window.showErrorMessage('Could not restore the VS Code workbench.');
                return;
            }
            await vscode.commands.executeCommand('workbench.extensions.uninstallExtension', EXTENSION_ID);
            await vsHelp.reload({ message: 'Background Image has been uninstalled.' });
        })
    );
}
