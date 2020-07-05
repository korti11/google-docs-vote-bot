"use strict";

// Imports
require("dotenv").config();
const puppeteer = require("puppeteer");

// Environment const
const formURL = process.env.FORM_URL;

(async () => {

	// eslint-disable-next-line no-constant-condition
	while(true) {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto(formURL);
		await setViewport(page);
		for(let i = 0; i <= 500; i++) {
			await page.screenshot({path: "./screenshots/viewport-test.png"});
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

function log(message) {
	console.log(`${getTimestamp()}: ${message}`);
}

function getTimestamp() {
	let time = new Date();
	return `${time.getDate()}. ${time.getMonth()} ${time.getFullYear()} - ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}:${time.getMilliseconds()}`;
}