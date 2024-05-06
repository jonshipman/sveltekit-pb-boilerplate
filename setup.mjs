#! /usr/bin/env node
import cp from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yauzl from 'yauzl';

const __dirname = path.dirname(fileURLToPath(new URL(import.meta.url)));
const template = path.join(__dirname, 'template');

const args = process.argv.slice(2);
const PBVERSION = '0.22.11';
let BASENAME = path.basename(process.cwd());

if (args[0] && BASENAME !== args[0]) {
	BASENAME = args[0];
	fs.mkdirSync(BASENAME, { recursive: true });
	process.chdir(BASENAME);
}

const resolved = path.resolve('.');
const pblink = getPocketbaseLink();
const pbzippath = 'pocketbase.zip';

if (os.platform() === 'win32') {
	await run('ROBOCOPY.EXE', [
		template + path.sep,
		'.\\',
		'/MIR',
		'/Z',
		'/XF',
		'*.code-workspace',
		'/XD',
		'web'
	]);
} else {
	await run('rsync', [
		'-av',
		template + path.sep,
		'./',
		'--exclude=*.code-workspace',
		'--exclude=web'
	]);
}

await run('curl', ['-o', pbzippath, '-L', pblink]);

await new Promise((resolve, reject) => {
	yauzl.open(pbzippath, { lazyEntries: true }, function (err, zipfile) {
		if (err) return [console.error(err), reject(err)];
		zipfile.readEntry();
		zipfile.on('entry', function (entry) {
			if (/^pocketbase/.test(entry.fileName)) {
				const writeStream = fs.createWriteStream(path.join(resolved, 'db', entry.fileName));

				zipfile.openReadStream(entry, function (err, readStream) {
					if (err) return [console.error(err), reject(err)];
					readStream.on('end', function () {
						resolve();
					});

					readStream.pipe(writeStream);
				});
			} else {
				zipfile.readEntry();
			}
		});
	});
});

await fs.promises.unlink(pbzippath);

if (os.platform() !== 'win32') {
	await run('chmod', ['+x', path.join('db', 'pocketbase')]);
}

await fs.promises.copyFile(
	path.join(template, 'project.code-workspace'),
	`${BASENAME}.code-workspace`
);

await run('npm', ['create', 'svelte@latest', 'web']);
const dependencies = [
	'postcss',
	'tailwindcss',
	'autoprefixer',
	'@sveltejs/adapter-node',
	'pocketbase',
	'@types/node'
];
const npmDevDepCmd = [];

for (const dep of dependencies) {
	try {
		const response = await fetch(`https://registry.npmjs.org/${dep}`).then((r) => r.json());
		if (response?.['dist-tags'].latest) {
			const version = response['dist-tags'].latest;
			npmDevDepCmd.push(`devDependencies.${dep}="^${version}"`);
		}
	} catch (e) {
		console.error(e);
	}
}

await run('npm', ['pkg', '-w=web', 'set', ...npmDevDepCmd]);
await run('npm', ['pkg', '-w=web', 'delete', 'devDependencies.@sveltejs/adapter-auto']);
await run('npx', ['tailwindcss', 'init'], { cwd: 'web' });

const configFile = path.join('web', 'svelte.config.js');
const config = await fs.promises.readFile(configFile, 'utf8');
const contents = config.replace('adapter-auto', 'adapter-node');
await fs.promises.writeFile(configFile, contents, 'utf8');

const envFile = path.join('.env');
const envContents = 'PUBLIC_DATABASE=http://127.0.0.1:8090\nADMIN_USER=\nADMIN_PASS=\n';
await fs.promises.writeFile(envFile, envContents, 'utf8');
await fs.promises.writeFile(path.join('web', '.env'), envContents, 'utf8');

await run('npm', ['pkg', '-w=web', 'set', `"scripts.start=node build"`]);
await run('npm', ['pkg', '-w=web', 'set', `version=0.0.0`]);
await run('npm', ['pkg', 'set', `name=${BASENAME}`]);

if (os.platform() === 'win32') {
	await run('ROBOCOPY.EXE', [path.join(template, 'web') + path.sep, 'web\\', '/E']);
} else {
	await run('rsync', ['-av', path.join(template, 'web') + path.sep, 'web/']);
}

await fs.promises.rename('gitignore', '.gitignore');
await fs.promises.rename(path.join('db', 'gitignore'), path.join('db', '.gitignore'));

await run('git', ['init']);
await run('git', ['add', '.']);

console.log('All Done!');
process.exit(0);

function run(command, args = [], options = {}) {
	console.log('\x1b[43m', 'command', '\x1b[0m');
	console.log('\x1b[33m', command, args.join(' '), '\x1b[0m', '\n');

	return new Promise((resolve, reject) => {
		options.cwd = options.cwd || '.';

		if (os.platform() === 'win32') {
			options.execPath = 'CMD.EXE';
			options.execArgv = ['/C'];
			options.windowsVerbatimArguments = true;
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
