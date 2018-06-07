import React, { Component } from 'react';
import connectToAdServer from './utils/connectToAdServer';
import PropTypes from 'prop-types';

class AdvertisingSlot extends Component {
    componentDidMount() {
        const { activate, id, hide } = this.props;
        activate(id, hide);
    }
    render() {
        const { id, style, className, children } = this.props;
        return <div id={id} style={style} className={className} children={children} />;
    }
}

AdvertisingSlot.propTypes = {
    id: PropTypes.string.isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    activate: PropTypes.func.isRequired,
    hide: PropTypes.func.isRequired
};

AdvertisingSlot.defaultProps = {
    hide: () => {}
};

export default connectToAdServer(AdvertisingSlot);
