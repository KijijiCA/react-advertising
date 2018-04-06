import React, { Component } from 'react';
import Advertising from '../Advertising';
import PropTypes from 'prop-types';
import AdvertisingConfigPropType from './utils/AdvertisingConfigPropType';

export default class AdvertisingProvider extends Component {
    constructor(props) {
        super(props);
        this.advertising = this.props.config.active ? new Advertising(props.config) : null;
    }

    getChildContext() {
        if (!this.advertising) {
            return {
                activate: () => {}
            };
        }
        const { activate } = this.advertising;
        return {
            activate: (...args) => activate.call(this.advertising, ...args)
        };
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
        return <span>{this.props.children}</span>;
    }
}

AdvertisingProvider.childContextTypes = {
    activate: PropTypes.func
};

AdvertisingProvider.propTypes = {
    config: AdvertisingConfigPropType,
    children: PropTypes.node
};
