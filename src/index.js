"use strict";

// Imports
require("dotenv").config();
const puppeteer = require("puppeteer");

// Environment const
const formURL = process.env.FORM_URL;
const entriesToSelect = process.env.ENTRIES !== undefined ? JSON.parse(process.env.ENTRIES) : undefined;
const entryToSelect = process.env.ENTRY;
const entryMode = process.env.ENTRY_MODE || "single";
const minWaitTime = process.env.MIN_WAIT_TIME !== undefined ? parseInt(process.env.MIN_WAIT_TIME) : 1;
const maxWaitTime = process.env.MAX_WAIT_TIME !== undefined ? parseInt(process.env.MAX_WAIT_TIME) : 2;

// Global variables
let entryCounter = 0;

(async () => {

	// Environment validation
	if(!formURL.startsWith("https://docs.google.com/forms")) {
		log("The given url is not a google docs form url.");
		log(`Given: ${formURL}, Should: https://docs.google.com/forms/...`);
		return;
	} else if(["single", "multiple", "random"].indexOf(entryMode) === -1) {
		log("The given entry mode is not supported.");
		log(`Given: ${entryMode}, Should be one of: 'single', 'multiple' or 'random'`);
		return;
	} else if(entryMode === "single" && (entryToSelect === undefined || entryToSelect === "")) {
		log("Single entry mode selected but the 'ENTRY' environment variable is empty.");
		return;
	} else if((entryMode === "multiple" || entryMode === "random") && (entriesToSelect === undefined || entriesToSelect.length === 0)) {
		log("Multiple or random mode selected but the the 'ENTRIES' variable is either empty or the given array is empty.");
		return;
	} else if(minWaitTime > maxWaitTime) {
		log(`The given min wait time: ${minWaitTime}s is bigger then the max wait time: ${maxWaitTime}s.`);
		return;
	}

	// eslint-disable-next-line no-constant-condition
	while(true) {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto(formURL);
		await setViewport(page);
		try {
			for(let i = 0; i <= 500; i++) {
				entryCounter++;

				const waitTime = random(minWaitTime, maxWaitTime);
				log(`Wait ${waitTime} seconds for entry #${entryCounter}`);
				await wait(waitTime);

				await selectEntries(page);
				await submitEntry(page);
				await anotherEntry(page);
				await page.screenshot({path: "./screenshots/test.png"});
			}
		} catch (error) {
			logError(error);
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

function logError(message) {
	console.error(`${getTimestamp()}: ${message}`);
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