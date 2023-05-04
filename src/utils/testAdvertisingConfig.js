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

const GPT_SIZES = ['fluid', [320, 240]];

const GLOBAL_AD_UNIT_PATH = 'global/ad/unit/path';
const SLOT_AD_UNIT_PATH = 'slot/ad/unit/path';
const USD_TO_EUR_RATE = 2;

export const TWO_SLOT_QUEUE = [
  {
    id: DIV_ID_FOO,
    customEventHandlers: {},
  },
  {
    id: DIV_ID_BAR,
    customEventHandlers: {},
  },
];

export const configWithoutSlots = {
  active: true,
  path: GLOBAL_AD_UNIT_PATH,
  aps: {
    pubID: 'apsid',
    bidTimeout: 2e3,
    deals: true,
  },
  prebid: {
    bidderTimeout: 1500,
    priceGranularity: 'medium',
    bidderSequence: 'random',
  },
  sizeMappings: {
    mobailAndTablet: [
      {
        viewPortSize: [0, 0],
        sizes: [],
      },
      {
        viewPortSize: [320, 700],
        sizes: [
          [300, 250],
          [320, 50],
        ],
      },
      {
        viewPortSize: [1050, 200],
        sizes: [],
      },
    ],
  },
  metaData: {
    usdToEurRate: USD_TO_EUR_RATE,
  },

  targeting: {
    eagt: [666],
    'mt-ab': 'test',
    'mt-ma': ['Poserwagen'],
    'mt-mo': ['Brummstinko', 'Grand Umweltverpestino'],
    'mt-thread': [666],
    'mt-u2': ['00'],
    'mt-u4': true,
  },
  customEvents: {
    collapse: {
      eventMessagePrefix: 'CloseAdvContainer:',
      divIdPrefix: 'div-gpt-ad-',
    },
  },
};
export const config = {
  ...configWithoutSlots,
  slots: [
    {
      id: DIV_ID_FOO,
      targeting: { a: SLOT_ID_FOO },
      sizes: GPT_SIZES,
      prebid: [
        {
          mediaTypes: {
            banner: {
              sizes: PREBID_SIZES_FOO,
            },
          },
          bids: [
            {
              bidder: BIDDER_FOO,
              params: PARAMS_FOO,
            },
          ],
        },
      ],
    },
    {
      id: DIV_ID_BAR,
      path: SLOT_AD_UNIT_PATH,
      targeting: { a: SLOT_ID_BAR },
      sizes: GPT_SIZES,
      sizeMappingName: 'mobailAndTablet',
      collapseEmptyDiv: COLLAPSE_EMPTY_DIV,
      prebid: [
        {
          mediaTypes: {
            banner: {
              sizes: PREBID_SIZES_BAR,
            },
          },
          bids: [
            {
              bidder: BIDDER_BAR,
              params: PARAMS_BAR,
            },
          ],
        },
      ],
    },
  ],
};
