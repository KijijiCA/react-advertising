![eBay Tech Logo](ebay-tech-logo.png 'eBay Tech Logo')

# react-advertising

A JavaScript library for display ads in [React](https://reactjs.org)
applications.

**Integrate ads in your app the “React way”: by adding ad components to your JSX
layout!**

- One central configuration file for all your GPT and Prebid placement config
- One provider component that handles all the “plumbing” with _googletag_ and
  _pbjs_, nicely hidden away
- Ad slot components that get filled with creatives from the ad server when they
  mount to the DOM
- Works well in single page applications with multiple routes
- Suitable for server-side-rendering

[![Test](https://github.com/eBayClassifiedsGroup/react-advertising/actions/workflows/ci.yml/badge.svg)](https://github.com/eBayClassifiedsGroup/react-advertising/actions/workflows/ci.yml)[![Coverage Status](https://coveralls.io/repos/github/eBayClassifiedsGroup/react-advertising/badge.svg?branch=master)](https://coveralls.io/github/eBayClassifiedsGroup/react-advertising?branch=master)

## Prerequisites

To use _react-advertising_, you need to have a
[Google Ad Manager](https://admanager.google.com/) account set up, along with
configuration to use Prebid in place. Please refer to the
[Prebid documentation](http://prebid.org/overview/intro.html) for details.

## Demo

You can view a demo of this library online on _CodeSandbox_:

- [https://codesandbox.io/s/gptprebid-npmes6-k5czp](https://codesandbox.io/s/gptprebid-npmes6-k5czp)

The demo uses the same test Prebid configuration as the
[code examples from the official documentation](http://prebid.org/dev-docs/examples/basic-example.html).

## Documentation

You can find documentation on how to use this library in the project's wiki:

- [Usage](https://github.com/technology-ebay-de/react-advertising/wiki/Usage)
- [API](https://github.com/technology-ebay-de/react-advertising/wiki/API)
- [Configuration](https://github.com/technology-ebay-de/react-advertising/wiki/Configuration)
- [Custom Events](https://github.com/technology-ebay-de/react-advertising/wiki/Custom-Events)
- [Plugins](https://github.com/technology-ebay-de/react-advertising/wiki/Custom-Events)

## License

[MIT licensed](LICENSE)

Copyright © 2018-2021 mobile.de GmbH
