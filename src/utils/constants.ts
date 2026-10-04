import fs from 'node:fs';
import path from 'node:path';

// The bundle is in dist/, so its parent is the extension root.
export const EXT_ROOT = path.join(__dirname, '../');

export const ENCODING = 'utf-8';

const pkg: { version: string; publisher: string; name: string } = JSON.parse(
    fs.readFileSync(path.join(EXT_ROOT, 'package.json'), ENCODING)
);

export const VERSION: string = pkg.version;

export const BACKGROUND_VER = 'background.ver';

export const PUBLISHER: string = pkg.publisher;

export const EXTENSION_NAME: string = pkg.name;

export const EXTENSION_ID = `${PUBLISHER}.${EXTENSION_NAME}`;

export const WORKBENCH_PATH_FILE = path.join(EXT_ROOT, 'vscb.touch');
