#!/usr/bin/env sh
set -euo pipefail

[[ -d ./dist ]] && rm -r ./dist
tsc --project ./tsconfig.build.json
cp ./src/config/tsconfig.json ./dist/config
cp ./package.json ./README.md ./dist
(cd dist
	npm pkg delete scripts
	npm pkg delete devDependencies
	npm pkg delete prettier)
