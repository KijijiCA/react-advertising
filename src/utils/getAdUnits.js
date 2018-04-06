import getPrebidSizeMapping from './getPrebidSizeMapping';

export default (slot, sizeMappings) =>
    Object.values(slot).reduce(
        (acc, currSlot) =>
            acc.concat(
                currSlot.prebid.map(currPrebid => {
                    const adUnit = {
                        code: currSlot.divId,
                        sizes: currPrebid.sizes,
                        bids: currPrebid.bids
                    };

                    const sizeMapping = getPrebidSizeMapping(currSlot.sizeMappingName, sizeMappings);
                    if (sizeMapping) {
                        adUnit.sizeMapping = sizeMapping;
                    }

                    return adUnit;
                })
            ),
        []
    );
