describe(" user view notifications", () => {
  it("user view notificatons", () => {
    //visit website homepage
    cy.visit("http://localhost:3000");
    //sign in button
    cy.findByRole("link", { name: /sign in/i }).click();
    //signs in after verification
    cy.findByRole("textbox", { name: /email/i }).type("yongbin@gmail.com");
    cy.findByRole("button", { name: /next/i }).click();
    cy.get("[id=password1]").type("P@ssword1234");
    cy.get("[id=submit]").click();
    //checks notification
    cy.get("#notif-btn").click();
  });
  it("user view reviews", () => {
    //visit website homepage
    cy.visit("http://localhost:3000");
    //sign in button
    cy.findByRole("link", { name: /sign in/i }).click();
    //signs in after verification
    cy.findByRole("textbox", { name: /email/i }).type("yongbin@gmail.com");
    cy.findByRole("button", { name: /next/i }).click();
    cy.get("[id=password1]").type("P@ssword1234");
    cy.get("[id=submit]").click();
    cy.findByTestId("AccountCircleIcon").click();
    cy.findByRole("menuitem", { name: /account/i }).click();
    //user search for users
    cy.get('[data-testid="PreviewIcon"]').click();
    cy.get(".MuiDialogActions-root-gfgHdm > .MuiButtonBase-root-JobBs").click();
  });
});
