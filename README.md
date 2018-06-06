![alt text](https://github.com/technology-ebay-de/react-prebid/raw/master/ebay-tech-logo.png 'eBay Tech')

# react-prebid

Library for ad placements with [Prebid](http://prebid.org) header bidding in [React](https://reactjs.org) applications.

To use it, you need to have a [Doubleclick for Publishers](https://www.google.com/intl/en/doubleclick/publishers/welcome/)
(DFP) ad server set up, along with configuration to use Prebid in place. Please refer to the
[Prebid documentation](http://prebid.org/overview/intro.html) for details.

## Demo

You can view a demo of this library online on *codesandbox.io*:

*   [codesandbox.io/s/k5w8mr9o23](https://codesandbox.io/s/k5w8mr9o23)

The demo uses the same test Prebid configuration as the
[code examples from the official documentation](http://prebid.org/dev-docs/examples/basic-example.html).

## Usage

### Installing the Package

Assuming you already have an application that uses React, install the _react-prebid_ package as a production dependency
with npm:

    npm install --save react-prebid

### Including External Libraries

You need to load two external libraries, _gpt.js_ and _prebid.js_, just the same way you would do with a “classic”,
non-React web page.

The Prebid library should at least be version 1.0. Older versions of Prebid are not supported.

The script tags that load and initialize these libraries need to be included in your static HTML code.

Example for including the snippets in an HTML file:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Demo</title>
        <script async src="//www.googletagservices.com/tag/js/gpt.js"></script>
        <script>var googletag=googletag||{};googletag.cmd=googletag.cmd||[]</script>
        <script async src="//acdn.adnxs.com/prebid/not-for-prod/1/prebid.js"></script>
        <script>var pbjs=pbjs||{};pbjs.que=pbjs.que||[]</script>
    </head>
    <body>
        <!-- rest of your HTML code goes here -->
    </body>
</html>
```

**Important:** This example uses a test version of Prebid.js hosted on a CDN that is not recommended for production use.
It includes all available adapters. Production implementations should build from source or customize the
build using the [Prebid.js download page](http://prebid.org/download.html) to make sure only the necessary bidder adapters are included:

### Adding the Provider

The basic handline of initializing your ad slots and managing the bidding process is done by an
_&lt;AdvertisingProvider /&gt;_ component.

You pass your ad slot configuration to this provider, which then initializes Prebid when the page is loaded.

The provider should wrap your main page content, which contains the ad slots.

Example:

```jsx
import React from 'react';
import { AdvertisingProvider } from 'react-prebid';

const config = {
    slots: [
        {
            path: '/19968336/header-bid-tag-0',
            id: 'div-gpt-ad-1460505748561-0',
            sizes: [[300, 250], [300, 600]],
            bids: [
                {
                    bidder: 'appnexus',
                    params: {
                        placementId: '10433394'
                    }
                }
            ]
        },
        {
            path: '/19968336/header-bid-tag-1',
            id: 'div-gpt-ad-1460505661639-0',
            sizes: [[728, 90], [970, 90]],
            bids: [
              {
                bidder: 'appnexus',
                params: {
                  placementId: '10433394'
                }
              }
            ]
        }
    ]
};

function MyPage() {
    return (
        <div>
            <AdvertisingProvider config={config}>
                <h1>Hello World</h1>
            </AdvertisingProvider>
        </div>
    );
);
```

The configuration in this example is taken from the [Prebid example](http://prebid.org/dev-docs/examples/basic-example.html)
page. It configures two ad slots, one that shows a Prebid ad from bidder “appnexus”, the other showing a “house ad” as a
fallback when no bids have come back in time.

**Note:** If you use [react-router](https://github.com/ReactTraining/react-router), you can use one provider per route.

### Adding the Slots

Finally, with the provider in place, you can add slot components that display the ads from the ad server.

This library includes a component _AdvertisingSlot_ that you can use to put div elements on your page that are filled with
creatives from the ad server.

The final code example:

```jsx
import React from 'react';
import { AdvertisingProvider, AdvertisingSlot } from 'react-prebid';

const config = {
    slots: [
        {
            path: '/19968336/header-bid-tag-0',
            id: 'div-gpt-ad-1460505748561-0',
            sizes: [[300, 250], [300, 600]],
            bids: [
                {
                    bidder: 'appnexus',
                    params: {
                        placementId: '10433394'
                    }
                }
            ]
        },
        {
            path: '/19968336/header-bid-tag-1',
            id: 'div-gpt-ad-1460505661639-0',
            sizes: [[728, 90], [970, 90]],
            bids: [
              {
                bidder: 'appnexus',
                params: {
                  placementId: '10433394'
                }
              }
            ]
        }
    ]
};

function MyPage() {
    return (
        <div>
            <AdvertisingProvider config={config}>
                <h1>Hello World</h1>
                <h2>Slot 1</h2>
                <AdvertisingSlot id="div-gpt-ad-1460505748561-0" />
                <h2>Slot 2</h2>
                <AdvertisingSlot id="div-gpt-ad-1460505661639-0" />
            </AdvertisingProvider>
        </div>
    );
);
```

**Note:** The critical part about the ad slot is the _id_ prop – it corresponds to the IDs in your configuration and
is used by the script from the ad server to find your container div in the page's DOM.

You can also add CSS classes to the _AdvertisingSlot_ component (using the _className_ prop) or inline styles (using
the _style_ prop).

## License

[MIT licensed](LICENSE)

Copyright © 2018 mobile.de GmbH
