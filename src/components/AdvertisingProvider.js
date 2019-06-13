import React, { Component } from 'react';
import Advertising from '../Advertising';
import PropTypes from 'prop-types';
import AdvertisingConfigPropType from './utils/AdvertisingConfigPropType';
import AdvertisingContext from '../AdvertisingContext';

export default class AdvertisingProvider extends Component {
    constructor(props) {
        super(props);
        this.initialize();

        const activate = this.advertising.activate.bind(this.advertising);
        this.state = {
            activate
        };
    }

    componentDidMount() {
        if (this.advertising.isConfigReady() && this.props.active) {
            this.setupAdvertising();
        }
    }

    componentDidUpdate(prevProps) {
        const { config, active } = this.props;
        const isConfigReady = this.advertising.isConfigReady();

        // activate advertising when the config changes from `undefined`
        if (!isConfigReady && config && active) {
            this.advertising.setConfig(config);
            this.setupAdvertising();
        } else if (isConfigReady && prevProps.config !== config) {
            // teardown the old configuration
            this.teardownIfNeeded();

            // re-initialize advertising, if it is active
            if (this.props.active) {
                this.initialize();
                const activate = this.advertising.activate.bind(this.advertising);
                // eslint-disable-next-line react/no-did-update-set-state
                this.setState({ activate });

                if (this.advertising.isConfigReady()) {
                    this.setupAdvertising();
                }
            }
        }
    }

    componentWillUnmount() {
        this.teardownIfNeeded();
    }

    async setupAdvertising() {
        await this.advertising.setup();
        // teardown and setup should run in pair
        this.needTearDown = true;
    }

    teardownIfNeeded() {
        if (this.needTearDown) {
            this.advertising.teardown();
            this.advertising = null;
            this.activate = null;
        }
    }

    initialize() {
        const { config, plugins } = this.props;
        this.advertising = new Advertising(config, plugins);
        this.needTearDown = false;
    }

    render() {
        const { activate } = this.state;
        return <AdvertisingContext.Provider value={activate}>{this.props.children}</AdvertisingContext.Provider>;
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
