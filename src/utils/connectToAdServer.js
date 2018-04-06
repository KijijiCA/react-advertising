import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default PlacementComponent => {
    const HoC = class extends Component {
        constructor(props) {
            super(props);
            this.state = { hidden: false };
        }

        componentDidMount() {
            const { divId } = this.props;
            const { activate } = this.context;
            activate(divId, () => this.setState({ hidden: true }));
        }

        render() {
            if (this.state.hidden) {
                return null;
            }
            return <PlacementComponent {...this.props} />;
        }
    };
    HoC.propTypes = {
        divId: PropTypes.string.isRequired
    };
    HoC.contextTypes = {
        activate: PropTypes.func.isRequired
    };
    return HoC;
};
