import PropTypes from 'prop-types';
import AdvertisingSlotConfigPropType from './AdvertisingSlotConfigPropType';
import requiredIf from 'react-required-if';

export default PropTypes.shape({
    active: PropTypes.bool.isRequired,
    metaData: requiredIf(
        PropTypes.shape({
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
        props => props.active
    ),
    prebid: requiredIf(
        PropTypes.shape({
            timeout: PropTypes.number.isRequired
        }),
        props => props.active
    ),
    sizeMappings: PropTypes.objectOf(
        PropTypes.arrayOf(
            PropTypes.shape({
                viewPortSize: PropTypes.arrayOf(PropTypes.number).isRequired,
                sizes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired
            })
        )
    ),
    slot: requiredIf(PropTypes.objectOf(AdvertisingSlotConfigPropType), props => props.active)
});
