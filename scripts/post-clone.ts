#!/usr/bin/env zx

import { $, cd } from "zx";

// Clone nodecg-speedcontrol
await $`mkdir bundles`;
cd("bundles");
await $`git clone https://github.com/speedcontrol/nodecg-speedcontrol.git`;

// Install dependencies for whole project
cd("../..")
await $`pnpm install`;

// Build nodecg-speedcontrol
cd("bundles/nodecg-speedcontrol");
await $`pnpm build`;

// Build asm-graphics
cd("../../");
await $`pnpm build`;

// Setup config file
await $`cp asm-graphics.example.json cfg/asm-graphics.json`;
await $`cp nodecg-speedcontrol.example.json cfg/nodecg-speedcontrol.json`;
