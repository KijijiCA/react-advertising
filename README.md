# react-prebid

Library for ad placements with [Prebid](http://prebid.org) header bidding in [React](https://reactjs.org) applications.

To use it, you need to have a [Doubleclick for Publishers](https://www.google.com/intl/en/doubleclick/publishers/welcome/) 
(DFP) ad server set up, along with configuration to use Prebid in place. Please refer to the 
[Prebid documentation](http://prebid.org/overview/intro.html) for details.

## Usage

### Installing the Package

Assuming you already have an application that uses React, install the *react-prebid* package as a production dependency
with npm:

    npm install --save react-prebid

Make sure that the external JavaScript libs for Google Publisher Tags (GPT) and Prebid are included in your page.

### Including the Snippets

You need to load two external libraries, *gpt.js* and *prebid.js*, just the same way you would do with a “classic”, 
non-React web page.

For your convenience, *react-prebid* provides two React components to do this for you, *&lt;GooglePublisherTagsSnippet /&gt;*
and *&lt;PrebidSnippet /&gt;*.

Example for including the snippets in a React component:

    import React from 'react';
    import { GooglePublisherTagsSnippet, PrebidSnippet } from 'react-prebid';
    
    function MyPage() {
        return (
            <div>
                <GooglePublisherTagsSnippet />
                <PrebidSnippet scriptPath="./js/prebid.js" />
                <h1>Hello World</h1>
            </div>
        );
    )

**Note** he prop *scriptPath* for the *&lt;PrebidSnippet /&gt;* component – because it is best practice to compile the
Prebid lib yourself with the bidder adapters you need, the the Prebid.js script is not included in this lib. You can
create it yourself using the [Prebid.js download page](http://prebid.org/download.html).

### Adding the Provider

The basic handline of initializing your ad slots and managing the bidding process is done by an 
*&lt;AdvertisingProvider /&gt;* component.

You pass your ad slot configuration to this provider, which then initializes Prebid when the page is loaded.

The provider should wrap your main page content, which contains the ad slots. 

Example:

    import React from 'react';
    import { GooglePublisherTagsSnippet, PrebidSnippet, AdvertisingProvider } from 'react-prebid';
    
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
                <GooglePublisherTagsSnippet />
                <PrebidSnippet scriptPath="./js/prebid.js" />
                <AdvertisingProvider config={config}>
                    <h1>Hello World</h1>
                </AdvertisingProvider>
            </div>
        );
    );
    
The configuration in this example is taken from the [Prebid example](http://prebid.org/dev-docs/examples/basic-example.html) 
page. It configures two ad slots, one that shows a Prebid ad from bidder “appnexus”, the other showing a “house ad” as a 
fallback when no bids have come back in time.

**Note:** If you use [react-router](https://github.com/ReactTraining/react-router), you can use one provider per route.

### Adding the Slots

Finally, with the provider in place, you can add slot components that display the ads from the ad server.

This library includes a component *AdvertisingSlot* that you can use to put div elements on your page that are filled with
creatives from the ad server.

The final code example:

    import React from 'react';
    import {
        GooglePublisherTagsSnippet,
        PrebidSnippet,
        AdvertisingProvider,
        AdvertisingSlot
    } from 'react-prebid';
    
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
                <GooglePublisherTagsSnippet />
                <PrebidSnippet scriptPath="./js/prebid.js" />
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
    
**Note:** The critical part about the ad slot is the *id* prop – it corresponds to the IDs in your configuration and 
is used by the script from the ad server to find your container div in the page's DOM.

You can also add CSS classes to the *AdvertisingSlot* component (using the *className* prop) or inline styles (using
the *style* prop).

## License

[MIT licensed](LICENSE)

Copyright © 2018 mobile.de GmbH

