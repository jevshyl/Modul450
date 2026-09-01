describe('Test View Students', () => {
  beforeEach(() => {
    cy.visit('/students');
  });

  it('Visits the list overview page', () => {
    cy.visit('/')
    cy.get('.btn.btn-info').first().click()
    cy.url().should('eq', 'http://localhost:4200/students');
    cy.get('.table.table-bordered.table-striped').should('be.visible');
  })

  it('should display student name and email', () => {
    cy.get('table tbody tr').first().within(() => {
      cy.get('td').eq(1).should('not.be.empty');
      cy.get('td').eq(2).should('not.be.empty');
    });
  });
})


