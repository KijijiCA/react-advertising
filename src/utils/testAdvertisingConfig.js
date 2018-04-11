export const DIV_ID_FOO = 'div-gpt-ad-foo';
const SLOT_ID_FOO = 666;
const PREBID_SIZES_FOO = [[320, 240]];
const BIDDER_FOO = 'bidder-foo';
const PARAMS_FOO = { foo: 'bar' };

export const DIV_ID_BAR = 'div-gpt-ad-bar';
const SLOT_ID_BAR = [11, 666];
const PREBID_SIZES_BAR = [[320, 240]];
const BIDDER_BAR = 'bidder-bar';
const PARAMS_BAR = { bar: 'foo' };
const COLLAPSE_EMPTY_DIV = [true, true];

const TIMEOUT = 5000;
const GPT_SIZES = ['fluid', [320, 240]];

const GLOBAL_AD_UNIT_PATH = 'global/ad/unit/path';
const SLOT_AD_UNIT_PATH = 'slot/ad/unit/path';
const USD_TO_EUR_RATE = 2;
const MAKE = 'make';
const MODELS = 'models';
const LOGGED_IN = false;
const THREAD_ID = 6666;
const PLACEMENT_TEST_ID = 100;

export const config = {
    active: true,
    prebid: {
        timeout: TIMEOUT
    },
    slots: [
        {
            id: DIV_ID_FOO,
            targeting: { a: SLOT_ID_FOO },
            sizes: GPT_SIZES,
            prebid: [
                {
                    sizes: PREBID_SIZES_FOO,
                    bids: [
                        {
                            bidder: BIDDER_FOO,
                            params: PARAMS_FOO
                        }
                    ]
                }
            ]
        },
        {
            id: DIV_ID_BAR,
            adUnitPath: SLOT_AD_UNIT_PATH,
            targeting: { a: SLOT_ID_BAR },
            sizes: GPT_SIZES,
            sizeMappingName: 'mobailAndTablet',
            collapseEmptyDiv: COLLAPSE_EMPTY_DIV,
            prebid: [
                {
                    sizes: PREBID_SIZES_BAR,
                    bids: [
                        {
                            bidder: BIDDER_BAR,
                            params: PARAMS_BAR
                        }
                    ]
                }
            ]
        }
    ],
    sizeMappings: {
        mobailAndTablet: [
            {
                viewPortSize: [0, 0],
                sizes: []
            },
            {
                viewPortSize: [320, 700],
                sizes: [[300, 250], [320, 50]]
            },
            {
                viewPortSize: [1050, 200],
                sizes: []
            }
        ]
    },
    metaData: {
        adUnitPath: {
            path: GLOBAL_AD_UNIT_PATH
        },
        boardMakeAndModels: [
            {
                make: MAKE,
                models: MODELS
            }
        ],
        usdToEurRate: USD_TO_EUR_RATE,
        loggedIn: LOGGED_IN,
        threadId: THREAD_ID
    },
    placementTestId: PLACEMENT_TEST_ID
};
