import getPrebidSizeMapping from './getPrebidSizeMapping';

export default (slots, sizeMappings) =>
    slots.reduce(
        (acc, currSlot) =>
            acc.concat(
                currSlot.prebid.map(currPrebid => {
                    const adUnit = {
                        code: currSlot.id,
                        mediaTypes: currPrebid.mediaTypes,
                        bids: currPrebid.bids
                    };

                    // PH_TODO: this is obsolete with Prebid 1.0!
                    const sizeMapping = getPrebidSizeMapping(currSlot.sizeMappingName, sizeMappings);
                    if (sizeMapping) {
                        adUnit.sizeMapping = sizeMapping;
                    }

                    return adUnit;
                })
            ),
        []
    );
