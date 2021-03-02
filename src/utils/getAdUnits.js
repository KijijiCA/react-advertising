export default (slots) =>
  slots.reduce(
    (acc, currSlot) =>
      acc.concat(
        currSlot.prebid.map((currPrebid) => ({
          code: currSlot.id,
          mediaTypes: currPrebid.mediaTypes,
          bids: currPrebid.bids,
        }))
      ),
    []
  );
