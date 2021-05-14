import PropTypes from 'prop-types';
import React from 'react';

export default function RowLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>{children}</div>
  );
}

RowLayout.propTypes = {
  children: PropTypes.node,
};
