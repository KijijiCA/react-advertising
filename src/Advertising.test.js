import Advertising from './Advertising';
import { stub, spy } from 'sinon';
import { config, DIV_ID_BAR, DIV_ID_FOO } from './utils/testAdvertisingConfig';

const GPT_SIZE_MAPPING = [
    [[0, 0], []],
    [
        [320, 700],
        [
            [300, 250],
            [320, 50]
        ]
    ],
    [[1050, 200], []]
];

describe('When I instantiate an advertising main module', () => {
    let originalPbjs, originalGoogletag, advertising;
    beforeEach(() => {
        originalPbjs = setupPbjs();
        originalGoogletag = setupGoogletag();
        advertising = new Advertising(config);
    });
    describe('call the setup method', () => {
        let onErrorSpy;
        beforeEach(() => {
            onErrorSpy = spy();
            advertising = new Advertising(config, [], onErrorSpy);
        });

        describe('and pbjs.addAdUnits throws an error', () => {
            it('calls onError callback', () => {
                const error = new Error();
                global.pbjs.addAdUnits = stub().throws(error);

                advertising.setup();

                expect(onErrorSpy).to.have.been.calledWithMatch(error);
            });
        });

        describe('and pbjs.requestBids throws an error', () => {
            it('calls onError callback', () => {
                const error = new Error();
                global.pbjs.requestBids = stub().throws(error);

                advertising.setup();
                advertising.activate(DIV_ID_FOO);

                expect(onErrorSpy).to.have.been.calledWithMatch(error);
            });
        });

        describe('and pbjs.setTargetingForGPTAsync throws an error', () => {
            it('calls onError callback', () => {
                const error = new Error();
                global.pbjs.setTargetingForGPTAsync = stub().throws(error);

                advertising.setup();
                advertising.activate(DIV_ID_FOO);

                expect(onErrorSpy).to.have.been.calledWithMatch(error);
            });
        });

        describe('and pbjs.teardown throws an error', () => {
            it('calls onError callback', () => {
                const error = new Error();
                global.pbjs.removeAdUnit = stub().throws(error);

                advertising.setup();
                advertising.teardown();

                expect(onErrorSpy).to.have.been.calledWithMatch(error);
            });
        });

        describe('and googletag.pubads throws an error', () => {
            it('calls onError callback', () => {
                const error = new Error();
                global.googletag.pubads = stub().throws(error);

                advertising.setup();

                expect(onErrorSpy).to.have.been.calledWithMatch(error);
            });
        });

        describe('and googletag.destroySlots throws an error', () => {
            it('calls onError callback', () => {
                const error = new Error();
                global.googletag.destroySlots = stub().throws(error);

                advertising.setup();
                advertising.teardown();

                expect(onErrorSpy).to.have.been.calledWithMatch(error);
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
        describe('the Prebid module', () =>
            it('is used to add ad units', () => void expect(global.pbjs.addAdUnits).to.have.been.calledOnce));
        describe('the ad units object added to Prebid', () =>
            it('is correct', () => void expect(global.pbjs.addAdUnits.firstCall.args[0]).toMatchSnapshot()));
        describe('the price granularity for Prebid', () => {
            it('is set', () =>
                void expect(global.pbjs.setConfig).to.have.been.calledWithMatch({ priceGranularity: 'medium' }));
        });
        describe('the bidder sequence for Prebid', () => {
            it('is set', () =>
                void expect(global.pbjs.setConfig).to.have.been.calledWithMatch({ bidderSequence: 'random' }));
        });
        describe('the bidder timeout for Prebid', () => {
            it('is set', () =>
                void expect(global.pbjs.setConfig).to.have.been.calledWithMatch({ bidderTimeout: 1500 }));
        });
        describe('initial loading of ad creatives through GPT', () =>
            it('is disabled', () => void expect(global.googletag.pubads().disableInitialLoad).to.have.been.calledOnce));
        describe('size mappings for responsive ads', () =>
            it('are defined using GPT', () =>
                void expect(global.googletag.sizeMapping().addSize.args).toMatchSnapshot()));
        describe('a GPT slot', () => {
            it('is defined for each slot', () => void expect(global.googletag.defineSlot).to.have.been.calledTwice);
            it('is defined for the “foo” ad with the correct parameters', () =>
                void expect(global.googletag.defineSlot.firstCall.args).toMatchSnapshot());
            it('is defined for the “bar” ad with the correct parameters', () =>
                void expect(global.googletag.defineSlot.secondCall.args).toMatchSnapshot());
        });
        describe('a GPT outOfPage slot', () => {
            it('is not called once', () => void expect(global.googletag.defineOutOfPageSlot).to.not.have.been.called);
        });
        describe('the GPT slot that is defined for the “foo” ad', () => {
            let foo;
            beforeEach(() => (foo = global.googletag.fakeSlots[0]));
            it('does not get a size mapping because no size mapping name is configured', () =>
                void expect(foo.defineSizeMapping).to.not.have.been.called);
            it('does not collapse empty divs because that is not configured', () =>
                void expect(foo.setCollapseEmptyDiv).to.not.have.been.called);
            it('gets the correct targeting parameters', () => void expect(foo.setTargeting.args).toMatchSnapshot());
            it('gets the pubads service added to it', () =>
                void expect(foo.addService.firstCall.args[0]).to.deep.equal(global.googletag.pubads()));
        });
        describe('the GPT slot that is defined for the “bar” ad', () => {
            let foo;
            beforeEach(() => (foo = global.googletag.fakeSlots[1]));
            it('gets a size mapping', () => void expect(foo.defineSizeMapping.args).toMatchSnapshot());
            it('collapses empty divs', () => void expect(foo.setCollapseEmptyDiv.args).toMatchSnapshot());
            it('gets the correct targeting parameters', () => void expect(foo.setTargeting.args).toMatchSnapshot());
            it('gets the pubads service added to it', () =>
                void expect(foo.addService.firstCall.args[0]).to.deep.equal(global.googletag.pubads()));
        });
        describe('global GPT targeting parameters', () =>
            it('are set correctly', () => void expect(global.googletag.pubads().setTargeting.args).toMatchSnapshot()));
        describe('GPT single request mode', () =>
            it('is enabled', () => void expect(global.googletag.pubads().enableSingleRequest).to.have.been.calledOnce));
        describe('the GPT services', () =>
            it('are enabled', () => void expect(global.googletag.enableServices).to.have.been.calledOnce));
        describe('the display method of GPT', () => {
            it('is called for each slot', () => void expect(global.googletag.display).to.have.been.calledTwice);
            it('is called with the DIV ID of the “foo” ad', () =>
                void expect(global.googletag.display).to.have.been.calledWith(DIV_ID_FOO));
            it('is called with the DIV ID of the “bar” ad', () =>
                void expect(global.googletag.display).to.have.been.calledWith(DIV_ID_BAR));
        });
        describe('the slots of the advertising module instance', () =>
            it('are correct', () => void expect(advertising.slots).toMatchSnapshot()));
        describe('the GPT size mappings of the advertising module instance', () =>
            it('are correct', () => void expect(advertising.gptSizeMappings).toMatchSnapshot()));
        describe('and call the teardown method', () => {
            beforeEach(() => advertising.teardown());
            describe('the Prebid ad units', () =>
                it('are removed', () => void expect(global.pbjs.removeAdUnit.args).toMatchSnapshot()));
            describe('the GPT slots', () =>
                it('are destroyed', () => void expect(global.googletag.destroySlots).to.have.been.calledOnce));
            describe('the slots of the advertising module instance', () =>
                it('are empty', () => void expect(advertising.slots).to.deep.equal({})));
            describe('the GPT size mappings of the advertising module instance', () =>
                it('are empty', () => void expect(advertising.gptSizeMappings).to.deep.equal({})));
        });
        describe('and I activate the “foo” ad', () => {
            beforeEach(() => advertising.activate(DIV_ID_FOO));
            describe('a bid with the correct parameters', () =>
                it('is requested', () => void expect(global.pbjs.requestBids.args).toMatchSnapshot()));
            describe('the targeting for asynchronous GPT', () =>
                it('is set correctly', () => void expect(global.pbjs.setTargetingForGPTAsync.args).toMatchSnapshot()));
            describe('the ad slot', () =>
                it('is refreshed', () => void expect(global.googletag.pubads().refresh.args).toMatchSnapshot()));
        });
        describe('and I activate the “foo” ad with a custom events object to collapse its slot', () => {
            let collapse;
            beforeEach(() => {
                collapse = spy();
                advertising.activate(DIV_ID_FOO, { collapse });
            });
            describe('and I send a message event to collapse the ad slot', () => {
                beforeEach(done => {
                    window.postMessage('CloseAdvContainer:foo', '*');
                    setTimeout(() => done());
                });
                describe('the provided collapse callback', () =>
                    it('is called', () => void expect(collapse).to.have.been.calledOnce));
            });
            describe('and I send some message event', () => {
                beforeEach(done => {
                    window.postMessage({ foo: 'thud' }, '*');
                    setTimeout(() => done());
                });
                describe('the provided collapse callback', () =>
                    it('is not called', () => void expect(collapse).to.not.have.been.called));
            });
            describe('and I send a message event to collapse another ad slot', () => {
                beforeEach(done => {
                    window.postMessage('CloseAdvContainer:waldo', '*');
                    setTimeout(() => done());
                });
                describe('the provided collapse callback', () =>
                    it('is not called', () => void expect(collapse).to.not.have.been.called));
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
            it('is requested', () => void expect(global.pbjs.requestBids).to.not.have.been.called));
        describe('the targeting for asynchronous GPT', () =>
            it('is not set', () => void expect(global.pbjs.setTargetingForGPTAsync).to.not.have.been.called));
        describe('the ad slot', () =>
            it('is not refreshed', () => void expect(global.googletag.pubads().refresh).to.not.have.been.called));
        describe('and I call the setup method', () => {
            beforeEach(() => advertising.setup());
            describe('a bid', () =>
                it('is requested', () => void expect(global.pbjs.requestBids).to.have.been.calledOnce));
            describe('the targeting for asynchronous GPT', () =>
                it('is set', () => void expect(global.pbjs.setTargetingForGPTAsync).to.have.been.calledOnce));
            describe('the ad slot', () =>
                it('is refreshed', () => void expect(global.googletag.pubads().refresh).to.have.been.calledOnce));
        });
    });
    afterEach(() => {
        global.pbjs = originalPbjs;
        global.googletag = originalGoogletag;
    });
});

describe('When I instantiate an advertising main module', () => {
    describe('without prebid config', () => {
        let advertising;
        beforeEach(() => (advertising = new Advertising({})));
        describe('the prebid config', () => {
            it('is set to sensible defaults', () => {
                void expect(advertising.config).toMatchSnapshot();
            });
        });
    });
});

describe('When I instantiate an advertising main module', () => {
    describe('without prebid config', () => {
        let advertising;
        beforeEach(() => (advertising = new Advertising()));

        describe('config ready', () => {
            it('is false', () => {
                const result = advertising.isConfigReady();

                expect(result).toBe(false);
            });
        });

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
                setup: spy(),
                setupPrebid: spy(),
                teardownPrebid: spy(),
                setupGpt: spy(),
                teardownGpt: spy(),
                displaySlots: spy(),
                displayOutOfPageSlot: spy()
            }
        ];
        advertising = new Advertising(config, plugins);
    });
    describe('and call the setup method', () => {
        beforeEach(() => advertising.setup());
        describe("the plugin's hook for Advertising setup", () =>
            it('is called', () => void plugins[0].setup.should.have.been.called));
        describe("the plugin's hook for Prebid setup", () =>
            it('is called', () => void plugins[0].setupPrebid.should.have.been.called));
        describe("the plugin's hook for Prebid teardown", () =>
            it('is not called', () => void plugins[0].teardownPrebid.should.not.have.been.called));
        describe("the plugin's hook for GPT setup", () =>
            it('is called', () => void plugins[0].setupGpt.should.have.been.called));
        describe("the plugin's hook for GPT teardown", () =>
            it('is not called', () => void plugins[0].teardownGpt.should.not.have.been.called));
        describe("the plugin's hook for displaying slots", () =>
            it('is called', () => void plugins[0].displaySlots.should.have.been.called));
        describe("the plugin's hook for displaying outOfPage slots", () =>
            it('is called', () => void plugins[0].displayOutOfPageSlot.should.have.been.called));
    });
    describe('and call the teardown method', () => {
        beforeEach(() => advertising.teardown());
        describe("the plugin's hook for Prebid setup", () =>
            it('is not called', () => void plugins[0].setupPrebid.should.not.have.been.called));
        describe("the plugin's hook for Prebid teardown", () =>
            it('is called', () => void plugins[0].teardownPrebid.should.have.been.called));
        describe("the plugin's hook for GPT setup", () =>
            it('is not called', () => void plugins[0].setupGpt.should.not.have.been.called));
        describe("the plugin's hook for GPT teardown", () =>
            it('is called', () => void plugins[0].teardownGpt.should.have.been.called));
        describe("the plugin's hook for displaying slots", () =>
            it('is not called', () => void plugins[0].displaySlots.should.not.have.been.called));
        describe("the plugin's hook for displaying outOfPage slots", () =>
            it('is not called', () => void plugins[0].displayOutOfPageSlot.should.not.have.been.called));
    });
    afterEach(() => {
        global.pbjs = originalPbjs;
        global.googletag = originalGoogletag;
    });
});

describe('When I instantiate an advertising main module with outOfPageSlots', () => {
    let originalPbjs, originalGoogletag, advertising, outOfPageSlotsConfig;
    beforeEach(() => {
        originalPbjs = setupPbjs();
        originalGoogletag = setupGoogletag();

        outOfPageSlotsConfig = { ...config };
        outOfPageSlotsConfig.outOfPageSlots = [{ id: 'outOfPageSlot1' }, { id: 'outOfPageSlot2' }];

        advertising = new Advertising(outOfPageSlotsConfig);
    });
    describe('a GPT outOfPage slot', () => {
        beforeEach(() => advertising.setup());
        it('is defined for each slot', () =>
            void expect(global.googletag.defineOutOfPageSlot).to.have.been.calledTwice);
        it('is defined for the “outOfPageSlot1” ad with the correct parameters', () =>
            void expect(global.googletag.defineOutOfPageSlot.firstCall.args).toMatchSnapshot());
        it('is defined for the “outOfPageSlot2” ad with the correct parameters', () =>
            void expect(global.googletag.defineOutOfPageSlot.secondCall.args).toMatchSnapshot());
    });
    afterEach(() => {
        global.pbjs = originalPbjs;
        global.googletag = originalGoogletag;
    });
});

function setupPbjs() {
    const originalPbjs = global.pbjs;
    global.pbjs = {
        que: { push: stub().callsFake(func => func()) }
    };
    global.pbjs.addAdUnits = spy();
    global.pbjs.removeAdUnit = spy();
    global.pbjs.requestBids = stub().callsFake(requestBidsConfig => requestBidsConfig.bidsBackHandler());
    global.pbjs.getAdserverTargeting = spy();
    global.pbjs.setConfig = spy();
    global.pbjs.setTargetingForGPTAsync = spy();
    global.pbjs.setBidderSequence = spy();
    return originalPbjs;
}

function setupGoogletag() {
    const originalGoogletag = global.googletag;
    global.googletag = {
        cmd: { push: stub().callsFake(func => func()) }
    };
    global.googletag.fakeSlots = [];
    global.googletag.defineSlot = stub().callsFake(() => {
        const fakeSlot = {};
        fakeSlot.setTargeting = stub().returns(fakeSlot);
        fakeSlot.defineSizeMapping = stub().returns(fakeSlot);
        fakeSlot.addService = stub().returns(fakeSlot);
        fakeSlot.setCollapseEmptyDiv = stub().returns(fakeSlot);
        global.googletag.fakeSlots.push(fakeSlot);
        return fakeSlot;
    });
    global.googletag.defineOutOfPageSlot = stub().callsFake(() => {
        const fakeSlot = {};
        fakeSlot.addService = stub().returns(fakeSlot);
        global.googletag.fakeSlots.push(fakeSlot);
        return fakeSlot;
    });
    global.googletag.setTargeting = stub().returns(global.googletag);
    global.googletag.addService = stub().returns(global.googletag);
    global.googletag.pubads = stub().returns(global.googletag);
    global.googletag.fakeSizeMapping = {
        addSize: stub().returns(global.googletag.fakeSizeMapping),
        build: stub().returns(GPT_SIZE_MAPPING)
    };
    global.googletag.sizeMapping = stub().returns(global.googletag.fakeSizeMapping);
    global.googletag.enableSingleRequest = spy();
    global.googletag.enableServices = spy();
    global.googletag.refresh = spy();
    global.googletag.display = spy();
    global.googletag.destroySlots = spy();
    global.googletag.disableInitialLoad = spy();
    global.googletag.collapseEmptyDivs = spy();
    return originalGoogletag;
}
