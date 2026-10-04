import { rmSync } from 'node:fs';

import esbuild from 'esbuild';

const watchMode = process.argv.includes('--watch');

async function main() {
    rmSync('dist', { recursive: true, force: true });

    const ctx = await esbuild.context({
        entryPoints: ['src/extension.ts', 'src/uninstall.ts'],
        bundle: true,
        format: 'cjs',
        minify: false,
        sourcemap: watchMode,
        sourcesContent: false,
        platform: 'node',
        outdir: 'dist',
        external: ['vscode'],
        logLevel: 'warning'
    });
    if (watchMode) {
        await ctx.watch();
    } else {
        await ctx.rebuild();
        await ctx.dispose();
    }
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
