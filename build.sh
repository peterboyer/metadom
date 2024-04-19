#!/usr/bin/env bash
set -euo pipefail

[[ -d dist ]] && rm -r dist
tsc --project tsconfig.build.json
cp src/config/tsconfig.json dist/config
cp package.json dist
cd dist
	npm pkg delete scripts
	npm pkg delete devDependencies
	npm pkg delete tsup
	npm pkg delete prettier
