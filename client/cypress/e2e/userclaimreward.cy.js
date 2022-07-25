describe(" user claim rewards", () => {
  it("user claim reward", () => {
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
    //View points
    cy.findByRole("link", { name: /points/i }).click();
    cy.wait(1000);
    cy.findByRole("button", { name: /spend coins/i }).click();
    cy.get(
      ":nth-child(3) > .sc-dZeWys > :nth-child(1) > .MuiButtonBase-root-JobBs > .sc-tsFYE > .MuiCardMedia-root-iPFsKD"
    )
      .click()
      .should("be.visible");
    cy.findByRole("button", { name: /claim it!/i }).click();
    //check rewards
    cy.findByTestId("AccountCircleIcon").click();
    cy.findByRole("menuitem", { name: /account/i }).click();
    cy.findByRole("link", { name: /rewards claimed/i }).click();
  });
});
