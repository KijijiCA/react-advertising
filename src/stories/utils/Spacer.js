import React from 'react';
import PropTypes from 'prop-types';

export default function Spacer({ height }) {
  return (
    <div
      style={{
        height: `${height}vh`,
      }}
    />
  );
}

Spacer.propTypes = {
  height: PropTypes.number.isRequired,
};
