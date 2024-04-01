#!/usr/bin/env bash
set -euo pipefail

tsup
cp package.json dist
cd dist
	npm pkg delete scripts
	npm pkg delete devDependencies
	npm pkg delete tsup
	npm pkg delete prettier
