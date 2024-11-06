// @ts-check
const path = require('path');
const fs = require('fs');

require('esbuild').context({
	entryPoints: {
		'dist/client': './out/nodeClientMain.js',
		'dist/server': './node_modules/@vue/language-server/bin/vue-language-server.js',
		'node_modules/typescript-vue-plugin-bundle/index': './node_modules/@vue/typescript-plugin/index.js',
	},
	bundle: true,
	metafile: process.argv.includes('--metafile'),
	outdir: '.',
	external: ['vscode'],
	format: 'cjs',
	platform: 'node',
	tsconfig: './tsconfig.json',
	define: { 'process.env.NODE_ENV': '"production"' },
	minify: process.argv.includes('--minify'),
	plugins: [
		{
			name: 'umd2esm',
			setup(build) {
				build.onResolve({ filter: /^(vscode-.*-languageservice|jsonc-parser)/ }, args => {
					const pathUmdMay = require.resolve(args.path, { paths: [args.resolveDir] })
					// Call twice the replace is to solve the problem of the path in Windows
					const pathEsm = pathUmdMay.replace('/umd/', '/esm/').replace('\\umd\\', '\\esm\\')
					return { path: pathEsm }
				})
			},
		},
		{
			name: 'schemas',
			setup(build) {
				build.onEnd(() => {
					if (!fs.existsSync(path.resolve(__dirname, '../dist/schemas'))) {
						fs.mkdirSync(path.resolve(__dirname, '../dist/schemas'));
					}
					fs.cpSync(
						path.resolve(__dirname, '../node_modules/@vue/language-core/schemas/vue-tsconfig.schema.json'),
						path.resolve(__dirname, '../dist/schemas/vue-tsconfig.schema.json'),
					);
				});
			},
		},
		{
			name: 'meta',
			setup(build) {
				build.onEnd((result) => {
					if (result.metafile && result.errors.length === 0) {
						fs.writeFileSync(
							path.resolve(__dirname, '../meta.json'),
							JSON.stringify(result.metafile),
						);
					}
				});
			},
		},
	],
}).then(async ctx => {
	console.log('building...');
	if (process.argv.includes('--watch')) {
		await ctx.watch();
		console.log('watching...');
	} else {
		await ctx.rebuild();
		await ctx.dispose();
		console.log('finished.');
	}
});
