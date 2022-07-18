describe(" user follow other user", () => {
  it("user follows other user", () => {
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
    //set image
    cy.findByRole("link", { name: /followers\/following/i }).click();
    cy.get(
      ".sc-hNKHps > .MuiAutocomplete-root-fQIQHN > .MuiFormControl-root-cICfZa > .MuiInputBase-root-jxOjEw > #search"
    ).type("Wang HaoYang");
    cy.get('[data-testid="SearchIcon"]').click({ multiple: true });
    cy.get(
      ":nth-child(1) > .MuiCardActions-root-iQBMpy > .MuiButtonBase-root-JobBs"
    ).click();
    //check following
    cy.findByRole("tab", { name: /following/i }).click();
  });
  it("send message to following", () => {
    cy.visit("http://localhost:3000");
    //sign in button
    cy.findByRole("link", { name: /sign in/i }).click();
    //signs in after verification
    cy.findByRole("textbox", { name: /email/i }).type("yongbin@gmail.com");
    cy.findByRole("button", { name: /next/i }).click();
    cy.get("[id=password1]").type("P@ssword1234");
    cy.get("[id=submit]").click();
    cy.findByTestId("ChatIcon").click();
    cy.findByText("Wang Haoyang").click();
    cy.get("textarea").type("Hello!");
    cy.findByRole("button", { name: /send/i }).click();
  });
});
