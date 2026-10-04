import fs from 'node:fs';

import { WorkbenchPatch } from './background/WorkbenchPatch';
import { ENCODING, WORKBENCH_PATH_FILE } from './utils/constants';

async function uninstall() {
    try {
        const filePath = (await fs.promises.readFile(WORKBENCH_PATH_FILE, ENCODING)).trim();
        if (!filePath) {
            return;
        }

        await new WorkbenchPatch(filePath).restore();
        console.log('vscode background has been auto uninstalled.');
    } catch (ex: any) {
        console.error('vscode background uninstalled fail: ' + ex.message);
    }
}

uninstall();
