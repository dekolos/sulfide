> Sulfide (and this readme) is still work in progress!
>
> But we're working hard to get to a first release. So please come back.
> If you can't wait, feel free to test the current state of the library.
> Do not hesitate to send us you're feedback.

![Sulfide](https://dekolos.github.io/sulfide/images/logo.png "Sulfide")
# Sulfide
[![npm version](https://badge.fury.io/js/sulfide.svg)](https://www.npmjs.com/package/sulfide)
[![Build Status](https://travis-ci.org/dekolos/sulfide.svg?branch=master)](https://travis-ci.org/dekolos/sulfide)
[![Coverage Status](https://coveralls.io/repos/github/dekolos/sulfide/badge.svg?branch=master)](https://coveralls.io/github/dekolos/sulfide?branch=master)

Sulfide is a [Selenide](http://selenide.org/) inspired library for Google's [Puppeteer](https://github.com/GoogleChrome/puppeteer).
It aims to make writing end-to-end tests for Chrome easy.

It can work together with [Jasmine](https://jasmine.github.io/) to write tests in a well known format.

#### Sulfide vs Puppeteer

##### Puppeteer
```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://developers.google.com/web/');

  // Type into search box.
  await page.type('#searchbox input', 'Headless Chrome');

  // Wait for suggest overlay to appear and click "show all results".
  const allResultsSelector = '.devsite-suggest-all-results';
  await page.waitForSelector(allResultsSelector);
  await page.click(allResultsSelector);

  // Wait for the results page to load and display the results.
  const resultsSelector = '.gsc-results .gsc-thumbnail-inside a.gs-title';
  await page.waitForSelector(resultsSelector);
})();
```
##### Sulfide
```javascript
const sulfide = require('sulfide');

(async () => {
  await open('https://developers.google.com/web/');

  // Type into search box.
  await $('#searchbox input').sendKeys('Headless Chrome');

  // Wait for suggest overlay to appear and click "show all results".
  const allResultsSelector = '.devsite-suggest-all-results';
  await $(allResultsSelector).should(exists());
  await $(allResultsSelector).click();

  // Wait for the results page to load and display the results.
  const resultsSelector = '.gsc-results .gsc-thumbnail-inside a.gs-title';
  await $(resultsSelector).should(exist());
})();
```

#### Puppeteer/Sulfide vs Selenium/Selenide
Selenide is a great library that makes working with [Selenium]() a lot more fun. But as much as we love Selenide, we would
love it even more if we could write our tests in JavaScript that easy. So Sulfide tries to be for Puppeteer what Selenide
is for Selenium.

The only downside is that Puppeteer only works with Chrome. But if you are like use and do end-to-end testing only in Chrome
anyway, then you will love Sulfide!

## Prerequisites
To install Sulfide from the Github Repository you need git (duh), [NodeJS](https://nodejs.org/) >= v7.10.1 , and
[yarn](https://yarnpkg.com/)

## Installation
```
git clone <THIS_REPOSITORY>
cd sulfide
yarn install
```

Or with npm in an existing project:
```
yarn add sulfide --dev
# or
# npm install sulfide --save-dev
```

## Writing tests

#### Configuration
Writing tests is tried to be kept as simple as possible by using a most common default configuration. However it is just
as simple to overwrite the default configuration with your own settings.

```javascript
const Sulfide = require('sulfide');
Sulfide.configure({
    // Add your configuration adjustments here
});
```

Currently Sulfide supports the following configuration options:

**headless** (_default value: true_)<br/>
Will make puppeteer run Chrome in headless mode.

**ignoreHTTPSErrors** (_default value: true_)<br/>
Will make Chrome ignore https errors. Convenient if you are testing in environments with self-signed certificates.

**devtools** (_default value: false_)<br/>
Will open developer tools when Chrome launches.

**width** (_default value: 800_)<br/>
The width in pixels of the viewport of the Chrome window.

**height** (_default value: 600_)<br/>
The height in pixels of the viewport of the Chrome window.

**disableInfobars** (_default value: false_)<br/>
Disables the information bars in Chrome, for example the one that states that Chrome is being controlled by a script.

**implicitWaitTime** (_default value: 4000_)<br/>
Sulfide will poll the page to see if conditions are met. This tells Sulfide how long it should poll before giving up when
a condition isn't met.

**pollInterval** (_default value: 200_)<br/>
Sulfide will poll the page to see if conditions are met. This tells Sulfide how long to wait between consecutive polls.

**jasmine** (_default value: false_)<br/>
When testing with Jasmine Sulfide can make specs fail when a condition check fails.

**nwApp** (_default value: false_)<br/>
Set this to true if you want to test an NWJS app with Sulfide. The $.open() method needs to be called with the path to
the nw executable as parameter.

#### Launching a browser and navigate to a certain page
```javascript
require('sulfide');

// The first time $.open() is called, it will launch the browser
await $.open(<URL-OF-THE-PAGE-YOU-WANT-TO-NAVIGATE-TO>);

// Do some check to know that the page is fully loaded
await $('body').shouldHave(cssClass('main-page'));

// Navigate to another page. $.open() will not launch a new browser
// but use the one we launched before.
await $.open(<ANOTHER-URL>);

// Do some check to know that the page is fully loaded
await $('body').shouldHave(cssClass('another-page'));

// Click on an element
await $('#a-cool-button').click();
```

## Examples
Sulfide is tested by using itself. To see how to use Sulfide in Jasmine tests just take a look at the code in the
[tests]() directory.

## NWJS apps (EXPERIMENTAL)
Puppeteer requires Chromium 65+, so to test [NWJS](https://nwjs.io/) apps you must build your app with the (yet) unstable
v0.29.0. Instead of the URL of a page that you want to open, you should pass the path to your NWJS app as a parameter to
the Sulfide.open method:

```javascript
require('sulfide');

// Open the app
await $.open('<PATH_TO_YOUR_NWJS_APP'>);

// Wait until the app is loaded by checking if the body element
// of the active page has the 'my-page' class.
// You probably have other ways to check if you app is loaded.
await $('body').shouldHave(cssClass('my-page'));

// Store a reference to our page, so we can activate it later
// if necessary.
// NOTE: Sulfide will activate a newly opened page automatically.
// This means that all operations will target that page.
const mainPage = $.getPage();
```

## API
The latest Sulfide API documentation is published on [Sulfides Github pages](https://dekolos.github.io/sulfide/api/).
