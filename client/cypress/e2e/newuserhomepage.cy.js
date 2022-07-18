describe("new user on home page", () => {
  it("user use app without sign in", () => {
    //visit website homepage
    cy.visit("http://localhost:3000");
    // clicks on a itemcard
    cy.findByRole("button", {
      name: /wang haoyang jul 6, 2022 item listing image overcooked/i,
    }).click();
    // not signed in user clicks borrow
    cy.findByRole("button", { name: /borrow it!/i }).click();
    // not signed in user clicks chat
    cy.findByRole("button", { name: /chat/i }).click();
  });
  it("User use search bar without sign in", () => {
    //visit website homepage
    cy.visit("http://localhost:3000");
    //uses search bar
    cy.findByRole("combobox", { name: /search/i }).type("over");
    //user searches search results
    cy.findByTestId("SearchIcon").click();
  });
});
