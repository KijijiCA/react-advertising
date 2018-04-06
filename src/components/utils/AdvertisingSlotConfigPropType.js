import PropTypes from 'prop-types';

export default PropTypes.shape({
    divId: PropTypes.string.isRequired,
    targeting: PropTypes.object,
    sizes: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.number)])).isRequired,
    prebid: PropTypes.arrayOf(
        PropTypes.shape({
            sizes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
            bids: PropTypes.arrayOf(
                PropTypes.shape({
                    bidder: PropTypes.string.isRequired,
                    params: PropTypes.object
                })
            )
        })
    ).isRequired
});
