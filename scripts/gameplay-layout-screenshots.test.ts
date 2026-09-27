import assert from "node:assert/strict";
import test from "node:test";
import {
	isExpectedChromeVersion,
	normalizeLayoutName,
	resolveLayoutName,
} from "./gameplay-layout-screenshots.ts";

const routes = ["Standard", "Standard-2", "Widescreen-2", "DS-2", "GBA", "Standard-Vertical", "1x1", "None"];

test("normalizes OBS-style spacing and player-count suffixes", () => {
	assert.equal(resolveLayoutName("Widescreen 2p", routes), "Widescreen-2");
	assert.equal(resolveLayoutName("LAYOUT: standard", routes), "Standard");
});

test("resolves known intended-layout aliases", () => {
	assert.equal(resolveLayoutName("Standard Portrait", routes), "Standard-Vertical");
	assert.equal(resolveLayoutName("Nintendo DS 2p", routes), "DS-2");
	assert.equal(resolveLayoutName("1:1", routes), "1x1");
	assert.equal(resolveLayoutName("No Graphics", routes), "None");
});

test("leaves unsupported labels unmapped", () => {
	assert.equal(resolveLayoutName("Full Cam", routes), undefined);
	assert.equal(normalizeLayoutName(" Widescreen_2P "), "widescreen-2");
});

test("accepts only Chrome major version 150", () => {
	assert.equal(isExpectedChromeVersion("Chrome/150.0.0.0"), true);
	assert.equal(isExpectedChromeVersion("HeadlessChrome/150.0.0.0"), true);
	assert.equal(isExpectedChromeVersion("Chrome/149.0.0.0"), false);
	assert.equal(isExpectedChromeVersion("Chromium/150.0.0.0"), false);
});