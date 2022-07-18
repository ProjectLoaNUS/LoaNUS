describe(" user uses listing", () => {
  it("user list item", () => {
    //visit website homepage
    cy.visit("http://localhost:3000");
    //sign in button
    cy.findByRole("link", { name: /sign in/i }).click();
    //signs in after verification
    cy.findByRole("textbox", { name: /email/i }).type("yongbin@gmail.com");
    cy.findByRole("button", { name: /next/i }).click();
    cy.get("[id=password1]").type("P@ssword1234");
    cy.get("[id=submit]").click();
    //clicks + button
    cy.findByTestId("AddCircleOutlineIcon").click();
    cy.findByRole("button", { name: /item category others/i }).click();
    cy.findByRole("option", { name: /tv & home appliances/i }).click();
    cy.findByRole("textbox", { name: /item name/i }).type("Vacuum Cleaner");
    cy.findByRole("textbox", { name: /item description/i }).type(
      "Any type of portable vacuum cleaner"
    );
    cy.findByRole("textbox", { name: /preferred meetup location\(s\)/i }).type(
      "Raffles Hall Entrance"
    );
    cy.get(".MuiButton-contained").click();
    //user check request is created by going to profile page
    cy.findByRole("button", { name: /back to home/i }).click();
    cy.findByTestId("AccountCircleIcon").click();
    cy.findByRole("menuitem", { name: /account/i }).click();
    cy.findByRole("link", { name: /requests/i }).click();
  });
});
