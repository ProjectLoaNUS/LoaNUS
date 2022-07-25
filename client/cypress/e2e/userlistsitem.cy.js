describe(" user uses listing", () => {
  it("user lists item", () => {
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
    //user clicks list item
    cy.findByRole("button", { name: /list item/i }).click();
    //user fills up detail
    cy.findByRole("button", { name: /item category others/i }).click();
    cy.findByRole("option", { name: /tools/i }).click();

    cy.get("input[type=file]").attachFile("Portable.jpg");
    cy.findByRole("textbox", { name: /item name/i }).type("Portable Charger");
    cy.findByRole("textbox", { name: /item description/i }).type(
      "Seldom Used Portable Charger"
    );
    cy.findByRole("textbox", { name: /preferred meetup location\(s\)/i }).type(
      "Raffles Hall Entrance"
    );
    cy.findByRole("textbox", { name: /set return deadline/i }).clear();
    cy.findByRole("textbox", { name: /set return deadline/i }).type(
      "14/08/2022"
    );
    cy.get(".MuiButton-contained").click();
    //check listing in profile page
    cy.findByRole("button", { name: /back to home/i }).click();
    cy.findByTestId("AccountCircleIcon").click();
    cy.findByRole("menuitem", { name: /account/i }).click();
    // click on listing
    cy.wait(3000);
    cy.get(".MuiCardMedia-root-iPFsKD").click().should("be.visible");
    //deletes listing
    cy.findByRole("button", { name: /delete listing/i }).click();
  });
});
