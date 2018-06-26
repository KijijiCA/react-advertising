![eBay Tech Logo](https://github.com/technology-ebay-de/react-prebid/raw/master/ebay-tech-logo.png "eBay Tech Logo")

# react-prebid

A JavaScript library for ad placements with [Prebid](http://prebid.org) header bidding in [React](https://reactjs.org) applications.

**Integrate ads in your app the “React way”: by adding ad components to your JSX layout!**

* One central configuration file for all your GPT and Prebid placement config
* One provider component that handles all the “plumbing” with *googletag* and *pbjs*, nicely hidden away
* Ad slot components that get filled with creatives from the ad server when they mount to the DOM
* Works well in single page applications with multiple routes
* Suitable for server-side-rendering

[![npm version](https://img.shields.io/npm/v/react-prebid.svg)](https://www.npmjs.com/package/react-prebid) [![Build Status](https://travis-ci.com/technology-ebay-de/react-prebid.svg?branch=master)](https://travis-ci.com/technology-ebay-de/react-prebid) [![Coverage Status](https://coveralls.io/repos/github/technology-ebay-de/react-prebid/badge.svg?branch=master)](https://coveralls.io/github/technology-ebay-de/react-prebid?branch=master)

## Prerequisites

To use *react-prebid*, you need to have a [Doubleclick for Publishers](https://www.google.com/intl/en/doubleclick/publishers/welcome/)
(DFP) ad server set up, along with configuration to use Prebid in place. Please refer to the
[Prebid documentation](http://prebid.org/overview/intro.html) for details.

## Demo

You can view a demo of this library online on *CodeSandbox*:

*   [codesandbox.io/s/k5w8mr9o23](https://codesandbox.io/s/k5w8mr9o23)

The demo uses the same test Prebid configuration as the
[code examples from the official documentation](http://prebid.org/dev-docs/examples/basic-example.html).

## Documentation

You can find documentation on how to use this library in the project's wiki:

* [Usage](https://github.com/technology-ebay-de/react-prebid/wiki/Usage)
* [API](https://github.com/technology-ebay-de/react-prebid/wiki/API)
* [Configuration](https://github.com/technology-ebay-de/react-prebid/wiki/Configuration)
* [Custom Events](https://github.com/technology-ebay-de/react-prebid/wiki/Custom-Events)
* [Plugins](https://github.com/technology-ebay-de/react-prebid/wiki/Custom-Events)

## License

[MIT licensed](LICENSE)

Copyright © 2018 mobile.de GmbH
