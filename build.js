import { build } from 'esbuild';
import path from 'path';

/** @type {import('esbuild').BuildOptions} */
export const config = {
    bundle: true,
    entryPoints: [
        'src/index.ts',
    ],
    external: [
        'fastify',
        'node:http',
        'node:stream',
        'react',
        'react-dom',
    ],
    jsx: 'preserve',
    keepNames: true,
    logLevel: 'info',
    minify: true,
    packages: 'bundle',
    platform: 'node',
    sourcemap: false,
    splitting: false,
    treeShaking: true,
    tsconfig: 'tsconfig.json',
};

(async () => {
    try {
        const distDir = path.join(process.cwd(), 'dist');

        console.log('Building CJS module...');
        const cjsBuild = await build({
            ...config,
            format: 'cjs',
            outdir: distDir,
            outExtension: { '.js': '.cjs' },
        });
        if (cjsBuild.warnings.length) {
            console.warn('⚠️  CJS build completed with warnings:');
            cjsBuild.warnings.forEach((warning) => console.warn(`  - ${warning.location.file} (line ${warning.location.line}): ${warning.text}`));
        }

        console.log('\nBuilding ESM module...');
        const esmBuild = await build({
            ...config,
            format: 'esm',
            outdir: distDir,
        });
        if (esmBuild.warnings.length) {
            console.warn('⚠️  ESM build completed with warnings:');
            esmBuild.warnings.forEach((warning) => console.warn(`  - ${warning.location.file} (line ${warning.location.line}): ${warning.text}`));
        }
    } catch (e) {
        console.error('❌  Build failed:', e);
        process.exit(1);
    }
})();
