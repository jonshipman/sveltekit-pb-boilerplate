@ECHO OFF
SETLOCAL ENABLEDELAYEDEXPANSION

CALL npm create svelte@latest web
CHDIR web
CALL npm add -D postcss tailwindcss autoprefixer @sveltejs/adapter-node
CALL npx tailwindcss init
CALL npm remove @sveltejs/adapter-auto
@REM https://fart-it.sourceforge.net/
CALL fart.exe web\svelte.config.js adapter-auto adapter-node
CHDIR ..
ROBOCOPY [web]\ web\ /E