"use strict";

// Imports
require("dotenv").config();
const puppeteer = require("puppeteer");

// Environment const
const formURL = process.env.FORM_URL;
const entriesToSelect = process.env.ENTRIES !== undefined ? JSON.parse(process.env.ENTRIES) : undefined;
const entryToSelect = process.env.ENTRY;
const entryMode = process.env.ENTRY_MODE || "single";

// Global variables
let entryCounter = 0;

(async () => {

	// eslint-disable-next-line no-constant-condition
	while(true) {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto(formURL);
		await setViewport(page);
		for(let i = 0; i <= 500; i++) {
			entryCounter++;
			await selectEntries(page);
			await submitEntry(page);
			await anotherEntry(page);
			await page.screenshot({path: "./screenshots/test.png"});
		}
		page.close();
		browser.close();
	}

})();

async function setViewport(page) {
	const body = await page.waitForSelector("body");
	const boundingBox = await body.boundingBox();
	await page.setViewport({ width: boundingBox.width, height: boundingBox.height });
	log(`Set page viewport to ${boundingBox.width} width and ${boundingBox.height} height.`);
}

async function selectEntries(page) {
	switch(entryMode) {
	case "single":
		await selectSingleEntry(page, entryToSelect);
		log(`Single entry for entry #${entryCounter} selected.`);
		break;
	case "multiple":
		await selectMultipleEntries(page);
		log(`Multiple entries for entry #${entryCounter} selected.`);
		break;
	case "random":
		// eslint-disable-next-line no-case-declarations
		const entry = await selectRandomEntry(page);
		log(`Random entry ${entry} for entry #${entryCounter} selected.`);
		break;
	}
	await wait(0.5);
}

async function selectSingleEntry(page, entry) {
	const checkBox = await page.waitForSelector(`div[aria-label="${entry}"]`);
	await checkBox.click();
}

async function selectMultipleEntries(page) {
	for(let entry of entriesToSelect) {
		selectSingleEntry(page, entry);
	}
}

async function selectRandomEntry(page) {
	let randomIndex = random(0, entriesToSelect.length);
	let entry = entriesToSelect[randomIndex];
	selectSingleEntry(page, entry);
	return entry;
}

async function submitEntry(page) {
	const submitButton = await page.waitForSelector(".freebirdFormviewerViewNavigationSubmitButton");
	await submitButton.click();
	log(`Submitted entry #${entryCounter}`);
	await wait(0.5);
}

async function anotherEntry(page) {
	const anotherEntryLink = await page.waitForSelector(".freebirdFormviewerViewResponseLinksContainer a");
	await anotherEntryLink.click();
	log("Return for another entry.");
}

async function wait(seconds) {
	return new Promise((res) => {
		setTimeout(() => res(1), seconds * 1000);
	});
}

function log(message) {
	console.log(`${getTimestamp()}: ${message}`);
}

function getTimestamp() {
	const now = new Date();
	const formatter = new Intl.DateTimeFormat("en-DE", {
		day: "2-digit", month: "short", year: "numeric",
		hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
	});
	return formatter.format(now);
}

function random(start, end) {
	return Math.floor(Math.random() * (end - start)) + start;
}