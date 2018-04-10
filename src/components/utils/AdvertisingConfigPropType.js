import PropTypes from 'prop-types';
import AdvertisingSlotConfigPropType from './AdvertisingSlotConfigPropType';

export default PropTypes.shape({
    metaData: PropTypes.shape({
        adUnitPath: PropTypes.shape({
            path: PropTypes.string.isRequired
        }).isRequired,
        boardMakeAndModels: PropTypes.arrayOf(
            PropTypes.shape({
                make: PropTypes.string.isRequired,
                models: PropTypes.arrayOf(PropTypes.string).isRequired
            })
        ),
        loggedIn: PropTypes.bool,
        usdToEurRate: PropTypes.number.isRequired
    }),
    prebid: PropTypes.shape({
        timeout: PropTypes.number
    }),
    sizeMappings: PropTypes.objectOf(
        PropTypes.arrayOf(
            PropTypes.shape({
                viewPortSize: PropTypes.arrayOf(PropTypes.number).isRequired,
                sizes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired
            })
        )
    ),
    slot: PropTypes.objectOf(AdvertisingSlotConfigPropType)
});
