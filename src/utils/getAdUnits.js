import getPrebidSizeMapping from './getPrebidSizeMapping';

export default (slots, sizeMappings) =>
    slots.reduce(
        (acc, currSlot) =>
            acc.concat(
                currSlot.prebid.map(currPrebid => {
                    const adUnit = {
                        code: currSlot.id,
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
