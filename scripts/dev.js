/*
 * @Author: chenzhongsheng
 * @Date: 2023-02-14 08:06:30
 * @Description: Coding something
 */
const { context } = require('esbuild');
const fs = require('fs');
const { resolveRootPath } = require('./helper/utils');

main(
    resolveRootPath('scripts/dev/dev.ts'),
    resolveRootPath('scripts/dev/bundle.min.js')
);

async function main (entry, outfile) {
    const config = {
        entryPoints: [ entry ],
        outfile,
        bundle: true,
        sourcemap: true,
        format: 'cjs',
        globalName: 'Upfs',
        platform: 'node',
        define: {
            'process.env.NODE_ENV': '"development"',
        },
        plugins: [
        ],
    };

    let rebuildCount = 1;
    const ctx = await context(config);
    await ctx.watch();
    console.log('Dev Success!');
    fs.watchFile(config.outfile, {}, () => {
        console.log(`Dev Rebuild Success(${rebuildCount++});`);
    });

}
