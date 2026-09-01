describe('Student List Tests', () => {
  beforeEach(() => {
    cy.visit('/students');
  });

  it('should display student table', () => {
    cy.get('table').should('be.visible');
    cy.get('thead th').should('have.length', 3);
  });

  it('should display at least one student', () => {
    cy.get('tbody tr').should('have.length.at.least', 1);
  });

  it('should show student details correctly', () => {
    cy.get('tbody tr').first().within(() => {
      cy.get('td').eq(0).should('not.be.empty');
      cy.get('td').eq(1).should('not.be.empty');
      cy.get('td').eq(2).find('a').should('have.attr', 'href').and('include', 'mailto:');
    });
  });
});
