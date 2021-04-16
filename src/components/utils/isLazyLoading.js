export default function isLazyLoading(lazyLoadConfig) {
  if (typeof lazyLoadConfig === 'boolean') {
    return lazyLoadConfig;
  }

  if (!lazyLoadConfig) {
    return false;
  }

  const { marginPercent } = lazyLoadConfig;

  if (!marginPercent) {
    return true;
  }

  return marginPercent > -1;
}
