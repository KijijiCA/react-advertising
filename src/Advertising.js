/* global pbjs, googletag */

import getAdUnits from './utils/getAdUnits';

const GROSS_TO_NET_RATE = 0.93;
const PRICE_GRANULARITY = 'medium';
const BIDDER_SEQUENCE = 'random';
const defineGptSizeMappings = Symbol('define GTP size mappings (private method)');
const getGptSizeMapping = Symbol('get GPT size mapping (private method)');
const defineSlots = Symbol('define slots (private method)');
const displaySlots = Symbol('display slots (private method)');
const setupPrebid = Symbol('setup Prebid (private method)');
const teardownPrebid = Symbol('teardown Prebid (private method)');
const setupGpt = Symbol('setup GPT (private method)');
const teardownGpt = Symbol('teardown GPT (private method)');
const setupCollapseEmtpyAdvertisingSlots = Symbol('setup collapse empty advertising slots (private method)');
const teardownCollapseEmtpyAdvertisingSlots = Symbol('teardown collapse empty advertising slots (private method)');
const collapseEmptyAdvertisingSlots = Symbol('collapse empty advertising slots (private method)');
const withQueue = Symbol('with queue (private method)');
const queueForGPT = Symbol('queue for GPT (private method)');
const queueForPrebid = Symbol('queue for Prebid (private method)');
const removeBackground = Symbol('remove background (private method)');
const setDefaultConfig = Symbol('set default config (private method)');

export default class Advertising {
    constructor(config) {
        this.config = config;
        this.slots = {};
        this.gptSizeMappings = {};
        this.collapseCallbacks = {};
        this.queue = [];
    }

    // ---------- PUBLIC METHODS ----------

    async setup() {
        this[setDefaultConfig]();
        const { slots, config: { prebid: { timeout } }, collapseCallbacks, queue } = this;
        this[setupCollapseEmtpyAdvertisingSlots]();
        await Promise.all([
            Advertising[queueForPrebid](this[setupPrebid].bind(this)),
            Advertising[queueForGPT](this[setupGpt].bind(this))
        ]);
        if (queue.length === 0) {
            return;
        }
        for (const { divId, collapse } of queue) {
            collapseCallbacks[divId] = collapse;
        }
        const divIds = queue.map(({ divId }) => divId);
        const selectedSlots = queue.map(({ divId }) => slots[divId]);
        Advertising[queueForPrebid](() =>
            pbjs.requestBids({
                timeout,
                adUnitCodes: divIds,
                bidsBackHandler() {
                    pbjs.setTargetingForGPTAsync(divIds);
                    Advertising[queueForGPT](() => {
                        googletag.pubads().refresh(selectedSlots);
                        divIds.forEach(Advertising[removeBackground]);
                    });
                }
            })
        );
    }

    async teardown() {
        this[teardownCollapseEmtpyAdvertisingSlots]();
        await Promise.all([
            Advertising[queueForPrebid](this[teardownPrebid].bind(this)),
            Advertising[queueForGPT](this[teardownGpt].bind(this))
        ]);
        this.slots = {};
        this.gptSizeMappings = {};
        this.collapseCallbacks = {};
        this.queue = {};
    }

    activate(divId, collapse = () => {}) {
        const { slots, config: { prebid: { timeout } }, collapseCallbacks } = this;
        if (Object.values(slots).length === 0) {
            this.queue.push({ divId, collapse });
            return;
        }
        collapseCallbacks[divId] = collapse;
        Advertising[queueForPrebid](() =>
            pbjs.requestBids({
                timeout,
                adUnitCodes: [divId],
                bidsBackHandler() {
                    pbjs.setTargetingForGPTAsync([divId]);
                    Advertising[queueForGPT](() => {
                        googletag.pubads().refresh([slots[divId]]);
                        Advertising[removeBackground](divId);
                    });
                }
            })
        );
    }

    // ---------- PRIVATE METHODS ----------

    [setupCollapseEmtpyAdvertisingSlots]() {
        const { collapseCallbacks } = this;
        this[collapseEmptyAdvertisingSlots] = ({ data }) => {
            if (typeof data !== 'string' || !data.startsWith('CloseAdvContainer:')) {
                return;
            }
            const divId = `div-gpt-ad-${data.replace(/^CloseAdvContainer:/, '')}`;
            const collapseCallback = collapseCallbacks[divId];
            if (collapseCallback) {
                collapseCallback();
            }
        };
        window.addEventListener('message', this[collapseEmptyAdvertisingSlots]);
    }

    [teardownCollapseEmtpyAdvertisingSlots]() {
        window.removeEventListener('message', this[collapseEmptyAdvertisingSlots]);
    }

    [defineGptSizeMappings]() {
        if (!this.config.sizeMappings) {
            return;
        }
        Object.keys(this.config.sizeMappings).forEach(key => {
            const sizeMapping = googletag.sizeMapping();
            this.config.sizeMappings[key].forEach(({ viewPortSize, sizes }) =>
                sizeMapping.addSize(viewPortSize, sizes)
            );
            this.gptSizeMappings[key] = sizeMapping.build();
        });
    }

    [getGptSizeMapping](sizeMappingName) {
        return sizeMappingName && this.gptSizeMappings[sizeMappingName] ? this.gptSizeMappings[sizeMappingName] : null;
    }

    [defineSlots]() {
        Object.values(this.config.slot).forEach(
            ({ divId, targeting = {}, sizes, sizeMappingName, adUnitPath, collapseEmptyDiv }) => {
                const slot = googletag.defineSlot(adUnitPath || this.config.metaData.adUnitPath.path, sizes, divId);

                const sizeMapping = this[getGptSizeMapping](sizeMappingName);
                if (sizeMapping) {
                    slot.defineSizeMapping(sizeMapping);
                }

                if (collapseEmptyDiv && collapseEmptyDiv.length && collapseEmptyDiv.length > 0) {
                    slot.setCollapseEmptyDiv(...collapseEmptyDiv);
                }

                Object.entries(targeting).forEach(([key, value]) => slot.setTargeting(key, value));

                slot.addService(googletag.pubads());
                this.slots[divId] = slot;
            }
        );
    }

    [displaySlots]() {
        Object.values(this.config.slot).forEach(({ divId }) => googletag.display(divId));
    }

    [setupPrebid]() {
        pbjs.addAdUnits(getAdUnits(this.config.slot, this.config.sizeMappings));
        pbjs.setPriceGranularity(PRICE_GRANULARITY);
        pbjs.setBidderSequence(BIDDER_SEQUENCE);
        const usdToEurRate = this.config.metaData.usdToEurRate;
        pbjs.bidderSettings = {
            appnexus: {
                bidCpmAdjustment(bidCpm) {
                    return bidCpm * usdToEurRate;
                }
            },
            rubicon: {
                bidCpmAdjustment(bidCpm) {
                    return bidCpm * usdToEurRate * GROSS_TO_NET_RATE;
                }
            }
        };
    }

    [teardownPrebid]() {
        getAdUnits(this.config.slot, this.config.sizeMappings).forEach(({ code }) => pbjs.removeAdUnit(code));
    }

    [setupGpt]() {
        const pubads = googletag.pubads();
        const { metaData, placementTestId } = this.config;
        this[defineGptSizeMappings]();
        this[defineSlots]();
        if (metaData.loggedIn !== undefined) {
            pubads.setTargeting('mt-u4', metaData.loggedIn);
        }
        if (metaData.threadId !== undefined) {
            pubads.setTargeting('mt-thread', [metaData.threadId]);
        }
        pubads.setTargeting('mt-ab', 'test');
        if (metaData.boardMakeAndModels && metaData.boardMakeAndModels.length > 0) {
            pubads
                .setTargeting('mt-ma', [metaData.boardMakeAndModels[0].make])
                .setTargeting('mt-mo', metaData.boardMakeAndModels[0].models)
                .setTargeting('mt-u2', ['00']);
        }
        if (placementTestId) {
            pubads.setTargeting('eagt', [placementTestId]); // pmtest
        }
        pubads.disableInitialLoad();
        pubads.enableSingleRequest();
        googletag.enableServices();
        this[displaySlots]();
    }

    [teardownGpt]() {
        googletag.destroySlots();
    }

    [setDefaultConfig]() {
        if (!this.config.prebid) {
            this.config.prebid = {};
        }
        if (!this.config.prebid.timeout) {
            this.config.prebid.timeout = 700;
        }
    }

    static [queueForGPT](func) {
        return Advertising[withQueue](googletag.cmd, func);
    }

    static [queueForPrebid](func) {
        return Advertising[withQueue](pbjs.que, func);
    }

    static [withQueue](queue, func) {
        return new Promise(resolve =>
            queue.push(() => {
                func();
                resolve();
            })
        );
    }

    static [removeBackground](divId) {
        const divEl = document.getElementById(divId);
        if (!divEl) {
            return;
        }
        divEl.style.backgroundColor = 'transparent';
        divEl.style.backgroundImage = 'none';
    }
}
