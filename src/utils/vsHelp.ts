import vscode from 'vscode';

type ReloadOptions = {
    message?: string;
    btnReload?: string;
    beforeReload?: () => Promise<boolean | void>;
};

export const vsHelp = {
    async reload(options: ReloadOptions = {}): Promise<void> {
        if (options.message) {
            const choice = await vscode.window.showInformationMessage(options.message, {
                title: options.btnReload ?? 'Reload VS Code'
            });
            if (!choice || (await options.beforeReload?.()) === false) {
                return;
            }
        }
        await vscode.commands.executeCommand('workbench.action.reloadWindow');
    }
};
