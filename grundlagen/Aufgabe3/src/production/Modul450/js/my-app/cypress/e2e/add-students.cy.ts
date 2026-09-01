describe('Student Form Page', () => {
  beforeEach(() => {
    cy.visit('/addstudents');
  });

  it('should display the form', () => {
    cy.get('form').should('be.visible');
    cy.get('input[name="name"]').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('should show validation errors for empty fields', () => {
    cy.get('.alert alert-danger').should('be.visible');
  });

  it('should add a new student successfully', () => {
    const randomName = `Test User ${Date.now()}`;
    const randomEmail = `test${Date.now()}@tbz.ch`;

    cy.get('input[name="name"]').type(randomName);
    cy.get('input[name="email"]').type(randomEmail);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/students');
    cy.get('table tbody tr').last().should('contain', randomName);
  });

  it('should clear fields after submit', () => {
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('test@tbz.ch');
    cy.get('button[type="submit"]').click();

    // After redirect, form should not be visible
    cy.get('form').should('not.exist');
  });

  it('should navigate back to student list', () => {
    cy.contains('List Students').click();
    cy.url().should('include', '/students');
  });
});
