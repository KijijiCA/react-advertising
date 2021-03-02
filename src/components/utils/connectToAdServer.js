import React from 'react';
import AdvertisingContext from '../../AdvertisingContext';

export default (Component) => (props) => (
  <AdvertisingContext.Consumer>
    {(activate) => <Component {...props} activate={activate} />}
  </AdvertisingContext.Consumer>
);
