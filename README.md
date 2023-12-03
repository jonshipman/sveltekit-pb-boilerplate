# SvelteKit ➕ Pocketbase

Simple setup for SK and PB.
For me to save in one spot and reuse as needed.

1. Run a `npm create svelte@latest web` in this folder (or another name and rename it "web").
Assumes the project will be "Typescript".
2. Add tailwind to your web project. `npm add -D postcss tailwindcss autoprefixer` and `npx tailwindcss init`.
(in the web folder you just created)
3. Copy the files from the `[web]` folder into the correct spots inside `web/src`.
Since this is a boilerplate and not a package, there's less I go into about setup.
These files should be customized to fit your project.

## more stuff

You need to set `DATABASE` in your environment.
The docker-compose.yml I included, I use for production and have `DATABASE` set to the internal docker url.
However, during dev, I'll throw a pocketbase.exe in the db folder and set `DATABASE` to 'http://localhost:8090' to keep things smooth.

Change the `.github/workflows/main.yml` to work with your production environment.
It's setup to workflow_dispatch, so change it for on: push: [main] or what have you.

Delete the `[web]` folder after merging with `web`.
I didn't want to commit a SvelteKit init to this repo as I prefer to run the init on each new project.