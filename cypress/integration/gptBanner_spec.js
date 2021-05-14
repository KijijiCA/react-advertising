before(() =>
  cy.visit('/iframe.html?id=gpt-banner--default-story&viewMode=story')
);

describe('The GPT banner example page on Storybook', () => {
  it('shows a GPT banner', () =>
    cy.googleAdShouldExist('/6355419/Travel/Europe/France/Paris_0'));
});
