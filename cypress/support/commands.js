// Enables tests for iframes (like Google ads)
// https://www.cypress.io/blog/2020/02/12/working-with-iframes-in-cypress/
Cypress.Commands.add('getIFrameBody', (selector) => {
  cy.log('getIFrameBody', selector);
  return cy
    .get(selector, { log: false })
    .its('0.contentDocument.body', { log: false })
    .should('not.be.empty')
    .then((body) => cy.wrap(body, { log: false }));
});

// Convenience function to the the iFrame body of a Google by ad unit path
Cypress.Commands.add('getGoogleAd', (adUnitPath) => {
  cy.log('getGoogleAd', adUnitPath);
  const selector = `#google_ads_iframe_${adUnitPath.replace(
    /([./])/g,
    '\\$1'
  )}`;
  return cy.getIFrameBody(selector);
});
