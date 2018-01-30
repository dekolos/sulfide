> Sulfide (and this readme) is still work in progress!
>
> But we're working hard to get to a first release. So please come back.
> If you can't wait, feel free to test the current state of the library.
> Do not hesitate to send us you're feedback.

![Sulfide](https://rotous.github.io/sulfide/images/logo.png "Sulfide")
# Sulfide
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


## Writing tests

#### Configuration
Writing tests is tried to be kept as simple as possible to set a most common default configuration. However it is just
as simple to overwrite the default configuration with your own settings.

## Examples
The examples directory contains an example project that uses Sulfide together with Jasmine. It runs some simple tests on
https://www.example.com.

## API
The Sulfide API has three main parts, Sulfide, SulfideElement, and the Selectors.

### Sulfide

### SulfideElement

### Selectors
