/// <reference types="cypress" />

const alice = {
  username: "eve",
  email: "eve@example.com",
  password: "Z6#6%xfLTarZ9U",
};
const bob = {
  username: "faye",
  email: "faye@example.com",
  password: "L%e$xZHC4QKP@F",
};

  
describe("New feature: unread messages", () => {
  it("setup", () => {
    cy.signup(alice.username, alice.email, alice.password);
    cy.logout();
    cy.signup(bob.username, bob.email, bob.password);
    cy.logout();
  });

  it("send new messages", () => {
    cy.login(alice.username, alice.password);

    cy.get("input[name=search]").type("faye");
    cy.contains("faye").click();

    cy.get("input[name=text]").type("First message{enter}");
    cy.contains("First message");
    cy.get("input[name=text]").type("Second message{enter}");
    cy.contains("Second message");
    cy.get("input[name=text]").type("Third message{enter}");
    cy.logout();

    cy.login(bob.username, bob.password);
    cy.get("p[name=unreadCount]").should("contain","3");
    cy.logout();
  });

  it("clicks on unread conversation", () => {
    cy.login(bob.username, bob.password);
    cy.get("p[name=unreadCount]").click();
    cy.logout();
    //verify unread is cleared
    cy.get("p[name=unreadCount]").should("not.exist");
  });


});