> Sulfide (and this readme) is still work in progress!
>
> But we're working hard to get to a first release. So please come back.
> If you can't wait, feel free to test the current state of the library.
> Do not hesitate to send us you're feedback.

![Sulfide](https://dekolos.github.io/sulfide/images/logo.png "Sulfide")
# Sulfide
[![npm version](https://badge.fury.io/js/sulfide.svg)](https://badge.fury.io/js/sulfide)
[![Build Status](https://travis-ci.org/dekolos/sulfide.svg?branch=master)](https://travis-ci.org/dekolos/sulfide)

Sulfide is a [Selenide](http://selenide.org/) inspired library for Google's [Puppeteer](https://github.com/GoogleChrome/puppeteer).
It aims to make writing end-to-end tests for Chrome easy.

It can work together with [Jasmine](https://jasmine.github.io/) to write tests in a well known format.

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

## Examples
The examples directory contains an example project that uses Sulfide together with Jasmine. It runs some simple tests on
https://www.example.com.

## API
The Sulfide API has four main parts, Sulfide, SulfideElement, selectors and conditions.

### Sulfide

### SulfideElement

### Selectors

### Conditions
