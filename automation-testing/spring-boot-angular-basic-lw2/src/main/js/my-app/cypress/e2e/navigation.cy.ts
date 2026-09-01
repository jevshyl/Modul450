describe('Navigation Tests', () => {
  it('should navigate between pages', () => {
    cy.visit('/');

    cy.contains('List Students').click();
    cy.url().should('include', '/students');

    cy.contains('Add Students').click();
    cy.url().should('include', '/addstudents');
  });
});
