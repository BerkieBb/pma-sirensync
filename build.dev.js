import { build } from 'esbuild';
import fetch from 'node-fetch';

let lastRebuild = Date.now();

function onRebuild() {
	// Wait before each rebuild incase we're using a local version of a library
	// so we dont spam 100000 rebuilds in a second
	if (process.env.PMA_RESTART_KEY && Date.now() - lastRebuild > 150) {
		lastRebuild = Date.now()
		fetch(`http://127.0.0.1:4689/rr?resource=${__dirname.split(process.platform === "win32" ? "\\" : "/").pop()}`, {
			method: 'GET',
		})
	}
}

build({
	entryPoints: ['./client/main.ts'],
	outfile: './dist/client/main.js',
	target: "es2020",
	minify: false,
	bundle: true,
	watch: {
		onRebuild(error) {
			if (error) console.error('Client Build Failed:', error)
			else {
				onRebuild()
				console.log("Client Build Succeeded")
			}
		},
	}
}).catch(() => process.exit(1))

build({
	entryPoints: ['./server/main.ts'],
	outfile: './dist/server/main.js',
	platform: "node",
	target: "es2020",
	minify: false,
	bundle: true,
	watch: {
		onRebuild(error) {
			if (error) console.error('Server Build Failed:', error)
			else {
				onRebuild()
				console.log('Server Build Succeeded')
			}
		},
	}
}).catch(() => process.exit(1))
