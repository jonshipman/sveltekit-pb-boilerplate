@ECHO OFF
SETLOCAL ENABLEDELAYEDEXPANSION

CALL npm create svelte@latest web
CHDIR web
CALL npm add -D postcss tailwindcss autoprefixer
CALL npx tailwindcss init
CHDIR ..
ROBOCOPY [web]\ web\ /E