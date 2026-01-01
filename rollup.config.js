import { dts } from 'rollup-plugin-dts';

/** @type {import("rollup").RollupOptions} */
export default {
    external: [
        'fastify',
    ],
    input: './src/index.ts',
    output: {
        file: 'dist/index.d.ts',
        format: 'es',
    },
    plugins: [
        dts({
            tsconfig: './tsconfig.json',
            compilerOptions: {
                noEmit: false,
                emitDeclarationOnly: true,
            },
        }),
    ],
};
