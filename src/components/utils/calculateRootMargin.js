import isMobileDevice from './isMobileDevice';

export default function calculateRootMargin({ marginPercent, mobileScaling }) {
  if (!marginPercent) {
    return undefined;
  }
  const finalMarginPercent =
    isMobileDevice() && mobileScaling !== undefined && mobileScaling !== -1
      ? marginPercent * mobileScaling
      : marginPercent;
  return `${(finalMarginPercent / 100) * window.innerHeight}px`;
}
