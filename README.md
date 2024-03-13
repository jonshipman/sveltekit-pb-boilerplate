# SvelteKit ➕ Pocketbase

Simple setup for SK and PB.
For me to save in one spot and reuse as needed.

## Install

Run `npx svelte-pb@latest your-project` to create "your-project".

## behind the scenes

1. Run a `npm create svelte@latest web` in this folder (or another name and rename it "web").
Assumes the project will be "Typescript".
2. Add tailwind to your web project. `npm add -D postcss tailwindcss autoprefixer` and `npx tailwindcss init`.
(in the web folder you just created)
3. Copies the files from the `template/web` folder into the correct spots inside `web/src`.
Since this is a boilerplate and not a package, there's less I go into about setup.
These files should be customized to fit your project.

## more stuff

You need to set `PUBLIC_DATABASE` in your environment.
The docker-compose.yml I included, I use for production and have `PUBLIC_DATABASE` set to the internal docker url.
However, during dev, I'll throw a pocketbase.exe in the db folder and set `PUBLIC_DATABASE` to 'http://localhost:8090' to keep things smooth.

Change the `.github/workflows/main.yml` to work with your production environment.
It's setup to workflow_dispatch, so change it for on: push: [main] or what have you.

## ssr

My projects tend to focus on SSR.
This boilerplate will prioritize SSR as most projects will have the Pocketbase URL only on localhost.
However, I recently needed realtime so I added it to the mix.
If you want to protect your database: change the PUBLIC_DATABASE envvar to DATABASE, remove `httpOnly` from hooks.server, and remove hooks.client + lib/pocketbase/client.

## scripts: typegen

On Windows, you will need the Windows 10 SDK. If you only have the 11 SDK, you will need to download 10. `pocketbase-typegen` uses the npm package sqlite3 and that uses node-gyp:^8 which isn't compatible with Windows 11 SDK. Note: I do use WOA, so x86 and x64 Windows may be unaffected.
