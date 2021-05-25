before(() =>
  cy.visit('/iframe.html?id=gpt-lazy-loading--default-story&viewMode=story')
);

describe('The GPT lazy loading example page on Storybook', () => {
  beforeEach(() => cy.viewport(800, 600));
  describe('after initial page load', () => {
    it('shows the top banner immediately because it is in the viewport on load', () =>
      cy.googleAdShouldExist('/6355419/Travel/Europe/France_0'));
    it('does not show the second banner because it is not in the viewport yet', () =>
      cy.googleAdShouldNotExist('/6355419/Travel/Europe/Spain_0'));
  });
  describe('when I scroll down to the second ad slot', () => {
    beforeEach(() => cy.scrollTo(0, 600));
    it('is filled with an ad when it enters the viewport', () =>
      cy.googleAdShouldExist('/6355419/Travel/Europe/Spain_0'));
  });
});
