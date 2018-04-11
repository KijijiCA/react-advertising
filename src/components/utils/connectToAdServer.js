import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default PlacementComponent => {
    const HoC = class extends Component {
        constructor(props) {
            super(props);
            this.state = { hidden: false };
        }

        componentDidMount() {
            const { id } = this.props;
            const { activate } = this.context;
            activate(id, () => this.setState({ hidden: true }));
        }

        render() {
            if (this.state.hidden) {
                return null;
            }
            return <PlacementComponent {...this.props} />;
        }
    };
    HoC.propTypes = {
        id: PropTypes.string.isRequired
    };
    HoC.contextTypes = {
        activate: PropTypes.func.isRequired
    };
    return HoC;
};
