import { useRef } from 'react';
import calculateRootMargin from '../components/utils/calculateRootMargin';
import getLazyLoadConfig from '../components/utils/getLazyLoadConfig';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';

/**
 * Custom hook that creates an Intersection Observer to lazy load an element when it appears within the viewport.
 *
 * @param {Function} activate - Function to activate the advertisement when the intersection is observed.
 * @param {Object} config - Configuration object for the advertising context.
 * @param {string} id - ID of the advertising slot.
 * @param {Object} customEventHandlers - An object containing custom event handlers.
 * @param {Object} containerDivRef - Ref object to the element to be observed.
 * @param {boolean} isLazyLoadEnabled - Boolean to indicate if lazy loading is enabled.
 *
 * @example
 *
 * const containerDivRef = useRef();
 * const { activate, config } = useContext(AdvertisingContext);
 * const isLazyLoadEnabled = isLazyLoading(getLazyLoadConfig(config, id));
 *
 * // Usage of useIntersectionObserver
 * useIntersectionObserver(activate, config, id, customEventHandlers, containerDivRef, isLazyLoadEnabled);
 *
 * @returns {void}
 */
export const useIntersectionObserver = (
  activate,
  config,
  id,
  customEventHandlers,
  onAdLoaded,
  containerDivRef,
  isLazyLoadEnabled
) => {
  const observerRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!config || !isLazyLoadEnabled) {
      return () => {};
    }

    const rootMargin = calculateRootMargin(getLazyLoadConfig(config, id));
    observerRef.current = new IntersectionObserver(
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          activate(id, customEventHandlers, onAdLoaded);
          if (containerDivRef.current) {
            observerRef.current.unobserve(containerDivRef.current);
          }
        }
      },
      { rootMargin }
    );
    observerRef.current.observe(containerDivRef.current);

    return () => {
      if (containerDivRef.current) {
        observerRef.current.unobserve(containerDivRef.current);
      }
    };
  }, [
    activate,
    config,
    id,
    customEventHandlers,
    onAdLoaded,
    containerDivRef,
    isLazyLoadEnabled,
  ]);
};
