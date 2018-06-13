import PropTypes from 'prop-types';

export default PropTypes.shape({
    id: PropTypes.string.isRequired,
    path: PropTypes.string,
    collapseEmptyDiv: PropTypes.arrayOf(PropTypes.bool),
    targeting: PropTypes.object,
    sizes: PropTypes.oneOfType([
        PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.number)]),
        PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.number)]))
    ]),
    sizeMappingName: PropTypes.string,
    prebid: PropTypes.arrayOf(
        PropTypes.shape({
            mediaTypes: PropTypes.objectOf(
                PropTypes.shape({
                    sizes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
                })
            ).isRequired,
            bids: PropTypes.arrayOf(
                PropTypes.shape({
                    bidder: PropTypes.string.isRequired,
                    params: PropTypes.object
                })
            ).isRequired
        })
    ).isRequired
});
