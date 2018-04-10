import Advertising from './Advertising';
import { stub, spy } from 'sinon';
import { config, DIV_ID_BAR, DIV_ID_FOO } from './utils/testAdvertisingConfig';

const GPT_SIZE_MAPPING = [[[0, 0], []], [[320, 700], [[300, 250], [320, 50]]], [[1050, 200], []]];

describe('When I instantiate an advertising main module', () => {
    let originalGetElementById, fakeElement, originalPbjs, originalGoogletag, advertising;
    beforeEach(() => {
        ({ originalGetElementById, fakeElement } = setupGetElementById());
        originalPbjs = setupPbjs();
        originalGoogletag = setupGoogletag();
        advertising = new Advertising(config);
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
            it('is set', () => void expect(global.pbjs.setPriceGranularity).to.have.been.calledOnce);
            it('is set correctly', () => void expect(global.pbjs.setPriceGranularity.firstCall.args).toMatchSnapshot());
        });
        describe('the bidder sequence for Prebid', () => {
            it('is set', () => void expect(global.pbjs.setBidderSequence).to.have.been.calledOnce);
            it('is set correctly', () => void expect(global.pbjs.setBidderSequence.firstCall.args).toMatchSnapshot());
        });
        describe('bidder settings for AppNexus', () =>
            it('are set', () => void expect(global.pbjs.bidderSettings.appnexus).to.exist));
        describe('bidder settings for Rubicon', () =>
            it('are set', () => void expect(global.pbjs.bidderSettings.rubicon).to.exist));
        describe('and I call the method to adjust the bid CPM for AppNexus', () => {
            let result;
            beforeEach(() => (result = global.pbjs.bidderSettings.appnexus.bidCpmAdjustment(666)));
            describe('the result', () => it('is correct', () => void expect(result).toMatchSnapshot()));
        });
        describe('and I call the method to adjust the bid CPM for Rubicon', () => {
            let result;
            beforeEach(() => (result = global.pbjs.bidderSettings.rubicon.bidCpmAdjustment(666)));
            describe('the result', () => it('is correct', () => void expect(result).toMatchSnapshot()));
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
        describe("the background color of the ad slot's DOM element", () =>
            it('is not changed', () => void expect(fakeElement.style.backgroundColor).to.equal('shmackground-color')));
        describe("the background image of the ad slot's DOM element", () =>
            it('is not changed', () => void expect(fakeElement.style.backgroundImage).to.equal('shmackground-image')));
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
            describe("the background color of the ad slot's DOM element", () =>
                it('is set to transparent', () =>
                    void expect(fakeElement.style.backgroundColor).to.equal('transparent')));
            describe("the background image of the ad slot's DOM element", () =>
                it('is set to none', () => void expect(fakeElement.style.backgroundImage).to.equal('none')));
        });
        describe('and I activate the “foo” ad with a callback function to collapse its slot', () => {
            let collapseCallback;
            beforeEach(() => {
                collapseCallback = spy();
                advertising.activate(DIV_ID_FOO, collapseCallback);
            });
            describe('and I send a message event to collapse the ad slot', () => {
                beforeEach(done => {
                    window.postMessage('CloseAdvContainer:foo', '*');
                    setTimeout(() => done());
                });
                describe('the provided collapse callback', () =>
                    it('is called', () => void expect(collapseCallback).to.have.been.calledOnce));
            });
            describe('and I send some message event', () => {
                beforeEach(done => {
                    window.postMessage({ foo: 'thud' }, '*');
                    setTimeout(() => done());
                });
                describe('the provided collapse callback', () =>
                    it('is not called', () => void expect(collapseCallback).to.not.have.been.called));
            });
            describe('and I send a message event to collapse another ad slot', () => {
                beforeEach(done => {
                    window.postMessage('CloseAdvContainer:waldo', '*');
                    setTimeout(() => done());
                });
                describe('the provided collapse callback', () =>
                    it('is not called', () => void expect(collapseCallback).to.not.have.been.called));
            });
        });
    });
    afterEach(() => {
        global.document = originalGetElementById;
        global.pbjs = originalPbjs;
        global.googletag = originalGoogletag;
    });
});
describe('When I instantiate an advertising main module', () => {
    let originalGetElementById, fakeElement, originalPbjs, originalGoogletag, advertising;
    beforeEach(() => {
        ({ originalGetElementById, fakeElement } = setupGetElementById());
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
        describe("the background color of the ad slot's DOM element", () =>
            it('is not changed', () => void expect(fakeElement.style.backgroundColor).to.equal('shmackground-color')));
        describe("the background image of the ad slot's DOM element", () =>
            it('is not changed', () => void expect(fakeElement.style.backgroundImage).to.equal('shmackground-image')));
        describe('and I call the setup method', () => {
            beforeEach(() => advertising.setup());
            describe('a bid', () =>
                it('is requested', () => void expect(global.pbjs.requestBids).to.have.been.calledOnce));
            describe('the targeting for asynchronous GPT', () =>
                it('is set', () => void expect(global.pbjs.setTargetingForGPTAsync).to.have.been.calledOnce));
            describe('the ad slot', () =>
                it('is refreshed', () => void expect(global.googletag.pubads().refresh).to.have.been.calledOnce));
            describe("the background color of the ad slot's DOM element", () =>
                it('is set to transparent', () =>
                    void expect(fakeElement.style.backgroundColor).to.equal('transparent')));
            describe("the background image of the ad slot's DOM element", () =>
                it('is set to none', () => void expect(fakeElement.style.backgroundImage).to.equal('none')));
        });
    });
    afterEach(() => {
        global.document = originalGetElementById;
        global.pbjs = originalPbjs;
        global.googletag = originalGoogletag;
    });
});

function setupGetElementById() {
    const originalGetElementById = global.document.getElementById;
    const fakeElement = { style: { backgroundColor: 'shmackground-color', backgroundImage: 'shmackground-image' } };
    global.document.getElementById = () => fakeElement;
    return { fakeElement, originalGetElementById };
}
function setupPbjs() {
    const originalPbjs = global.pbjs;
    global.pbjs = {
        que: { push: stub().callsFake(func => func()) }
    };
    global.pbjs.addAdUnits = spy();
    global.pbjs.removeAdUnit = spy();
    global.pbjs.requestBids = stub().callsFake(requestBidsConfig => requestBidsConfig.bidsBackHandler());
    global.pbjs.getAdserverTargeting = spy();
    global.pbjs.setPriceGranularity = spy();
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
