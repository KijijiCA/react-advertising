import Advertising from './Advertising';
import {
  config,
  configWithoutSlots,
  DIV_ID_BAR,
  DIV_ID_FOO,
  TWO_SLOT_QUEUE,
} from './utils/testAdvertisingConfig';

const GPT_SIZE_MAPPING = [
  [[0, 0], []],
  [
    [320, 700],
    [
      [300, 250],
      [320, 50],
    ],
  ],
  [[1050, 200], []],
];

describe('When I instantiate an advertising main module, with APS', () => {
  let originalApstag, originalGoogletag, advertising;
  beforeEach(() => {
    originalApstag = setupAps();
    originalGoogletag = setupGoogletag();
  });

  afterEach(() => {
    global.apstag = originalApstag;
    global.googletag = originalGoogletag;
  });

  describe('call the setup method (with errors)', () => {
    let onErrorSpy;
    beforeEach(() => {
      onErrorSpy = jest.fn();
      advertising = new Advertising(config, [], onErrorSpy);
      advertising.activate(DIV_ID_FOO);
    });
    it('should call onError callback when apstag.init throws an error', async () => {
      const error = new Error();
      global.apstag.init = jest.fn(() => {
        throw error;
      });

      advertising.setup();

      expect(onErrorSpy).toHaveBeenCalledWith(error);
    });

    it('should call onError callback when apstag.fetchBids throws an error', async () => {
      const error = new Error();
      global.apstag.fetchBids = jest.fn(() => {
        throw error;
      });

      await advertising.setup();

      expect(onErrorSpy).toHaveBeenCalledWith(error);
    });

    it('should call onError callback when apstag.setDisplayBids throws an error', async () => {
      const error = new Error();
      global.apstag.fetchBids = jest.fn((_, callback) => {
        callback();
      });
      global.apstag.setDisplayBids = jest.fn(() => {
        throw error;
      });

      await advertising.setup();

      expect(onErrorSpy).toHaveBeenCalledWith(error);
    });
  });

  describe('call the setup method (without errors)', () => {
    beforeEach(() => {
      advertising = new Advertising(config);
    });

    it('the property `isAPSUsed` should be true', async () => {
      await advertising.setup();

      expect(advertising.isAPSUsed).toBeTruthy();
    });

    it('fetchBids and setDisplayBids should not be called if the queue is empty', async () => {
      await advertising.setup();

      expect(global.apstag.fetchBids).toHaveBeenCalledTimes(0);
      expect(global.apstag.setDisplayBids).toHaveBeenCalledTimes(0);
    });

    it('fetchBids and setDisplayBids should be called if there are items in the queue', async () => {
      advertising.activate(DIV_ID_FOO);
      await advertising.setup();

      expect(global.apstag.fetchBids).toHaveBeenCalledTimes(1);
      expect(global.apstag.setDisplayBids).toHaveBeenCalledTimes(1);
      expect(global.googletag.pubads().refresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('call the activate method (with errors)', () => {
    let onErrorSpy;
    beforeEach(async () => {
      onErrorSpy = jest.fn();
      advertising = new Advertising(config, [], onErrorSpy);
      await advertising.setup();
    });

    it('should call onError callback when apstag.fetchBids throws an error', async () => {
      const error = new Error();
      global.apstag.fetchBids = jest.fn(() => {
        throw error;
      });

      advertising.activate(DIV_ID_FOO);

      expect(onErrorSpy).toHaveBeenCalledWith(error);
      expect(onErrorSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onError callback when apstag.setDisplayBids throws an error', async () => {
      const error = new Error();
      global.apstag.fetchBids = jest.fn((_, callback) => {
        callback();
      });
      global.apstag.setDisplayBids = jest.fn(() => {
        throw error;
      });

      advertising.activate(DIV_ID_FOO);

      expect(onErrorSpy).toHaveBeenCalledWith(error);
      expect(onErrorSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('call the activate method (without errors)', () => {
    beforeEach(() => {
      advertising = new Advertising(config);
    });

    it("fetchBids and setDisplayBids should not be called if setup isn't called", async () => {
      advertising.activate(DIV_ID_FOO);

      expect(global.apstag.fetchBids).toHaveBeenCalledTimes(0);
      expect(global.apstag.setDisplayBids).toHaveBeenCalledTimes(0);
    });

    it('fetchBids and setDisplayBids should be called if setup has been called', async () => {
      await advertising.setup();

      expect(global.apstag.fetchBids).toHaveBeenCalledTimes(0);
      expect(global.apstag.setDisplayBids).toHaveBeenCalledTimes(0);

      advertising.activate(DIV_ID_FOO);

      expect(global.apstag.fetchBids).toHaveBeenCalledTimes(1);
      expect(global.apstag.setDisplayBids).toHaveBeenCalledTimes(1);
    });
  });
});

describe('When I instantiate an advertising main module, with Prebid', () => {
  let originalPbjs, originalGoogletag, advertising;
  beforeEach(() => {
    originalPbjs = setupPbjs();
    originalGoogletag = setupGoogletag();
    advertising = new Advertising(config);
  });
  describe('call the setup method', () => {
    let onErrorSpy;
    beforeEach(() => {
      onErrorSpy = jest.fn();
      advertising = new Advertising(config, [], onErrorSpy);
    });

    describe('and pbjs.addAdUnits throws an error', () => {
      it('calls onError callback', () => {
        const error = new Error();
        global.pbjs.addAdUnits = jest.fn(() => {
          throw error;
        });

        advertising.setup();

        expect(onErrorSpy).toHaveBeenCalledWith(error);
      });
    });

    describe('and pbjs.requestBids throws an error', () => {
      it('calls onError callback', () => {
        const error = new Error();
        global.pbjs.requestBids = jest.fn(() => {
          throw error;
        });

        advertising.setup();
        advertising.activate(DIV_ID_FOO);

        expect(onErrorSpy).toHaveBeenCalledWith(error);
      });
    });

    describe('and pbjs.setTargetingForGPTAsync throws an error', () => {
      it('calls onError callback', () => {
        const error = new Error();
        global.pbjs.setTargetingForGPTAsync = jest.fn(() => {
          throw error;
        });

        advertising.setup();
        advertising.activate(DIV_ID_FOO);

        expect(onErrorSpy).toHaveBeenCalledWith(error);
      });
    });

    describe('and pbjs.teardown throws an error', () => {
      it('calls onError callback', () => {
        const error = new Error();
        global.pbjs.removeAdUnit = jest.fn(() => {
          throw error;
        });

        advertising.setup();
        advertising.teardown();

        expect(onErrorSpy).toHaveBeenCalledWith(error);
      });
    });

    describe('and googletag.pubads throws an error', () => {
      it('calls onError callback', () => {
        const error = new Error();
        global.googletag.pubads = jest.fn(() => {
          throw error;
        });

        advertising.setup();

        expect(onErrorSpy).toHaveBeenCalledWith(error);
      });
    });

    describe('and googletag.destroySlots throws an error', () => {
      it('calls onError callback', () => {
        const error = new Error();
        global.googletag.destroySlots = jest.fn(() => {
          throw error;
        });

        advertising.setup();
        advertising.teardown();

        expect(onErrorSpy).toHaveBeenCalledWith(error);
      });
    });

    afterEach(() => {
      global.pbjs = originalPbjs;
      global.googletag = originalGoogletag;
    });
  });

  describe('and call the setup method', () => {
    beforeEach(() => {
      advertising.setup();
    });
    describe('the property `isPrebidUsed`', () =>
      void it('is set to true', () =>
        expect(advertising.isPrebidUsed).toBeTruthy()));
    describe('the Prebid module', () =>
      void it('is used to add ad units', () =>
        expect(global.pbjs.addAdUnits).toHaveBeenCalledTimes(1)));
    describe('the ad units object added to Prebid', () =>
      void it('is correct', () =>
        expect(global.pbjs.addAdUnits.mock.calls[0][0]).toMatchSnapshot()));
    describe('the price granularity for Prebid', () => {
      void it('is set', () =>
        expect(global.pbjs.setConfig).toHaveBeenCalledWith(
          expect.objectContaining({
            priceGranularity: 'medium',
          })
        ));
    });
    describe('the bidder sequence for Prebid', () => {
      void it('is set', () =>
        expect(global.pbjs.setConfig).toHaveBeenCalledWith(
          expect.objectContaining({
            bidderSequence: 'random',
          })
        ));
    });
    describe('the bidder timeout for Prebid', () =>
      void it('is set', () =>
        expect(global.pbjs.setConfig).toHaveBeenCalledWith(
          expect.objectContaining({
            bidderTimeout: 1500,
          })
        )));
    describe('initial loading of ad creatives through GPT', () =>
      void it('is disabled', () =>
        expect(
          global.googletag.pubads().disableInitialLoad
        ).toHaveBeenCalledTimes(1)));
    describe('size mappings for responsive ads', () =>
      void it('are defined using GPT', () =>
        expect(
          global.googletag.sizeMapping().addSize.mock.calls
        ).toMatchSnapshot()));
    describe('a GPT slot', () => {
      it('is defined for each slot', () =>
        expect(global.googletag.defineSlot).toHaveBeenCalledTimes(2));
      it('is defined for the “foo” ad with the correct parameters', () =>
        expect(global.googletag.defineSlot.mock.calls[0]).toMatchSnapshot());
      it('is defined for the “bar” ad with the correct parameters', () =>
        expect(global.googletag.defineSlot.mock.calls[1]).toMatchSnapshot());
    });
    describe('a GPT outOfPage slot', () => {
      it('is not called', () =>
        expect(global.googletag.defineOutOfPageSlot).toHaveBeenCalledTimes(0));
    });
    describe('the GPT slot that is defined for the “foo” ad', () => {
      let foo;
      beforeEach(() => (foo = global.googletag.fakeSlots[0]));
      it('does not get a size mapping because no size mapping name is configured', () =>
        expect(foo.defineSizeMapping).toHaveBeenCalledTimes(0));
      it('does not collapse empty divs because that is not configured', () =>
        expect(foo.setCollapseEmptyDiv).toHaveBeenCalledTimes(0));
      it('gets the correct targeting key values', () =>
        expect(foo.setTargeting.mock.calls).toMatchSnapshot());
      it('gets the pubads service added to it', () =>
        expect(foo.addService.mock.calls[0][0]).toStrictEqual(
          global.googletag.pubads()
        ));
    });
    describe('the GPT slot that is defined for the “bar” ad', () => {
      let foo;
      beforeEach(() => (foo = global.googletag.fakeSlots[1]));
      it('gets a size mapping', () =>
        expect(foo.defineSizeMapping.mock.calls).toMatchSnapshot());
      it('collapses empty divs', () =>
        expect(foo.setCollapseEmptyDiv.mock.calls).toMatchSnapshot());
      it('gets the correct targeting parameters', () =>
        expect(foo.setTargeting.mock.calls).toMatchSnapshot());
      it('gets the pubads service added to it', () =>
        expect(foo.addService.mock.calls[0][0]).toStrictEqual(
          global.googletag.pubads()
        ));
    });
    describe('global GPT targeting parameters', () =>
      void it('are set correctly', () =>
        expect(
          global.googletag.pubads().setTargeting.mock.calls
        ).toMatchSnapshot()));
    describe('GPT single request mode', () =>
      void it('is enabled', () =>
        expect(
          global.googletag.pubads().enableSingleRequest
        ).toHaveBeenCalledTimes(1)));
    describe('the GPT services', () =>
      void it('are enabled', () =>
        expect(global.googletag.enableServices).toHaveBeenCalledTimes(1)));
    //----------------------------------------------------------------------------------------------------
    describe('the display method of GPT', () => {
      it('is called for each slot', () =>
        expect(global.googletag.display).toHaveBeenCalledTimes(2));
      it('is called with the DIV ID of the “foo” ad', () =>
        expect(global.googletag.display).toHaveBeenCalledWith(DIV_ID_FOO));
      it('is called with the DIV ID of the “bar” ad', () =>
        expect(global.googletag.display).toHaveBeenCalledWith(DIV_ID_BAR));
    });
    describe('the slots of the advertising module instance', () =>
      void it('are correct', () =>
        expect(advertising.slots).toMatchSnapshot()));
    describe('the GPT size mappings of the advertising module instance', () =>
      void it('are correct', () =>
        expect(advertising.gptSizeMappings).toMatchSnapshot()));
    describe('and call the teardown method', () => {
      beforeEach(() => advertising.teardown());
      describe('the Prebid ad units', () =>
        void it('are removed', () =>
          expect(global.pbjs.removeAdUnit.mock.calls).toMatchSnapshot()));
      describe('the GPT slots', () =>
        void it('are destroyed', () =>
          expect(global.googletag.destroySlots).toHaveBeenCalledTimes(1)));
      describe('the slots of the advertising module instance', () =>
        void it('are empty', () =>
          expect(advertising.slots).toStrictEqual({})));
      describe('the GPT size mappings of the advertising module instance', () =>
        void it('are empty', () =>
          expect(advertising.gptSizeMappings).toStrictEqual({})));
    });
    describe('and I activate the “foo” ad', () => {
      beforeEach(() => advertising.activate(DIV_ID_FOO));
      describe('a bid with the correct parameters', () =>
        void it('is requested', () =>
          expect(global.pbjs.requestBids.mock.calls).toMatchSnapshot()));
      describe('the targeting for asynchronous GPT', () =>
        void it('is set correctly', () =>
          expect(
            global.pbjs.setTargetingForGPTAsync.mock.calls
          ).toMatchSnapshot()));
      describe('the ad slot', () =>
        void it('is refreshed', () =>
          expect(
            global.googletag.pubads().refresh.mock.calls
          ).toMatchSnapshot()));
    });
    describe('and I activate the “foo” ad with a custom events object to collapse its slot', () => {
      let collapse;
      beforeEach(() => {
        collapse = jest.fn();
        advertising.activate(DIV_ID_FOO, { collapse });
      });
      describe('and I send a message event to collapse the ad slot', () => {
        beforeEach((done) => {
          window.postMessage('CloseAdvContainer:foo', '*');
          setTimeout(() => done());
        });
        describe('the provided collapse callback', () =>
          void it('is called', () =>
            expect(collapse).toHaveBeenCalledTimes(1)));
      });
      describe('and I send some message event', () => {
        beforeEach((done) => {
          window.postMessage({ foo: 'thud' }, '*');
          setTimeout(() => done());
        });
        describe('the provided collapse callback', () =>
          void it('is not called', () =>
            expect(collapse).toHaveBeenCalledTimes(0)));
      });
      describe('and I send a message event to collapse another ad slot', () => {
        beforeEach((done) => {
          window.postMessage('CloseAdvContainer:waldo', '*');
          setTimeout(() => done());
        });
        describe('the provided collapse callback', () =>
          void it('is not called', () =>
            expect(collapse).toHaveBeenCalledTimes(0)));
      });
    });
  });
  afterEach(() => {
    global.pbjs = originalPbjs;
    global.googletag = originalGoogletag;
  });
});
describe('When I instantiate an advertising main module', () => {
  let originalPbjs, originalGoogletag, advertising;
  beforeEach(() => {
    originalPbjs = setupPbjs();
    originalGoogletag = setupGoogletag();
    advertising = new Advertising(config);
  });
  describe('and I activate the “foo” ad before the advertising module was set up', () => {
    beforeEach(() => advertising.activate(DIV_ID_FOO));
    describe('no bid', () =>
      void it('is requested', () =>
        expect(global.pbjs.requestBids).toHaveBeenCalledTimes(0)));
    describe('the targeting for asynchronous GPT', () =>
      void it('is not set', () =>
        expect(global.pbjs.setTargetingForGPTAsync).toHaveBeenCalledTimes(0)));
    describe('the ad slot', () =>
      void it('is not refreshed', () =>
        expect(global.googletag.pubads().refresh).toHaveBeenCalledTimes(0)));
    describe('and I call the setup method', () => {
      beforeEach(() => advertising.setup());
      describe('a bid', () =>
        void it('is requested', () =>
          expect(global.pbjs.requestBids).toHaveBeenCalledTimes(1)));
      describe('the targeting for asynchronous GPT', () =>
        void it('is set', () =>
          expect(global.pbjs.setTargetingForGPTAsync).toHaveBeenCalledTimes(
            1
          )));
      describe('the ad slot', () =>
        void it('is refreshed', () =>
          expect(global.googletag.pubads().refresh).toHaveBeenCalledTimes(1)));
    });
  });
  afterEach(() => {
    global.pbjs = originalPbjs;
    global.googletag = originalGoogletag;
  });
});

describe('When I instantiate an advertising main module and call setup', () => {
  describe('without ad config', () => {
    let originalPbjs, originalGoogletag, advertising;
    beforeEach(() => {
      originalPbjs = setupPbjs();
      originalGoogletag = setupGoogletag();
      advertising = new Advertising({});
    });
    beforeEach(() => (advertising = new Advertising({})));
    describe('the ad config', () =>
      void it('is set to sensible defaults', () => {
        expect(advertising.config).toMatchSnapshot();
      }));
    afterEach(() => {
      global.pbjs = originalPbjs;
      global.googletag = originalGoogletag;
    });
  });
});

describe('When I instantiate an advertising main module', () => {
  describe('without ad config config', () => {
    let advertising;
    beforeEach(() => (advertising = new Advertising()));

    describe('config ready', () =>
      void it('is false', () => {
        const result = advertising.isConfigReady();

        expect(result).toBe(false);
      }));

    describe('and set config later', () => {
      it('is set to proper config', () => {
        advertising.setConfig(config);
        expect(advertising.config).toMatchSnapshot();
      });

      it('is set to proper config', () => {
        advertising.setConfig(config);
        const result = advertising.isConfigReady();
        expect(result).toBe(true);
      });
    });
  });
});

describe('When I instantiate an advertising main module with plugins', () => {
  let originalPbjs, originalGoogletag, advertising, plugins;
  beforeEach(() => {
    originalPbjs = setupPbjs();
    originalGoogletag = setupGoogletag();
    plugins = [
      {
        setup: jest.fn(),
        setupPrebid: jest.fn(),
        teardownPrebid: jest.fn(),
        setupGpt: jest.fn(),
        teardownGpt: jest.fn(),
        displaySlots: jest.fn(),
        displayOutOfPageSlot: jest.fn(),
        refreshInterstitialSlot: jest.fn(),
      },
    ];
    advertising = new Advertising(config, plugins);
  });
  describe('and call the setup method', () => {
    beforeEach(() => advertising.setup());
    describe("the plugin's hook for Advertising setup", () =>
      void it('is called', () => expect(plugins[0].setup).toHaveBeenCalled()));
    describe("the plugin's hook for Prebid setup", () =>
      void it('is called', () =>
        expect(plugins[0].setupPrebid).toHaveBeenCalled()));
    describe("the plugin's hook for Prebid teardown", () =>
      void it('is not called', () =>
        expect(plugins[0].teardownPrebid).toHaveBeenCalledTimes(0)));
    describe("the plugin's hook for GPT setup", () =>
      void it('is called', () =>
        expect(plugins[0].setupGpt).toHaveBeenCalled()));
    describe("the plugin's hook for GPT teardown", () =>
      void it('is not called', () =>
        expect(plugins[0].teardownGpt).toHaveBeenCalledTimes(0)));
    describe("the plugin's hook for displaying slots", () =>
      void it('is called', () =>
        expect(plugins[0].displaySlots).toHaveBeenCalled()));
    describe("the plugin's hook for displaying outOfPage slots", () =>
      void it('is called', () =>
        expect(plugins[0].displayOutOfPageSlot).toHaveBeenCalled()));
    describe("the plugin's hook for refreshing interstitial slot", () =>
      void it('is called', () =>
        expect(plugins[0].refreshInterstitialSlot).toHaveBeenCalled()));
    describe('and call the teardown method', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        advertising.teardown();
      });
      describe("the plugin's hook for Prebid setup", () =>
        void it('is not called', () =>
          expect(plugins[0].setupPrebid).toHaveBeenCalledTimes(0)));
      describe("the plugin's hook for Prebid teardown", () =>
        void it('is called', () =>
          expect(plugins[0].teardownPrebid).toHaveBeenCalled()));
      describe("the plugin's hook for GPT setup", () =>
        void it('is not called', () =>
          expect(plugins[0].setupGpt).toHaveBeenCalledTimes(0)));
      describe("the plugin's hook for GPT teardown", () =>
        void it('is called', () =>
          expect(plugins[0].teardownGpt).toHaveBeenCalled()));
      describe("the plugin's hook for displaying slots", () =>
        void it('is not called', () =>
          expect(plugins[0].displaySlots).toHaveBeenCalledTimes(0)));
      describe("the plugin's hook for displaying outOfPage slots", () =>
        void it('is not called', () =>
          expect(plugins[0].displayOutOfPageSlot).toHaveBeenCalledTimes(0)));
      describe("the plugin's hook for refreshing interstiotials slots", () =>
        void it('is not called', () =>
          expect(plugins[0].refreshInterstitialSlot).toHaveBeenCalledTimes(0)));
    });
  });
  afterEach(() => {
    global.pbjs = originalPbjs;
    global.googletag = originalGoogletag;
  });
});

describe('When I instantiate an advertising main module with outOfPageSlots', () => {
  let originalPbjs,
    originalApstag,
    originalGoogletag,
    advertising,
    outOfPageSlotsConfig;
  beforeEach(() => {
    originalPbjs = setupPbjs();
    originalApstag = setupAps();
    originalGoogletag = setupGoogletag();

    outOfPageSlotsConfig = { ...config };
    outOfPageSlotsConfig.outOfPageSlots = [
      { id: 'outOfPageSlot1' },
      { id: 'outOfPageSlot2' },
    ];

    advertising = new Advertising(outOfPageSlotsConfig);
  });
  describe('a GPT outOfPage slot', () => {
    beforeEach(() => advertising.setup());
    it('is defined for each slot', () =>
      expect(global.googletag.defineOutOfPageSlot).toHaveBeenCalledTimes(2));
    it('is defined for the “outOfPageSlot1” ad with the correct parameters', () =>
      expect(
        global.googletag.defineOutOfPageSlot.mock.calls[0]
      ).toMatchSnapshot());
    it('is defined for the “outOfPageSlot2” ad with the correct parameters', () =>
      expect(
        global.googletag.defineOutOfPageSlot.mock.calls[1]
      ).toMatchSnapshot());
  });
  afterEach(() => {
    global.pbjs = originalPbjs;
    global.apstag = originalApstag;
    global.googletag = originalGoogletag;
  });
});

describe('When I instantiate an advertising main module with an interstitial slot', () => {
  let originalPbjs,
    originalApstag,
    originalGoogletag,
    advertising,
    interstitialSlotConfig;
  beforeEach(() => {
    originalPbjs = setupPbjs();
    originalApstag = setupAps();
    originalGoogletag = setupGoogletag();

    interstitialSlotConfig = { ...config };
    interstitialSlotConfig.interstitialSlot = {
      path: 'Path/Interstitial',
      targeting: {
        a: 'int123',
      },
    };

    advertising = new Advertising(interstitialSlotConfig);
  });
  describe('a GPT interstitial slot', () => {
    beforeEach(() => advertising.setup());
    it('is defined from given data', () =>
      expect(global.googletag.defineOutOfPageSlot).toHaveBeenCalledTimes(1));
    it('is defined with the correct parameters', () =>
      expect(
        global.googletag.defineOutOfPageSlot.mock.calls[0]
      ).toMatchSnapshot());
  });
  afterEach(() => {
    global.pbjs = originalPbjs;
    global.apstag = originalApstag;
    global.googletag = originalGoogletag;
  });
});

describe("When I instantiate an advertising main module with an interstitial slot doesn't create", () => {
  let originalPbjs,
    originalApstag,
    originalGoogletag,
    advertising,
    interstitialSlotConfig;
  beforeEach(() => {
    originalPbjs = setupPbjs();
    originalApstag = setupAps();
    originalGoogletag = setupGoogletag();
    global.googletag.interstitialNotProvided = true;

    interstitialSlotConfig = { ...config };
    interstitialSlotConfig.interstitialSlot = {
      path: 'Path/Interstitial',
      targeting: {
        a: 'int123',
      },
    };

    advertising = new Advertising(interstitialSlotConfig);
  });
  describe('a GPT interstitial slot', () => {
    beforeEach(() => advertising.setup());
    it('is not returning an outofpage slot', () =>
      expect(
        global.googletag.defineOutOfPageSlot.mock.results[0].value
      ).not.toBeDefined());
  });
  afterEach(() => {
    global.pbjs = originalPbjs;
    global.apstag = originalApstag;
    global.googletag = originalGoogletag;
  });
});

describe('When I instantiate an advertising main module and call the setup method with no slots given', () => {
  let originalGoogletag, originalApstag, advertising;
  beforeEach(() => {
    originalGoogletag = setupGoogletag();
    originalApstag = setupAps();
    advertising = new Advertising(configWithoutSlots);
    advertising.setup();
  });
  describe('a GPT slot', () => {
    it('is not defined', () =>
      expect(global.googletag.defineSlot).not.toHaveBeenCalled());
  });
  afterEach(() => {
    global.googletag = originalGoogletag;
    global.apstag = originalApstag;
  });
});

describe('When I instantiate an advertising main module without Prebid.js or APS library being loaded', () => {
  let originalGoogletag, advertising;
  beforeEach(() => {
    originalGoogletag = setupGoogletag();
    advertising = new Advertising(config);
  });
  describe('and call the setup method', () => {
    beforeEach(() => {
      advertising.setup();
    });
    describe('the property `isPrebidUsed`', () =>
      void it('is set to false', () =>
        expect(advertising.isPrebidUsed).toBeFalsy()));
    describe('the property `isAPSUsed`', () =>
      void it('is set to false', () =>
        expect(advertising.isAPSUsed).toBeFalsy()));
    describe('initial loading of ad creatives through GPT', () =>
      void it('is disabled', () =>
        expect(
          global.googletag.pubads().disableInitialLoad
        ).toHaveBeenCalledTimes(1)));
    describe('size mappings for responsive ads', () =>
      void it('are defined using GPT', () =>
        expect(
          global.googletag.sizeMapping().addSize.mock.calls
        ).toMatchSnapshot()));
    describe('a GPT slot', () => {
      it('is defined for each slot', () =>
        expect(global.googletag.defineSlot).toHaveBeenCalledTimes(2));
      it('is defined for the “foo” ad with the correct parameters', () =>
        expect(global.googletag.defineSlot.mock.calls[0]).toMatchSnapshot());
      it('is defined for the “bar” ad with the correct parameters', () =>
        expect(global.googletag.defineSlot.mock.calls[1]).toMatchSnapshot());
    });
    describe('the GPT slot that is defined for the “foo” ad', () => {
      let foo;
      beforeEach(() => (foo = global.googletag.fakeSlots[0]));
      it('does not get a size mapping because no size mapping name is configured', () =>
        expect(foo.defineSizeMapping).toHaveBeenCalledTimes(0));
      it('does not collapse empty divs because that is not configured', () =>
        expect(foo.setCollapseEmptyDiv).toHaveBeenCalledTimes(0));
      it('gets the correct targeting key values', () =>
        expect(foo.setTargeting.mock.calls).toMatchSnapshot());
      it('gets the pubads service added to it', () =>
        expect(foo.addService.mock.calls[0][0]).toStrictEqual(
          global.googletag.pubads()
        ));
    });
    describe('the GPT slot that is defined for the “bar” ad', () => {
      let foo;
      beforeEach(() => (foo = global.googletag.fakeSlots[1]));
      it('gets a size mapping', () =>
        expect(foo.defineSizeMapping.mock.calls).toMatchSnapshot());
      it('collapses empty divs', () =>
        expect(foo.setCollapseEmptyDiv.mock.calls).toMatchSnapshot());
      it('gets the correct targeting parameters', () =>
        expect(foo.setTargeting.mock.calls).toMatchSnapshot());
      it('gets the pubads service added to it', () =>
        expect(foo.addService.mock.calls[0][0]).toStrictEqual(
          global.googletag.pubads()
        ));
    });
    describe('global GPT targeting parameters', () =>
      void it('are set correctly', () =>
        expect(
          global.googletag.pubads().setTargeting.mock.calls
        ).toMatchSnapshot()));
    describe('GPT single request mode', () =>
      void it('is enabled', () =>
        expect(
          global.googletag.pubads().enableSingleRequest
        ).toHaveBeenCalledTimes(1)));
    describe('the GPT services', () =>
      void it('are enabled', () =>
        expect(global.googletag.enableServices).toHaveBeenCalledTimes(1)));
    //----------------------------------------------------------------------------------------------------
    describe('the display method of GPT', () => {
      it('is called for each slot', () =>
        expect(global.googletag.display).toHaveBeenCalledTimes(2));
      it('is called with the DIV ID of the “foo” ad', () =>
        expect(global.googletag.display).toHaveBeenCalledWith(DIV_ID_FOO));
      it('is called with the DIV ID of the “bar” ad', () =>
        expect(global.googletag.display).toHaveBeenCalledWith(DIV_ID_BAR));
    });
    describe('the slots of the advertising module instance', () =>
      void it('are correct', () =>
        expect(advertising.slots).toMatchSnapshot()));
    describe('the GPT size mappings of the advertising module instance', () =>
      void it('are correct', () =>
        expect(advertising.gptSizeMappings).toMatchSnapshot()));
    describe('and call the teardown method', () => {
      beforeEach(() => advertising.teardown());
      describe('the GPT slots', () =>
        void it('are destroyed', () =>
          expect(global.googletag.destroySlots).toHaveBeenCalledTimes(1)));
      describe('the slots of the advertising module instance', () =>
        void it('are empty', () =>
          expect(advertising.slots).toStrictEqual({})));
      describe('the GPT size mappings of the advertising module instance', () =>
        void it('are empty', () =>
          expect(advertising.gptSizeMappings).toStrictEqual({})));
    });
    describe('and I activate the “foo” ad', () => {
      beforeEach(() => advertising.activate(DIV_ID_FOO));
      describe('the ad slot', () =>
        void it('is refreshed', () =>
          expect(
            global.googletag.pubads().refresh.mock.calls
          ).toMatchSnapshot()));
    });
  });
  afterEach(() => {
    global.googletag = originalGoogletag;
  });
});

// https://github.com/eBayClassifiedsGroup/react-advertising/issues/50
// eslint-disable-next-line max-len
describe('When I instantiate and initialize an Advertising module, with gpt.js and prebid.js available, with config.usePrebid set to false', () => {
  let originalPbjs, originalGoogletag, advertising;
  beforeEach(() => {
    originalPbjs = setupPbjs();
    originalGoogletag = setupGoogletag();
    advertising = new Advertising({ ...config, usePrebid: false });
    advertising.setup();
  });
  describe('the property `isPrebidUsed`', () =>
    void it('is set to false', () =>
      expect(advertising.isPrebidUsed).toBeFalsy()));
  afterEach(() => {
    global.pbjs = originalPbjs;
    global.googletag = originalGoogletag;
  });
});

// eslint-disable-next-line max-len
describe('When I instantiate and initialize an Advertising module, with gpt.js and apstag.js available, with config.useAPS set to false', () => {
  it('the property `isAPSUsed` is set to false', () => {
    const originalApstag = setupAps();
    const originalGoogletag = setupGoogletag();
    const advertising = new Advertising({
      ...config,
      useAPS: false,
    });

    advertising.setup();
    expect(advertising.isAPSUsed).toBeFalsy();

    global.apstag = originalApstag;
    global.googletag = originalGoogletag;
  });
});

describe('When I instantiate an advertising main module, with both APS and Prebid', () => {
  let originalApstag, originalPbjs, originalGoogletag;
  beforeEach(() => {
    originalPbjs = setupPbjs();
    originalApstag = setupAps();
    originalGoogletag = setupGoogletag();
  });

  afterEach(() => {
    global.apstag = originalApstag;
    global.pbjs = originalPbjs;
    global.googletag = originalGoogletag;
  });

  it('should call googletag.pubads().refresh() once during setup', async () => {
    const advertising = new Advertising(config);
    advertising.queue = TWO_SLOT_QUEUE;
    await advertising.setup();
    expect(global.googletag.pubads().refresh).toHaveBeenCalledTimes(1);
  });

  it('should call googletag.pubads().refresh() twice if two slots request new ads simultaneously', async () => {
    const advertising = new Advertising(config);
    advertising.queue = TWO_SLOT_QUEUE;
    await advertising.setup();

    // setup should call global.googletag.pubads().refresh once
    expect(global.googletag.pubads().refresh).toHaveBeenCalledTimes(1);

    advertising.activate(DIV_ID_FOO);
    advertising.activate(DIV_ID_BAR);
    expect(global.googletag.pubads().refresh).toHaveBeenCalledTimes(3);
  });
});

function setupAps() {
  const originalApstag = global.apstag;
  global.apstag = {
    init: jest.fn(),
    fetchBids: jest.fn((_, callback) => callback()),
    setDisplayBids: jest.fn(),
  };
  return originalApstag;
}

function setupPbjs() {
  const originalPbjs = global.pbjs;
  global.pbjs = {
    que: { push: jest.fn((func) => func()) },
  };
  global.pbjs.addAdUnits = jest.fn();
  global.pbjs.removeAdUnit = jest.fn();
  global.pbjs.requestBids = jest.fn((requestBidsConfig) =>
    requestBidsConfig.bidsBackHandler()
  );
  global.pbjs.getAdserverTargeting = jest.fn();
  global.pbjs.setConfig = jest.fn();
  global.pbjs.setTargetingForGPTAsync = jest.fn();
  global.pbjs.setBidderSequence = jest.fn();
  return originalPbjs;
}

function setupGoogletag() {
  const originalGoogletag = global.googletag;
  global.googletag = {
    cmd: { push: jest.fn((func) => func()) },
    enums: { OutOfPageFormat: { INTERSTITIAL: 2 } },
  };
  global.googletag.fakeSlots = [];
  global.googletag.defineSlot = jest.fn(() => {
    const fakeSizes = [{ width: 100, height: 100 }];
    const fakeSlot = {
      getSlotElementId: jest.fn(),
      getAdUnitPath: jest.fn(),
      getSizes: jest.fn().mockReturnValue(fakeSizes),
    };
    fakeSlot.setTargeting = jest.fn().mockReturnValue(fakeSlot);
    fakeSlot.defineSizeMapping = jest.fn().mockReturnValue(fakeSlot);
    fakeSlot.addService = jest.fn().mockReturnValue(fakeSlot);
    fakeSlot.setCollapseEmptyDiv = jest.fn().mockReturnValue(fakeSlot);
    global.googletag.fakeSlots.push(fakeSlot);
    return fakeSlot;
  });
  global.googletag.defineOutOfPageSlot = jest.fn((path, id) => {
    if (
      global.googletag.interstitialNotProvided &&
      id === window.googletag.enums.OutOfPageFormat.INTERSTITIAL
    ) {
      return;
    }
    const fakeSlot = {};
    fakeSlot.addService = jest.fn().mockReturnValue(fakeSlot);
    fakeSlot.setTargeting = jest.fn();
    global.googletag.fakeSlots.push(fakeSlot);
    // eslint-disable-next-line consistent-return
    return fakeSlot;
  });
  global.googletag.setTargeting = jest.fn().mockReturnValue(global.googletag);
  global.googletag.addService = jest.fn().mockReturnValue(global.googletag);
  global.googletag.pubads = jest.fn().mockReturnValue(global.googletag);
  global.googletag.fakeSizeMapping = {
    addSize: jest.fn().mockReturnValue(global.googletag.fakeSizeMapping),
    build: jest.fn().mockReturnValue(GPT_SIZE_MAPPING),
  };
  global.googletag.sizeMapping = jest
    .fn()
    .mockReturnValue(global.googletag.fakeSizeMapping);
  global.googletag.enableSingleRequest = jest.fn();
  global.googletag.enableServices = jest.fn();
  global.googletag.refresh = jest.fn();
  global.googletag.display = jest.fn();
  global.googletag.destroySlots = jest.fn();
  global.googletag.disableInitialLoad = jest.fn();
  global.googletag.collapseEmptyDivs = jest.fn();
  return originalGoogletag;
}
