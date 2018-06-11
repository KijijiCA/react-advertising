import getAdUnits from './utils/getAdUnits';

const GROSS_TO_NET_RATE = 0.93;
const defineGptSizeMappings = Symbol('define GTP size mappings (private method)');
const getGptSizeMapping = Symbol('get GPT size mapping (private method)');
const defineSlots = Symbol('define slots (private method)');
const displaySlots = Symbol('display slots (private method)');
const setupPrebid = Symbol('setup Prebid (private method)');
const teardownPrebid = Symbol('teardown Prebid (private method)');
const setupGpt = Symbol('setup GPT (private method)');
const teardownGpt = Symbol('teardown GPT (private method)');
const setupCustomEvents = Symbol('setup custom events (private method)');
const setupCustomEvent = Symbol('setup custom event (private method)');
const teardownCustomEvents = Symbol('teardown custom events (private method)');
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
        this.customEventCallbacks = {};
        this.customEventHandlers = {};
        this.queue = [];
        this[setDefaultConfig]();
    }

    // ---------- PUBLIC METHODS ----------

    async setup() {
        const { slots, queue } = this;
        this[setupCustomEvents]();
        await Promise.all([
            Advertising[queueForPrebid](this[setupPrebid].bind(this)),
            Advertising[queueForGPT](this[setupGpt].bind(this))
        ]);
        if (queue.length === 0) {
            return;
        }
        for (const { id, customEventHandlers } of queue) {
            Object.keys(customEventHandlers).forEach(customEventId => {
                if (!this.customEventCallbacks[customEventId]) {
                    this.customEventCallbacks[customEventId] = {};
                }
                return (this.customEventCallbacks[customEventId][id] = customEventHandlers[customEventId]);
            });
        }
        const divIds = queue.map(({ id }) => id);
        const selectedSlots = queue.map(({ id }) => slots[id]);
        Advertising[queueForPrebid](() =>
            window.pbjs.requestBids({
                adUnitCodes: divIds,
                bidsBackHandler() {
                    window.pbjs.setTargetingForGPTAsync(divIds);
                    Advertising[queueForGPT](() => {
                        window.googletag.pubads().refresh(selectedSlots);
                        divIds.forEach(Advertising[removeBackground]);
                    });
                }
            })
        );
    }

    async teardown() {
        this[teardownCustomEvents]();
        await Promise.all([
            Advertising[queueForPrebid](this[teardownPrebid].bind(this)),
            Advertising[queueForGPT](this[teardownGpt].bind(this))
        ]);
        this.slots = {};
        this.gptSizeMappings = {};
        this.queue = {};
    }

    activate(id, customEventHandlers = {}) {
        const { slots } = this;
        if (Object.values(slots).length === 0) {
            this.queue.push({ id, customEventHandlers });
            return;
        }
        Object.keys(customEventHandlers).forEach(customEventId => {
            if (!this.customEventCallbacks[customEventId]) {
                this.customEventCallbacks[customEventId] = {};
            }
            return (this.customEventCallbacks[customEventId][id] = customEventHandlers[customEventId]);
        });
        Advertising[queueForPrebid](() =>
            window.pbjs.requestBids({
                adUnitCodes: [id],
                bidsBackHandler() {
                    window.pbjs.setTargetingForGPTAsync([id]);
                    Advertising[queueForGPT](() => {
                        window.googletag.pubads().refresh([slots[id]]);
                        Advertising[removeBackground](id);
                    });
                }
            })
        );
    }

    // ---------- PRIVATE METHODS ----------

    [setupCustomEvents]() {
        if (!this.config.customEvents) {
            return;
        }
        Object.keys(this.config.customEvents).forEach(customEventId =>
            this[setupCustomEvent](customEventId, this.config.customEvents[customEventId])
        );
    }

    [setupCustomEvent](customEventId, { eventMessagePrefix, divIdPrefix }) {
        const { customEventCallbacks } = this;
        this.customEventHandlers[customEventId] = ({ data }) => {
            if (typeof data !== 'string' || !data.startsWith(`${eventMessagePrefix}`)) {
                return;
            }
            const divId = `${divIdPrefix || ''}${data.substr(eventMessagePrefix.length)}`;
            const callbacks = customEventCallbacks[customEventId];
            if (!callbacks) {
                return;
            }
            const callback = callbacks[divId];
            if (callback) {
                callback();
            }
        };
        window.addEventListener('message', this.customEventHandlers[customEventId]);
    }

    [teardownCustomEvents]() {
        if (!this.config.customEvents) {
            return;
        }
        Object.keys(this.config.customEvents).forEach(customEventId =>
            window.removeEventListener('message', this.customEventHandlers[customEventId])
        );
    }

    [defineGptSizeMappings]() {
        if (!this.config.sizeMappings) {
            return;
        }
        Object.keys(this.config.sizeMappings).forEach(key => {
            const sizeMapping = window.googletag.sizeMapping();
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
        this.config.slots.forEach(({ id, targeting = {}, sizes, sizeMappingName, path, collapseEmptyDiv }) => {
            const slot = window.googletag.defineSlot(path || this.config.path, sizes, id);

            const sizeMapping = this[getGptSizeMapping](sizeMappingName);
            if (sizeMapping) {
                slot.defineSizeMapping(sizeMapping);
            }

            if (collapseEmptyDiv && collapseEmptyDiv.length && collapseEmptyDiv.length > 0) {
                slot.setCollapseEmptyDiv(...collapseEmptyDiv);
            }

            for (const [key, value] of Object.entries(targeting)) {
                slot.setTargeting(key, value);
            }

            slot.addService(window.googletag.pubads());
            this.slots[id] = slot;
        });
    }

    [displaySlots]() {
        this.config.slots.forEach(({ id }) => window.googletag.display(id));
    }

    [setupPrebid]() {
        const adUnits = getAdUnits(this.config.slots, this.config.sizeMappings);
        window.pbjs.addAdUnits(adUnits);
        window.pbjs.setConfig(this.config.prebid);
        if (this.config.metaData.usdToEurRate) {
            const usdToEurRate = this.config.metaData.usdToEurRate;
            window.pbjs.bidderSettings = {
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
    }

    [teardownPrebid]() {
        getAdUnits(this.config.slots, this.config.sizeMappings).forEach(({ code }) => window.pbjs.removeAdUnit(code));
    }

    [setupGpt]() {
        const pubads = window.googletag.pubads();
        const { targeting } = this.config;
        this[defineGptSizeMappings]();
        this[defineSlots]();
        for (const [key, value] of Object.entries(targeting)) {
            pubads.setTargeting(key, value);
        }
        pubads.disableInitialLoad();
        pubads.enableSingleRequest();
        window.googletag.enableServices();
        this[displaySlots]();
    }

    [teardownGpt]() {
        window.googletag.destroySlots();
    }

    [setDefaultConfig]() {
        if (!this.config.prebid) {
            this.config.prebid = {};
        }
        if (!this.config.metaData) {
            this.config.metaData = {};
        }
        if (!this.config.targeting) {
            this.config.targeting = {};
        }
    }

    static [queueForGPT](func) {
        return Advertising[withQueue](window.googletag.cmd, func);
    }

    static [queueForPrebid](func) {
        return Advertising[withQueue](window.pbjs.que, func);
    }

    static [withQueue](queue, func) {
        return new Promise(resolve =>
            queue.push(() => {
                func();
                resolve();
            })
        );
    }

    static [removeBackground](id) {
        const divEl = document.getElementById(id);
        if (!divEl) {
            return;
        }
        divEl.style.backgroundColor = 'transparent';
        divEl.style.backgroundImage = 'none';
    }
}
