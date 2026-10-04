// The uninstall hook runs outside VS Code's extension host.

import type VSCODE_BASE from 'vscode';

let vsc: typeof VSCODE_BASE | undefined;

try {
    vsc = require('vscode');
} catch {
    // The API is unavailable in the uninstall hook.
}

export { vsc };
