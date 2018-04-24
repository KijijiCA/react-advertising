import React, { Component } from 'react';
import Advertising from '../Advertising';
import PropTypes from 'prop-types';
import AdvertisingConfigPropType from './utils/AdvertisingConfigPropType';
import AdvertisingContext from '../AdvertisingContext';

export default class AdvertisingProvider extends Component {
    constructor(props) {
        super(props);
        this.advertising = this.props.active ? new Advertising(props.config) : null;
        if (this.advertising) {
            this.activate = this.advertising.activate.bind(this.advertising);
        }
    }

    componentDidMount() {
        if (this.advertising) {
            this.advertising.setup();
        }
    }

    componentWillUnmount() {
        if (this.advertising) {
            this.advertising.teardown();
        }
    }

    render() {
        return <AdvertisingContext.Provider value={this.activate}>{this.props.children}</AdvertisingContext.Provider>;
    }
}

AdvertisingProvider.propTypes = {
    active: PropTypes.bool,
    config: AdvertisingConfigPropType,
    children: PropTypes.node
};

AdvertisingProvider.defaultProps = {
    active: true
};
