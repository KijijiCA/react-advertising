import PropTypes from 'prop-types';
import React, { useRef, useContext } from 'react';
import AdvertisingContext from '../AdvertisingContext';
import isLazyLoading from './utils/isLazyLoading';
import getLazyLoadConfig from './utils/getLazyLoadConfig';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

function AdvertisingSlot({
  id,
  style,
  className,
  children,
  customEventHandlers,
  onAdLoaded = () => {},
  ...restProps
}) {
  const containerDivRef = useRef();

  const { activate, config } = useContext(AdvertisingContext);

  const lazyLoadConfig = getLazyLoadConfig(config, id);
  const isLazyLoadEnabled = isLazyLoading(lazyLoadConfig);

  useIntersectionObserver(
    activate,
    config,
    id,
    customEventHandlers,
    onAdLoaded,
    containerDivRef,
    isLazyLoadEnabled
  );

  useIsomorphicLayoutEffect(() => {
    if (!config || isLazyLoadEnabled) {
      return;
    }
    activate(id, customEventHandlers, onAdLoaded);
  }, [activate, config]);

  return (
    <div
      id={id}
      style={style}
      className={className}
      children={children}
      ref={containerDivRef}
      {...restProps}
    />
  );
}

AdvertisingSlot.propTypes = {
  id: PropTypes.string.isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node,
  customEventHandlers: PropTypes.objectOf(PropTypes.func).isRequired,
  onAdLoaded: PropTypes.func,
};

AdvertisingSlot.defaultProps = {
  customEventHandlers: {},
  onAdLoaded: () => {},
};

export default AdvertisingSlot;
