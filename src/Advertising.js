import getAdUnits from './utils/getAdUnits';

const defaultLazyLoadConfig = {
  marginPercent: 0,
  mobileScaling: 1,
};

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
    this.setDefaultConfig();

    this.requestManager = {
      adserverRequestSent: false,
      aps: false,
      prebid: false,
    };
  }

  // ---------- PUBLIC METHODS ----------

  async setup() {
    this.isPrebidUsed =
      typeof this.config.usePrebid === 'undefined'
        ? typeof window.pbjs !== 'undefined'
        : this.config.usePrebid;
    this.isAPSUsed =
      typeof this.config.useAPS === 'undefined'
        ? typeof window.apstag !== 'undefined'
        : this.config.useAPS;
    this.executePlugins('setup');
    const { slots, outOfPageSlots, queue, isPrebidUsed, isAPSUsed } = this;
    this.setupCustomEvents();
    const setUpQueueItems = [
      Advertising.queueForGPT(this.setupGpt.bind(this), this.onError),
    ];
    if (isAPSUsed) {
      window.apstag.init({
        ...this.config.aps,
        adServer: 'googletag',
      });
    }
    if (isPrebidUsed) {
      setUpQueueItems.push(
        Advertising.queueForPrebid(this.setupPrebid.bind(this), this.onError)
      );
    }
    await Promise.all(setUpQueueItems);
    if (queue.length === 0) {
      return;
    }
    for (let i = 0; i < queue.length; i++) {
      const { id, customEventHandlers } = queue[i];
      Object.keys(customEventHandlers).forEach((customEventId) => {
        if (!this.customEventCallbacks[customEventId]) {
          this.customEventCallbacks[customEventId] = {};
        }
        return (this.customEventCallbacks[customEventId][id] =
          customEventHandlers[customEventId]);
      });
    }
    const divIds = queue.map(({ id }) => id);
    const selectedSlots = queue.map(
      ({ id }) => slots[id] || outOfPageSlots[id]
    );
    if (isPrebidUsed) {
      Advertising.queueForPrebid(
        () =>
          window.pbjs.requestBids({
            adUnitCodes: divIds,
            bidsBackHandler: () => {
              window.pbjs.setTargetingForGPTAsync(divIds);
              this.requestManager.prebid = true;
              this.biddersBack(selectedSlots);
            },
          }),
        this.onError
      );
    }

    if (this.isAPSUsed) {
      window.apstag.fetchBids(
        {
          slots: selectedSlots.map(Advertising.mapSlotToAPSSlot),
        },
        () => {
          Advertising.queueForGPT(() => {
            window.apstag.setDisplayBids();
            this.requestManager.aps = true; // signals that APS request has completed
            this.biddersBack(selectedSlots); // checks whether both APS and Prebid have returned
          });
        }
      );
    }

    if (!isPrebidUsed && !isAPSUsed) {
      Advertising.queueForGPT(
        () => window.googletag.pubads().refresh(selectedSlots),
        this.onError
      );
    }
  }

  async teardown() {
    this.teardownCustomEvents();
    const teardownQueueItems = [
      Advertising.queueForGPT(this.teardownGpt.bind(this), this.onError),
    ];
    if (this.isPrebidUsed) {
      teardownQueueItems.push(
        Advertising.queueForPrebid(this.teardownPrebid.bind(this), this.onError)
      );
    }
    await Promise.all(teardownQueueItems);
    this.slots = {};
    this.gptSizeMappings = {};
    this.queue = [];
  }

  activate(id, customEventHandlers = {}) {
    const { slots, isPrebidUsed } = this;
    // check if have slots from configurations
    if (Object.values(slots).length === 0) {
      this.queue.push({ id, customEventHandlers });
      return;
    }
    Object.keys(customEventHandlers).forEach((customEventId) => {
      if (!this.customEventCallbacks[customEventId]) {
        this.customEventCallbacks[customEventId] = {};
      }
      return (this.customEventCallbacks[customEventId][id] =
        customEventHandlers[customEventId]);
    });
    if (isPrebidUsed) {
      Advertising.queueForPrebid(
        () =>
          window.pbjs.requestBids({
            adUnitCodes: [id],
            bidsBackHandler: () => {
              window.pbjs.setTargetingForGPTAsync([id]);
              this.requestManager.prebid = true;
              this.biddersBack([id]);
            },
          }),
        this.onError
      );
    }

    if (this.isAPSUsed) {
      window.apstag.fetchBids(
        {
          slots: slots.map(Advertising.mapSlotToAPSSlot),
        },
        () => {
          Advertising.queueForGPT(() => {
            window.apstag.setDisplayBids();
            this.requestManager.aps = true; // signals that APS request has completed
            this.biddersBack([id]); // checks whether both APS and Prebid have returned
          });
        }
      );
    }

    if (!this.isPrebidUsed && !this.isAPSUsed) {
      Advertising.queueForGPT(
        () => window.googletag.pubads().refresh([slots[id]]),
        this.onError
      );
    }
  }

  isConfigReady() {
    return Boolean(this.config);
  }

  setConfig(config) {
    this.config = config;
    this.setDefaultConfig();
  }

  // ---------- PRIVATE METHODS ----------

  setupCustomEvents() {
    if (!this.config.customEvents) {
      return;
    }
    Object.keys(this.config.customEvents).forEach((customEventId) =>
      this.setupCustomEvent(
        customEventId,
        this.config.customEvents[customEventId]
      )
    );
  }

  setupCustomEvent(customEventId, { eventMessagePrefix, divIdPrefix }) {
    const { customEventCallbacks } = this;
    this.customEventHandlers[customEventId] = ({ data }) => {
      if (
        typeof data !== 'string' ||
        !data.startsWith(`${eventMessagePrefix}`)
      ) {
        return;
      }
      const divId = `${divIdPrefix || ''}${data.substr(
        eventMessagePrefix.length
      )}`;
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

  teardownCustomEvents() {
    if (!this.config.customEvents) {
      return;
    }
    Object.keys(this.config.customEvents).forEach((customEventId) =>
      window.removeEventListener(
        'message',
        this.customEventHandlers[customEventId]
      )
    );
  }

  defineGptSizeMappings() {
    if (!this.config.sizeMappings) {
      return;
    }
    const entries = Object.entries(this.config.sizeMappings);
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      const sizeMapping = window.googletag.sizeMapping();
      for (let q = 0; q < value.length; q++) {
        const { viewPortSize, sizes } = value[q];
        sizeMapping.addSize(viewPortSize, sizes);
      }
      this.gptSizeMappings[key] = sizeMapping.build();
    }
  }

  getGptSizeMapping(sizeMappingName) {
    return sizeMappingName && this.gptSizeMappings[sizeMappingName]
      ? this.gptSizeMappings[sizeMappingName]
      : null;
  }

  defineSlots() {
    if (!this.config.slots) {
      return;
    }
    this.config.slots.forEach(
      ({
        id,
        path,
        collapseEmptyDiv,
        targeting = {},
        sizes,
        sizeMappingName,
      }) => {
        const slot = window.googletag.defineSlot(
          path || this.config.path,
          sizes,
          id
        );

        const sizeMapping = this.getGptSizeMapping(sizeMappingName);
        if (sizeMapping) {
          slot.defineSizeMapping(sizeMapping);
        }

        if (
          collapseEmptyDiv &&
          collapseEmptyDiv.length &&
          collapseEmptyDiv.length > 0
        ) {
          slot.setCollapseEmptyDiv(...collapseEmptyDiv);
        }

        const entries = Object.entries(targeting);
        for (let i = 0; i < entries.length; i++) {
          const [key, value] = entries[i];
          slot.setTargeting(key, value);
        }

        slot.addService(window.googletag.pubads());

        this.slots[id] = slot;
      }
    );
  }

  defineOutOfPageSlots() {
    if (this.config.outOfPageSlots) {
      this.config.outOfPageSlots.forEach(({ id, path }) => {
        const slot = window.googletag.defineOutOfPageSlot(
          path || this.config.path,
          id
        );
        slot.addService(window.googletag.pubads());
        this.outOfPageSlots[id] = slot;
      });
    }
  }

  defineInterstitialSlot() {
    if (this.config.interstitialSlot) {
      const { path, targeting } = this.config.interstitialSlot;
      const slot = window.googletag.defineOutOfPageSlot(
        path || this.config.path,
        window.googletag.enums.OutOfPageFormat.INTERSTITIAL
      );
      if (slot) {
        const entries = Object.entries(targeting || []);
        for (let i = 0; i < entries.length; i++) {
          const [key, value] = entries[i];
          slot.setTargeting(key, value);
        }
        slot.addService(window.googletag.pubads());
        this.interstitialSlot = slot;
      }
    }
  }

  displaySlots() {
    this.executePlugins('displaySlots');
    this.config.slots.forEach(({ id }) => {
      window.googletag.display(id);
    });
  }

  displayOutOfPageSlots() {
    this.executePlugins('displayOutOfPageSlot');
    if (this.config.outOfPageSlots) {
      this.config.outOfPageSlots.forEach(({ id }) => {
        window.googletag.display(id);
      });
    }
  }

  refreshInterstitialSlot() {
    this.executePlugins('refreshInterstitialSlot');
    if (this.interstitialSlot) {
      window.googletag.pubads().refresh([this.interstitialSlot]);
    }
  }

  setupPrebid() {
    this.executePlugins('setupPrebid');
    const adUnits = getAdUnits(this.config.slots);
    window.pbjs.addAdUnits(adUnits);
    window.pbjs.setConfig(this.config.prebid);
  }

  teardownPrebid() {
    this.executePlugins('teardownPrebid');
    getAdUnits(this.config.slots).forEach(({ code }) =>
      window.pbjs.removeAdUnit(code)
    );
  }

  setupGpt() {
    this.executePlugins('setupGpt');
    const pubads = window.googletag.pubads();
    const { targeting } = this.config;
    this.defineGptSizeMappings();
    this.defineSlots();
    this.defineOutOfPageSlots();
    this.defineInterstitialSlot();
    const entries = Object.entries(targeting);
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      pubads.setTargeting(key, value);
    }
    pubads.disableInitialLoad();
    pubads.enableSingleRequest();

    window.googletag.enableServices();
    this.displaySlots();
    this.displayOutOfPageSlots();
    this.refreshInterstitialSlot();
  }

  teardownGpt() {
    this.executePlugins('teardownGpt');
    window.googletag.destroySlots();
  }

  setDefaultConfig() {
    if (!this.config) {
      return;
    }
    if (!this.config.prebid) {
      this.config.prebid = {};
    }
    if (!this.config.metaData) {
      this.config.metaData = {};
    }
    if (!this.config.targeting) {
      this.config.targeting = {};
    }
    if (this.config.enableLazyLoad === true) {
      this.config.enableLazyLoad = defaultLazyLoadConfig;
    }
    if (this.config.slots) {
      this.config.slots = this.config.slots.map((slot) =>
        slot.enableLazyLoad === true
          ? { ...slot, enableLazyLoad: defaultLazyLoadConfig }
          : slot
      );
    }
  }

  executePlugins(method) {
    for (let i = 0; i < this.plugins.length; i++) {
      const func = this.plugins[i][method];
      if (func) {
        func.call(this);
      }
    }
  }

  // when both APS and Prebid have returned, initiate ad request
  biddersBack(selectedSlots) {
    // TODO: handle other cases where prebid and aps are not used together
    if (this.requestManager.aps && this.requestManager.prebid) {
      this.sendAdserverRequest(selectedSlots);
    }
  }

  // sends adserver request
  sendAdserverRequest(selectedSlots) {
    if (this.requestManager.adserverRequestSent) {
      return;
    }
    this.requestManager.adserverRequestSent = true;

    Advertising.queueForGPT(() => {
      window.googletag.pubads().refresh(selectedSlots);
    });
  }

  static mapSlotToAPSSlot(slot) {
    const { id, path, sizes } = slot;
    return {
      id,
      name: path,
      sizes,
    };
  }

  static queueForGPT(func, onError) {
    return Advertising.withQueue(window.googletag.cmd, func, onError);
  }

  static queueForPrebid(func, onError) {
    return Advertising.withQueue(window.pbjs.que, func, onError);
  }

  static withQueue(queue, func, onError) {
    return new Promise((resolve) =>
      queue.push(() => {
        try {
          func();
          resolve();
        } catch (error) {
          onError(error);
        }
      })
    );
  }
}
