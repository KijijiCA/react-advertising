import React from 'react';
import connectToAdServer from './utils/connectToAdServer';
import PropTypes from 'prop-types';

export function AdvertisingSlotDiv({ id, style, className, children }) {
    return <div id={id} style={style} className={className} children={children} />;
}

AdvertisingSlotDiv.propTypes = {
    id: PropTypes.string.isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node
};

export default connectToAdServer(AdvertisingSlotDiv);
