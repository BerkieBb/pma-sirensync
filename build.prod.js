import { build } from 'esbuild';

build({
	entryPoints: ['./client/main.ts'],
	outfile: './dist/client/main.js',
	target: "es2020",
	minify: false,
	bundle: true
}).catch(() => process.exit(1));

build({
	entryPoints: ['./server/main.ts'],
	outfile: './dist/server/main.js',
	platform: "node",
	target: "es2020",
	minify: false,
	bundle: true
}).catch(() => process.exit(1));