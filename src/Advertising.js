import getAdUnits from './utils/getAdUnits';

const defineGptSizeMappings = Symbol('define GTP size mappings (private method)');
const getGptSizeMapping = Symbol('get GPT size mapping (private method)');
const defineSlots = Symbol('define slots (private method)');
const defineOutOfPageSlots = Symbol('define out of page slots (private method)');
const displaySlots = Symbol('display slots (private method)');
const displayOutOfPageSlots = Symbol('display slots (private method)');
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
const setDefaultConfig = Symbol('set default config (private method)');
const executePlugins = Symbol('execute plugins (private method)');

export default class Advertising {
    constructor(config, plugins = [], onError = () => {}) {
        this.config = config;
        this.slots = {};
        this.outOfPageSlots = {};
        this.plugins = plugins;
        this.onError = onError;
        this.gptSizeMappings = {};
        this.customEventCallbacks = {};
        this.customEventHandlers = {};
        this.queue = [];

        if (config) {
            this[setDefaultConfig]();
        }
    }

    // ---------- PUBLIC METHODS ----------

    async setup() {
        this[executePlugins]('setup');
        const { slots, outOfPageSlots, queue } = this;
        this[setupCustomEvents]();
        await Promise.all([
            Advertising[queueForPrebid](this[setupPrebid].bind(this), this.onError),
            Advertising[queueForGPT](this[setupGpt].bind(this), this.onError)
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
        const selectedSlots = queue.map(({ id }) => slots[id] || outOfPageSlots[id]);
        Advertising[queueForPrebid](
            () =>
                window.pbjs.requestBids({
                    adUnitCodes: divIds,
                    bidsBackHandler() {
                        window.pbjs.setTargetingForGPTAsync(divIds);
                        Advertising[queueForGPT](() => window.googletag.pubads().refresh(selectedSlots), this.onError);
                    }
                }),
            this.onError
        );
    }

    async teardown() {
        this[teardownCustomEvents]();
        await Promise.all([
            Advertising[queueForPrebid](this[teardownPrebid].bind(this), this.onError),
            Advertising[queueForGPT](this[teardownGpt].bind(this), this.onError)
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
        Advertising[queueForPrebid](
            () =>
                window.pbjs.requestBids({
                    adUnitCodes: [id],
                    bidsBackHandler() {
                        window.pbjs.setTargetingForGPTAsync([id]);
                        Advertising[queueForGPT](() => window.googletag.pubads().refresh([slots[id]]), this.onError);
                    }
                }),
            this.onError
        );
    }

    isConfigReady() {
        return Boolean(this.config);
    }

    setConfig(config) {
        this.config = config;
        this[setDefaultConfig]();
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
        for (const [key, value] of Object.entries(this.config.sizeMappings)) {
            const sizeMapping = window.googletag.sizeMapping();
            for (const { viewPortSize, sizes } of value) {
                sizeMapping.addSize(viewPortSize, sizes);
            }
            this.gptSizeMappings[key] = sizeMapping.build();
        }
    }

    [getGptSizeMapping](sizeMappingName) {
        return sizeMappingName && this.gptSizeMappings[sizeMappingName] ? this.gptSizeMappings[sizeMappingName] : null;
    }

    [defineSlots]() {
        this.config.slots.forEach(({ id, path, collapseEmptyDiv, targeting = {}, sizes, sizeMappingName }) => {
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

    [defineOutOfPageSlots]() {
        if (this.config.outOfPageSlots) {
            this.config.outOfPageSlots.forEach(({ id }) => {
                const slot = window.googletag.defineOutOfPageSlot(this.config.path, id);
                slot.addService(window.googletag.pubads());
                this.outOfPageSlots[id] = slot;
            });
        }
    }

    [displaySlots]() {
        this[executePlugins]('displaySlots');
        this.config.slots.forEach(({ id }) => {
            window.googletag.display(id);
        });
    }

    [displayOutOfPageSlots]() {
        this[executePlugins]('displayOutOfPageSlot');
        if (this.config.outOfPageSlots) {
            this.config.outOfPageSlots.forEach(({ id }) => {
                window.googletag.display(id);
            });
        }
    }

    [setupPrebid]() {
        this[executePlugins]('setupPrebid');
        const adUnits = getAdUnits(this.config.slots);
        window.pbjs.addAdUnits(adUnits);
        window.pbjs.setConfig(this.config.prebid);
    }

    [teardownPrebid]() {
        this[executePlugins]('teardownPrebid');
        getAdUnits(this.config.slots).forEach(({ code }) => window.pbjs.removeAdUnit(code));
    }

    [setupGpt]() {
        this[executePlugins]('setupGpt');
        const pubads = window.googletag.pubads();
        const { targeting } = this.config;
        this[defineGptSizeMappings]();
        this[defineSlots]();
        this[defineOutOfPageSlots]();
        for (const [key, value] of Object.entries(targeting)) {
            pubads.setTargeting(key, value);
        }
        pubads.disableInitialLoad();
        pubads.enableSingleRequest();

        window.googletag.enableServices();
        this[displaySlots]();
        this[displayOutOfPageSlots]();
    }

    [teardownGpt]() {
        this[executePlugins]('teardownGpt');
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

    [executePlugins](method) {
        for (const plugin of this.plugins) {
            const func = plugin[method];
            if (func) {
                func.call(this);
            }
        }
    }

    static [queueForGPT](func, onError) {
        return Advertising[withQueue](window.googletag.cmd, func, onError);
    }

    static [queueForPrebid](func, onError) {
        return Advertising[withQueue](window.pbjs.que, func, onError);
    }

    static [withQueue](queue, func, onError) {
        return new Promise(resolve =>
            queue.push(() => {
                try {
                    func();
                    resolve();
                } catch (error) {
                    // console.log(error);
                    onError(error);
                }
            })
        );
    }
}
