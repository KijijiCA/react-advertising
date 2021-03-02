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
    };
  }

  componentDidMount() {
    if (this.advertising.isConfigReady() && this.props.active) {
      this.advertising.setup();
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
      this.advertising.setup();
    } else if (isConfigReady && !equal(prevProps.config, config)) {
      // teardown the old configuration
      // to make sure the teardown and initialization are in a right sequence, need `await`
      await this.teardown();

      // re-initialize advertising, if it is active
      if (active) {
        this.initialize();
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          activate: this.advertising.activate.bind(this.advertising),
        });

        if (this.advertising.isConfigReady()) {
          this.advertising.setup();
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.props.config) {
      this.teardown();
    }
  }

  async teardown() {
    await this.advertising.teardown();
    this.advertising = null;
    this.activate = null;
  }

  initialize() {
    const { config, plugins, onError } = this.props;
    this.advertising = new Advertising(config, plugins, onError);
  }

  render() {
    const { activate } = this.state;
    return (
      <AdvertisingContext.Provider value={activate}>
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
