describe('The GPT banner example page on Storybook', () => {
  it('shows a GPT banner', () => {
    cy.visit(
      'http://localhost:6006/iframe.html?id=gpt-banner--default-story&viewMode=story'
    );
    cy.getGoogleAd('/6355419/Travel/Europe/France/Paris_0');
  });
});
