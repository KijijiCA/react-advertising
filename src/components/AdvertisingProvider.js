import React, { Component } from 'react';
import Advertising from '../Advertising';
import PropTypes from 'prop-types';
import AdvertisingConfigPropType from './utils/AdvertisingConfigPropType';
import AdvertisingContext from '../AdvertisingContext';
import equal from 'fast-deep-equal';

export default class AdvertisingProvider extends Component {
  constructor(props) {
    super(props);
    this.initialize();

    this.state = {
      activate: this.advertising.activate.bind(this.advertising),
      config: this.props.config,
    };
  }

  async componentDidMount() {
    if (this.advertising.isConfigReady() && this.props.active) {
      await this.advertising.setup();
    }
  }

  async componentDidUpdate(prevProps) {
    // this means teardown method has been invoked already
    if (!this.advertising) {
      return;
    }

    const { config, active } = this.props;
    const isConfigReady = this.advertising.isConfigReady();

    // activate advertising when the config changes from `undefined`
    if (!isConfigReady && config && active) {
      this.advertising.setConfig(config);
      // eslint-disable-next-line react/no-did-update-set-state
      await this.advertising.setup();
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        activate: this.advertising.activate.bind(this.advertising),
        config: this.advertising.config,
      });
    } else if (isConfigReady && !equal(prevProps.config, config)) {
      // teardown the old configuration
      // to make sure the teardown and initialization are in a right sequence, need `await`
      await this.teardown();

      // re-initialize advertising, if it is active
      if (active) {
        this.initialize();
        if (this.advertising.isConfigReady()) {
          await this.advertising.setup();
        }
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          activate: this.advertising.activate.bind(this.advertising),
          config: this.advertising.config,
        });
      }
    }
  }

  async componentWillUnmount() {
    if (this.props.config) {
      await this.teardown();
    }
  }

  async teardown() {
    this.setState({ activate: () => {}, config: null });
    await this.advertising.teardown();
    this.advertising = null;
  }

  initialize() {
    const { config, plugins, onError } = this.props;
    this.advertising = new Advertising(config, plugins, onError);
  }

  render() {
    const { activate, config } = this.state;
    return (
      <AdvertisingContext.Provider value={{ activate, config }}>
        {this.props.children}
      </AdvertisingContext.Provider>
    );
  }
}

AdvertisingProvider.propTypes = {
  active: PropTypes.bool,
  config: AdvertisingConfigPropType,
  children: PropTypes.node,
  onError: PropTypes.func,
  plugins: PropTypes.arrayOf(
    PropTypes.shape({
      setupPrebid: PropTypes.func,
      setupGpt: PropTypes.func,
      teardownPrebid: PropTypes.func,
      teardownGpt: PropTypes.func,
    })
  ),
};

AdvertisingProvider.defaultProps = {
  active: true,
};
