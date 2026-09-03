#!/bin/bash

set -o errexit

pnpm install --frozen-lockfile

pnpm build