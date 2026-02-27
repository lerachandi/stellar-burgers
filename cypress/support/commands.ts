/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare global {
  namespace Cypress {
    interface Chainable {
      interceptIngredients(): Chainable<void>;
      interceptUnauthorizedUser(): Chainable<void>;
      setAuthTokens(): Chainable<void>;
      clearAuthTokens(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('interceptIngredients', () => {
  cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' });
});

Cypress.Commands.add('interceptUnauthorizedUser', () => {
  cy.intercept('GET', '**/auth/user', { statusCode: 401 });
});

Cypress.Commands.add('setAuthTokens', () => {
  cy.setCookie('accessToken', 'Bearer test-access-token');
  cy.window().then((win) => {
    win.localStorage.setItem('refreshToken', 'test-refresh-token');
  });
});

Cypress.Commands.add('clearAuthTokens', () => {
  cy.clearCookie('accessToken');
  cy.window().then((win) => {
    win.localStorage.removeItem('refreshToken');
  });
});

export {};
