import PropTypes from 'prop-types';
import AdvertisingSlotConfigPropType from './AdvertisingSlotConfigPropType';

export default PropTypes.shape({
    path: PropTypes.string,
    targeting: PropTypes.object,
    prebid: PropTypes.shape({
        debug: PropTypes.bool,
        bidderTimeout: PropTypes.number,
        enableSendAllBids: PropTypes.bool,
        bidderSequence: PropTypes.oneOf(['random', 'fixed']),
        publisherDomain: PropTypes.string,
        cookieSyncDelay: PropTypes.number,
        priceGranularity: PropTypes.oneOfType([
            PropTypes.oneOf(['low', 'medium', 'high', 'auto', 'dense']),
            PropTypes.shape({
                buckets: PropTypes.arrayOf(
                    PropTypes.shape({
                        precision: PropTypes.number,
                        min: PropTypes.number.isRequired,
                        max: PropTypes.number.isRequired,
                        increment: PropTypes.number.isRequired
                    })
                ).isRequired
            })
        ]),
        mediaTypePriceGranularity: PropTypes.shape({
            video: PropTypes.oneOfType([
                PropTypes.oneOf(['low', 'medium', 'high', 'auto', 'dense']),
                PropTypes.shape({
                    buckets: PropTypes.arrayOf(
                        PropTypes.shape({
                            precision: PropTypes.number,
                            min: PropTypes.number.isRequired,
                            max: PropTypes.number.isRequired,
                            increment: PropTypes.number.isRequired
                        })
                    ).isRequired
                })
            ]),
            banner: PropTypes.oneOfType([
                PropTypes.oneOf(['low', 'medium', 'high', 'auto', 'dense']),
                PropTypes.shape({
                    buckets: PropTypes.arrayOf(
                        PropTypes.shape({
                            precision: PropTypes.number,
                            min: PropTypes.number.isRequired,
                            max: PropTypes.number.isRequired,
                            increment: PropTypes.number.isRequired
                        })
                    ).isRequired
                })
            ]),
            native: PropTypes.oneOfType([
                PropTypes.oneOf(['low', 'medium', 'high', 'auto', 'dense']),
                PropTypes.shape({
                    buckets: PropTypes.arrayOf(
                        PropTypes.shape({
                            precision: PropTypes.number,
                            min: PropTypes.number.isRequired,
                            max: PropTypes.number.isRequired,
                            increment: PropTypes.number.isRequired
                        })
                    ).isRequired
                })
            ])
        }),
        sizeConfig: PropTypes.arrayOf(
            PropTypes.shape({
                mediaQuery: PropTypes.string.isRequired,
                sizesSupported: PropTypes.arrayOf(
                    PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.number)])
                ),
                labels: PropTypes.arrayOf(PropTypes.string)
            })
        )
    }),
    sizeMappings: PropTypes.objectOf(
        PropTypes.arrayOf(
            PropTypes.shape({
                viewPortSize: PropTypes.arrayOf(PropTypes.number).isRequired,
                sizes: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.number)]))
                    .isRequired
            })
        )
    ),
    slots: PropTypes.arrayOf(AdvertisingSlotConfigPropType),
    customEvents: PropTypes.objectOf(
        PropTypes.shape({
            eventMessagePrefix: PropTypes.string.isRequired,
            divIdPrefix: PropTypes.string
        })
    )
});
