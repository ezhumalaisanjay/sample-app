describe("Authenticator:", function () {
  // Step 1: setup the application state
  beforeEach(function () {
    cy.visit("/");
  });

  describe("Sign In:", () => {
    it("allows a user to signin", () => {
      // Step 2: Take an action (Sign in)
      cy.get(selectors.usernameInput).type("ezhumalaisanjay05@gmail.com");
      cy.get(selectors.signInPasswordInput).type("Sanjay@2023");
      cy.get(selectors.signInButton).contains("Login").click();

      cy.wait(3000);

      cy.url().should("include", "/tenant/dashboard");
    });
  });
});
export const selectors = {
  // Auth component classes
  usernameInput: "#email",
  signInPasswordInput: "#password",
  signInButton: '[type="submit"]',
};