import PropTypes from 'prop-types';
import AdvertisingSlotConfigPropType from './AdvertisingSlotConfigPropType';

export default PropTypes.shape({
    metaData: PropTypes.shape({
        usdToEurRate: PropTypes.number.isRequired
    }),
    path: PropTypes.string,
    targeting: PropTypes.object,
    prebid: PropTypes.shape({
        bidderTimeout: PropTypes.number,
        priceGranularity: PropTypes.string,
        bidderSequence: PropTypes.string
    }),
    sizeMappings: PropTypes.objectOf(
        PropTypes.arrayOf(
            PropTypes.shape({
                viewPortSize: PropTypes.arrayOf(PropTypes.number).isRequired,
                sizes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired
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
