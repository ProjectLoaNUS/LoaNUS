describe(" user log in", () => {
  it("user signs in", () => {
    //visit website homepage
    cy.visit("http://localhost:3000");
    //sign in button
    cy.findByRole("link", { name: /sign in/i }).click();
    //signs in after verification
    cy.findByRole("textbox", { name: /email/i }).type("yongbin@gmail.com");
    cy.findByRole("button", { name: /next/i }).click();
    cy.get("[id=password1]").type("P@ssword1234");
    cy.get("[id=submit]").click();
    //user press itemcard and chats
    cy.findByRole("button", {
      name: /wang haoyang jul 6, 2022 item listing image overcooked/i,
    })
      .click()
      .should("be.visible");

    cy.get(".MuiButton-outlined").click();
    cy.wait(3000);
    //user press itemcard and borrows
    cy.get(
      ":nth-child(4) > .MuiCardActionArea-root-dQzkmW > .sc-cCsOjp > .MuiCardMedia-root-iPFsKD"
    )
      .click()
      .should("be.visible");

    cy.get(".MuiButton-contained").click();
  });
});
