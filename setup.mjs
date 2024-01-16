import cp from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const PBVERSION = '0.20.7';
const BASENAME = path.basename(process.cwd());

const pblink = getPocketbaseLink();
const pbzippath = path.join(os.tmpdir(), 'pocketbase.zip');
await run('curl', ['-o', pbzippath, '-L', pblink]);

if (os.platform() == 'win32') {
	await run('TAR.EXE', ['-xf', pbzippath], { cwd: os.tmpdir() });
	await run('MOVE', [path.join(os.tmpdir(), 'pocketbase.exe'), 'db\\']);
	await run('DEL', ['/F', pbzippath]);
	await run('MOVE', ['project.code-workspace', `${BASENAME}.code-workspace`]);
} else {
	await run('unzip', [pbzippath], { cwd: os.tmpdir() });
	await run('mv', [path.join(os.tmpdir(), 'pocketbase'), 'db/']);
	await run('rm', ['-f', pbzippath]);
	await run('mv', ['project.code-workspace', `${BASENAME}.code-workspace`]);
}

await run('npm', ['create', 'svelte@latest', 'web']);
await run('npm', [
	'--prefix',
	'web',
	'add',
	'-D',
	'postcss',
	'tailwindcss',
	'autoprefixer',
	'@sveltejs/adapter-node',
	'pocketbase'
]);
await run('npx', ['tailwindcss', 'init'], { cwd: 'web' });
await run('npm', ['--prefix', 'web', 'remove', '@sveltejs/adapter-auto']);

const configFile = path.join('web', 'svelte.config.js');
const config = await fs.promises.readFile(configFile, 'utf8');
const contents = config.replace('adapter-auto', 'adapter-node');
await fs.promises.writeFile(configFile, contents, 'utf8');

const envFile = path.join('web', '.env');
const envContents = 'PUBLIC_DATABASE=http://127.0.0.1:8090\n';
await fs.promises.writeFile(envFile, envContents, 'utf8');

const packageFile = path.join('web', 'package.json');
const packageFileContents = await fs.promises.readFile(packageFile, 'utf8');
const packageContents = packageFileContents.replace('"name": "web"', `"name": "${BASENAME.toLowerCase()}"`);
await fs.promises.writeFile(packageFile, packageContents, 'utf8');

if (os.platform() == 'win32') {
	await run('ROBOCOPY.EXE', ['[web]\\', 'web\\', '/E']);
	await run('RMDIR', ['[web]', '/S', '/Q']);
	await run('RMDIR', ['.git', '/S', '/Q']);
	await run('DEL', ['/F', 'README.md']);
	await run('DEL', ['/F', 'setup.*']);
} else {
	await run('rsync', ['-av', '[web]/', 'web/']);
	await run('rm', ['-rf', '[web]']);
	await run('rm', ['-rf', '.git']);
	await run('rm', ['-f', 'setup.*']);
}

await run('git', ['init']);
await run('git', ['add', '.']);

function run(command, args = [], options = {}) {
	console.log('\x1b[43m', 'command', '\x1b[0m');
	console.log('\x1b[33m', command, args.join(' '), '\x1b[0m', '\n');

	return new Promise((resolve, reject) => {
		options.cwd = options.cwd || '.';

		if (os.platform() === 'win32') {
			options.execPath = 'CMD.EXE';
			options.execArgv = ['/C'];
		} else {
			options.execPath = 'bash';
			options.execArgv = ['-c'];
			command = command + ' ' + args.join(' ');
			args = [];
		}

		const p = cp.fork(command, args, options);
		let data = '';
		p.on('message', (m) => {
			data += m;
		});

		p.on('error', (code) => {
			reject(code);
		});

		p.on('close', () => {
			resolve(data);
		});
	});
}

function getPocketbaseLink() {
	let platform = 'linux';
	let arch = 'amd64';

	if (os.arch() === 'arm64') {
		arch = 'arm64';
	} else if (os.arch() === 'armv7') {
		arch = 'armv7';
	}

	if (os.platform() == 'win32') {
		platform = 'windows';
	} else if (os.platform() === 'darwin') {
		platform = 'darwin';
	}

	return `https://github.com/pocketbase/pocketbase/releases/download/v${PBVERSION}/pocketbase_${PBVERSION}_${platform}_${arch}.zip`;
}
