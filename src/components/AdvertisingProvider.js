import React, { Component } from 'react';
import Advertising from '../Advertising';
import PropTypes from 'prop-types';
import AdvertisingConfigPropType from './utils/AdvertisingConfigPropType';
import AdvertisingContext from '../AdvertisingContext';

export default class AdvertisingProvider extends Component {
    constructor(props) {
        super(props);

        const { config, plugins } = this.props;
        this.advertising = new Advertising(config, plugins);
        this.activate = this.advertising.activate.bind(this.advertising);
        this.needTearDown = false;
    }

    async setupAdvertising() {
        await this.advertising.setup();
        // teardown and setup should run in pair
        this.needTearDown = true;
    }

    componentDidUpdate() {
        const { config, active } = this.props;

        // activate advertising when the config changes from `undefined`
        if (!this.advertising.isConfigReady() && config && active) {
            this.advertising.setConfig(config);
            this.setupAdvertising();
        }
    }

    componentDidMount() {
        if (this.advertising.isConfigReady() && this.props.active) {
            this.setupAdvertising();
        }
    }

    componentWillUnmount() {
        if (this.needTearDown) {
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
    children: PropTypes.node,
    plugins: PropTypes.arrayOf(
        PropTypes.shape({
            setupPrebid: PropTypes.func,
            setupGpt: PropTypes.func,
            teardownPrebid: PropTypes.func,
            teardownGpt: PropTypes.func
        })
    )
};

AdvertisingProvider.defaultProps = {
    active: true
};
